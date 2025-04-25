const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const logger = require('./utils/logger');
const { apiLimiter, authLimiter } = require('./middleware/rateLimit');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

const app = express();

// Log server configuration
logger.info('Server Configuration:', {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_blockchain',
    JWT_EXPIRATION: process.env.JWT_EXPIRES_IN || '24h'
});

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(compression()); // Compress all routes

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev', { stream: logger.stream }));
}

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter);

// // Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/records', require('./routes/records'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/aadhaar', require('./routes/aadhaarAuthRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));

// // Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle undefined routes
app.all('*', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
});

// Global error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
let server;

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();
        
        // Then start the server
        server = app.listen(PORT, () => {
            logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            logger.error('Server error:', error);
            if (error.code === 'EADDRINUSE') {
                logger.error(`Port ${PORT} is already in use`);
                process.exit(1);
            }
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger.error(err.name, err.message);
    process.exit(1);
});



