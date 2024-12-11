import { useState } from 'react';
import { web3, contract } from '../../lib/web3';
import Header from '../components/Header';

const Update = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [metadata, setMetadata] = useState('');
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    setAccount(accounts[0]);
  };

  const updateIdentity = async () => {
    try {
      await contract.methods
        .updateIdentity(name, email, metadata)
        .send({ from: account });
      alert('Identity updated successfully!');
    } catch (err) {
      console.error('Error updating identity:', err);
    }
  };

  return (
    <div>
      <Header />
      <main style={{ padding: '20px' }}>
        <h1>Update Identity</h1>
        <button onClick={connectWallet}>Connect Wallet</button>
        <div>
          <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Metadata"
            onChange={(e) => setMetadata(e.target.value)}
          />
          <button onClick={updateIdentity}>Update</button>
        </div>
      </main>
    </div>
  );
};

export default Update;
