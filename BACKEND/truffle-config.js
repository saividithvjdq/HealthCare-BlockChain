const path = require('path');

module.exports = {
    contracts_build_directory: path.join(__dirname, 'contracts/build'),
    networks: {
        development: {
            host: '127.0.0.1', // Localhost (default: none)
            port: 8545,        // Standard Ethereum port (default: none)
            network_id: '*',   // Any network (default: none)
        },
    },
    compilers: {
        solc: {
            version: '0.8.0', // Fetch exact version from solc-bin (default: truffle's version)
        },
    },
};