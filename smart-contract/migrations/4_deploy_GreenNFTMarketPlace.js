const GreenNFTMarketplace = artifacts.require("./GreenNFTMarketplace.sol");
const GreenNFTData = artifacts.require("./GreenNFTData.sol");

const _greenNFTData = GreenNFTData.address;

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(GreenNFTMarketplace, _greenNFTData);
};
