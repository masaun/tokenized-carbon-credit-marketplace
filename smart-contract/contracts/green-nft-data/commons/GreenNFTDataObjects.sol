pragma solidity 0.6.12;

import { GreenNFT } from "../../GreenNFT.sol";


contract GreenNFTDataObjects {

    enum GreenNFTStatus { Applied, Approved, Sale, NotSale }
    
    /// @notice - Data of a GreenNFT
    struct Green {  /// [Key]: index of array
        GreenNFT greenNFT;

        address projectOwner;
        string projectName;
        uint carbonCreditsTotal;
        uint carbonCreditsSold; 
        string referenceDocument;  /// IPFS hash
        string auditedReport;      /// IPFS hash

        //string greenNFTName;
        //string greenNFTSymbol;
        //address ownerAddress;
        //uint greenNFTPrice;
        //string ipfsHashOfGreenNFT;
        //string status;                /// "Applied" or "Audited" or "Open (Sale)" or "Cancelled (Not Sale)"
        GreenNFTStatus greenNFTStatus;  /// "Applied" or "Audited" or "Open (Sale)" or "Cancelled (Not Sale)"
    }

    struct Request {
        address projectOwner;
        string projectName;
        uint numberOfCarbonCredits;

        string referenceDocument;  /// IPFS hash
    }
    
}
