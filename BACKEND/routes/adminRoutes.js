const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const logger = require('../utils/logger');
const { 
    createAdmin,
    loginAdmin,
    getAdminProfile,
    updateAdminProfile
} = require('../controllers/adminController');

// Public routes
router.post('/create', createAdmin);
router.post('/login', loginAdmin);

// Protected routes
router.get('/profile', auth, getAdminProfile);
router.put('/profile/update', auth, updateAdminProfile);

// Basic admin route for testing
router.get('/', auth, (req, res) => {
    res.json({ message: 'Admin routes are working' });
});

module.exports = router; 