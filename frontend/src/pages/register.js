import { useState } from 'react';
import { web3, contract } from '../../lib/web3';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  let registered = false;

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
      setErrorMessage('');
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setErrorMessage('Failed to connect wallet. Please try again.');
    }
  };

  const registerIdentity = async () => {
    if (!account) {
      setErrorMessage('Wallet not connected. Please connect your wallet.');
      return;
    }

    if (!name || !email) {
      setErrorMessage('Name and email are required.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await contract.methods
        .registerIdentity(name, email)
        .send({ from: account });
      setSuccessMessage('Registration successful! Redirecting to your profile...');
      setTimeout(() => {
        registered = true;
        router.push('/profile');
      }, 2000);
    } catch (err) {
      console.error('Error while registering user:', err);
      setErrorMessage('Registration failed. Ensure your wallet is funded and try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <title>Register</title>
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl translate-y-4 font-semibold text-center text-gray-800 mb-6">Register</h1>
          <button
            className={`w-full font-semibold translate-y-3 px-4 py-2 mb-4 rounded ${
              account ? 'text-green-500' : 'text-blue-500 hover:text-blue-600 underline'
            }`}
            onClick={connectWallet}
            disabled={loading}
          >
            {account ? 'Wallet Connected' : 'Connect Wallet'}
          </button>
          {account && <p className="text-center text-sm text-gray-500 mb-6">{account}</p>}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300 focus:outline-none"
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300 focus:outline-none"
              disabled={loading}
            />
            <button
              className={`w-full px-4 py-2 text-white font-semibold rounded-lg ${
                loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={registerIdentity}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>

          {successMessage && <p className="text-green-600 text-center mt-4">{successMessage}</p>}
          {errorMessage && <p className="text-red-600 text-center mt-4">{errorMessage}</p>}

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;