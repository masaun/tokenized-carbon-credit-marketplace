const GreenNFTTradable = artifacts.require("./GreenNFTTradable.sol");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(GreenNFTTradable);
};
