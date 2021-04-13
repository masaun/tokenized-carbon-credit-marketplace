pragma solidity 0.6.12;

import { PhotoNFTDataObjects } from "./PhotoNFTDataObjects.sol";


// shared storage
contract PhotoNFTDataStorages is PhotoNFTDataObjects {

    Photo[] public photos;

}

