const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  patientAadhaar: {
    type: String,
    required: true,
    index: true
  },
  recordType: {
    type: String,
    required: true
  },
  description: String,
  fileData: {
    type: Buffer,
    required: true
  },
  fileName: String,
  fileType: String,
  accessHistory: [{
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    accessedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  blockchainTxHash: String
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);