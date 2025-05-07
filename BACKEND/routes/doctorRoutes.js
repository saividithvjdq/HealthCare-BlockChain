const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { uploadToIPFS } = require('../services/ipfsService');
const { verifyDoctor } = require('../services/blockchainService');
const multer = require('multer');
const auth = require('../middleware/auth');

const upload = multer({
  limits: {
    fileSize: process.env.MAX_FILE_SIZE
  }
});

router.post('/verify', auth, upload.fields([
  { name: 'idPhoto', maxCount: 1 },
  { name: 'livePhoto', maxCount: 1 }
]), async (req, res) => {
  try {
    const { licenseNumber, patientAadhaar } = req.body;
    const idPhoto = req.files['idPhoto'][0];
    const livePhoto = req.files['livePhoto'][0];

    // Upload photos to IPFS
    const idPhotoHash = await uploadToIPFS(idPhoto.buffer);
    const livePhotoHash = await uploadToIPFS(livePhoto.buffer);

    // Verify on blockchain
    const txHash = await verifyDoctor(licenseNumber, idPhotoHash, livePhotoHash);

    // Save to database
    const doctor = new Doctor({
      licenseNumber,
      idPhotoHash,
      livePhotoHash,
      blockchainTxHash: txHash,
      verificationStatus: 'verified',
      patientAccess: [{
        patientAadhaar,
        grantedAt: new Date(),
        status: 'active'
      }]
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      doctor,
      txHash,
      idPhotoUrl: `${process.env.IPFS_GATEWAY_URL}/ipfs/${idPhotoHash}`
    });
  } catch (error) {
    console.error('Doctor verification error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/verification-status/:id', auth, async (req, res) => {
  try {
    const verification = await Doctor.findById(req.params.id);
    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }
    
    res.json({
      status: verification.verificationStatus,
      details: verification
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;