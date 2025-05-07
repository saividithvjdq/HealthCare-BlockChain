const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const logger = require('../utils/logger');

// Input validation middleware
const validateRegistration = (req, res, next) => {
    const { name, email, password, aadhaar } = req.body;
    
    if (!name || !email || !password || !aadhaar) {
        return res.status(400).json({ 
            status: 'error',
            message: 'All fields are required (name, email, password, aadhaar)' 
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            status: 'error',
            message: 'Invalid email format' 
        });
    }

    // Password validation (at least 8 characters)
    if (password.length < 8) {
        return res.status(400).json({ 
            status: 'error',
            message: 'Password must be at least 8 characters long' 
        });
    }

    // Aadhaar validation (12 digits)
    if (!/^\d{12}$/.test(aadhaar)) {
        return res.status(400).json({ 
            status: 'error',
            message: 'Invalid Aadhaar number format. Must be 12 digits' 
        });
    }

    next();
};

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
    try {
        const { name, email, password, aadhaar } = req.body;

        // Check if user already exists (by email or aadhaar)
        let existingUser = await User.findOne({ 
            $or: [{ email }, { aadhaar }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                status: 'error',
                message: existingUser.email === email ? 
                    'Email already registered' : 
                    'Aadhaar number already registered' 
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            aadhaar
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Create JWT token
        const token = jwt.sign(
            {
                _id: user._id,
                aadhaar: user.aadhaar,
                role: user.role
            },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    aadhaar: user.aadhaar,
                    role: user.role
                }
            }
        });
    } catch (error) {
        logger.error('User registration error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Registration failed',
            error: error.message 
        });
    }
});

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                status: 'error',
                message: 'Email and password are required' 
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                status: 'error',
                message: 'Invalid credentials' 
            });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                status: 'error',
                message: 'Invalid credentials' 
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                _id: user._id,
                aadhaar: user.aadhaar,
                role: user.role
            },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        res.json({
            status: 'success',
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    aadhaar: user.aadhaar,
                    role: user.role
                }
            }
        });
    } catch (error) {
        logger.error('User login error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Login failed',
            error: error.message 
        });
    }
});

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ 
                status: 'error',
                message: 'User not found' 
            });
        }

        res.json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        logger.error('Get user profile error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Failed to fetch user profile',
            error: error.message 
        });
    }
});

module.exports = router;
