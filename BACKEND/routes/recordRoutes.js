const express = require('express');
const router = express.Router();
const multer = require('multer');
const recordController = require('../controllers/recordController');
const auth = require('../middleware/auth');

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

router.post('/upload', 
  auth, 
  upload.single('file'), 
  recordController.uploadRecord
);

router.get('/:recordId', 
  auth, 
  recordController.getRecord
);

module.exports = router;