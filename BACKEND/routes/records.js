const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const HealthRecord = require('../models/HealthRecord.js');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!req.user || !req.user.aadhaar) {
            return cb(new Error('User information missing in request.'));
        }
        const userDir = path.join(__dirname, '../uploads/', req.user.aadhaar);
        console.log('User Directory:', userDir); // Log user directory path for debugging
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        cb(null, userDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const error = new Error('Invalid file type. Only PDF and images are allowed.');
            error.status = 400; // Add a status code
            cb(error);
        }
    }
});

// Get all records for a user
router.get('/', auth, async (req, res) => {
    try {
        console.log(req.user); // Check if the user object is available
        const records = await HealthRecord.find({ user: req.user._id });
        res.json({ records });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ message: 'Error fetching records' });
    }
});

// Upload a new record
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const record = new HealthRecord({
            user: req.user._id,
            title: req.body.title || req.file.originalname,
            filePath: `/uploads/${req.user.aadhaar}/${req.file.filename}`,
            fileType: req.file.mimetype,
            fileSize: req.file.size
        });

        await record.save();

        res.json({
            success: true,
            message: 'File uploaded successfully',
            record
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

// Delete a record
router.delete('/:recordId', auth, async (req, res) => {
    try {
        const record = await HealthRecord.findOne({
            _id: req.params.recordId,
            user: req.user._id
        });

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Delete the file
        const filePath = path.join(__dirname, '..', record.filePath);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete the record from database
        await HealthRecord.deleteOne({ _id: req.params.recordId });

        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ message: 'Error deleting record' });
    }
});

module.exports = router;
