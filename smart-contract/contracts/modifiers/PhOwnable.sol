pragma solidity 0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";


contract PhOwnable is Ownable {

    // example
    modifier onlyStakingPerson(uint _time) { 
        require (now >= _time);
        _;
    }
    
}
