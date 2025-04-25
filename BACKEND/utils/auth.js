const jwt = require('jsonwebtoken');
const config = require('../config/keys');

// Generate JWT token
exports.generateToken = (payload) => {
    return jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRATION
    });
};

// Verify JWT token
exports.verifyToken = (token) => {
    try {
        return jwt.verify(token, config.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid token');
    }
};

// Generate random JWT secret if not provided
exports.generateJWTSecret = () => {
    return require('crypto').randomBytes(64).toString('hex');
};

// Generate OTP
exports.generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Verify OTP (mock implementation)
exports.verifyOTP = (storedOTP, providedOTP) => {
    return storedOTP === providedOTP;
}; 