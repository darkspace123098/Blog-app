import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

const updateUserRoles = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Update all users without a role to have 'user' role
        const result = await User.updateMany(
            { role: { $exists: false } },
            { $set: { role: 'user', isActive: true } }
        );

        console.log(`Updated ${result.modifiedCount} users with default role`);

        // Create a super admin user if it doesn't exist
        const superAdminEmail = "admin@techblog.com";
        const existingSuperAdmin = await User.findOne({ email: superAdminEmail });

        if (!existingSuperAdmin) {
            const bcrypt = await import("bcryptjs");
            const hashedPassword = await bcrypt.hash("admin123", 10);
            
            await User.create({
                firstName: "Super",
                lastName: "Admin",
                email: superAdminEmail,
                password: hashedPassword,
                role: "superadmin",
                isActive: true
            });
            console.log("Created super admin user");
            console.log("Email: admin@techblog.com");
            console.log("Password: admin123");
        } else {
            // Update existing user to super admin
            existingSuperAdmin.role = "superadmin";
            existingSuperAdmin.isActive = true;
            await existingSuperAdmin.save();
            console.log("Updated existing user to super admin");
        }

        // List all users with their roles
        const users = await User.find({}, 'firstName lastName email role isActive');
        console.log("\nAll users:");
        users.forEach(user => {
            console.log(`${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}, Active: ${user.isActive}`);
        });

    } catch (error) {
        console.error("Error updating user roles:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

updateUserRoles();
