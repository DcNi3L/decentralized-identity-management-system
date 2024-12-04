import { useState } from 'react';
import { web3, contract } from '../../lib/web3';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const userList = await contract.methods.getAllUsers().call();
      setUsers(userList);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  return (
    <div>
      <Header />
      <main style={{ padding: '20px' }}>
        <h1>Registered Users</h1>
        <button onClick={fetchUsers}>Fetch Users</button>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
};

export default UserList;
