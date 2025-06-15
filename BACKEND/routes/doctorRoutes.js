const express = require('express');
const router = express.Router();
const { uploadToIPFS } = require('../services/ipfsService');
const { verifyDoctor } = require('../services/blockchainService');
const multer = require('multer');
const auth = require('../middleware/auth');

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/verify', auth, upload.fields([
    { name: 'idPhoto', maxCount: 1 },
    { name: 'livePhoto', maxCount: 1 }
]), async (req, res) => {
    try {
        const { licenseNumber } = req.body;
        const idPhoto = req.files['idPhoto'][0];
        const livePhoto = req.files['livePhoto'][0];

        // Upload photos to IPFS
        const idPhotoHash = await uploadToIPFS(idPhoto.buffer);
        const livePhotoHash = await uploadToIPFS(livePhoto.buffer);

        // Verify doctor on blockchain
        const txHash = await verifyDoctor(licenseNumber, idPhotoHash, livePhotoHash);

        res.status(201).json({ success: true, txHash });
    } catch (error) {
        console.error('Error verifying doctor:', error.message);
        res.status(500).json({ message: 'Error verifying doctor' });
    }
});

module.exports = router;