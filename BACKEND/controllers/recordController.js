const recordService = require('../services/recordService');

const recordController = {
  uploadRecord: async (req, res) => {
    try {
      const { file } = req;
      const { recordType, description } = req.body;
      const patientAadhaar = req.user.aadhaar;

      const record = await recordService.uploadRecord(file.buffer, {
        patientAadhaar,
        recordType,
        description,
        fileName: file.originalname,
        fileType: file.mimetype
      });

      res.status(201).json({
        success: true,
        record: {
          id: record._id,
          recordType: record.recordType,
          description: record.description,
          createdAt: record.createdAt
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  getRecord: async (req, res) => {
    try {
      const { recordId } = req.params;
      const doctorId = req.user.doctorId;

      const record = await recordService.getRecord(recordId, doctorId);

      res.set('Content-Type', record.fileType);
      res.send(record.fileData);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = recordController;