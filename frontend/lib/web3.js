import Web3 from 'web3';
import IdentityManagerContract from './contracts/IdentityManager.json';

let web3;
let contract;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);

  const initContract = async () => {
    const networkId = await web3.eth.net.getId(); // Get the current network ID
    const deployedNetwork = IdentityManagerContract.networks[networkId];
    console.log('Network ID:', networkId);

    if (deployedNetwork && deployedNetwork.address) {
      contract = new web3.eth.Contract(
        IdentityManagerContract.abi,
        deployedNetwork.address // Deployed contract address
      );
      console.log('Contract initialized:', contract);
    } else {
      console.error('Contract not deployed on the current network.');
    }
  };

  initContract();
} else {
  console.error('Web3 provider not found. Please install MetaMask.');
}

export { web3, contract };
