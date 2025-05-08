module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Ganache host
      port: 8545,        // Ganache GUI port
      network_id: "1337", // Match MetaMask's Chain ID
    },
  },
  compilers: {
    solc: {
      version: "0.8.19", // Match your Solidity version
    },
  },
};
