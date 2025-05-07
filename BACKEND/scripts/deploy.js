const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const solc = require('solc');
require('dotenv').config();

function findImports(importPath) {
    try {
        let fullPath;
        if (importPath.startsWith('@openzeppelin/')) {
            fullPath = path.resolve(__dirname, '..', 'node_modules', importPath);
        } else {
            fullPath = path.resolve(__dirname, '..', 'contracts', importPath);
        }
        
        if (!fs.existsSync(fullPath)) {
            return { error: `File not found: ${fullPath}` };
        }

        return {
            contents: fs.readFileSync(fullPath, 'utf8')
        };
    } catch (error) {
        return { error: `Error reading file: ${error.message}` };
    }
}

const deployContract = async () => {
    try {
        // Connect to local Ethereum node
        const web3 = new Web3('http://127.0.0.1:8545');

        // Load and compile the contract
        const contractPath = path.join(__dirname, '../contracts/HealthRecords.sol');
        const contractSource = fs.readFileSync(contractPath, 'utf8');

        // Prepare compiler input
        const input = {
            language: 'Solidity',
            sources: {
                'HealthRecords.sol': {
                    content: contractSource
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['abi', 'evm.bytecode']
                    }
                },
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        };

        // Compile the contract with import callback
        console.log('Compiling contract...');
        const compiledContract = solc.compile(JSON.stringify(input), { import: findImports });
        const output = JSON.parse(compiledContract);

        // Check for compilation errors
        if (output.errors) {
            const errors = output.errors.filter(error => error.severity === 'error');
            if (errors.length > 0) {
                throw new Error(`Compilation errors: ${JSON.stringify(errors, null, 2)}`);
            }
        }

        // Get the contract data
        const contractOutput = output.contracts['HealthRecords.sol'].HealthRecords;
        const abi = contractOutput.abi;
        const bytecode = contractOutput.evm.bytecode.object;

        // Get account to deploy from
        const accounts = await web3.eth.getAccounts();
        const deployer = accounts[0];
        console.log('Deploying from account:', deployer);

        // Create contract instance
        const Contract = new web3.eth.Contract(abi);
        
        // Deploy the contract
        const deploy = Contract.deploy({
            data: '0x' + bytecode,
            arguments: []
        });

        // Estimate gas
        const gas = await deploy.estimateGas({ from: deployer });
        console.log('Estimated gas:', gas);

        // Convert gas to number and add 10% buffer
        const gasLimit = Number(gas) + Math.floor(Number(gas) * 0.1);
        console.log('Gas limit with buffer:', gasLimit);

        // Send deployment transaction
        const deployed = await deploy.send({
            from: deployer,
            gas: gasLimit
        });

        // Save contract address and ABI
        const contractConfig = {
            address: deployed.options.address,
            abi: abi
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

module.exports = deployContract;