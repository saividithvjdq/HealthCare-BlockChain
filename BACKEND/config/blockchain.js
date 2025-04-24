const Web3 = require('web3');
const contract = require('@truffle/contract');
const HealthRecordsContract = require('../contracts/HealthRecords.json');

const initBlockchain = async () => {
    const provider = new Web3.providers.HttpProvider('http://localhost:7545'); // For local Ganache
    const web3 = new Web3(provider);
    
    const healthRecords = contract(HealthRecordsContract);
    healthRecords.setProvider(provider);
    
    return { web3, healthRecords };
};

module.exports = { initBlockchain };