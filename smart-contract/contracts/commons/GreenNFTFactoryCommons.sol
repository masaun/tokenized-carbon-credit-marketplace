pragma solidity 0.6.12;

import { GreenNFT } from "../GreenNFT.sol";


contract GreenNFTFactoryCommons {

    ///---------------------------
    /// Storages
    ///---------------------------


    ///---------------------------
    /// Objects
    ///---------------------------


    ///---------------------------
    /// Events
    ///---------------------------
    event ClaimAudited (
        uint projectId, 
        uint co2Reductions, 
        string referenceDocument
    );

    event GreenNFTCreated (
        uint projectId, 
        uint claimId,
        GreenNFT greenNFT,
        uint carbonCredits
    );

}
