// SPDX-License-Identifier: GPl-3.0

pragma solidity ^0.8.0;

import {Comet} from "../compound-comet/comet/contracts/Comet.sol";
import {CometFactory} from "../compound-comet/comet/contracts/CometFactory.sol";
import {CometConfiguration} from "../compound-comet/comet/contracts/CometConfiguration.sol";
import {CErc20} from "../compound-protocol/compound-protocol/contracts/CErc20.sol";
import{ERC20} from "../compound-comet/comet/contracts/ERC20.sol";

contract CompoundSupplyAndRedeem is CometConfiguration {
    CErc20 public cToken = 0x07865c6E87B9F70255377e024ace6630C1Eaa37F; //USDC
    ERC20 public 

    function supply(uint amount) public {
        
    }
}