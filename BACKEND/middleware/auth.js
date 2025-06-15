const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            logger.warn('Authentication attempt without token');
            return res.status(401).json({ 
                status: 'error',
                message: 'Authentication required' 
            });
        }

        try {
            const decoded = jwt.verify(token, config.jwtSecret);
            req.user = decoded;
            next();
        } catch (error) {
            logger.error('JWT verification failed:', error);
            return res.status(401).json({ 
                status: 'error',
                message: 'Invalid or expired token' 
            });
        }
    } catch (error) {
        logger.error('Authentication middleware error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error' 
        });
    }
};

// Middleware to verify Aadhaar number
module.exports.verifyAadhaar = (req, res, next) => {
    try {
        const aadhaarNumber = req.headers['aadhaar-number'];

        // Validate Aadhaar number
        if (!aadhaarNumber || aadhaarNumber !== '123456789012') {
            return res.status(401).json({ message: 'Invalid or missing Aadhaar number' });
        }

        // Attach Aadhaar number to the request object
        req.aadhaarNumber = aadhaarNumber;
        next();
    } catch (error) {
        console.error('Error in verifyAadhaar middleware:', error);
        res.status(500).json({ message: 'Authentication error' });
    }
};

module.exports = {
    verifyToken,
    verifyAadhaar
};