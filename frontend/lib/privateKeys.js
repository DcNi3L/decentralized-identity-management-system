const axios = require('axios');

// Ganache RPC URL
const ganacheRPC = 'http://127.0.0.1:7545';

async function fetchPrivateKeys() {
    try {
        // Fetch the list of accounts
        const accountsResponse = await axios.post(ganacheRPC, {
            jsonrpc: '2.0',
            method: 'eth_accounts',
            params: [],
            id: 1,
        });

        const accounts = accountsResponse.data.result;

        // Fetch private keys for each account
        const privateKeys = [];
        for (const account of accounts) {
            const privateKeyResponse = await axios.post(ganacheRPC, {
                jsonrpc: '2.0',
                method: 'debug_accountRange', // Ganache-specific method
                params: [0, accounts.length], // Fetch all accounts
                id: 1,
            });

            const debugAccounts = privateKeyResponse.data.result.accounts;

            for (const acc of debugAccounts) {
                const privateKey = acc.privateKey;
                privateKeys.push(privateKey);
            }
        }

        console.log('Private Keys:', privateKeys);
        return privateKeys;
    } catch (error) {
        console.error('Error fetching private keys:', error);
        throw error;
    }
}

// Fetch private keys
module.exports = fetchPrivateKeys;
