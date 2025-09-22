import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import { Newsletter } from "../models/newsletter.model.js";
import Comment from "../models/comment.model.js";
import bcrypt from "bcryptjs";

// Get admin dashboard statistics
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const totalBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ isPublished: true });
        const totalComments = await Comment.countDocuments();
        const totalSubscribers = await Newsletter.countDocuments({ isActive: true });

        // Recent activity
        const recentUsers = await User.find()
            .select('firstName lastName email createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentBlogs = await Blog.find()
            .populate('author', 'firstName lastName')
            .select('title createdAt isPublished')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                activeUsers,
                totalBlogs,
                publishedBlogs,
                totalComments,
                totalSubscribers
            },
            recentActivity: {
                users: recentUsers,
                blogs: recentBlogs
            }
        });
    } catch (error) {
        console.error("Admin stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin statistics"
        });
    }
};

// Get all users with pagination
export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        let query = {};
        if (search) {
            query = {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const users = await User.find(query)
            .select('-password -resetPasswordCode -resetPasswordExpiresAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        res.status(200).json({
            success: true,
            users,
            pagination: {
                currentPage: page,
                totalPages,
                totalUsers,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

// Update user role
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['user', 'admin', 'superadmin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role"
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
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
        console.error("Update user role error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user role"
        });
    }
};

// Toggle user active status
export const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
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
        console.error("Toggle user status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user status"
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Don't allow deletion of superadmin
        if (user.role === 'superadmin') {
            return res.status(403).json({
                success: false,
                message: "Cannot delete super admin"
            });
        }

        // Delete user's blogs and comments
        await Blog.deleteMany({ author: userId });
        await Comment.deleteMany({ userId: userId });

        await User.findByIdAndDelete(userId);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};

// Get all blogs for admin
export const getAllBlogsAdmin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';
        const status = req.query.status || 'all'; // all, published, unpublished

        let query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { subtitle: { $regex: search, $options: 'i' } }
            ];
        }

        if (status !== 'all') {
            query.isPublished = status === 'published';
        }

        const blogs = await Blog.find(query)
            .populate('author', 'firstName lastName email')
            .select('-description')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments(query);
        const totalPages = Math.ceil(totalBlogs / limit);

        res.status(200).json({
            success: true,
            blogs,
            pagination: {
                currentPage: page,
                totalPages,
                totalBlogs,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error("Get blogs admin error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch blogs"
        });
    }
};

// Toggle blog publish status
export const toggleBlogStatus = async (req, res) => {
    try {
        const { blogId } = req.params;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        blog.isPublished = !blog.isPublished;
        await blog.save();

        res.status(200).json({
            success: true,
            message: `Blog ${blog.isPublished ? 'published' : 'unpublished'} successfully`,
            blog: {
                _id: blog._id,
                title: blog.title,
                isPublished: blog.isPublished
            }
        });
    } catch (error) {
        console.error("Toggle blog status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update blog status"
        });
    }
};

// Delete blog (admin)
export const deleteBlogAdmin = async (req, res) => {
    try {
        const { blogId } = req.params;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Delete related comments
        await Comment.deleteMany({ postId: blogId });
        await Blog.findByIdAndDelete(blogId);

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });
    } catch (error) {
        console.error("Delete blog admin error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete blog"
        });
    }
};
