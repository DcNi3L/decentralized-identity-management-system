import { useState } from 'react';
import { web3, contract } from '../../lib/web3';
import Header from '../components/Header';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Login = () => {
  const [account, setAccount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
      setError(false);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const loginIdentity = async () => {
    if (!account) {
      alert('Wallet not connected. Please connect your wallet.');
      return;
    }

    setLoading(true);

    try {
      const identity = await contract.methods.getIdentity(account).call();

      if (identity[0] === name && identity[1] === email) {
        console.log('Login successful:', identity);
        router.push('/profile');
      } else {
        alert('Name or email does not match the registered identity.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <title>Login</title>
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl translate-y-4 font-semibold text-center text-gray-800 mb-6">Login</h1>
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
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-gray-800 focus:ring focus:ring-blue-300 focus:outline-none"
            />
            <button
              className={`w-full px-4 py-2 text-white font-semibold rounded-lg ${
                loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              onClick={loginIdentity}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          {error && (
            <p className="text-red-600 text-center mt-4">
              Failed to login. Please check your details.
            </p>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            Not a member?{' '}
            <Link href="/register" className="text-blue-500 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
