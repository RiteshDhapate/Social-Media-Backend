import express from 'express';
import {
  sendFriendRequest,
  respondFriendRequest,
  getFriends,
  getPendingRequests,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/users/friend-request
 * @desc    Send a friend request to another user
 * @access  Private
 */
router.post('/friend-request', protect, sendFriendRequest);

/**
 * @route   POST /api/users/friend-request/response
 * @desc    Respond to a friend request (accept/reject)
 * @access  Private
 */
router.post('/friend-request/response', protect, respondFriendRequest);

/**
 * @route   GET /api/users/friends
 * @desc    Get a user's friend list
 * @access  Private
 */
router.get('/friends', protect, getFriends);

/**
 * @route   GET /api/users/friend-requests
 * @desc    Get all pending friend requests for the user
 * @access  Private
 */
router.get('/friend-requests', protect, getPendingRequests);

export default router;
