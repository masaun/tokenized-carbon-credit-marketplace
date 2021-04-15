pragma solidity 0.6.12;

import { GreenNFT } from "../../GreenNFT.sol";


contract GreenNFTFactoryEvents {

    event ProjectApproved (
        address auditor, 
        address projectOwner,
        string projectName, 
        uint carbonCreditsTotal,
        string referenceDocument,
        string auditedReport
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
