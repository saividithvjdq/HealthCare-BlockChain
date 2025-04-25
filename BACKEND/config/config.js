require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_blockchain',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    maxFileSize: process.env.MAX_FILE_SIZE || '5mb',
    rateLimitWindow: process.env.RATE_LIMIT_WINDOW || 15,
    rateLimitMax: process.env.RATE_LIMIT_MAX || 100
};

module.exports = config; 