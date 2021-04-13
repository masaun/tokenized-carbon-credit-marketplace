pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { Strings } from "./libraries/Strings.sol";
import { GreenNFTFactoryStorages } from "./green-nft-factory/commons/GreenNFTFactoryStorages.sol";
import { GreenNFT } from "./GreenNFT.sol";
import { GreenNFTMarketplace } from "./GreenNFTMarketplace.sol";
import { GreenNFTData } from "./GreenNFTData.sol";


/**
 * @notice - This is the factory contract for a NFT of green
 */
contract GreenNFTFactory is GreenNFTFactoryStorages {
    using SafeMath for uint256;
    using Strings for string;    

    address[] public greenAddresses;
    address GREEN_NFT_MARKETPLACE;

    GreenNFTMarketplace public greenNFTMarketplace;
    GreenNFTData public greenNFTData;

    constructor(GreenNFTMarketplace _greenNFTMarketplace, GreenNFTData _greenNFTData) public {
        greenNFTMarketplace = _greenNFTMarketplace;
        greenNFTData = _greenNFTData;
        GREEN_NFT_MARKETPLACE = address(greenNFTMarketplace);
    }

    /**
     * @notice - Create a new GreenNFT when a seller (owner) upload a green onto IPFS
     */
    function createNewGreenNFT(string memory nftName, string memory nftSymbol, uint greenNFTPrice, string memory ipfsHashOfGreenNFT) public returns (bool) {
        address owner = msg.sender;  /// [Note]: Initial owner of GreenNFT is msg.sender
        string memory tokenURI = getTokenURI(ipfsHashOfGreenNFT);  /// [Note]: IPFS hash + URL
        GreenNFT greenNFT = new GreenNFT(owner, nftName, nftSymbol, tokenURI, greenNFTPrice);
        greenAddresses.push(address(greenNFT));

        /// Save metadata of a GreenNFT created
        greenNFTData.saveMetadataOfGreenNFT(greenAddresses, greenNFT, nftName, nftSymbol, msg.sender, greenNFTPrice, ipfsHashOfGreenNFT);
        greenNFTData.updateStatus(greenNFT, "Open");

        emit GreenNFTCreated(msg.sender, greenNFT, nftName, nftSymbol, greenNFTPrice, ipfsHashOfGreenNFT);
    }


    ///-----------------
    /// Getter methods
    ///-----------------
    function baseTokenURI() public pure returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function getTokenURI(string memory _ipfsHashOfGreenNFT) public view returns (string memory) {
        return Strings.strConcat(baseTokenURI(), _ipfsHashOfGreenNFT);
    }

}
