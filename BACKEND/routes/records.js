const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadToIPFS } = require('../services/ipfsService');
const { verifyToken } = require('../middleware/auth');
const Record = require('../models/Record'); // MongoDB model for records

// Configure multer for file upload
const upload = multer({ storage: multer.memoryStorage() });

// Upload a new record
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload file to IPFS
        const ipfsHash = await uploadToIPFS(req.file.buffer);

        // Save metadata and IPFS hash to MongoDB
        const record = new Record({
            userId: req.user.id, // Assuming user ID is available in the token
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            ipfsHash,
            uploadedAt: new Date(),
        });
        await record.save();

        // Return IPFS hash and metadata
        res.json({
            message: 'File uploaded successfully',
            ipfsHash,
            metadata: {
                fileName: req.file.originalname,
                fileType: req.file.mimetype,
                fileSize: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
                user: req.user, // Include user data from the token
            },
        });
    } catch (error) {
        console.error('Error uploading file:', error.message);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

// Get records for the authenticated user
router.get('/user-records', verifyToken, async (req, res) => {
    try {
        const records = await Record.find({ userId: req.user.id });
        res.json(records);
    } catch (error) {
        console.error('Error fetching records:', error.message);
        res.status(500).json({ message: 'Error fetching records' });
    }
});

module.exports = router;
