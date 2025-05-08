import getWeb3 from './web3';
import AgroCoin from '../contracts/AgroCoin.json';

const getContract = async () => {
  try {
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    console.log('Connected to network ID:', networkId);
    
    // Only use network ID 5777 (Ganache)
    const deployedNetwork = AgroCoin.networks['5777'];
    
    if (!deployedNetwork) {
      throw new Error(`Contract not deployed to Ganache (ID: 5777). Please make sure you're connected to Ganache on port 8545 and that the contract is deployed.`);
    }

    console.log('Using contract address:', deployedNetwork.address);
    const contract = new web3.eth.Contract(
      AgroCoin.abi,
      deployedNetwork.address
    );

    return contract;
  } catch (error) {
    console.error("Error loading contract:", error);
    throw error;
  }
};

export default getContract; 