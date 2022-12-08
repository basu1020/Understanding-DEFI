// SPDX-License-Identifier:GPl-3.0

pragma solidity ^0.8.0;

// import IPool interface here
// import the asset's Interface here
// import IFLashLoanSimpleReceiver.sol and inherit the contract with it.
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IFlashLoanSimpleReceiver} from "@aave/core-v3/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IPoolAddressesProviderRegistry} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProviderRegistry.sol";

abstract contract FlashLoanAAVE is IFlashLoanSimpleReceiver {

    address asset = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    address poolAddress = 0x326C977E6efc84E512bB9C30f76E30c160eD06FB;
    uint256 public count = 0;

    function executeFlashLoan() public {
        // perform a flashLoanSimple() on the pool contract
        count += 1;

    }

    function getPremium() public {
        // call FLASHLOAN_PREMIUM_TOTAL from the pool 
    }

    function executeOperation() public { //this will be called by Pool

        // approve the Pool for the flashloan amount + premium
        // we have to give 0.09% of the amount borrowed to the Pool

    }
}