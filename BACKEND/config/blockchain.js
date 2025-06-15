const Web3 = require('web3');
const contract = require('@truffle/contract');
const BillingVerification = require('../contracts/BillingVerification.json');
const RecordsStorage = require('../contracts/RecordsStorage.json');
const DoctorVerification = require('../contracts/DoctorVerification.json');
const EmergencyAccess = require('../contracts/EmergencyAccess.json');

const initBlockchain = async () => {
    try {
        const provider = new Web3.providers.HttpProvider(process.env.BLOCKCHAIN_NETWORK);
        const web3 = new Web3(provider);

        const billingVerification = contract(BillingVerification);
        const recordsStorage = contract(RecordsStorage);
        const doctorVerification = contract(DoctorVerification);
        const emergencyAccess = contract(EmergencyAccess);

        billingVerification.setProvider(provider);
        recordsStorage.setProvider(provider);
        doctorVerification.setProvider(provider);
        emergencyAccess.setProvider(provider);

        return { web3, billingVerification, recordsStorage, doctorVerification, emergencyAccess };
    } catch (error) {
        console.error('Error initializing blockchain:', error.message);
        throw new Error('Failed to initialize blockchain');
    }
};

module.exports = { initBlockchain };