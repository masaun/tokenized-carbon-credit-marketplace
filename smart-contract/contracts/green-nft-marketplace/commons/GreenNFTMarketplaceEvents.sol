pragma solidity 0.6.12;

import { GreenNFT } from "../../GreenNFT.sol";


contract GreenNFTMarketplaceEvents {

    event GreenNFTOwnershipChanged (
        GreenNFT greenNFT,
        uint greenId, 
        address ownerBeforeOwnershipTransferred,
        address ownerAfterOwnershipTransferred
    );

}
