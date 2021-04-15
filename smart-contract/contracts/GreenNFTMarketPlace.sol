pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

//import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { GreenNFT } from "./GreenNFT.sol";
//import { GreenNFTTradable } from "./GreenNFTTradable.sol";
import { GreenNFTMarketplaceEvents } from "./green-nft-marketplace/commons/GreenNFTMarketplaceEvents.sol";
import { GreenNFTData } from "./GreenNFTData.sol";

/// [Note]: For calling the GreenNFTStatus enum
import { GreenNFTDataObjects } from "./green-nft-data/commons/GreenNFTDataObjects.sol";

contract GreenNFTMarketplace is GreenNFTMarketplaceEvents {
//contract GreenNFTMarketplace is GreenNFTTradable, GreenNFTMarketplaceEvents {
    using SafeMath for uint256;

    address public GREEN_NFT_MARKETPLACE;

    GreenNFTData public greenNFTData;

    constructor(GreenNFTData _greenNFTData) public {
    //constructor(GreenNFTData _greenNFTData) public GreenNFTTradable() {
        greenNFTData = _greenNFTData;
        address payable GREEN_NFT_MARKETPLACE = address(uint160(address(this)));
    }

    /** 
     * @notice - Buy function is that buy NFT token and ownership transfer. (Reference from IERC721.sol)
     * @notice - msg.sender buy NFT with ETH (msg.value)
     * @notice - greenID is always 1. Because each GreenNFT is unique.
     */
    function buyGreenNFT(GreenNFT _greenNFT) public payable returns (bool) {
        GreenNFT greenNFT = _greenNFT;

        GreenNFTData.GreenNFTMetadata memory greenNFTMetadata = greenNFTData.getGreenNFTMetadataByNFTAddress(greenNFT);
        uint _projectId = greenNFTData.getClaim(greenNFTMetadata.claimId).projectId;
        address _seller = greenNFTData.getProject(_projectId).projectOwner;
        address payable seller = address(uint160(_seller));  /// Convert owner address with payable
        
        /// [Todo]: Add calculation of buy amount (Unit price * buyable carbon credits)
        uint unitPrice = 1 * 1e18;
        uint buyableCarbonCredits;
        uint buyAmount = unitPrice * buyableCarbonCredits;
        require (msg.value == buyAmount, "msg.value should be equal to the buyAmount");
 
        /// Bought-amount is transferred into a seller wallet
        seller.transfer(buyAmount);
    }

}
