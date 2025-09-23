import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import crypto from "crypto";
import { sendMail } from "../utils/mail.js";


export const register = async (req, res) => {
    try {
        const { firstName, lastName, email,  password } = req.body;
        if (!firstName || !lastName || !email ||  !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const existingUserByEmail = await User.findOne({ email: email });

        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // const existingUserByUsername = await User.findOne({ userName: userName });

        // if (existingUserByUsername) {
        //     return res.status(400).json({ success: false, message: "Username already exists" });
        // }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            success: true,
            message: "Account Created Successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        })

    }
}

export const login = async(req, res) => {
    try {
        const {email,  password } = req.body;
        // Basic input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            })
        }

        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password"
            })
        }
       
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid Credentials" 
            })
        }
        
        const token = await jwt.sign({userId:user._id}, process.env.SECRET_KEY, { expiresIn: '1d' })
        const isProduction = process.env.NODE_ENV === 'production'
        return res.status(200).cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction
        }).json({
            success:true,
            message:`Welcome back ${user.firstName}`,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                photoUrl: user.photoUrl,
                bio: user.bio,
                occupation: user.occupation,
                instagram: user.instagram,
                linkedin: user.linkedin,
                github: user.github,
                facebook: user.facebook
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Login",           
        })
    }
  
}

export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async(req, res) => {
    try {
        const userId= req.id
        const {firstName, lastName, occupation, bio, instagram, facebook, linkedin, github, role} = req.body;
        const file = req.file;
        let cloudResponse = null;
        if (file) {
            const fileUri = getDataUri(file)
            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }

        const user = await User.findById(userId).select("-password")
        
        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            })
        }

        // updating data
        if(firstName !== undefined) user.firstName = firstName
        if(lastName !== undefined) user.lastName = lastName
        if(occupation !== undefined) user.occupation = occupation
        if(instagram !== undefined) user.instagram = instagram
        if(facebook !== undefined) user.facebook = facebook
        if(linkedin !== undefined) user.linkedin = linkedin
        if(github !== undefined) user.github = github
        if(bio !== undefined) user.bio = bio
        if(cloudResponse?.secure_url) user.photoUrl = cloudResponse.secure_url
        
        // Guarded role update: only admins/superadmins can change role
        if (role && ["user","admin","superadmin"].includes(role)) {
            if (user.role === "admin" || user.role === "superadmin") {
                user.role = role
            }
        }

        await user.save()
        return res.status(200).json({
            message:"profile updated successfully",
            success:true,
            user
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        })
    }
}

export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().select('-password'); // exclude password field
      res.status(200).json({
        success: true,
        message: "User list fetched successfully",
        total: users.length,
        users
      });
    } catch (error) {
      console.error("Error fetching user list:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch users"
      });
    }
  };

// REQUEST RESET CODE
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Do not leak whether user exists
            return res.status(200).json({ success: true, message: "If the email exists, a code was sent." });
        }

        const code = (Math.floor(100000 + Math.random() * 900000)).toString();
        // Hash the code before storing
        const codeHash = crypto.createHash("sha256").update(code).digest("hex");
        user.resetPasswordCode = codeHash;
        user.resetPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        await user.save();

        await sendMail({
            to: user.email,
            subject: "Your password reset code",
            html: `<p>Your password reset code is <b>${code}</b>. It expires in 15 minutes.</p>`
        });

        return res.status(200).json({ success: true, message: "If the email exists, a code was sent." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Could not process request" });
    }
}

// VERIFY RESET CODE (optional step for UI to pre-validate)
export const verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ success: false, message: "Email and code are required" });
        }
        const user = await User.findOne({ email });
        if (!user || !user.resetPasswordCode || !user.resetPasswordExpiresAt) {
            return res.status(400).json({ success: false, message: "Invalid or expired code" });
        }
        if (user.resetPasswordExpiresAt < new Date()) {
            return res.status(400).json({ success: false, message: "Code has expired" });
        }
        const codeHash = crypto.createHash("sha256").update(code).digest("hex");
        if (codeHash !== user.resetPasswordCode) {
            return res.status(400).json({ success: false, message: "Invalid code" });
        }
        return res.status(200).json({ success: true, message: "Code verified" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Verification failed" });
    }
}

// RESET PASSWORD USING CODE
export const resetPasswordWithCode = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) {
            return res.status(400).json({ success: false, message: "Email, code and newPassword are required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }
        const user = await User.findOne({ email });
        if (!user || !user.resetPasswordCode || !user.resetPasswordExpiresAt) {
            return res.status(400).json({ success: false, message: "Invalid or expired code" });
        }
        if (user.resetPasswordExpiresAt < new Date()) {
            return res.status(400).json({ success: false, message: "Code has expired" });
        }
        const codeHash = crypto.createHash("sha256").update(code).digest("hex");
        if (codeHash !== user.resetPasswordCode) {
            return res.status(400).json({ success: false, message: "Invalid code" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordCode = null;
        user.resetPasswordExpiresAt = null;
        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to reset password" });
    }
}

// Helper function to promote user to admin (for development)
export const promoteToAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.role = 'admin';
        user.isActive = true;
        await user.save();

        return res.status(200).json({ 
            success: true, 
            message: "User promoted to admin successfully",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error("Promote to admin error:", error);
        return res.status(500).json({ success: false, message: "Failed to promote user to admin" });
    }
}

// Initialize admin setup - creates first admin user
export const initializeAdmin = async (req, res) => {
    try {
        // Check if any admin exists
        const existingAdmin = await User.findOne({ role: { $in: ['admin', 'superadmin'] } });
        
        if (existingAdmin) {
            return res.status(400).json({ 
                success: false, 
                message: "Admin already exists. Use promote-admin endpoint instead." 
            });
        }

        // Create super admin
        const bcrypt = await import("bcryptjs");
        const hashedPassword = await bcrypt.hash("admin123", 10);
        
        const superAdmin = await User.create({
            firstName: "Super",
            lastName: "Admin",
            email: "admin@techblog.com",
            password: hashedPassword,
            role: "superadmin",
            isActive: true
        });

        return res.status(201).json({
            success: true,
            message: "Super admin created successfully",
            credentials: {
                email: "admin@techblog.com",
                password: "admin123"
            },
            user: {
                _id: superAdmin._id,
                firstName: superAdmin.firstName,
                lastName: superAdmin.lastName,
                email: superAdmin.email,
                role: superAdmin.role,
                isActive: superAdmin.isActive
            }
        });
    } catch (error) {
        console.error("Initialize admin error:", error);
        return res.status(500).json({ success: false, message: "Failed to initialize admin" });
    }
}