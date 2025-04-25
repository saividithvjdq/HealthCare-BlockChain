const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    description: String,
    blockchainHash: String,
    blockchainTxHash: String
}, {
    timestamps: true
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);