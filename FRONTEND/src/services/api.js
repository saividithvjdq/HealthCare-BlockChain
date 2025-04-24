import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL
});

export const setAadhaarHeader = (aadhaarNumber) => {
    api.defaults.headers.common['aadhaar-number'] = aadhaarNumber;
};

export const patientService = {
    register: (data) => api.post('/patients/register', data),
    getProfile: () => api.get('/patients/profile')
};

export const recordService = {
    upload: (formData) => api.post('/records/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getRecords: () => api.get('/records/list')
};

export default api;