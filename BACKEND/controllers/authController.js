const AadhaarUser = require('../models/AadhaarUser');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');

// Sample Aadhaar database (in production, this would be connected to actual UIDAI database)
const sampleAadhaarUsers = [
    {
        aadhaarNumber: '123456789012',
        name: 'John Doe',
        dateOfBirth: new Date('1990-01-01'),
        address: '123 Main St, Bangalore, Karnataka',
        phoneNumber: '9876543210',
        gender: 'Male'
    },
    {
        aadhaarNumber: '987654321098',
        name: 'Jane Smith',
        dateOfBirth: new Date('1985-05-15'),
        address: '456 Park Ave, Mumbai, Maharashtra',
        phoneNumber: '8765432109',
        gender: 'Female'
    }
];

// Initialize sample data
const initializeSampleData = async () => {
    try {
        for (const user of sampleAadhaarUsers) {
            await AadhaarUser.findOneAndUpdate(
                { aadhaarNumber: user.aadhaarNumber },
                user,
                { upsert: true, new: true }
            );
        }
        logger.info('Sample Aadhaar data initialized');
    } catch (error) {
        logger.error('Error initializing sample data:', error);
    }
};

// Call this when your server starts
initializeSampleData();

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { 
            aadhaar: user.aadhaarNumber,
            name: user.name
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );
};

// Send OTP
exports.sendOTP = async (req, res) => {
    try {
        const { aadhaar } = req.body;

        // Check if Aadhaar exists in our sample database
        const user = await AadhaarUser.findOne({ aadhaarNumber: aadhaar });
        if (!user) {
            logger.warn(`Aadhaar number not found: ${aadhaar}`);
            return res.status(404).json({ 
                status: 'error',
                message: 'Aadhaar number not found' 
            });
        }

        // Generate OTP
        const otp = await OTP.generateOTP(aadhaar);

        // In production, you would send this OTP via SMS
        // For development, we'll just send it in response
        res.json({
            status: 'success',
            message: 'OTP sent successfully',
            debug: { otp }, // Remove this in production
            phoneNumber: user.phoneNumber.replace(/\d(?=\d{4})/g, '*') // Mask phone number
        });

    } catch (error) {
        logger.error('Send OTP error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Error sending OTP' 
        });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { aadhaar, otp } = req.body;

        // Verify OTP
        const verification = await OTP.verifyOTP(aadhaar, otp);
        if (!verification.isValid) {
            logger.warn(`Invalid OTP attempt for Aadhaar: ${aadhaar}`);
            return res.status(400).json({ 
                status: 'error',
                message: verification.message 
            });
        }

        // Get user data
        const user = await AadhaarUser.findOne({ aadhaarNumber: aadhaar });
        if (!user) {
            logger.error(`User not found after OTP verification: ${aadhaar}`);
            return res.status(404).json({ 
                status: 'error',
                message: 'User not found' 
            });
        }

        // Generate JWT token
        const token = generateToken(user);

        // Send response with user data and token
        res.json({
            status: 'success',
            message: 'OTP verified successfully',
            token,
            user: {
                name: user.name,
                aadhaarNumber: user.aadhaarNumber,
                phoneNumber: user.phoneNumber.replace(/\d(?=\d{4})/g, '*'),
                address: user.address
            }
        });

    } catch (error) {
        logger.error('Verify OTP error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Error verifying OTP' 
        });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await AadhaarUser.findOne({ aadhaarNumber: req.user.aadhaar });
        if (!user) {
            logger.warn(`Profile not found for Aadhaar: ${req.user.aadhaar}`);
            return res.status(404).json({ 
                status: 'error',
                message: 'User not found' 
            });
        }

        res.json({
            status: 'success',
            user: {
                name: user.name,
                aadhaarNumber: user.aadhaarNumber,
                phoneNumber: user.phoneNumber.replace(/\d(?=\d{4})/g, '*'),
                address: user.address,
                gender: user.gender,
                dateOfBirth: user.dateOfBirth
            }
        });

    } catch (error) {
        logger.error('Get profile error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Error fetching profile' 
        });
    }
}; 