import { User } from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
    try {
        const userId = req.id; // From isAuthenticated middleware
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated"
            });
        }

        if (!['admin', 'superadmin'].includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        req.user = user; // Add user info to request
        next();
    } catch (error) {
        console.error("Admin middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const isSuperAdmin = async (req, res, next) => {
    try {
        const userId = req.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Super admin privileges required."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Super admin middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
