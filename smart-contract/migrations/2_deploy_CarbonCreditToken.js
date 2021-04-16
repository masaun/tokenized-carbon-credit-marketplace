const CarbonCreditToken = artifacts.require("./CarbonCreditToken.sol");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(CarbonCreditToken);
};
