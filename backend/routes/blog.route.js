import express from "express"

import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { singleUpload } from "../middleware/multer.js"
import {createBlog, deleteBlog, dislikeBlog, getAllBlogs, getMyTotalBlogLikes, getMyTotalBlogViews, getOwnBlogs, getPublishedBlog, likeBlog, togglePublishBlog, updateBlog, getBlogsByTag, getAllTags, getBlogById, getSuggestedBlogs } from "../controllers/blog.controller.js"

const router = express.Router()

router.route("/").post(isAuthenticated, createBlog)
router.route("/:blogId").put(isAuthenticated, singleUpload, updateBlog)
router.route("/:blogId").patch(togglePublishBlog);
router.route("/get-blog/:id").get(getBlogById)
router.route("/get-all-blogs").get(getAllBlogs)
router.route("/get-published-blogs").get(getPublishedBlog)
router.route("/get-own-blogs").get(isAuthenticated, getOwnBlogs)
router.route("/delete/:id").delete(isAuthenticated, deleteBlog);
router.get("/:id/like", isAuthenticated, likeBlog);
router.get("/:id/dislike", isAuthenticated, dislikeBlog);
router.get('/my-blogs/likes', isAuthenticated, getMyTotalBlogLikes)
router.get('/my-blogs/views', isAuthenticated, getMyTotalBlogViews)
router.get('/suggested', getSuggestedBlogs)
router.get('/tags', getAllTags);
router.get('/tag/:tag', getBlogsByTag);

export default router;