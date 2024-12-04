require('dotenv').config();
const Web3 = require('web3');

const provider = process.env.SEPOLIA_URL;
console.log('Provider: ', provider);
const web3 = new Web3(provider);

async function testConnection() {
  try {
    const blockNumber = await web3.eth.getBlockNumber();
    console.log('Connected to Sepolia! Current block number:', blockNumber);
  } catch (error) {
    console.error('Error connecting to Sepolia:', error.message);
  }
}

testConnection();
