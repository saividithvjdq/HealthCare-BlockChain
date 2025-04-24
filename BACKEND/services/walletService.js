const Web3 = require('web3');
require('dotenv').config();

class WalletService {
    constructor() {
        this.web3 = new Web3(process.env.BLOCKCHAIN_NETWORK);
    }

    async createWallet() {
        try {
            const account = this.web3.eth.accounts.create();
            return {
                address: account.address,
                privateKey: account.privateKey
            };
        } catch (error) {
            throw new Error('Failed to create wallet');
        }
    }

    async getBalance(address) {
        try {
            const balance = await this.web3.eth.getBalance(address);
            return this.web3.utils.fromWei(balance, 'ether');
        } catch (error) {
            throw new Error('Failed to get balance');
        }
    }
}

module.exports = new WalletService();