const Incentive = artifacts.require("Incentive");

module.exports = function (deployer) {
  // Deploy the Incentive contract
  deployer.deploy(Incentive);
};
