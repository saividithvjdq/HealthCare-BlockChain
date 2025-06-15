const { uploadToIPFS } = require('./services/ipfsService');

const mockData = JSON.stringify({
  patientName: 'John Doe',
  diagnosis: 'Flu',
  estimatedCost: 5000,
  hospitalCost: 5200,
});

(async () => {
  try {
    const hash = await uploadToIPFS(mockData);
    console.log('Mock data IPFS hash:', hash);
  } catch (error) {
    console.error('Error uploading mock data:', error);
  }
})();