const GreenNFTMarketplace = artifacts.require("./GreenNFTMarketplace.sol");
const GreenNFTData = artifacts.require("./GreenNFTData.sol");
const CarbonCreditToken = artifacts.require("./CarbonCreditToken.sol");

const _greenNFTData = GreenNFTData.address;
const _carbonCreditToken = CarbonCreditToken.address;

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(GreenNFTMarketplace, _greenNFTData, _carbonCreditToken);
};
