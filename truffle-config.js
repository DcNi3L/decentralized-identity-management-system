require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const path = require('path');

module.exports = {
  contracts_build_directory: path.join(__dirname, 'frontend/lib/contracts'),
  networks: {
    development: {
      host: '127.0.0.1', // Ganache local blockchain
      port: 7545,
      network_id: '*', // Any network
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          process.env.PRIVATE_KEY, // Your wallet mnemonic
          process.env.SEPOLIA_URL // Infura Sepolia endpoint
        ),
      network_id: 11155111, // Sepolia network ID
      gas: 5500000, // Gas limit
      gasPrice: 10000000000, // 10 Gwei
      networkCheckTimeout: 100000,
      timeoutBlocks: 200,
    },
  },
  compilers: {
    solc: {
      version: '0.8.0', // Specify your Solidity version
    },
  },
};
