import { useEffect, useState } from 'react';
import { web3, contract } from '../../lib/web3';
import Header from '../components/Header';

const UserList = () => {
  const [identities, setIdentities] = useState([]);

  const fetchIdentities = async () => {
    try {
      // Fetch all registered identities from the contract
      const identityList = await contract.methods.getAllIdentities().call();
      setIdentities(identityList);
    } catch (err) {
      console.error('Error fetching identities:', err);
    }
  };

  useEffect(() => {
    fetchIdentities();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <title>Users</title>
      <Header />
      <main className="flex-grow flex flex-col items-center py-12 px-6">
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Registered Users</h1>
          {identities.length === 0 ? (
            <p className="text-gray-500 text-center">No users registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">#</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {identities.map((identity, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-gray-800 truncate">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-800 truncate">
                        {identity.name || 'N/A'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-800 truncate">
                        {identity.email || 'N/A'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-gray-800 truncate">
                        {identity.owner || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserList;
