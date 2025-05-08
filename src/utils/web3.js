import Web3 from 'web3';

const getWeb3 = async () => {
  // Modern dapp browsers
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if we're on the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('Connected to chain ID:', chainId);
      
      // Get the network ID from Ganache
      const networkId = await web3.eth.net.getId();
      console.log('Network ID from Ganache:', networkId);
      
      // If not on Ganache, try to switch
      if (chainId !== '0x539') { // 1337 in hex
        try {
          // First try to switch to the network
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x539' }], // 1337 in hex
          });
        } catch (switchError) {
          console.log('Switch error:', switchError);
          // If the network is not added to MetaMask, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0x539', // 1337 in hex
                  chainName: 'Ganache 8545',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18
                  },
                  rpcUrls: ['http://localhost:8545'],
                  blockExplorerUrls: ['http://localhost:8545']
                }],
              });
            } catch (addError) {
              console.log('Add network error:', addError);
              // If adding fails, it might be because the network already exists
              // Try switching again
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x539' }],
              });
            }
          } else {
            throw switchError;
          }
        }
      }
      
      return web3;
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw new Error("Failed to connect to MetaMask. Please make sure MetaMask is installed and you're connected to Ganache (port 8545) with Chain ID 1337.");
    }
  }
  // Legacy dapp browsers
  else if (window.web3) {
    return new Web3(window.web3.currentProvider);
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    console.log('No web3 instance injected, using local Ganache');
    return new Web3('http://localhost:8545');
  }
};

export default getWeb3; 