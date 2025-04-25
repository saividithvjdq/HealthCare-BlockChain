const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logDir = path.join(__dirname, '../logs');
try {
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
} catch (err) {
    console.error('Error creating logs directory:', err);
}

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: logFormat,
    transports: [
        // Write to console in development
        process.env.NODE_ENV !== 'production' && new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Write all logs error (and below) to error.log
        new winston.transports.File({
            filename: path.join(logDir, 'error.log'),
            level: 'error',
            handleExceptions: true
        }),
        // Write all logs to combined.log
        new winston.transports.File({
            filename: path.join(logDir, 'combined.log'),
            handleExceptions: true
        })
    ].filter(Boolean)
});

// Create a stream object with a write function that will be used by Morgan
logger.stream = {
    write: function(message) {
        logger.info(message.trim());
    }
};

module.exports = logger; 