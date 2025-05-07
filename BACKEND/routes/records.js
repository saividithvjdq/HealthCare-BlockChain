const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middleware/auth');
const HealthRecord = require('../models/HealthRecord');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            if (!req.user || !req.user.aadhaar) {
                return cb(new Error('User authentication required'));
            }
            const userDir = path.join(uploadsDir, req.user.aadhaar);
            fs.mkdirSync(userDir, { recursive: true });
            cb(null, userDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: function (req, file, cb) {
        try {
            // Sanitize filename
            const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
            cb(null, `${Date.now()}-${sanitizedFilename}`);
        } catch (error) {
            cb(error);
        }
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        try {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                const error = new Error('Invalid file type. Only PDF, JPEG, and PNG files are allowed.');
                error.status = 400;
                cb(error);
            }
        } catch (error) {
            cb(error);
        }
    }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: error.message });
    }
    if (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
    next();
};

// Get all records for a user
router.get('/', verifyToken, async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const records = await HealthRecord.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json({ records });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ message: 'Error fetching records', error: error.message });
    }
});

// Upload a new record
router.post('/upload', verifyToken, upload.single('file'), handleMulterError, async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const record = new HealthRecord({
            user: req.user._id,
            title: req.body.title || req.file.originalname,
            filePath: path.join('uploads', req.user.aadhaar, req.file.filename).replace(/\\/g, '/'),
            fileType: req.file.mimetype,
            fileSize: req.file.size,
            description: req.body.description || ''
        });

        await record.save();

        res.json({
            success: true,
            message: 'File uploaded successfully',
            record
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
});

// Delete a record
router.delete('/:recordId', verifyToken, async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

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
        res.status(500).json({ message: 'Error deleting record', error: error.message });
    }
});

module.exports = router;
