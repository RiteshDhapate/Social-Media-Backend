import User from '../models/userModel.js';
import { invalidateCache } from '../utils/cacheUtils.js';

/**
 * @desc    Send a friend request to another user
 * @route   POST /api/users/friend-request
 * @access  Private
 */
export const sendFriendRequest = async (req, res) => {
  const { to } = req.body;

  try {
    // Validate recipient user
    const recipient = await User.findById(to);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if a friend request already exists
    const existingRequest = recipient.friendRequests.find(
      (req) => req.from.toString() === req.user && req.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    // Add friend request to the recipient
    recipient.friendRequests.push({ from: req.user, status: 'pending' });
    await recipient.save();

    res.status(200).json({ message: 'Friend request sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send friend request', error: error.message });
  }
};

/**
 * @desc    Respond to a friend request (accept/reject)
 * @route   POST /api/users/friend-request/response
 * @access  Private
 */
export const respondFriendRequest = async (req, res) => {
  const { requestId, response } = req.body;

  try {
    // Find the current user
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the friend request
    const friendRequest = user.friendRequests.find(
      (req) => req._id.toString() === requestId && req.status === 'pending'
    );

    if (!friendRequest) {
      return res.status(404).json({ message: 'Friend request not found or already responded' });
    }

    if (response === 'accepted') {
      // Add the sender as a friend
      user.friends.push(friendRequest.from);

      // Add the current user as a friend of the sender
      const sender = await User.findById(friendRequest.from);
      sender.friends.push(req.user);

      // Save the updated data
      await sender.save();
    }

    // Update the request status
    friendRequest.status = response;
    await user.save();

    // Invalidate feed cache for both users
    await invalidateCache([`feed:${req.user}`, `feed:${friendRequest.from}`]);

    res.status(200).json({ message: `Friend request ${response}` });
  } catch (error) {
    res.status(500).json({ message: 'Failed to respond to friend request', error: error.message });
  }
};

/**
 * @desc    Get a user's friend list
 * @route   GET /api/users/friends
 * @access  Private
 */
export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate('friends', 'username email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve friends', error: error.message });
  }
};

/**
 * @desc    Get all pending friend requests
 * @route   GET /api/users/friend-requests
 * @access  Private
 */
export const getPendingRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user).populate('friendRequests.from', 'username email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const pendingRequests = user.friendRequests.filter((req) => req.status === 'pending');
    res.status(200).json(pendingRequests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch friend requests', error: error.message });
  }
};
