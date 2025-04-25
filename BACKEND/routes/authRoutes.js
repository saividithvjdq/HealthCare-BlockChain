const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, verifyAadhaar } = require('../middleware/auth');
const { verifyOTP } = require('../controllers/patientController');

// Authentication routes
router.post('/send-otp', verifyAadhaar, authController.sendOTP);
router.post('/verify-otp', verifyAadhaar, authController.verifyOTP);
router.get('/profile', verifyToken, authController.getProfile);

// Aadhaar verification routes
router.post('/verify-aadhaar', verifyAadhaar);
router.post('/verify-otp', verifyOTP);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Internal server error'
    });
});

module.exports = router; 