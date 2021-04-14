pragma solidity 0.6.12;

import { GreenNFTDataObjects } from "./GreenNFTDataObjects.sol";


// shared storage
contract GreenNFTDataStorages is GreenNFTDataObjects {

    Green[] public greens;

    Request[] public requests;

}

