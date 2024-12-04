import Link from 'next/link';

const Header = () => {
  return (
    <header style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <nav>
        <Link href="/">Home</Link> | <Link href="/register">Register</Link> |{' '}
        <Link href="/profile">Profile</Link> |{' '}
        <Link href="/userList">User List</Link> |{' '}
        <Link href="/update">Update</Link>
      </nav>
    </header>
  );
};

export default Header;
