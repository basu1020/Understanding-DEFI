// SPDX-License-Identifier: GPl-3.0

pragma solidity ^0.8.10;

import {Comet} from "../compound-comet/comet/contracts/Comet.sol";
import {CometFactory} from "../compound-comet/comet/contracts/CometFactory.sol";
import {CometConfiguration} from "../compound-comet/comet/contracts/CometConfiguration.sol";
import {CErc20} from "../compound-protocol/compound-protocol/contracts/CErc20.sol";
import{ERC20} from "../compound-comet/comet/contracts/ERC20.sol";

contract CompoundSupplyAndRedeem is CometConfiguration {
    CErc20 public cToken = CErc20(0x3EE77595A8459e93C2888b13aDB354017B198188); //cUSDC
    ERC20 public token = ERC20(0x07865c6E87B9F70255377e024ace6630C1Eaa37F); //USDC

    function supply(uint amount) external {
        token.transferFrom(msg.sender, address(this), amount);
        token.approve(address(cToken), amount);
        require(cToken.mint(amount) == 0, "Not today Son");
        cToken.transfer(msg.sender, amount);
    }

    function getBalanceOfCtoken() public returns(uint256){
        return cToken.balanceOf(msg.sender);
    }

    function redeem(uint amount) external {
        cToken.transferFrom(msg.sender, address(this), amount);
        uint256 beforeRedeem = token.balanceOf(address(this));
        require(cToken.redeem(amount) == 0, "sh*t");
        uint256 afterRedeem = token.balanceOf(address(this));
        token.transfer(msg.sender, afterRedeem - beforeRedeem);
    }
}