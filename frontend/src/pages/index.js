import Header from '../components/Header';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      <Header />
      <main style={{ padding: '20px' }}>
        <h1>Welcome to Decentralized Identity Management</h1>
        <p>Manage identities securely using blockchain technology.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
