const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function deployContract() {
    try {
        // Initialize Web3
        const web3 = new Web3(process.env.BLOCKCHAIN_NETWORK);
        
        // Get contract artifact
        const contractPath = path.join(__dirname, '../contracts/HealthRecords.sol');
        const source = fs.readFileSync(contractPath, 'utf8');
        
        // Compile contract
        const solc = require('solc');
        const input = {
            language: 'Solidity',
            sources: {
                'HealthRecords.sol': {
                    content: source
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                }
            }
        };

        const output = JSON.parse(solc.compile(JSON.stringify(input)));
        const contract = output.contracts['HealthRecords.sol']['HealthRecords'];

        // Deploy contract
        const account = web3.eth.accounts.privateKeyToAccount(process.env.CONTRACT_OWNER_PRIVATE_KEY);
        web3.eth.accounts.wallet.add(account);

        const Contract = new web3.eth.Contract(contract.abi);
        const deploy = Contract.deploy({
            data: contract.evm.bytecode.object
        });

        const gas = await deploy.estimateGas();
        const deployed = await deploy.send({
            from: account.address,
            gas: gas
        });

        // Save contract address and ABI
        const contractConfig = {
            address: deployed.options.address,
            abi: contract.abi
        };

        fs.writeFileSync(
            path.join(__dirname, '../contracts/contract-config.json'),
            JSON.stringify(contractConfig, null, 2)
        );

        console.log('Contract deployed at:', deployed.options.address);
        return deployed.options.address;
    } catch (error) {
        console.error('Deployment error:', error);
        throw error;
    }
}

module.exports=deployContract;