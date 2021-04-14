pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { GreenNFTDataStorages } from "./green-nft-data/commons/GreenNFTDataStorages.sol";
import { GreenNFT } from "./GreenNFT.sol";


/**
 * @notice - This is the storage contract for GreenNFTs
 */
contract GreenNFTData is GreenNFTDataStorages {

    address[] public greenAddresses;

    constructor() public {}

    /**
     * @notice - Save metadata of a GreenNFT
     */
    function saveMetadataOfGreenNFT(
        address[] memory _greenAddresses, 
        GreenNFT _greenNFT, 
        string memory _greenNFTName, 
        string memory _greenNFTSymbol, 
        address _ownerAddress, 
        uint _greenNFTPrice, 
        string memory _ipfsHashOfGreenNFT
    ) public returns (bool) {
        /// Save metadata of a GreenNFT
        Green memory green = Green({
            greenNFT: _greenNFT,
            greenNFTName: _greenNFTName,
            greenNFTSymbol: _greenNFTSymbol,
            ownerAddress: _ownerAddress,
            greenNFTPrice: _greenNFTPrice,
            ipfsHashOfGreenNFT: _ipfsHashOfGreenNFT,
            status: "Open",
            reputation: 0
        });
        greens.push(green);

        /// Update greenAddresses
        greenAddresses = _greenAddresses;     
    }

    /**
     * @notice - Update owner address of a GreenNFT by transferring ownership
     */
    function updateOwnerOfGreenNFT(GreenNFT _greenNFT, address _newOwner) public returns (bool) {
        /// Identify green's index
        uint greenIndex = getGreenIndex(_greenNFT);

        /// Update metadata of a GreenNFT
        Green storage green = greens[greenIndex];
        require (_newOwner != address(0), "A new owner address should be not empty");
        green.ownerAddress = _newOwner;  
    }

    /**
     * @notice - Update status ("Open" or "Cancelled")
     */
    function updateStatus(GreenNFT _greenNFT, string memory _newStatus) public returns (bool) {
        /// Identify green's index
        uint greenIndex = getGreenIndex(_greenNFT);

        /// Update metadata of a GreenNFT
        Green storage green = greens[greenIndex];
        green.status = _newStatus;  
    }


    ///-----------------
    /// Getter methods
    ///-----------------
    function getGreen(uint index) public view returns (Green memory _green) {
        Green memory green = greens[index];
        return green;
    }

    function getGreenIndex(GreenNFT greenNFT) public view returns (uint _greenIndex) {
        address GREEN_NFT = address(greenNFT);

        /// Identify member's index
        uint greenIndex;
        for (uint i=0; i < greenAddresses.length; i++) {
            if (greenAddresses[i] == GREEN_NFT) {
                greenIndex = i;
            }
        }

        return greenIndex;   
    }

    function getGreenByNFTAddress(GreenNFT greenNFT) public view returns (Green memory _green) {
        address GREEN_NFT = address(greenNFT);

        /// Identify member's index
        uint greenIndex;
        for (uint i=0; i < greenAddresses.length; i++) {
            if (greenAddresses[i] == GREEN_NFT) {
                greenIndex = i;
            }
        }

        Green memory green = greens[greenIndex];
        return green;
    }

    function getAllGreens() public view returns (Green[] memory _greens) {
        return greens;
    }

}
