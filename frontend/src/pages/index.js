import Footer from '../components/Footer';
import Link from 'next/link';

const Home = () => {
  return (
    <>
      <div className="h-screen w-full flex justify-center items-center p-3 text-black bg-white">
        <title>Home</title>
        <main className="h-max w-full flex flex-col justify-center items-center">
          <h1 className="font-bold text-3xl mb-2">
            Welcome to Decentralized Identity Management
          </h1>
          <p className="text-xl mb-4">
            Manage identities securely using blockchain technology.
          </p>
          <Link
              href="/register"
              className="bg-blue-500 tracking-wider hover:shadow-lg hover:scale-105 hover:shadow-gray-500 delay-100 linear p-2 px-4 rounded text-white font-bold">
            Sign-In to Start
          </Link>
        </main>
      </div>
    </>
  );
};

export default Home;
