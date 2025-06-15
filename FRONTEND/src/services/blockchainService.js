import { ethers } from 'ethers';
import contractConfig from '../contracts/contract-config.json';

const blockchainNetwork = 'http://127.0.0.1:8545'; // Replace with your actual network URL
const provider = new ethers.providers.JsonRpcProvider(blockchainNetwork);

const getContract = (contractName) => {
    const { address, abi } = contractConfig[contractName];
    return new ethers.Contract(address, abi, provider);
};

export const getBillingVerificationContract = () => getContract('BillingVerification');
export const getRecordsStorageContract = () => getContract('RecordsStorage');
export const getDoctorVerificationContract = () => getContract('DoctorVerification');
export const getEmergencyAccessContract = () => getContract('EmergencyAccess');