// SPDX-License-Identifier:GPl-3.0

pragma solidity ^0.8.0;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IFlashLoanSimpleReceiver} from "@aave/core-v3/contracts/flashloan/interfaces/IFlashLoanSimpleReceiver.sol";
import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {SafeMath} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/SafeMath.sol";

interface IFaucet {
    function mint(address _token, uint256 amount) external;
}

contract FlashLoanAAVE is IFlashLoanSimpleReceiver {
    using SafeMath for uint256;

    IPoolAddressesProvider public ADRESSES_PROVIDER = IPoolAddressesProvider(0xc4dCB5126a3AfEd129BC3668Ea19285A9f56D15D);
    IPool public POOL;
    IFaucet public FAUCET = IFaucet(0x1ca525Cd5Cb77DB5Fa9cBbA02A0824e283469DBe);

    constructor () {
        POOL = IPool(ADRESSES_PROVIDER.getPool());
    }

    function ADDRESSES_PROVIDER() external view returns(IPoolAddressesProvider){
        return ADRESSES_PROVIDER;
    }

    function executeFlashLoan(address asset, uint256 amount) public {
        // perform a flashLoanSimple() on the pool contract
        uint16 referralCode = 0;
        bytes memory params = "";

        POOL.flashLoanSimple(address(this), asset, amount, params, referralCode);
    }

    function executeOperation(address asset, uint256 amount, uint256 premium, address initiator, bytes calldata params) external override returns(bool) { //this will be called by Pool

        FAUCET.mint(asset, premium);
        uint amountOwed = amount.add(premium);
        IERC20(asset).approve(address(POOL), amountOwed);
        return true;
    }
}

// deployed on goerli using hardhat and the address is 0x6dc85a986Fbad7A60a2130D806F5bdF327BbD8f9