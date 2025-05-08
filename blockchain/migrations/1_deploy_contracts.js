
const AgroCoin = artifacts.require("AgroCoin");

module.exports = function (deployer) {
  const initialSupply = 1000000; // or whatever number of tokens you want
  deployer.deploy(AgroCoin, initialSupply);
};
