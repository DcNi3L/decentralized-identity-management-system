const fetchPrivateKeys = require('./privateKeys');
const { web3, contract } = require('./web3');

// Private keys of 8 users from Ganache
const privateKeys = fetchPrivateKeys();
console.log('Private Keys:', privateKeys);


async function registerUsers() {
    for (let i = 0; i < privateKeys.length; i++) {
        try {
            // Create account from private key
            const account = web3.eth.accounts.privateKeyToAccount(privateKeys[i]);
            console.log(`Using account: ${account.address}`);

            // Add account to web3 wallet
            web3.eth.accounts.wallet.add(account);
            web3.eth.defaultAccount = account.address;

            // Simulate user details
            const name = `User_${i + 1}`;
            const email = `user${i + 1}@example.com`;

            // Register user on the smart contract
            const receipt = await contract.methods
                .registerIdentity(name, email)
                .send({
                    from: account.address,
                    gas: 3000000,
                });

            console.log(`User ${name} registered successfully! Transaction hash: ${receipt.transactionHash}`);
        } catch (error) {
            console.error(`Error registering user ${i + 1}:`, error);
        }
    }
}

// Execute the registration
registerUsers().then(() => {
    console.log('All users registered successfully.');
}).catch((err) => {
    console.error('Error during registration:', err);
});
