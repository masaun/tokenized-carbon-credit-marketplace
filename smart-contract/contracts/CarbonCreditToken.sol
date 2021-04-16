// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CarbonCreditToken is ERC20, Ownable {

    constructor() public ERC20("Carbon Credit Token", "CCT") {
        uint initialSupply = 1e8 * 1e18;  /// 1 milion
        address initialReceiver = msg.sender;
        _mint(initialReceiver, initialSupply);
    }    

    function mint(address to, uint mintAmount) public onlyOwner returns (bool) {
        _mint(to, mintAmount);    
    }

}
