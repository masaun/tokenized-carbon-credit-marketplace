pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { SafeMath } from "@openzeppelin/contracts/math/SafeMath.sol";


/**
 * @notice - This is the NFT contract for a green
 */
contract GreenNFT is ERC721 {
    using SafeMath for uint256;

    uint256 public currentGreenId;
    
    constructor(
        address owner,  /// Initial owner (Seller)
        string memory _nftName, 
        string memory _nftSymbol,
        string memory _tokenURI,    /// [Note]: TokenURI is URL include ipfs hash
        uint greenNFTPrice
    ) 
        public 
        ERC721(_nftName, _nftSymbol) 
    {
        mint(owner, _tokenURI);
    }

    /** 
     * @dev mint a GreenNFT
     * @dev tokenURI - URL include ipfs hash
     */
    function mint(address to, string memory tokenURI) public returns (bool) {
        /// Mint a new GreenNFT
        uint newgreenId = getNextgreenId();
        currentGreenId++;
        _mint(to, newgreenId);
        _setTokenURI(newgreenId, tokenURI);
    }


    ///--------------------------------------
    /// Getter methods
    ///--------------------------------------


    ///--------------------------------------
    /// Private methods
    ///--------------------------------------
    function getNextgreenId() private returns (uint nextgreenId) {
        return currentGreenId.add(1);
    }
    

}
