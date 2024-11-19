import express from 'express';
import { createPost, getFeed, addComment, getPostById } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private
 */
router.post('/', protect, createPost);

/**
 * @route   GET /api/posts/feed
 * @desc    Get the user's feed
 * @access  Private
 */
router.get('/feed', protect, getFeed);

/**
 * @route   POST /api/posts/:id/comment
 * @desc    Add a comment to a post
 * @access  Private
 */
router.post('/:id/comment', protect, addComment);

/**
 * @route   GET /api/posts/:id
 * @desc    Get a specific post by ID
 * @access  Private
 */
router.get('/:id', protect, getPostById);

export default router;
