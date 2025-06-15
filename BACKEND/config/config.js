require('dotenv').config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    blockchainNetwork: process.env.BLOCKCHAIN_NETWORK,
    contractOwnerPrivateKey: process.env.CONTRACT_OWNER_PRIVATE_KEY,
    contractAddress: process.env.CONTRACT_ADDRESS,
    ipfsNodeUrl: process.env.IPFS_NODE_URL,
    ipfsGatewayUrl: process.env.IPFS_GATEWAY_URL,
};

module.exports = config;