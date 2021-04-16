pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { Strings } from "./libraries/Strings.sol";

import { GreenNFTFactoryCommons } from "./commons/GreenNFTFactoryCommons.sol";
import { GreenNFT } from "./GreenNFT.sol";
import { GreenNFTMarketplace } from "./GreenNFTMarketplace.sol";
import { GreenNFTData } from "./GreenNFTData.sol";


/**
 * @notice - This is the factory contract for a NFT of green
 */
contract GreenNFTFactory is GreenNFTFactoryCommons {
    using SafeMath for uint256;
    using Strings for string;

    address GREEN_NFT_MARKETPLACE;

    GreenNFTMarketplace public greenNFTMarketplace;
    GreenNFTData public greenNFTData;

    constructor(GreenNFTMarketplace _greenNFTMarketplace, GreenNFTData _greenNFTData) public {
        greenNFTMarketplace = _greenNFTMarketplace;
        greenNFTData = _greenNFTData;
        GREEN_NFT_MARKETPLACE = address(greenNFTMarketplace);
    }

    /**
     * @notice - Register a auditor 
     */
    function registerAuditor(address auditor) public returns (bool) {
        /// Caller is onlyOwner 
        greenNFTData.addAuditor(auditor);
    }

    /**
     * @notice - Register a project
     */
    function registerProject(string memory projectName, uint co2Emissions) public returns (bool) {
        address projectOwner = msg.sender;
        greenNFTData.saveProject(projectOwner, projectName, co2Emissions);
    }

    /**
     * @notice - A project owner claim CO2 reductions
     */
    function claimCO2Reductions(uint projectId, uint co2Reductions, string memory referenceDocument) public returns (bool) {
        /// [Todo]: Add a condition to check a caller
        address projectOwner;
        require (msg.sender == projectOwner, "Caller must be a project owner");
        
        greenNFTData.saveClaim(projectId, co2Reductions, referenceDocument);
    }

    /**
     * @notice - An auditor audit a CO2 reduction claim
     * @notice - Only auditor can audit
     */
    function auditClaim(uint claimId, string memory auditedReport) public returns (bool) {
        address auditor;
        address[] memory auditors = greenNFTData.getAuditors();
        for (uint i=0; i < auditors.length; i++) {
            if (msg.sender == greenNFTData.getAuditor(i)) {
                auditor = greenNFTData.getAuditor(i);
            }
        }
        require (msg.sender == auditor, "Caller must be an auditor");

        GreenNFTData.Claim memory claim = greenNFTData.getClaim(claimId);
        uint _projectId = claim.projectId;
        uint _co2Reductions = claim.co2Reductions;
        string memory _referenceDocument = claim.referenceDocument;
        ClaimAudited(_projectId, _co2Reductions, _referenceDocument);

        /// Create a new GreenNFT
        _createNewGreenNFT(_projectId, claimId, auditor, _co2Reductions, auditedReport);
    }

    /**
     * @notice - Create a new GreenNFT when a seller (owner) upload a green onto IPFS
     */
    function _createNewGreenNFT(
        uint projectId,
        uint claimId,
        address auditor,
        uint co2Reductions, 
        string memory auditedReport
    ) internal returns (bool) {
        GreenNFTData.Project memory project = greenNFTData.getProject(projectId);
        address _projectOwner = project.projectOwner;
        string memory _projectName = project.projectName;
        string memory projectSymbol = "";
        string memory tokenURI = getTokenURI(auditedReport);  /// [Note]: IPFS hash + URL

        GreenNFT greenNFT = new GreenNFT(_projectOwner, _projectName, projectSymbol, tokenURI);

        /// Calculate carbon credits
        uint _cc2Emissions = project.co2Emissions;
        uint carbonCredits = _cc2Emissions.sub(co2Reductions);

        /// Save metadata of a GreenNFT created
        greenNFTData.saveGreenNFTMetadata(claimId, greenNFT, auditor, carbonCredits, auditedReport);

        emit GreenNFTCreated(projectId, claimId, greenNFT, auditor, carbonCredits, auditedReport);
    }


    ///-----------------
    /// Getter methods
    ///-----------------
    function baseTokenURI() public pure returns (string memory) {
        return "https://ipfs.io/ipfs/";
    }

    function getTokenURI(string memory _auditedReport) public view returns (string memory) {
        return Strings.strConcat(baseTokenURI(), _auditedReport);  /// IPFS hash of audited-report + base token URI
    }

}
