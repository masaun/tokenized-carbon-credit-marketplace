pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";
import { GreenNFTDataCommons } from "./commons/GreenNFTDataCommons.sol";
import { GreenNFT } from "./GreenNFT.sol";


/**
 * @notice - This is the storage contract for GreenNFTs
 */
contract GreenNFTData is GreenNFTDataCommons {
    using SafeMath for uint;

    uint currentProjectId;
    uint currentClaimId;
    uint currentGreenNFTMetadataId;

    /// Auditor
    address[] public auditors;

    /// All GreenNFTs addresses
    address[] public greenNFTAddresses;

    constructor() public {}

    /**
     * @notice - Register a auditor 
     */
    function addAuditor(address auditor) public returns (bool) {
        auditors.push(auditor);
    }

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
            co2Emissions: _co2Emissions
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
        uint _projectId,
        uint _claimId,
        GreenNFT _greenNFT, 
        address _projectOwner,
        address _auditor,
        string memory _auditedReport
    ) public returns (bool) {
        currentGreenNFTMetadataId++;

        /// Save metadata of a GreenNFT
        GreenNFTMetadata memory greenNFTMetadata = GreenNFTMetadata({
            projectId: _projectId,
            claimId: _claimId,
            greenNFT: _greenNFT,
            projectOwner: _projectOwner,
            auditor: _auditor,
            auditedReport: _auditedReport,
            greenNFTStatus: GreenNFTStatus.Audited
        });
        greenNFTMetadatas.push(greenNFTMetadata);

        /// Update GreenNFTs addresses
        greenNFTAddresses.push(address(_greenNFT));
    }

    /**
     * @notice - Save emission data of a GreenNFT
     */
    function saveGreenNFTEmissonData(
        uint _co2Emissions,
        uint _co2Reductions,
        uint _carbonCredits
    ) public returns (bool) {
        /// Save emission data of a GreenNFT
        GreenNFTEmissonData memory greenNFTEmissonData = GreenNFTEmissonData({
            co2Emissions: _co2Emissions,
            co2Reductions: _co2Reductions,
            carbonCredits: _carbonCredits,
            buyableCarbonCredits: _carbonCredits  /// [Note]: Initially, carbonCredits and buyableCarbonCredits are equal amount
        });
        greenNFTEmissonDatas.push(greenNFTEmissonData);
    }


    /**
     * @notice - Update status ("Open" or "Cancelled")
     */
    function updateStatus(GreenNFT _greenNFT, GreenNFTStatus _newStatus) public returns (bool) {
        /// Identify green's index
        uint greenNFTMetadataIndex = getGreenNFTMetadataIndex(_greenNFT);

        /// Update metadata of a GreenNFT
        GreenNFTMetadata storage greenNFTMetadata = greenNFTMetadatas[greenNFTMetadataIndex];
        greenNFTMetadata.greenNFTStatus = _newStatus;  
    }


    ///-----------------
    /// Getter methods
    ///-----------------

    function getProject(uint projectId) public view returns (Project memory _projectId) {
        uint index = projectId.sub(1);
        Project memory project = projects[index];
        return project;
    }

    function getClaim(uint claimId) public view returns (Claim memory _claim) {
        uint index = claimId.sub(1);
        Claim memory claim = claims[index];
        return claim;
    }

    function getGreenNFTMetadata(uint greenNFTMetadataId) public view returns (GreenNFTMetadata memory _greenNFTMetadata) {
        uint index = greenNFTMetadataId.sub(1);
        GreenNFTMetadata memory greenNFTMetadata = greenNFTMetadatas[index];
        return greenNFTMetadata;
    }

    function getGreenNFTMetadataIndex(GreenNFT greenNFT) public view returns (uint _greenNFTMetadataIndex) {
        address GREEN_NFT = address(greenNFT);

        /// Identify member's index
        uint greenNFTMetadataIndex;
        for (uint i=0; i < greenNFTAddresses.length; i++) {
            if (greenNFTAddresses[i] == GREEN_NFT) {
                greenNFTMetadataIndex = i;
            }
        }

        return greenNFTMetadataIndex;   
    }

    function getGreenNFTMetadataByNFTAddress(GreenNFT greenNFT) public view returns (GreenNFTMetadata memory _greenNFTMetadata) {
        address GREEN_NFT = address(greenNFT);

        /// Identify member's index
        uint index = getGreenNFTMetadataIndex(greenNFT);

        GreenNFTMetadata memory greenNFTMetadata = greenNFTMetadatas[index];
        return greenNFTMetadata;
    }

    function getGreenNFTMetadatas() public view returns (GreenNFTMetadata[] memory _greenNFTMetadatas) {
        return greenNFTMetadatas;
    }

    function getGreenNFTEmissonData(uint greenNFTMetadataId) public view returns (GreenNFTEmissonData memory _greenNFTEmissonData) {
        /// [Note]: The GreenNFTEmissonData and the GreenNFTMetadata has same greenNFTMetadataId
        uint index = greenNFTMetadataId.sub(1);
        GreenNFTEmissonData memory greenNFTEmissonData = greenNFTEmissonDatas[index];
        return greenNFTEmissonData;
    }

    function getGreenNFTEmissonDataIndex(GreenNFT greenNFT) public view returns (uint _greenNFTEmissonDataIndex) {
        address GREEN_NFT = address(greenNFT);

        /// Identify member's index
        uint greenNFTEmissonDataIndex;
        for (uint i=0; i < greenNFTAddresses.length; i++) {
            if (greenNFTAddresses[i] == GREEN_NFT) {
                greenNFTEmissonDataIndex = i;
            }
        }

        return greenNFTEmissonDataIndex;   
    }

    function getGreenNFTEmissonDataByNFTAddress(GreenNFT greenNFT) public view returns (GreenNFTEmissonData memory _greenNFTEmissonData) {
        address GREEN_NFT = address(greenNFT);

        /// Identify member's index
        uint index = getGreenNFTEmissonDataIndex(greenNFT);

        GreenNFTEmissonData memory greenNFTEmissonData = greenNFTEmissonDatas[index];
        return greenNFTEmissonData;
    }



    function getAuditors() public view returns (address[] memory _auditors) {
        return auditors;
    }
    
    function getAuditor(uint index) public view returns (address _auditor) {
        return auditors[index];
    }

}
