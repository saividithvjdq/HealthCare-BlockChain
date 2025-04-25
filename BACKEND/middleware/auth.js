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
const verifyAadhaar = (req, res, next) => {
    try {
        const { aadhaar } = req.body;
        
        if (!aadhaar) {
            logger.warn('Aadhaar verification attempt without Aadhaar number');
            return res.status(400).json({ 
                status: 'error',
                message: 'Aadhaar number is required' 
            });
        }

        // Basic Aadhaar validation (12 digits)
        if (!/^\d{12}$/.test(aadhaar)) {
            logger.warn(`Invalid Aadhaar format attempt: ${aadhaar}`);
            return res.status(400).json({ 
                status: 'error',
                message: 'Invalid Aadhaar format. Must be 12 digits' 
            });
        }

        next();
    } catch (error) {
        logger.error('Aadhaar verification error:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Internal server error' 
        });
    }
};

module.exports = {
    verifyToken,
    verifyAadhaar
};