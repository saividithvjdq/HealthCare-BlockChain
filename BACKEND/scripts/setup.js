const fs = require('fs');
const path = require('path');
const deployContract = require('./deploy');
require('dotenv').config();

async function setup() {
    try {
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync('uploads')) {
            fs.mkdirSync('uploads');
        }

        // Deploy contract
        const contractAddress = await deployContract();

        // Update .env with contract address
        const envPath = path.join(__dirname, '../.env');
        let envContent = fs.readFileSync(envPath, 'utf8');
        envContent = envContent.replace(
            /CONTRACT_ADDRESS=.*/,
            `CONTRACT_ADDRESS=${contractAddress}`
        );
        fs.writeFileSync(envPath, envContent);

        console.log('✅ Setup completed successfully');
    } catch (error) {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    }
}

setup();