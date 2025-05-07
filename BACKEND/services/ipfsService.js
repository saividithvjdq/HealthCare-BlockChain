const { create } = require('ipfs-http-client');
const { Buffer } = require('buffer');

const ipfs = create({
  host: process.env.IPFS_NODE_URL,
  port: 5001,
  protocol: 'http'
});

const uploadToIPFS = async (file) => {
  try {
    const fileBuffer = Buffer.from(file);
    const result = await ipfs.add(fileBuffer);
    return result.path;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload file to IPFS');
  }
};

const getFromIPFS = async (hash) => {
  try {
    const chunks = [];
    for await (const chunk of ipfs.cat(hash)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw new Error('Failed to retrieve file from IPFS');
  }
};

module.exports = { uploadToIPFS, getFromIPFS };