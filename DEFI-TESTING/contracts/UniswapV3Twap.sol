//SPDX-License-Identifier: GPL-3.0

pragma solidity 0.7.6;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol";


contract UniswapV3Twap {
    address public token0;
    address public token1;
    address public pool;

    constructor(address _uniswapFactory_, address _token0, address _token1, uint24 fee) {   
        token0 = _token0;
        token1 = _token1;
        address _pool = IUniswapV3Factory(_uniswapFactory_).getPool(token0, token1, fee);     
        require(_pool != address(0), "pool doesn't exist");
        pool = _pool;
    }

    function estimateAmountOut(
        address tokenIn,
        uint128 amountIn, 
        uint32 secondsAgo
    ) external view virtual returns (uint amountOut){
        require(tokenIn == token0 || tokenIn == token1, "invalid token");
        address tokenOut = tokenIn == token1 ? token1 : token0;
        (int24 arithmeticMeanTick, ) = OracleLibrary.consult(pool, secondsAgo);
        amountOut = OracleLibrary.getQuoteAtTick(arithmeticMeanTick, amountIn, tokenIn, tokenOut);
    }
}