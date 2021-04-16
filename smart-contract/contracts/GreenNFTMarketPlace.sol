pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

//import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { GreenNFTMarketplaceCommons } from "./commons/GreenNFTMarketplaceCommons.sol";
import { GreenNFT } from "./GreenNFT.sol";
import { GreenNFTTradable } from "./GreenNFTTradable.sol";
import { GreenNFTData } from "./GreenNFTData.sol";


contract GreenNFTMarketplace is GreenNFTTradable, GreenNFTMarketplaceCommons {
    using SafeMath for uint256;

    uint unitPriceOfCarbonCredits = 1 * 1e18;  /// 1 ETH per 1 carbon crefits

    address public GREEN_NFT_MARKETPLACE;

    GreenNFTData public greenNFTData;

    constructor(GreenNFTData _greenNFTData) public GreenNFTTradable() {
        greenNFTData = _greenNFTData;
        address payable GREEN_NFT_MARKETPLACE = address(uint160(address(this)));
    }

    /** 
     * @notice - Buy function is that a buyer (msg.sender) purchase carbon credits from a seller. (Reference from IERC721.sol)
     * @notice - a buyer (msg.sender) purchase carbon credits with ETH (msg.value)
     */
    function buyCarbonCredits(GreenNFT _greenNFT, uint orderOfCarbonCredits) public payable returns (bool) {
        GreenNFT greenNFT = _greenNFT;
        address buyer = msg.sender;  /// [Note]: In advance, a buyer (msg.sender) must transfer msg.value from front-end.

        GreenNFTData.GreenNFTMetadata memory greenNFTMetadata = greenNFTData.getGreenNFTMetadataByNFTAddress(greenNFT);
        uint _projectId = greenNFTData.getClaim(greenNFTMetadata.claimId).projectId;
        address _seller = greenNFTData.getProject(_projectId).projectOwner;
        address payable seller = address(uint160(_seller));  /// Convert owner address with payable
        
        /// Calculation of purchase amount (Unit price * buyable carbon credits) 
        uint purchaseAmountOfCarbonCredits = getPurchaseAmountOfCarbonCredits(greenNFT, orderOfCarbonCredits);
        require(purchaseAmountOfCarbonCredits == msg.value, "Purchase amount of carbon credits must be equal to msg.value");

        /// [Todo]: Finalize this condition
        //uint buyableCarbonCredits = getBuyableCarbonCredits()
        //require (purchaseAmountOfCarbonCredits <= buyableCarbonCredits, "Purchase amount of carbon credits must be less than buyable carbon credits");

        /// ETH amount purchased is transferred into a seller wallet
        seller.transfer(purchaseAmountOfCarbonCredits);
    }


    ///--------------------------
    /// Getter methods
    ///--------------------------
    function getBuyableCarbonCredits() public view returns (uint _buyableCarbonCredits) {
        /// [Todo]: Get buyable carbon credits
    }


    /**
     * @notice - Calculation of buy amount (Unit price * order of carbon credits)
     */
    function getPurchaseAmountOfCarbonCredits(GreenNFT _greenNFT, uint orderOfCarbonCredits) public view returns (uint _purchaseAmountOfCarbonCredits) {
        uint purchaseAmountOfCarbonCredits = unitPriceOfCarbonCredits * orderOfCarbonCredits;
        return purchaseAmountOfCarbonCredits;
    }
    

}
