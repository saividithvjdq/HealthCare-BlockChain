const express = require('express');
const router = express.Router();
const { verifyAadhaar } = require('../middleware/auth');
const upload = require('../middleware/upload');
const HealthRecord = require('../models/HealthRecord');
const blockchainService = require('../services/blockchainService');
const crypto = require('crypto');

// Helper function to generate file hash
const generateFileHash = (file) => {
    const fileBuffer = file.buffer;
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    return hash.digest('hex');
};

router.post('/upload', verifyAadhaar, upload.single('file'), async (req, res) => {
    try {
        const { recordType, description } = req.body;
        const file = req.file;

        // Generate hash of the file
        const fileHash = generateFileHash(file);

        // Store in blockchain
        const txHash = await blockchainService.addRecord(
            req.aadhaarNumber,
            fileHash,
            recordType
        );

        // Create database record
        const record = new HealthRecord({
            patientAadhaar: req.aadhaarNumber,
            recordType,
            fileUrl: `/uploads/${file.filename}`,
            fileName: file.originalname,
            description,
            fileHash,
            blockchainTxHash: txHash
        });

        await record.save();
        res.status(201).json(record);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/list', verifyAadhaar, async (req, res) => {
    try {
        // Get records from database
        const dbRecords = await HealthRecord.find({ patientAadhaar: req.aadhaarNumber });
        
        // Get records from blockchain
        const blockchainRecords = await blockchainService.getRecords(req.aadhaarNumber);
        
        // Combine and verify records
        const verifiedRecords = dbRecords.map(record => {
            const blockchainMatch = blockchainRecords.find(br => br.fileHash === record.fileHash);
            return {
                ...record.toObject(),
                verified: !!blockchainMatch
            };
        });

        res.json(verifiedRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;