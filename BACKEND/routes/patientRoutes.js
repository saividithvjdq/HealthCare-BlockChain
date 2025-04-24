const express = require('express');
const router = express.Router();
const { verifyAadhaar } = require('../middleware/auth');
const Patient = require('../models/Patient');

router.post('/register', verifyAadhaar, async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const aadhaarNumber = req.aadhaarNumber;

        const patient = new Patient({
            aadhaarNumber,
            name,
            email,
            phone
        });

        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/profile', verifyAadhaar, async (req, res) => {
    try {
        const patient = await Patient.findOne({ aadhaarNumber: req.aadhaarNumber });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;