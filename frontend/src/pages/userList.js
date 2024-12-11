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
        <div>
            <title>User List</title>
            <Header />
            <main style={{ padding: '20px' }}>
                <h1>Registered Users</h1>
                {identities.length === 0 ? (
                    <p>No users registered yet.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr>
                            <th style={{border: '1px solid #ddd', padding: '8px'}}>Name</th>
                            <th style={{border: '1px solid #ddd', padding: '8px'}}>Email</th>
                            <th style={{border: '1px solid #ddd', padding: '8px'}}>Address</th>
                        </tr>
                        </thead>
                        <tbody>
                        {identities.map((identity, index) => (
                            <tr style={{textAlign: 'center'}} key={index}>
                                <td style={{border: '1px solid #ddd', padding: '8px'}}>{identity.name}</td>
                                <td style={{border: '1px solid #ddd', padding: '8px'}}>{identity.email}</td>
                                <td style={{border: '1px solid #ddd', padding: '8px'}}>{identity.owner}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default UserList;
