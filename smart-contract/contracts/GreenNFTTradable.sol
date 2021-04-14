pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { GreenNFT } from "./GreenNFT.sol";
import { GreenNFTData } from "./GreenNFTData.sol";

/// [Note]: For calling enum
import { GreenNFTDataObjects } from "./green-nft-data/commons/GreenNFTDataObjects.sol";


/**
 * @title - GreenNFTTradable contract
 * @notice - This contract has role that put on sale of GreenNFTs
 */
contract GreenNFTTradable {
    event TradeStatusChange(uint256 ad, bytes32 status);

    GreenNFT public greenNFT;

    struct Trade {
        address seller;
        uint256 greenId;  /// GreenNFT's token ID
        uint256 greenNFTPrice;
        bytes32 status;   /// Open, Executed, Cancelled
    }
    mapping(uint256 => Trade) public trades;  /// [Key]: GreenNFT's token ID

    uint256 tradeCounter;

    constructor() public {
        tradeCounter = 0;
    }

    /**
     * @notice - This method is only executed when a seller create a new GreenNFT
     * @dev Opens a new trade. Puts _greenId in escrow.
     * @param _greenId The id for the greenId to trade.
     * @param _greenNFTPrice The amount of currency for which to trade the greenId.
     */
    function openTradeWhenCreateNewGreenNFT(GreenNFT greenNFT, uint256 _greenId, uint256 _greenNFTPrice) public {
        greenNFT.transferFrom(msg.sender, address(this), _greenId);

        tradeCounter += 1;    /// [Note]: New. Trade count is started from "1". This is to align greenId
        trades[tradeCounter] = Trade({
            seller: msg.sender,
            greenId: _greenId,
            greenNFTPrice: _greenNFTPrice,
            status: "Open"
        });
        //tradeCounter += 1;  /// [Note]: Original
        emit TradeStatusChange(tradeCounter - 1, "Open");
    }

    /**
     * @dev Opens a trade by the seller.
     */
    function openTrade(GreenNFTData _greenNFTData, GreenNFT greenNFT, uint256 _greenId) public {
        GreenNFTData greenNFTData = _greenNFTData;
        greenNFTData.updateStatus(greenNFT, GreenNFTDataObjects.GreenNFTStatus.Sale);
        //greenNFTData.updateStatus(greenNFT, "Open");

        Trade storage trade = trades[_greenId];
        require(
            msg.sender == trade.seller,
            "Trade can be open only by seller."
        );
        greenNFT.transferFrom(msg.sender, address(this), trade.greenId);
        trades[_greenId].status = "Open";
        emit TradeStatusChange(_greenId, "Open");
    }

    /**
     * @dev Cancels a trade by the seller.
     */
    function cancelTrade(GreenNFTData _greenNFTData, GreenNFT greenNFT, uint256 _greenId) public {
        GreenNFTData greenNFTData = _greenNFTData;
        greenNFTData.updateStatus(greenNFT, GreenNFTDataObjects.GreenNFTStatus.NotSale);
        //greenNFTData.updateStatus(greenNFT, "Cancelled");
        
        Trade storage trade = trades[_greenId];
        require(
            msg.sender == trade.seller,
            "Trade can be cancelled only by seller."
        );
        require(trade.status == "Open", "Trade is not Open.");
        greenNFT.transferFrom(address(this), trade.seller, trade.greenId);
        trades[_greenId].status = "Cancelled";
        emit TradeStatusChange(_greenId, "Cancelled");
    }

    /**
     * @dev Executes a trade. Must have approved this contract to transfer the amount of currency specified to the seller. Transfers ownership of the greenId to the filler.
     */
    function transferOwnershipOfGreenNFT(GreenNFT _greenNFT, uint256 _greenId, address _buyer) public {
        GreenNFT greenNFT = _greenNFT;

        Trade memory trade = getTrade(_greenId);
        require(trade.status == "Open", "Trade is not Open.");

        _updateSeller(_greenNFT, _greenId, _buyer);

        greenNFT.transferFrom(address(this), _buyer, trade.greenId);
        getTrade(_greenId).status = "Cancelled";
        emit TradeStatusChange(_greenId, "Cancelled");
    }

    function _updateSeller(GreenNFT greenNFT, uint256 _greenId, address _newSeller) internal {
        Trade storage trade = trades[_greenId];
        trade.seller = _newSeller;
    }


    /**
     * @dev - Returns the details for a trade.
     */
    function getTrade(uint256 _greenId) public view returns (Trade memory trade_) {
        Trade memory trade = trades[_greenId];
        return trade;
        //return (trade.seller, trade.greenId, trade.greenNFTPrice, trade.status);
    }
}
