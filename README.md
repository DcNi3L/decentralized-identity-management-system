# Decentralized Identity Management System

A decentralized application (DApp) built on Ethereum blockchain for managing user identities securely and transparently. This project demonstrates how to register, update, and retrieve user identities using a smart contract.

---

## Features
- **Register Identity**: Users can register their identity with a name and email address.
- **Update Identity**: Registered users can update their identity details.
- **Fetch Identity**: Retrieve identity details by user address.
- **Fetch All Users**: List all registered users.
- **Fetch All Identities**: Retrieve all registered identities.
- **Blockchain Technology**: All operations are decentralized, transparent, and immutable.

---

## Table of Contents
1. [Technologies Used](#technologies-used)
2. [Setup Instructions](#setup-instructions)
   - [Prerequisites](#prerequisites)
   - [Clone the Repository](#clone-the-repository)
   - [Install Dependencies](#install-dependencies)
   - [Setup Environment Variables](#setup-environment-variables)
   - [Deploy the Contract](#deploy-the-contract)
3. [Smart Contract](#smart-contract)
4. [Tests](#tests)
   - [Running Tests](#running-tests)
   - [Test Cases](#test-cases)
5. [Frontend Integration](#frontend-integration)
   - [Web3.js Setup](#web3js-setup)
   - [Frontend Features](#frontend-features)
6. [Future Enhancements](#future-enhancements)
7. [License](#license)

---

## Technologies Used
- **Ethereum Blockchain**: Provides a decentralized ledger for all transactions.
- **Solidity**: Used for writing the smart contract logic.
- **Truffle**: Framework for smart contract deployment, testing, and development.
- **Ganache**: Local blockchain for testing and development.
- **MetaMask**: Wallet for interacting with the Ethereum blockchain.
- **Infura**: Ethereum node provider for connecting to the Sepolia Testnet.
- **Node.js**: JavaScript runtime for backend development.
- **JavaScript**: For writing tests and integrating the frontend.

---

## Setup Instructions

### Prerequisites
Before starting, ensure you have the following installed:
1. **Node.js**: [Download Node.js](https://nodejs.org/).
2. **Truffle**: Install globally:
   ```bash
   npm install -g truffle
   ```
3. **Ganache**: Download Ganache for local blockchain testing.
4. **MetaMask**: Install the MetaMask browser extension.

---

## Clone the Repository
Clone this project to your local machine:

```bash
git clone https://github.com/DcNi3L/decentralized-identity-management-system.git
cd decentralized-identity-management-system
```
## Install Dependencies
Run the following command to install required dependencies:

```bash
npm install
```
## Setup Environment Variables
Create a `.env` file in the root directory with the following content:

```plaintext
MNEMONIC="your twelve word MetaMask seed phrase"
INFURA_URL="https://sepolia.infura.io/v3/your-infura-project-id"
```
## Deploy the Contract

### Using Ganache (Local Blockchain)
1. Open Ganache and configure it with MetaMask as a custom RPC network:
   - **Network Name**: Ganache
   - **RPC URL**: `http://127.0.0.1:7545`
   - **Chain ID**: `5777`
2. Deploy the contract locally:
   ```bash
   truffle migrate --network development
   ```
3. Note the deployed contract address from the output.

## Using Sepolia Testnet
1. Fund your wallet with Sepolia test ETH using a faucet.
2. Deploy the contract to Sepolia:
```bash
truffle migrate --network sepolia
```
3. Note the deployed contract address from the output.

# Smart Contract

The core functionality is implemented in the smart contract: `contracts/IdentityManager.sol`.

## Features

- **registerIdentity**: Allows users to register with a name and email address.
- **updateIdentity**: Enables users to update their details.
- **getIdentity**: Fetches the identity of a specific user by their Ethereum address.
- **getAllUsers**: Returns a list of all registered users' addresses.
- **getAllIdentities**: Retrieves the details of all registered identities.

---

## Tests

### Running Tests

To verify the functionality of the smart contract, run the following command:

```bash
truffle test
```
# Test Cases

The included test suite validates:

## Deployment
- Ensures the contract is deployed successfully.

## Identity Registration
- Users can register with valid details.
- Duplicate registrations are not allowed.

## Identity Update
- Registered users can update their details.
- Updates are rejected for unregistered users.

## Identity Retrieval
- Fetches identity details accurately.
- Throws an error for unregistered addresses.

## Fetching All Users and Identities
- Returns all registered users and their details.
- Handles empty cases gracefully.

# Frontend Integration

## Web3.js Setup
### Install Web3.js
```bash
npm install web3
```

# Frontend Features

- **Registration Form**: Collects name and email, and calls `registerIdentity`.
- **Update Form**: Updates registered details using `updateIdentity`.
- **User List**: Fetches and displays all registered users using `getAllUsers`.
- **Identity Details**: Fetches and displays individual identity details with `getIdentity`.

# Future Enhancements

- **Decentralized File Storage**: Use IPFS for storing additional identity metadata.
- **Role-Based Access Control**: Add roles for admin and users to restrict access to certain operations.
- **ENS (Ethereum Name Service) Integration**: Allow users to link their Ethereum addresses to human-readable names.
- **Mobile DApp**: Develop a mobile application for managing identities on the go.

# License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
