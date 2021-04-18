const GreenNFTFactory = artifacts.require("./GreenNFTFactory.sol");
const GreenNFTMarketPlace = artifacts.require("./GreenNFTMarketPlace.sol");
const GreenNFTData = artifacts.require("./GreenNFTData.sol");
const CarbonCreditToken = artifacts.require("./CarbonCreditToken.sol");

const _greenNFTMarketPlace = GreenNFTMarketPlace.address;
const _greenNFTData = GreenNFTData.address;
const _carbonCreditToken = CarbonCreditToken.address;

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(GreenNFTFactory, _greenNFTMarketPlace, _greenNFTData, _carbonCreditToken)

    /// Transfer 1000000 CCT (CarbonCreditToken) into the GreenNFTFactory contract
    const deployerAddress = accounts[0]
    console.log('=== deployerAddress ===', deployerAddress)

    const greenNFTFactory = await GreenNFTFactory.deployed()
    const carbonCreditToken = await CarbonCreditToken.deployed()

    const amount = web3.utils.toWei("1000000")  /// 1000000 CCT (CarbonCreditToken)
    await carbonCreditToken.transfer(greenNFTFactory.address, amount, { from: deployerAddress })

    let CCTBalance = await carbonCreditToken.balanceOf(greenNFTFactory.address)
    console.log('=== CCT (CarbonCreditToken) balance of the GreenNFTFactory contract ===', String(CCTBalance))
}
