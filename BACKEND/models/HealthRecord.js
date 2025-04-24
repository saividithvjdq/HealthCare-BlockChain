const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
    patientAadhaar: {
        type: String,
        required: true,
        ref: 'Patient'
    },
    recordType: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileName: String,
    description: String,
    blockchainHash: String,
    fileHash: {
        type: String,
        required: true
    },
    blockchainTxHash: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);