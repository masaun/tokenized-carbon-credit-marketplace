pragma solidity 0.6.12;

import { GreenNFT } from "../../GreenNFT.sol";


contract GreenNFTFactoryEvents {

    event ClaimAudited (
        uint projectId, 
        uint co2Reductions, 
        string referenceDocument
    );

    event GreenNFTCreated (
        GreenNFT greenNFT,
        address auditor, 
        address projectOwner,
        string projectName, 
        string referenceDocument,
        string auditedReport
    );

}
