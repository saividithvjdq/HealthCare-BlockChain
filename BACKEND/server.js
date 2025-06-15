const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db'); // Import MongoDB connection
const logger = require('./utils/logger');
const { apiLimiter, authLimiter } = require('./middleware/rateLimit');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Log server configuration
logger.info('Server Configuration:', {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 5000,
    JWT_EXPIRATION: process.env.JWT_EXPIRES_IN || '24h',
});

// Security Middleware
app.use(helmet()); // Set security HTTP headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
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

// Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/patients', require('./routes/patientRoutes'));
// app.use('/api/records', require('./routes/records'));
// app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/aadhaar', require('./routes/aadhaarAuthRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/images', require('./routes/imageRoutes'));
// app.use('/api/doctors', require('./routes/doctorRoutes'));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

// Handle undefined routes
app.all('*', (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
});

// Global error handling middleware
app.use(errorHandler);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

let server;
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Check if port is in use
        await new Promise((resolve, reject) => {
            const checkServer = require('net').createServer()
            .once('error', err => {
                if (err.code === 'EADDRINUSE') {
                    logger.error(`Port ${PORT} is in use`);
                    reject(new Error(`Port ${PORT} is in use`));
                } else {
                    reject(err);
                }
            })
            .once('listening', () => {
                checkServer.close();
                resolve();
            })
            .listen(PORT);
        });

        // Start the server
        server = app.listen(PORT, () => {
            logger.info(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });

        // Graceful shutdown handlers
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

const gracefulShutdown = async () => {
    try {
        logger.info('🔄 Received shutdown signal. Starting graceful shutdown...');
        
        if (server) {
            await new Promise((resolve) => {
                server.close(resolve);
            });
            logger.info('✅ HTTP server closed');
        }

        process.exit(0);
    } catch (error) {
        logger.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
};

// Remove previous process.on handlers and use this:
process.on('uncaughtException', (err) => {
    logger.error('❌ UNCAUGHT EXCEPTION:', err);
    gracefulShutdown();
});

process.on('unhandledRejection', (err) => {
    logger.error('❌ UNHANDLED REJECTION:', err);
    gracefulShutdown();
});

startServer();



