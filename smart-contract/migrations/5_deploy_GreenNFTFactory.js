const GreenNFTFactory = artifacts.require("./GreenNFTFactory.sol");
const GreenNFTMarketPlace = artifacts.require("./GreenNFTMarketPlace.sol");
const GreenNFTData = artifacts.require("./GreenNFTData.sol");
const CarbonCreditToken = artifacts.require("./CarbonCreditToken.sol");

const _greenNFTMarketPlace = GreenNFTMarketPlace.address;
const _greenNFTData = GreenNFTData.address;
const _carbonCreditToken = CarbonCreditToken.address;

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(GreenNFTFactory, _greenNFTMarketPlace, _greenNFTData, _carbonCreditToken);
};
