const Patient = require('../models/patient');
const AadhaarService = require('../services/aadhaarService');
const { generateToken } = require('../utils/auth');
const { encryptData, decryptData } = require('../utils/encryption');
const { createBlockchainRecord, getBlockchainRecords } = require('../services/blockchainService');

exports.verifyAadhaar = async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;

    // Verify Aadhaar using mock service
    const verificationResult = await AadhaarService.verifyAadhaar(aadhaarNumber);
    
    if (!verificationResult.success) {
      return res.status(400).json({ message: 'Aadhaar verification failed' });
    }

    // Store verification attempt in blockchain
    await createBlockchainRecord({
      type: 'AADHAAR_VERIFICATION',
      aadhaarNumber: encryptData(aadhaarNumber),
      timestamp: new Date(),
      status: 'SUCCESS'
    });

    res.json({
      success: true,
      message: 'Aadhaar verified successfully',
      data: {
        name: verificationResult.data.name,
        dob: verificationResult.data.dob,
        gender: verificationResult.data.gender
      },
      otp: verificationResult.otp
    });
  } catch (error) {
    console.error('Aadhaar verification error:', error);
    res.status(500).json({ message: 'Aadhaar verification failed' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { aadhaarNumber, otp } = req.body;

    // Verify OTP using mock service
    const verificationResult = await AadhaarService.verifyOTP(aadhaarNumber, otp);
    
    if (!verificationResult.success) {
      return res.status(400).json({ message: 'OTP verification failed' });
    }

    // Store OTP verification in blockchain
    await createBlockchainRecord({
      type: 'OTP_VERIFICATION',
      aadhaarNumber: encryptData(aadhaarNumber),
      timestamp: new Date(),
      status: 'SUCCESS'
    });

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

// New innovative feature: Patient Health Timeline
exports.getHealthTimeline = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Get all blockchain records for the patient
    const timeline = await getBlockchainRecords(patient.aadhaarNumber);
    
    // Decrypt sensitive data
    const decryptedTimeline = timeline.map(record => ({
      ...record,
      data: decryptData(record.data)
    }));

    res.json({
      success: true,
      timeline: decryptedTimeline
    });
  } catch (error) {
    console.error('Error fetching health timeline:', error);
    res.status(500).json({ message: 'Error fetching health timeline' });
  }
};

// New innovative feature: Health Data Sharing Consent
exports.updateDataSharingConsent = async (req, res) => {
  try {
    const { consentType, consentStatus } = req.body;
    const patient = await Patient.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Update consent in blockchain
    await createBlockchainRecord({
      type: 'CONSENT_UPDATE',
      aadhaarNumber: patient.aadhaarNumber,
      consentType,
      consentStatus,
      timestamp: new Date()
    });

    res.json({
      success: true,
      message: 'Consent updated successfully'
    });
  } catch (error) {
    console.error('Error updating consent:', error);
    res.status(500).json({ message: 'Error updating consent' });
  }
}; 