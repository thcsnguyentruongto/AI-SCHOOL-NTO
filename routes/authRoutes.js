const express = require('express');
const { auth } = require('../middleware/auth');
const {
  register,
  login,
  getCurrentUser,
  logout
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getCurrentUser);
router.post('/logout', auth, logout);

module.exports = router;
