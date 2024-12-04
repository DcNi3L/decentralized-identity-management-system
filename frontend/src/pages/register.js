import { useState } from 'react';
import { web3, contract } from '../../lib/web3';
import Header from '../components/Header';
import Footer from '../components/Footer';

console.log('contract: ', contract);
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]); // Set the first account from MetaMask
      console.log('Wallet connected:', accounts[0]);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const registerIdentity = async () => {
    if (!account) {
      alert('Wallet not connected. Please connect your wallet.');
      return;
    }

    try {
      await contract.methods
        .registerIdentity(name, email)
        .send({ from: account });
      alert('Identity registered successfully!');
    } catch (err) {
      console.error('Error registering identity:', err);
    }
  };

  return (
    <div>
      <Header />
      <main style={{ padding: '20px' }}>
        <h1>Register Identity</h1>
        <button onClick={connectWallet}>Connect Wallet</button>
        <div>
          <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={registerIdentity}>Register</button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
