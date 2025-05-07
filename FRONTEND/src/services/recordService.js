import api from './api';

const recordService = {
  uploadRecord: async (file, metadata) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('recordType', metadata.recordType);
    formData.append('description', metadata.description);

    return api.post('/records/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getRecord: async (recordId) => {
    return api.get(`/records/${recordId}`, {
      responseType: 'blob'
    });
  }
};

export default recordService;