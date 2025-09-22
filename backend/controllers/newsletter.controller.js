import { Newsletter } from "../models/newsletter.model.js";
import { sendMail } from "../utils/mail.js";

// Subscribe to newsletter
export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase() });
        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                return res.status(400).json({
                    success: false,
                    message: "This email is already subscribed to our newsletter"
                });
            } else {
                // Reactivate subscription
                existingSubscriber.isActive = true;
                existingSubscriber.subscribedAt = new Date();
                await existingSubscriber.save();
                
                return res.status(200).json({
                    success: true,
                    message: "Welcome back! You've been resubscribed to our newsletter"
                });
            }
        }

        // Create new subscription
        const newSubscriber = await Newsletter.create({
            email: email.toLowerCase(),
            isActive: true
        });

        // Send welcome email
        try {
            await sendMail({
                to: email,
                subject: "Welcome to Tech-Blog Newsletter!",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Welcome to Tech-Blog Newsletter!</h2>
                        <p>Thank you for subscribing to our newsletter. You'll now receive:</p>
                        <ul>
                            <li>Latest blog posts and tech insights</li>
                            <li>Special offers and free giveaways</li>
                            <li>Web development tutorials and tips</li>
                            <li>Industry news and updates</li>
                        </ul>
                        <p>We're excited to have you on board!</p>
                        <p>Best regards,<br>The Tech-Blog Team</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.log("Email sending failed:", emailError);
            // Don't fail the subscription if email sending fails
        }

        res.status(201).json({
            success: true,
            message: "Successfully subscribed to newsletter! Check your email for confirmation."
        });

    } catch (error) {
        console.error("Newsletter subscription error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to subscribe to newsletter. Please try again later."
        });
    }
};

// Unsubscribe from newsletter
export const unsubscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: "Email not found in our newsletter list"
            });
        }

        if (!subscriber.isActive) {
            return res.status(400).json({
                success: false,
                message: "This email is already unsubscribed"
            });
        }

        subscriber.isActive = false;
        await subscriber.save();

        res.status(200).json({
            success: true,
            message: "Successfully unsubscribed from newsletter"
        });

    } catch (error) {
        console.error("Newsletter unsubscribe error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to unsubscribe. Please try again later."
        });
    }
};

// Get all subscribers (admin only)
export const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find({ isActive: true })
            .select('-__v')
            .sort({ subscribedAt: -1 });

        res.status(200).json({
            success: true,
            count: subscribers.length,
            subscribers
        });

    } catch (error) {
        console.error("Get subscribers error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch subscribers"
        });
    }
};
