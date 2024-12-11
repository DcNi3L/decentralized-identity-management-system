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

  // Connect wallet
  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]); // Set the first account from MetaMask
      console.log('Wallet connected:', accounts[0]);
      setErrorMessage('');
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setErrorMessage('Failed to connect wallet. Please try again.');
    }
  };

  // Register identity
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
        router.push('/profile');
      }, 2000); // Redirect after a short delay
    } catch (err) {
      console.error('Error while registering user:', err);
      setErrorMessage(
          'Registration failed. Ensure your wallet is funded and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bg-white w-screen box-border text-black">
        <title>Register</title>
        <Header />
        <main className="px-20 py-8 min-h-screen flex justify-center items-center">
          <div className="flex flex-col justify-between rounded-xl shadow-2xl w-max h-max p-6 bg-[#f7fafc]">
            <h1 className="text-center font-bold text-2xl">Register</h1>
            <button
                className="m-[-2] underline text-blue-500"
                onClick={connectWallet}
                disabled={loading}
            >
              {account ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
            {account ? (
                <p>
                  <b>Your wallet: </b>
                  {account}
                </p>
            ) : (
                <p className="text-center">First connect your wallet!</p>
            )}
            <div className="flex flex-col justify-around h-52">
              <input
                  className="border border-gray-400 rounded p-2"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
              />
              <input
                  className="border -translate-y-1 border-gray-400 rounded p-2"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
              />
              <button
                  className={`bg-blue-500 rounded p-2 text-white font-bold tracking-wider delay-125 linear ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                  onClick={registerIdentity}
                  disabled={loading}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </div>
            {successMessage && (
                <p className="text-green-500 text-center mt-4">{successMessage}</p>
            )}
            {errorMessage && (
                <p className="text-red-500 text-center mt-4">{errorMessage}</p>
            )}
            <p className="p-1 -m-2 text-center">
              Already have an account?{' '}
              <Link className="text-blue-500 font-bold underline" href="/login">
                Login
              </Link>
            </p>
          </div>
        </main>
      </div>
  );
};

export default Register;
