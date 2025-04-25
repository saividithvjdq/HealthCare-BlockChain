// Mock implementation for development
const logger = require('../utils/logger');

// In-memory store for development/testing
const records = [];

class MockBlockchainService {
    constructor() {
        logger.info('Initializing Mock Blockchain Service for development');
    }

    async createBlockchainRecord(recordData) {
        try {
            const record = {
                id: `record_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
                timestamp: new Date(),
                ...recordData
            };
            
            records.push(record);
            logger.info(`Mock blockchain record created: ${record.id}`);
            
            return record.id;
        } catch (error) {
            logger.error('Mock blockchain record creation error:', error);
            throw new Error('Failed to create mock blockchain record');
        }
    }

    async getBlockchainRecords(aadhaarNumber) {
        try {
            // Filter records by aadhaarNumber if provided
            const filteredRecords = aadhaarNumber 
                ? records.filter(record => record.aadhaarNumber === aadhaarNumber)
                : records;
                
            return filteredRecords;
        } catch (error) {
            logger.error('Mock blockchain read error:', error);
            throw new Error('Failed to read mock blockchain records');
        }
    }
}

// Export functions directly for easier usage
const service = new MockBlockchainService();

// Main function to create a blockchain record
exports.createBlockchainRecord = async (recordData) => {
    return service.createBlockchainRecord(recordData);
};

// Function to get blockchain records
exports.getBlockchainRecords = async (aadhaarNumber) => {
    return service.getBlockchainRecords(aadhaarNumber);
};