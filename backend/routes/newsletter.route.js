import express from "express";
import { subscribeNewsletter, unsubscribeNewsletter, getAllSubscribers } from "../controllers/newsletter.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

// Public routes
router.post("/subscribe", subscribeNewsletter);
router.post("/unsubscribe", unsubscribeNewsletter);

// Admin routes
router.get("/subscribers", isAuthenticated, getAllSubscribers);

export default router;
