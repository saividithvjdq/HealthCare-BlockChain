// const AadhaarUser = require('../models/AadhaarUser');
const jwt = require('jsonwebtoken');
const config = require('../config/keys');
const logger = require('../utils/logger');

const otpStore = new Map(); // In-memory OTP storage

// Generate and send OTP
exports.generateOTP = async (req, res) => {
    try {
        const { aadhaarNumber } = req.body;

        if (aadhaarNumber !== '123456789012') {
            return res.status(400).json({ message: 'Invalid Aadhaar number' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(aadhaarNumber, { otp, createdAt: Date.now() });

        console.log(`Generated OTP for Aadhaar ${aadhaarNumber}: ${otp}`); // Log OTP to console

        res.json({ message: 'OTP generated successfully' });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({ message: 'Server error during OTP generation' });
    }
};

// Verify OTP and login
exports.verifyOTP = async (req, res) => {
    try {
        const { aadhaarNumber, otp } = req.body;

        const storedOtp = otpStore.get(aadhaarNumber);
        if (!storedOtp) {
            return res.status(400).json({ message: 'OTP not found or expired' });
        }

        if (Date.now() - storedOtp.createdAt > 5 * 60 * 1000) {
            otpStore.delete(aadhaarNumber);
            return res.status(400).json({ message: 'OTP expired' });
        }

        if (storedOtp.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        otpStore.delete(aadhaarNumber); // Remove OTP after successful verification
        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
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