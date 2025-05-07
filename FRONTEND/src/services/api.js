import axios from 'axios';

const API_URL =  'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Variable to store the Aadhaar number
let aadhaarNumber = localStorage.getItem('aadhaar');

// Function to set Aadhaar header for authentication
export const setAadhaarHeader = (aadhaar) => {
  aadhaarNumber = aadhaar;
  if (aadhaar) {
    api.defaults.headers.common['X-Aadhaar'] = aadhaar;
  } else {
    delete api.defaults.headers.common['X-Aadhaar'];
  }
};

// Initialize headers if Aadhaar exists in localStorage
if (aadhaarNumber) {
  setAadhaarHeader(aadhaarNumber);
}

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // You can add additional logic here before requests
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const doctorService = {
  verify: async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    return api.post('/doctors/verify', formData, config);
  },
  
  accessRecords: async (doctorLicense, patientAadhaar, reason) => {
    return api.post('/doctors/access-records', {
      doctorLicense,
      patientAadhaar,
      reason
    });
  }
};

export default api;