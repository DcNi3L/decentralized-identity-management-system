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
    const router = useRouter();

    // Connect Wallet
    const connectWallet = async () => {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
            setAccount(accounts[0]);
            console.log('Wallet connected:', accounts[0]);
        } catch (err) {
            console.error('Error connecting wallet:', err);
            alert('Failed to connect wallet. Please try again.');
        }
    };

    // Login Identity
    const loginIdentity = async () => {
        if (!account) {
            alert('Wallet not connected. Please connect your wallet.');
            return;
        }

        try {
            const identity = await contract.methods.getIdentity(account).call();

            if (identity[0] === name && identity[1] === email) {
                console.log('Login successful:', identity);
                router.push('/profile'); // Redirect to profile page
            } else {
                alert('Name or email does not match the registered identity.');
            }
        } catch (err) {
            console.error('Error during login:', err);
            setError(true);
        }
    };

    return (
        <div className="bg-white w-screen box-border text-black">
            <title>Login</title>
            <Header />
            <main className="px-20 py-8 min-h-screen flex justify-center items-center">
                <div className="flex flex-col justify-between rounded-xl shadow-2xl w-max h-max p-6 bg-[#f7fafc]">
                    <h1 className="text-center font-bold text-2xl">Login</h1>
                    <button className="m-[-2] underline text-blue-500" onClick={connectWallet}>
                        Connect Wallet
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
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            className="border -translate-y-1 border-gray-400 rounded p-2"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 rounded p-2 text-white font-bold tracking-wider delay-125 linear hover:bg-blue-600"
                            onClick={loginIdentity}
                        >
                            Login
                        </button>
                    </div>
                    {error && (
                        <p className="text-red-500 text-center mt-4">
                            Failed to login. Please check your details.
                        </p>
                    )}
                    <p className="p-1 -m-2 text-center">
                        Not a member?{' '}
                        <Link className="text-blue-500 font-bold underline" href="/register">
                            Register
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Login;
