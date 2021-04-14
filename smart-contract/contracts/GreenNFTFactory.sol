pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { Strings } from "./libraries/Strings.sol";
import { GreenNFTFactoryStorages } from "./green-nft-factory/commons/GreenNFTFactoryStorages.sol";
import { GreenNFT } from "./GreenNFT.sol";
import { GreenNFTMarketplace } from "./GreenNFTMarketplace.sol";
import { GreenNFTData } from "./GreenNFTData.sol";

/// [Note]: For calling enum
import { GreenNFTDataObjects } from "./green-nft-data/commons/GreenNFTDataObjects.sol";


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
     * @notice - A creator apply to an auditor
     * @notice - Anyone can apply
     */
    function applyProject(GreenNFT _greenNFT, string memory _projectName, uint _carbonCreditsTotal, string memory _referenceDocument) public returns (bool) {

        address _projectOwner = msg.sender;

        /// Save metadata of a GreenNFT created
        uint _carbonCreditsSold = 0;
        string memory _auditedReport = "";
        greenNFTData.saveMetadataOfGreenNFT(greenAddresses, _greenNFT, _projectOwner, _projectName, _carbonCreditsTotal, _carbonCreditsSold, _referenceDocument, _auditedReport);
    }

    /**
     * @notice - An auditor approve a project that an auditor applied
     * @notice - Only auditor can apply
     */
    function approveProject() public returns (bool) {
        address auditor;
        address[] memory auditors = greenNFTData.getAuditors();
        for (uint i=0; i < auditors.length; i++) {
            if (msg.sender == auditors[i]) {
                auditor = auditors[i];
            }
        }

        require (msg.sender == auditor, "Caller must be an auditor");
        
    }

    /**
     * @notice - Create a new GreenNFT when a seller (owner) upload a green onto IPFS
     */
    function createNewGreenNFT(
        GreenNFT _greenNFT, 
        string memory _projectName, 
        uint _carbonCreditsTotal, 
        uint _carbonCreditsSold, 
        string memory _referenceDocument, 
        string memory _auditedReport
    ) public returns (bool) {
        address _projectOwner = msg.sender;                    /// [Note]: Initial owner of GreenNFT is msg.sender
        string memory tokenURI = getTokenURI(_auditedReport);  /// [Note]: IPFS hash + URL
        string memory _projectSymbol = "";
        GreenNFT greenNFT = new GreenNFT(_projectOwner, _projectName, _projectSymbol, tokenURI);
        //GreenNFT greenNFT = new GreenNFT(owner, nftName, nftSymbol, tokenURI, greenNFTPrice);
        greenAddresses.push(address(greenNFT));

        /// Save metadata of a GreenNFT created
        greenNFTData.saveMetadataOfGreenNFT(greenAddresses, _greenNFT, _projectOwner, _projectName, _carbonCreditsTotal, _carbonCreditsSold, _referenceDocument, _auditedReport);
        greenNFTData.updateStatus(greenNFT, GreenNFTDataObjects.GreenNFTStatus.Sale);
        //greenNFTData.updateStatus(greenNFT, "Open");

        emit GreenNFTCreated(greenNFT, _projectOwner, _projectName, _auditedReport);
    }


    ///-----------------
    /// Getter methods
    ///-----------------
    function baseTokenURI() public pure returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function getTokenURI(string memory _auditedReport) public view returns (string memory) {
        return Strings.strConcat(baseTokenURI(), _auditedReport);  /// IPFS hash + URI
    }

}
