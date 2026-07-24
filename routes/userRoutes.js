const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// User routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

// Admin routes
router.get('/', auth, adminOnly, getAllUsers);
router.delete('/:userId', auth, adminOnly, deleteUser);

module.exports = router;
