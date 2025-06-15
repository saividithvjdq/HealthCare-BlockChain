const fs = require('fs');
require('dotenv').config();
const { uploadToIPFS } = require('./services/ipfsService');

const testUpload = async () => {
    const fileBuffer = fs.readFileSync('DT Poster.png.pdf'); // Replace with an actual file path
    const hash = await uploadToIPFS(fileBuffer);
    console.log('Uploaded IPFS Hash:', hash);
};

testUpload();