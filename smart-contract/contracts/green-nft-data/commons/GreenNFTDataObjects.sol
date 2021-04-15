pragma solidity 0.6.12;

import { GreenNFT } from "../../GreenNFT.sol";


contract GreenNFTDataObjects {

    enum GreenNFTStatus { Applied, Approved, Sale, NotSale }

    struct Project {
        address projectOwner;
        string projectName;
    }
   
    /// @notice - CO2 reduction claim from a project
    struct Claim {
        uint projectId;            /// This is projectId for the Project struct (Index is projectId - 1)
        uint carbonCreditsTotal;
        string referenceDocument;  /// IPFS hash
    }

    /// @notice - Metadata of a GreenNFT of a project
    struct GreenNFTMetadata {  /// [Key]: index of array
        //GreenNFT greenNFT;  /// [Note]: This is not needed. Because there is "address[] public greenNFTAddresses"
        uint claimId;              /// This is claimId for the Claim struct (Index is claimId - 1)
        address auditor;
        uint carbonCreditsSold;    /// [Note]: This value is updated often time
        string auditedReport;      /// IPFS hash
        GreenNFTStatus greenNFTStatus;  /// Audited" or "Sale" or "Not Sale"
    }


    
}
