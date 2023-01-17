// SPDX-License-Identifier: GPl-3.0

pragma solidity ^0.8.10;

// import {Comet} from "../compound-comet/comet/contracts/Comet.sol";
// import {CometFactory} from "../compound-comet/comet/contracts/CometFactory.sol";
// import {CometConfiguration} from "../compound-comet/comet/contracts/CometConfiguration.sol";
import {CEther} from "../compound-protocol/compound-protocol/contracts/CEther.sol";
// import{ERC20} from "../compound-comet/comet/contracts/ERC20.sol";
import {Bulker} from "../compound-comet/comet/contracts/Bulker.sol";
import {IWETH9} from "../compound-comet/comet/contracts/IWETH9.sol";

contract CompoundSupplyAndRedeem {
    CEther public compEther = CEther(payable(0x3EE77595A8459e93C2888b13aDB354017B198188)); //cEther
    Bulker public bulker = Bulker(payable(0xf82AAB8ae0E7F6a2ecBfe2375841d83AeA4cb9cE)); //Bulker
    IWETH9 public wEth = IWETH9(payable(0x42a71137C09AE83D8d05974960fd607d40033499)); //WETH

    function supply() payable public {
        uint256 prevBalMsgSenderWeth = wEth.balanceOf(msg.sender);
        require(wEth.deposit{value: msg.value}() == 0, "Not today Son");
        uint256 afterBalMsgSenderWeth = wEth.balanceOf(msg.sender);
        wEth.approve(address(this, afterBalMsgSenderWeth - prevBalMsgSenderWeth));
    }

    // function getBalanceOfCtoken() public returns(uint256){
    //     return cToken.balanceOf(msg.sender);
    // }

    // function getBorrowBalance() public returns(uint256){
    //     return cToken.borrowBalanceCurrent(msg.sender);
    // }

    // function redeem(uint amount) external {
    //     cToken.transferFrom(msg.sender, address(this), amount);
    //     uint256 beforeRedeem = token.balanceOf(address(this));
    //     require(cToken.redeem(amount) == 0, "sh*t");
    //     uint256 afterRedeem = token.balanceOf(address(this));
    //     token.transfer(msg.sender, afterRedeem - beforeRedeem);
    // }
}