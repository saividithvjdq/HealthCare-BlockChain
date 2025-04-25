const AadhaarUser = require('../models/AadhaarUser');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');
const logger = require('../utils/logger');

// Generate and send OTP
exports.generateOTP = async (req, res) => {
    try {
        const { aadhaarNumber } = req.body;

        // Validate Aadhaar number
        if (!/^\d{12}$/.test(aadhaarNumber)) {
            return res.status(400).json({ message: 'Invalid Aadhaar number format' });
        }

        // Check if user exists
        const user = await AadhaarUser.findOne({ aadhaarNumber });
        if (!user) {
            return res.status(404).json({ message: 'Aadhaar number not registered' });
        }

        // Generate OTP
        const otp = await OTP.generateOTP(aadhaarNumber);

        // In a real application, you would send this OTP to the user's registered phone number
        // For testing purposes, we'll return it in the response
        res.json({ 
            message: 'OTP generated successfully',
            otp: otp // Remove this in production
        });
    } catch (error) {
        logger.error('Error generating OTP:', error);
        res.status(500).json({ message: 'Server error during OTP generation' });
    }
};

// Verify OTP and login
exports.verifyOTP = async (req, res) => {
    try {
        const { aadhaarNumber, otp } = req.body;

        // Verify OTP
        const verification = await OTP.verifyOTP(aadhaarNumber, otp);
        if (!verification.isValid) {
            return res.status(400).json({ message: verification.message });
        }

        // Get user details
        const user = await AadhaarUser.findOne({ aadhaarNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id,
                aadhaarNumber: user.aadhaarNumber
            }
        };

        jwt.sign(
            payload,
            config.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token,
                    user: {
                        name: user.name,
                        aadhaarNumber: user.aadhaarNumber
                    }
                });
            }
        );
    } catch (error) {
        logger.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Server error during OTP verification' });
    }
};

// Register new Aadhaar user
exports.registerAadhaarUser = async (req, res) => {
    try {
        const { aadhaarNumber, name, dateOfBirth, address, phoneNumber, gender } = req.body;

        // Check if user already exists
        let user = await AadhaarUser.findOne({ aadhaarNumber });
        if (user) {
            return res.status(400).json({ message: 'Aadhaar number already registered' });
        }

        // Create new user
        user = new AadhaarUser({
            aadhaarNumber,
            name,
            dateOfBirth,
            address,
            phoneNumber,
            gender
        });

        await user.save();

        res.json({ message: 'User registered successfully' });
    } catch (error) {
        logger.error('Error registering Aadhaar user:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
}; 