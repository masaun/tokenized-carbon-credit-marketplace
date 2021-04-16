pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { GreenNFT } from "./GreenNFT.sol";
import { GreenNFTData } from "./GreenNFTData.sol";

/// [Note]: For calling enum
import { GreenNFTDataCommons } from "./commons/GreenNFTDataCommons.sol";


/**
 * @title - GreenNFTTradable contract
 * @notice - This contract has role that switch open/cancel to put on sale of carbon credits
 */
contract GreenNFTTradable {
    constructor() public {}

    /**
     * @notice - Open to put on sale of carbon credits.
     */
    function openSale(GreenNFTData _greenNFTData, GreenNFT greenNFT, uint256 _greenId) public {
        GreenNFTData greenNFTData = _greenNFTData;
        greenNFTData.updateStatus(greenNFT, GreenNFTDataCommons.GreenNFTStatus.Sale);
    }

    /**
     * @notice - Cancel to put on sale of carbon credits.
     */
    function cancelSale(GreenNFTData _greenNFTData, GreenNFT greenNFT, uint256 _greenId) public {
        GreenNFTData greenNFTData = _greenNFTData;
        greenNFTData.updateStatus(greenNFT, GreenNFTDataCommons.GreenNFTStatus.NotSale);
    }

}
