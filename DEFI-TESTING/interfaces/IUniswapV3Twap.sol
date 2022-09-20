//SPDX-License-Identifier: GPL-3.0

pragma solidity 0.7.6;

interface IUniswapV3Twap {
    function estimateAmountOut(
        address tokenIn,
        uint128 amountIn, 
        uint32 secondsAgo
    ) external view virtual returns (uint amountOut){}
}