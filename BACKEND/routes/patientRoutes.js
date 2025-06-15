const express = require('express');
const router = express.Router();
const { verifyAadhaar } = require('../middleware/auth');

// In-memory storage for patients (replace with blockchain logic if needed)
const patients = new Map();

// Register a new patient
router.post('/register', verifyAadhaar, async (req, res) => {
    try {
        console.log('Request body:', req.body); // Debugging log
        console.log('Aadhaar number:', req.aadhaarNumber); // Debugging log

        const { name, email, phone } = req.body;
        const aadhaarNumber = req.aadhaarNumber;

        // Check if the patient already exists
        if (patients.has(aadhaarNumber)) {
            return res.status(400).json({ message: 'Patient already registered' });
        }

        // Save patient details in memory
        const patient = { aadhaarNumber, name, email, phone };
        patients.set(aadhaarNumber, patient);

        res.status(201).json(patient);
    } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({ message: 'Error registering patient' });
    }
});

// Get patient profile
router.get('/profile', verifyAadhaar, async (req, res) => {
    try {
        console.log('Fetching profile for Aadhaar:', req.aadhaarNumber); // Debugging log

        const aadhaarNumber = req.aadhaarNumber;

        // Retrieve patient details from memory
        const patient = patients.get(aadhaarNumber);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json(patient);
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.status(500).json({ message: 'Error fetching patient profile' });
    }
});

module.exports = router;