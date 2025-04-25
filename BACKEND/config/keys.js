const crypto = require('crypto');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Generate a random JWT secret if not provided in environment variables
const generateJWTSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

// Generate a random encryption key if not provided
const generateEncryptionKey = () => {
    return crypto.randomBytes(32).toString('hex').slice(0, 32); // AES-256 requires 32 bytes
};

const config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET || generateJWTSecret(),
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_blockchain',
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || generateEncryptionKey(),
    // You can add more security configurations here
};

// Log configuration during development (remove in production)
if (config.NODE_ENV === 'development') {
    console.log('Server Configuration:', {
        NODE_ENV: config.NODE_ENV,
        PORT: config.PORT,
        MONGODB_URI: config.MONGODB_URI,
        JWT_EXPIRATION: config.JWT_EXPIRATION
    });
}

module.exports = config; 