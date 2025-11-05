
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Loan from '../models/Loan.js';

// @desc    Get user profile (for member dashboard)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    // We could also attach recent loans/savings here
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users (for admin dashboard)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

export { getUserProfile, getAllUsers };