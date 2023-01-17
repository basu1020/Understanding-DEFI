// SPDX-License-Identifier: GPl-3.0

pragma solidity ^0.8.10;

import {Comet} from "../compound-comet/comet/contracts/Comet.sol";
import {CometFactory} from "../compound-comet/comet/contracts/CometFactory.sol";
import {CometConfiguration} from "../compound-comet/comet/contracts/CometConfiguration.sol";
import {CErc20} from "../compound-protocol/compound-protocol/contracts/CErc20.sol";
import{ERC20} from "../compound-comet/comet/contracts/ERC20.sol";

contract BorrowAndRepay {
    CErc20 public cToken = CErc20(0x3EE77595A8459e93C2888b13aDB354017B198188); //cUSDC
    ERC20 public token = ERC20(0x07865c6E87B9F70255377e024ace6630C1Eaa37F); //USDC

    function borrow(uint amount) external {
        
    }

    function repay(uint amount) external {

    }
}