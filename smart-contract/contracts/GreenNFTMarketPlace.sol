pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

//import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { GreenNFT } from "./GreenNFT.sol";
import { GreenNFTTradable } from "./GreenNFTTradable.sol";
import { GreenNFTMarketplaceEvents } from "./green-nft-marketplace/commons/GreenNFTMarketplaceEvents.sol";
import { GreenNFTData } from "./GreenNFTData.sol";


contract GreenNFTMarketplace is GreenNFTTradable, GreenNFTMarketplaceEvents {
    using SafeMath for uint256;

    address public GREEN_NFT_MARKETPLACE;

    GreenNFTData public greenNFTData;

    constructor(GreenNFTData _greenNFTData) public GreenNFTTradable() {
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

        GreenNFTData.Green memory green = greenNFTData.getGreenByNFTAddress(greenNFT);
        address _seller = green.ownerAddress;                     /// Owner
        address payable seller = address(uint160(_seller));  /// Convert owner address with payable
        uint buyAmount = green.greenPrice;
        require (msg.value == buyAmount, "msg.value should be equal to the buyAmount");
 
        /// Bought-amount is transferred into a seller wallet
        seller.transfer(buyAmount);

        /// Approve a buyer address as a receiver before NFT's transferFrom method is executed
        address buyer = msg.sender;
        uint greenId = 1;  /// [Note]: greenID is always 1. Because each GreenNFT is unique.
        greenNFT.approve(buyer, greenId);

        address ownerBeforeOwnershipTransferred = greenNFT.ownerOf(greenId);

        /// Transfer Ownership of the GreenNFT from a seller to a buyer
        transferOwnershipOfGreenNFT(greenNFT, greenId, buyer);    
        greenNFTData.updateOwnerOfGreenNFT(greenNFT, buyer);
        greenNFTData.updateStatus(greenNFT, "Cancelled");

        /// Event for checking result of transferring ownership of a GreenNFT
        address ownerAfterOwnershipTransferred = greenNFT.ownerOf(greenId);
        emit GreenNFTOwnershipChanged(greenNFT, greenId, ownerBeforeOwnershipTransferred, ownerAfterOwnershipTransferred);

        /// Mint a green with a new greenId
        //string memory tokenURI = GreenNFTFactory.getTokenURI(greenData.ipfsHashOfgreen);  /// [Note]: IPFS hash + URL
        //GreenNFT.mint(msg.sender, tokenURI);
    }

}
