import { useEffect, useState } from 'react';
import { web3, contract } from '../../lib/web3';
import Header from '../components/Header';

const Profile = () => {
  const [account, setAccount] = useState('');
  const [identity, setIdentity] = useState({});

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    setAccount(accounts[0]);
  };

  const fetchProfile = async () => {
    try {
      const result = await contract.methods.getIdentity(account).call();
      setIdentity({
        name: result[0],
        email: result[1],
      });
    } catch (err) {
      console.log('Error fetching profile:', err);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    fetchProfile();
  },)

  return (
    <div>
      <title>Profile</title>
      <Header />
      <main style={{ padding: '20px' }}>
        <h1>Your Profile</h1>
        {identity.name && (
          <div>
            <p>Name: {identity.name}</p>
            <p>Email: {identity.email}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
