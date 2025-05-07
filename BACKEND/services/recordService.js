const Record = require('../models/Record');
const crypto = require('crypto');

const recordService = {
  uploadRecord: async (fileBuffer, metadata) => {
    try {
      const fileHash = crypto
        .createHash('sha256')
        .update(fileBuffer)
        .digest('hex');

      const record = new Record({
        patientAadhaar: metadata.patientAadhaar,
        recordType: metadata.recordType,
        description: metadata.description,
        fileData: fileBuffer,
        fileName: metadata.fileName,
        fileType: metadata.fileType,
        blockchainTxHash: fileHash
      });

      await record.save();
      return record;
    } catch (error) {
      console.error('Record upload error:', error);
      throw new Error('Failed to upload record');
    }
  },

  getRecord: async (recordId, doctorId) => {
    try {
      const record = await Record.findById(recordId);
      if (!record) {
        throw new Error('Record not found');
      }

      // Add access history
      if (doctorId) {
        record.accessHistory.push({
          doctorId,
          accessedAt: new Date(),
          reason: 'Medical consultation'
        });
        await record.save();
      }

      return record;
    } catch (error) {
      console.error('Record retrieval error:', error);
      throw new Error('Failed to retrieve record');
    }
  }
};

module.exports = recordService;