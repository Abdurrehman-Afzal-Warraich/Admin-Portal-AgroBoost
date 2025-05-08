const AgroCoin = artifacts.require("AgroCoin");

module.exports = async function (deployer) {
  console.log("Starting AgroCoin deployment...");
  await deployer.deploy(AgroCoin, 1000000);
  console.log("Deployment complete.");
};
