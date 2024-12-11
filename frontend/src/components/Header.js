import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full flex justify-center p-5 font-bold text-xl bg-[#2d3748] text-white">
      <nav className="flex w-1/2 items-center justify-between">
        <Link href="/">Home</Link>
          <Link href="/register">Register</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/userList">User List</Link>
      </nav>
    </header>
  );
};

export default Header;
