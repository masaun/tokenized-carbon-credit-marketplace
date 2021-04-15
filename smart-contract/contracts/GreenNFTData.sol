pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { GreenNFTDataStorages } from "./green-nft-data/commons/GreenNFTDataStorages.sol";
import { GreenNFT } from "./GreenNFT.sol";


/**
 * @notice - This is the storage contract for GreenNFTs
 */
contract GreenNFTData is GreenNFTDataStorages {
    using SafeMath for uint;

    uint currentProjectId;
    uint currentClaimId;

    /// Auditor
    address[] public auditors;

    /// All GreenNFTs addresses
    address[] public greenNFTAddresses;

    constructor() public {}


    /**
     * @notice - Save a project
     */
    function saveProject(
        address _projectOwner,
        string memory _projectName,
        uint _co2Emissions
    ) public returns (bool) {
        currentProjectId++;
        Project memory project = Project({
            projectOwner: _projectOwner,
            projectName: _projectName,    
            co2Emissiosn: _co2Emissions
        });
        projects.push(project);        
    }


    /**
     * @notice - Save a CO2 reduction claim
     */
    function saveClaim(
        uint _projectId,
        uint _co2Reductions,
        string memory _referenceDocument
    ) public returns (bool) {
        currentClaimId++;
        Claim memory claim = Claim({
            projectId: _projectId,
            co2Reductions: _co2Reductions,
            referenceDocument: _referenceDocument
        });
        claims.push(claim);        
    }

    /**
     * @notice - Save metadata of a GreenNFT
     */
    function saveGreenNFTMetadata(
        uint _claimId,
        address[] memory _greenNFTAddresses, 
        GreenNFT _greenNFT, 
        address _auditor,
        uint _carbonCredits,
        string memory _auditedReport
    ) public returns (bool) {
        currentGreenId++;

        /// Save metadata of a GreenNFT
        GreenNFTMetadata memory greenNFTMetadata = GreenNFTMetadata({
            claimId: _claimId,
            greenNFT: _greenNFT,
            auditor: _auditor,
            carbonCredits: _carbonCredits,
            buyableCarbonCredits: _carbonCredits,  /// [Note]: Initially, carbonCredits and buyableCarbonCredits are equal amount
            auditedReport: _auditedReport,
            greenNFTStatus: GreenNFTStatus.Audited
        });
        greenNFTMetadatas.push(greenNFTMetadata);

        /// Update GreenNFTs addresses
        greenNFTAddresses.push(address(_greenNFT));
    }

    /**
     * @notice - Update status ("Open" or "Cancelled")
     */
    function updateStatus(GreenNFT _greenNFT, GreenNFTStatus _newStatus) public returns (bool) {
        /// Identify green's index
        uint greenIndex = getGreenIndex(_greenNFT);

        /// Update metadata of a GreenNFT
        Green storage green = greens[greenIndex];
        green.greenNFTStatus = _newStatus;  
        //green.status = _newStatus;  
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
        green.projectOwner = _newOwner;
    }



    ///-----------------
    /// Getter methods
    ///-----------------
    function getGreen(uint greenId) public view returns (Green memory _green) {
        uint index = greenId.sub(1);
        Green memory green = greens[index];
        return green;
    }

    function getGreenIndex(GreenNFT greenNFT) public view returns (uint _greenIndex) {
        address GREEN_NFT = address(greenNFT);

        /// Identify member's index
        uint greenIndex;
        for (uint i=0; i < greenNFTAddresses.length; i++) {
            if (greenNFTAddresses[i] == GREEN_NFT) {
                greenIndex = i;
            }
        }

        return greenIndex;   
    }

    function getGreenByNFTAddress(GreenNFT greenNFT) public view returns (Green memory _green) {
        address GREEN_NFT = address(greenNFT);

        /// Identify member's index
        uint greenIndex = getGreenIndex(greenNFT);

        Green memory green = greens[greenIndex];
        return green;
    }

    function getAllGreens() public view returns (Green[] memory _greens) {
        return greens;
    }


    function getAuditors() public view returns (address[] memory _auditors) {
        return auditors;
    }
    

}
