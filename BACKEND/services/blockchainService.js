// Mock implementation for development
const logger = require('../utils/logger');
const { ethers } = require('ethers');
const doctorVerificationABI = require('../contracts/DoctorVerification.json');

// In-memory store for development/testing
const records = [];

const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_NETWORK);
const wallet = new ethers.Wallet(process.env.CONTRACT_OWNER_PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  doctorVerificationABI.abi,
  wallet
);

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

const verifyDoctor = async (licenseNumber, idPhotoHash, livePhotoHash) => {
  try {
    const tx = await contract.verifyDoctor(licenseNumber, idPhotoHash, livePhotoHash);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Blockchain verification error:', error);
    throw new Error('Failed to verify doctor on blockchain');
  }
};

const recordAccess = async (doctorLicense, patientAadhaar, reason) => {
  try {
    const tx = await contract.recordAccess(doctorLicense, patientAadhaar, reason);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Record access error:', error);
    throw new Error('Failed to record access on blockchain');
  }
};

module.exports = { verifyDoctor, recordAccess };