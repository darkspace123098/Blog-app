import express from "express";
import { 
    getAdminStats, 
    getAllUsers, 
    updateUserRole, 
    toggleUserStatus, 
    deleteUser,
    getAllBlogsAdmin,
    toggleBlogStatus,
    deleteBlogAdmin
} from "../controllers/admin.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { isAdmin, isSuperAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(isAuthenticated);
router.use(isAdmin);

// Dashboard stats
router.get("/stats", getAdminStats);

// User management
router.get("/users", getAllUsers);
router.put("/users/:userId/role", updateUserRole);
router.put("/users/:userId/toggle-status", toggleUserStatus);
router.delete("/users/:userId", deleteUser);

// Blog management
router.get("/blogs", getAllBlogsAdmin);
router.put("/blogs/:blogId/toggle-status", toggleBlogStatus);
router.delete("/blogs/:blogId", deleteBlogAdmin);

export default router;
