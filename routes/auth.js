const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', authController.registerUser);

// GET /api/auth/verify-email
router.get('/verify-email', authController.verifyEmail);

// POST /api/auth/register
router.post('/login', authController.loginUser);

router.post('/refresh', authController.refreshAccessToken);

module.exports = router;
