const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Optional: prepare for Mongoose v7
mongoose.set('strictQuery', false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare_blockchain',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000 // Shorter timeout
            }
        );

        // Log success
        logger.info(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Runtime connection issues
        conn.connection.on('error', (err) => {
            logger.error(`MongoDB runtime connection error: ${err}`);
            console.error(`❌ MongoDB runtime error: ${err.message}`);
        });

        conn.connection.on('disconnected', () => {
            logger.warn('⚠️ MongoDB disconnected');
            console.warn('⚠️ MongoDB disconnected');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await conn.connection.close();
            logger.info('🔌 MongoDB connection closed through app termination');
            console.log('🔌 MongoDB connection closed (SIGINT)');
            process.exit(0);
        });

    } catch (error) {
        // Startup error logging
        logger.error(`❌ MongoDB connection error: ${error.message}`);
        console.error('❌ MongoDB failed to connect:', error.message);
        console.error(error.stack);

        // Only exit in production to allow nodemon auto-retry in dev
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
