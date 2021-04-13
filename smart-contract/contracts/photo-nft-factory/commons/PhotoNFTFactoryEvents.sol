pragma solidity 0.6.12;

import { PhotoNFT } from "../../PhotoNFT.sol";


contract PhotoNFTFactoryEvents {

    event PhotoNFTCreated (
        address owner,
        PhotoNFT photoNFT,
        string nftName, 
        string nftSymbol, 
        uint photoPrice, 
        string ipfsHashOfPhoto
    );

    event AddReputation (
        uint256 tokenId,
        uint256 reputationCount
    );

}
