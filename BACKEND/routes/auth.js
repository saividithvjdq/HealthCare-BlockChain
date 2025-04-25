const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

// In-memory OTP storage (replace with Redis in production)
const otpStore = new Map();

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Mock Aadhaar database (remove in production)
const mockAadhaarDB = new Set([
    '123456789012',
    '234567890123',
    '345678901234'
]);

// Send OTP route
router.post('/send-otp', [
    body('aadhaar').matches(/^\d{12}$/).withMessage('Invalid Aadhaar number')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: errors.array()[0].msg 
            });
        }

        const { aadhaar } = req.body;

        // For development, check if Aadhaar exists in mock database
        if (!mockAadhaarDB.has(aadhaar)) {
            return res.status(400).json({ 
                success: false,
                message: 'Aadhaar number not found in database' 
            });
        }

        // Clear any existing OTP for this Aadhaar
        if (otpStore.has(aadhaar)) {
            otpStore.delete(aadhaar);
        }

        const otp = generateOTP();
        
        // Store OTP with 5 minutes expiry
        otpStore.set(aadhaar, {
            otp,
            createdAt: Date.now(),
            attempts: 0
        });

        // In production, integrate with actual SMS gateway
        console.log(`Development OTP for ${aadhaar}: ${otp}`);

        setTimeout(() => {
            if (otpStore.has(aadhaar)) {
                otpStore.delete(aadhaar);
            }
        }, 5 * 60 * 1000); // 5 minutes expiry

        res.json({ 
            success: true, 
            message: 'OTP sent successfully',
            // Only in development
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });
    } catch (error) {
        console.error('Send OTP Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error sending OTP' 
        });
    }
});

// Verify OTP route
router.post('/verify-otp', [
    body('aadhaar').matches(/^\d{12}$/).withMessage('Invalid Aadhaar number'),
    body('otp').matches(/^\d{6}$/).withMessage('Invalid OTP format')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                message: errors.array()[0].msg 
            });
        }

        const { aadhaar, otp } = req.body;
        const storedData = otpStore.get(aadhaar);

        if (!storedData) {
            return res.status(400).json({ 
                success: false,
                message: 'OTP expired or not sent. Please request a new OTP.' 
            });
        }

        if (storedData.attempts >= 3) {
            otpStore.delete(aadhaar);
            return res.status(400).json({ 
                success: false,
                message: 'Too many failed attempts. Please request a new OTP.' 
            });
        }

        if (Date.now() - storedData.createdAt > 5 * 60 * 1000) {
            otpStore.delete(aadhaar);
            return res.status(400).json({ 
                success: false,
                message: 'OTP has expired. Please request a new OTP.' 
            });
        }

        if (storedData.otp !== otp) {
            storedData.attempts += 1;
            const remainingAttempts = 3 - storedData.attempts;
            return res.status(400).json({ 
                success: false,
                message: `Invalid OTP. ${remainingAttempts} attempts remaining.` 
            });
        }

        // OTP verified successfully
        otpStore.delete(aadhaar);

        // Generate JWT token
        const token = jwt.sign(
            { aadhaar },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'OTP verified successfully',
            token
        });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error verifying OTP' 
        });
    }
});

module.exports = router; 