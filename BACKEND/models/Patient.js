const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    aadhaarNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    blockchainAddress: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);