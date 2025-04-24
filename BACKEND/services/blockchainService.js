const Web3 = require('web3');
const contractConfig = require('../contracts/contract-config.json');
require('dotenv').config();

class BlockchainService {
    constructor() {
        this.web3 = new Web3(process.env.BLOCKCHAIN_NETWORK);
        this.account = this.web3.eth.accounts.privateKeyToAccount(process.env.CONTRACT_OWNER_PRIVATE_KEY);
        this.web3.eth.accounts.wallet.add(this.account);
        this.contract = new this.web3.eth.Contract(
            contractConfig.abi,
            contractConfig.address
        );
    }

    async addRecord(aadhaarNumber, fileHash, recordType) {
        try {
            const tx = await this.contract.methods.addRecord(
                aadhaarNumber,
                fileHash,
                recordType
            ).send({
                from: this.account.address,
                gas: 2000000
            });

            return tx.transactionHash;
        } catch (error) {
            console.error('Blockchain transaction error:', error);
            throw new Error('Failed to add record to blockchain');
        }
    }

    async getRecords(aadhaarNumber) {
        try {
            return await this.contract.methods.getRecords(aadhaarNumber).call();
        } catch (error) {
            console.error('Blockchain read error:', error);
            throw new Error('Failed to read records from blockchain');
        }
    }
}

module.exports = new BlockchainService();