pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { GreenNFT } from "./GreenNFT.sol";
import { GreenNFTData } from "./GreenNFTData.sol";
import { CarbonCreditToken } from "./CarbonCreditToken.sol";

/// [Note]: For calling enum
import { GreenNFTDataCommons } from "./commons/GreenNFTDataCommons.sol";


/**
 * @title - GreenNFTTradable contract
 * @notice - This contract has role that switch open/cancel to put on sale of carbon credits
 */
contract GreenNFTTradable {
    CarbonCreditToken private carbonCreditToken;  /// [Note]: The reason why I use "private" is to avoid an error of "Overriding public state variable"

    constructor(CarbonCreditToken _carbonCreditToken) public {
        carbonCreditToken = _carbonCreditToken;        
    }

    /**
     * @notice - Open to put on sale of carbon credits.
     * @notice - Caller is a projectOwner (Seller)
     */
    function openToPutOnSale(GreenNFTData _greenNFTData, GreenNFT greenNFT) public {
        GreenNFTData greenNFTData = _greenNFTData;
        
        /// Update status
        greenNFTData.updateStatus(greenNFT, GreenNFTDataCommons.GreenNFTStatus.Sale);

        /// Get amount of carbon credits
        GreenNFTDataCommons.GreenNFTEmissonData memory greenNFTEmissonData = greenNFTData.getGreenNFTEmissonDataByNFTAddress(greenNFT);
        uint _carbonCredits = greenNFTEmissonData.carbonCredits;

        /// CarbonCreditTokens are locked on this smart contract
        address projectOwner = msg.sender;
        carbonCreditToken.transferFrom(projectOwner, address(this), _carbonCredits);
    }

    /**
     * @notice - Cancel to put on sale of carbon credits.
     * @notice - Caller is a seller
     */
    function cancelToPutOnSale(GreenNFTData _greenNFTData, GreenNFT greenNFT) public {
        GreenNFTData greenNFTData = _greenNFTData;

        /// Update status
        greenNFTData.updateStatus(greenNFT, GreenNFTDataCommons.GreenNFTStatus.NotSale);

        /// Get amount of carbon credits
        GreenNFTDataCommons.GreenNFTEmissonData memory greenNFTEmissonData = greenNFTData.getGreenNFTEmissonDataByNFTAddress(greenNFT);
        uint _carbonCredits = greenNFTEmissonData.carbonCredits;

        /// CarbonCreditTokens locked are relesed from this smart contract and transferred into a projectOwner (seller) 
        address projectOwner = msg.sender;
        carbonCreditToken.transfer(projectOwner, _carbonCredits);
    }

}
