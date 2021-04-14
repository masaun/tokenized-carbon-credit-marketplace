pragma solidity 0.6.12;

import { GreenNFT } from "../../GreenNFT.sol";


contract GreenNFTFactoryEvents {

    event GreenNFTCreated (
        GreenNFT greenNFT,
        address projectOwner,
        string projectName, 
        string auditedReport
    );

}
