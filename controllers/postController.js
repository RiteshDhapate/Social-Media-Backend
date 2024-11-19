import Post from '../models/postModel.js';
import User from '../models/userModel.js';
import { getCachedData, setCacheData, invalidateCache } from '../utils/cacheUtils.js';

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
export const createPost = async (req, res) => {
  const { text } = req.body;

  try {
    // Create a new post
    const post = await Post.create({
      author: req.user,
      text,
    });

    // Invalidate feed cache for the user and their friends
    const user = await User.findById(req.user);
    const cacheKeys = [`feed:${req.user}`, ...user.friends.map((friendId) => `feed:${friendId}`)];
    await invalidateCache(cacheKeys);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
};

/**
 * @desc    Get the user's feed (cached)
 * @route   GET /api/posts/feed
 * @access  Private
 */
export const getFeed = async (req, res) => {
  const userId = req.user;

  try {
    // Check Redis cache for the feed
    const cacheKey = `feed:${userId}`;
    const cachedFeed = await getCachedData(cacheKey);

    if (cachedFeed) {
      return res.json(cachedFeed); // Return cached feed
    }

    // Fetch feed from MongoDB
    const user = await User.findById(userId).populate('friends');
    const posts = await Post.find({
      $or: [
        { author: { $in: user.friends } }, // Posts by friends
        { comments: { $elemMatch: { commenter: { $in: user.friends } } } }, // Posts commented on by friends
      ],
    })
      .populate('author', 'username email')
      .populate('comments.commenter', 'username email')
      .sort({ createdAt: -1 }); // Latest posts first

    // Cache the feed in Redis for 10 minutes
    await setCacheData(cacheKey, posts, 600);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch feed', error: error.message });
  }
};

/**
 * @desc    Add a comment to a post
 * @route   POST /api/posts/:id/comment
 * @access  Private
 */
export const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    // Find the post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Add a new comment
    const comment = {
      commenter: req.user,
      text,
    };
    post.comments.push(comment);
    await post.save();

    // Invalidate cache for the user and the post author
    const cacheKeys = [`feed:${req.user}`, `feed:${post.author}`];
    await invalidateCache(cacheKeys);

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
};

/**
 * @desc    Get a specific post by ID
 * @route   GET /api/posts/:id
 * @access  Private
 */
export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id)
      .populate('author', 'username email')
      .populate('comments.commenter', 'username email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
};
