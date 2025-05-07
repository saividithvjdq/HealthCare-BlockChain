const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    hospitalId: {
        type: String,
        required: true
    },
    idPhotoUrl: {
        type: String,
        required: true
    },
    livePhotoUrl: {
        type: String,
        required: true
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    blockchainTxHash: String,
    patientAccess: [{
        patientAadhaar: {
            type: String,
            required: true
        },
        grantedAt: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['active', 'revoked'],
            default: 'active'
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);