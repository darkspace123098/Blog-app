import { Blog } from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

// Create a new blog post
export const createBlog = async (req,res) => {
    try {
        const {title, category, tags} = req.body;
        
        // Enhanced validation
        const errors = {};
        
        if (!title || !title.trim()) {
            errors.title = "Title is required";
        } else if (title.trim().length < 3) {
            errors.title = "Title must be at least 3 characters long";
        } else if (title.trim().length > 200) {
            errors.title = "Title must be less than 200 characters";
        }
        
        if (!category || !category.trim()) {
            errors.category = "Category is required";
        }
        
        // Validate tags if provided
        if (tags && tags.trim()) {
            const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            if (tagArray.some(tag => tag.length > 50)) {
                errors.tags = "Each tag must be less than 50 characters";
            }
            if (tagArray.length > 10) {
                errors.tags = "Maximum 10 tags allowed";
            }
        }
        
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            })
        }

        // Process tags - split by comma and trim whitespace
        let processedTags = [];
        if (tags && tags.trim()) {
            processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }

        const blog = await Blog.create({
            title: title.trim(),
            category: category.trim(),
            tags: processedTags,
            author: req.id
        })

        return res.status(201).json({
            success: true,
            blog,
            message: "Blog Created Successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create blog"
        })
    }
}

export const updateBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId
        const { title, subtitle, description, category, tags } = req.body;
        const file = req.file;

        let blog = await Blog.findById(blogId).populate("author");
        if(!blog){
            return res.status(404).json({
                message:"Blog not found!"
            })
        }
        let thumbnail;
        if (file) {
            const fileUri = getDataUri(file)
            thumbnail = await cloudinary.uploader.upload(fileUri)
        }

        // Process tags - split by comma and trim whitespace
        let processedTags = [];
        if (tags) {
            processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }

        const updateData = {
            title, 
            subtitle, 
            description, 
            category, 
            tags: processedTags,
            author: req.id, 
            thumbnail: thumbnail?.secure_url
        };
        blog = await Blog.findByIdAndUpdate(blogId, updateData, {new:true});

        res.status(200).json({ success: true, message: "Blog updated successfully", blog });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating blog", error: error.message });
    }
};

export const getAllBlogs = async (_, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'firstName lastName photoUrl'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'userId',
                select: 'firstName lastName photoUrl'
            }
        });
        res.status(200).json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching blogs", error: error.message });
    }
};

// Get single blog by id (published or not, used for detail view)
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id)
            .populate({
                path: 'author',
                select: 'firstName lastName photoUrl occupation'
            })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: {
                    path: 'userId',
                    select: 'firstName lastName photoUrl'
                }
            });

        if (!blog) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        // Increment views when blog is accessed
        await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } });

        return res.status(200).json({ success: true, blog });
    } catch (error) {
        console.error('Error fetching blog by id:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch blog' });
    }
};

export const getPublishedBlog = async (_,res) => {
    try {
        const blogs = await Blog.find({isPublished:true}).sort({ createdAt: -1 }).populate({path:"author", select:"firstName lastName photoUrl"}).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'userId',
                select: 'firstName lastName photoUrl'
            }
        });
        if(!blogs){
            return res.status(404).json({
                message:"Blog not found"
            })
        }
        return res.status(200).json({
            success:true,
            blogs,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get published blogs"
        })
    }
}

export const togglePublishBlog = async (req,res) => {
    try {
        const {blogId} = req.params;
        const {publish} = req.query; // true, false
        console.log(req.query);
        
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).json({
                message:"Blog not found!"
            });
        }
        // publish status based on the query paramter
        blog.isPublished = !blog.isPublished
        await blog.save();

        const statusMessage = blog.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            success:true,
            message:`Blog is ${statusMessage}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update status"
        })
    }
}

export const getOwnBlogs = async (req, res) => {
    try {
        const userId = req.id; // Assuming `req.id` contains the authenticated user’s ID

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const blogs = await Blog.find({ author: userId }).populate({
            path: 'author',
            select: 'firstName lastName photoUrl'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'userId',
                select: 'firstName lastName photoUrl'
            }
        });;

        if (!blogs) {
            return res.status(404).json({ message: "No blogs found.", blogs: [], success: false });
        }

        return res.status(200).json({ blogs, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error: error.message });
    }
};

// Delete a blog post
export const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const authorId = req.id
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        if (blog.author.toString() !== authorId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this blog' });
        }

        // Delete blog
        await Blog.findByIdAndDelete(blogId);

        // Delete related comments
        await Comment.deleteMany({ postId: blogId });


        res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting blog", error: error.message });
    }
};

export const likeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const likeKrneWalaUserKiId = req.id;
        const blog = await Blog.findById(blogId).populate({path:'likes'});
        if (!blog) return res.status(404).json({ message: 'Blog not found', success: false })

        // Check if user already liked the blog
        // const alreadyLiked = blog.likes.includes(userId);

        //like logic started
        await blog.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
        await blog.save();


        return res.status(200).json({ message: 'Blog liked', blog, success: true });
    } catch (error) {
        console.log(error);

    }
}


export const dislikeBlog = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'post not found', success: false })

        //dislike logic started
        await blog.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
        await blog.save();

        return res.status(200).json({ message: 'Blog disliked', blog, success: true });
    } catch (error) {
        console.log(error);

    }
}

export const getMyTotalBlogLikes = async (req, res) => {
    try {
      const userId = req.id; // assuming you use authentication middleware
  
      // Step 1: Find all blogs authored by the logged-in user
      const myBlogs = await Blog.find({ author: userId }).select("likes");
  
      // Step 2: Sum up the total likes
      const totalLikes = myBlogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0);
  
      res.status(200).json({
        success: true,
        totalBlogs: myBlogs.length,
        totalLikes,
      });
    } catch (error) {
      console.error("Error getting total blog likes:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch total blog likes",
      });
    }
  };

export const getMyTotalBlogViews = async (req, res) => {
    try {
      const userId = req.id; // assuming you use authentication middleware
  
      // Step 1: Find all blogs authored by the logged-in user
      const myBlogs = await Blog.find({ author: userId }).select("views");
  
      // Step 2: Sum up the total views
      const totalViews = myBlogs.reduce((acc, blog) => acc + (blog.views || 0), 0);
  
      res.status(200).json({
        success: true,
        totalBlogs: myBlogs.length,
        totalViews,
      });
    } catch (error) {
      console.error("Error getting total blog views:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch total blog views",
      });
    }
  };

// Get blogs by tag
export const getBlogsByTag = async (req, res) => {
    try {
        const { tag } = req.params;
        if (!tag) {
            return res.status(400).json({
                success: false,
                message: "Tag parameter is required"
            });
        }

        const blogs = await Blog.find({ 
            tags: { $in: [tag] },
            isPublished: true 
        }).sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'firstName lastName photoUrl'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'userId',
                select: 'firstName lastName photoUrl'
            }
        });

        res.status(200).json({
            success: true,
            blogs,
            tag,
            count: blogs.length
        });
    } catch (error) {
        console.error("Error fetching blogs by tag:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch blogs by tag"
        });
    }
};

// Get all unique tags
export const getAllTags = async (req, res) => {
    try {
        const tags = await Blog.distinct('tags', { isPublished: true });
        res.status(200).json({
            success: true,
            tags: tags.filter(tag => tag && tag.trim().length > 0)
        });
    } catch (error) {
        console.error("Error fetching tags:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tags"
        });
    }
};

// Get suggested blogs based on views, likes, and recent activity
export const getSuggestedBlogs = async (req, res) => {
    try {
        const { limit = 3 } = req.query;
        
        // Get blogs sorted by a combination of views, likes, and recent activity
        const suggestedBlogs = await Blog.find({ isPublished: true })
            .populate({
                path: 'author',
                select: 'firstName lastName photoUrl'
            })
            .sort({ 
                views: -1,  // Sort by views (most viewed first)
                createdAt: -1  // Then by creation date (most recent first)
            })
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            blogs: suggestedBlogs,
            count: suggestedBlogs.length
        });
    } catch (error) {
        console.error("Error fetching suggested blogs:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch suggested blogs"
        });
    }
};