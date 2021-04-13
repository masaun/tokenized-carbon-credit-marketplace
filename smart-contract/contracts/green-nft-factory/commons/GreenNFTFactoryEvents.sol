pragma solidity 0.6.12;

import { GreenNFT } from "../../GreenNFT.sol";


contract GreenNFTFactoryEvents {

    event GreenNFTCreated (
        address owner,
        GreenNFT greenNFT,
        string nftName, 
        string nftSymbol, 
        uint greenPrice, 
        string ipfsHashOfgreen
    );

    event AddReputation (
        uint256 tokenId,
        uint256 reputationCount
    );

}
