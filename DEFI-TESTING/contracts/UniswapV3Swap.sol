//SPDX-License-Identifier: GPL-3.0;

pragma solidity 0.7.6;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';


contract UniswapV3Swap{

    ISwapRouter public immutable swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    uint24 public constant poolFee = 3000;

    // function safeTransferFrom(address token, address from, address to, uint256 value);

    function swapExactInputSingle(
        address _tokenIn,
        address _tokenOut,
        uint24 _fee,
        uint256 _amountIn,
        uint256 _deadline
        ) external returns (uint256 amountOut) {
        address payable msgSender = payable(msg.sender);

        TransferHelper.safeTransferFrom(_tokenIn, msgSender, address(this), _amountIn);
        
        TransferHelper.safeApprove(_tokenIn, address(swapRouter), _amountIn);

        ISwapRouter.ExactInputSingleParams memory params = 
            ISwapRouter.ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: _fee,
                recipient: msg.sender,
                deadline: _deadline,
                amountIn: _amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        
        amountOut = swapRouter.exactInputSingle(params);
    }

    /// @notice swapExactOutputSingle swaps a minimum possible amount of DAI for a fixed amount of WETH.
    /// @dev The calling address must approve this contract to spend its DAI for this function to succeed. As the amount of input DAI is variable,
    /// the calling address will need to approve for a slightly higher amount, anticipating some variance.
    /// @param amountOut The exact amount of WETH9 to receive from the swap.
    /// @param amountInMaximum The amount of DAI we are willing to spend to receive the specified amount of WETH9.
    /// @return amountIn The amount of DAI actually spent in the swap.

    // function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum) external returns (uint256 amountIn) {
    //     // Transfer the specified amount of DAI to this contract.
    //     TransferHelper.safeTransferFrom(DAI, msg.sender, address(this), amountInMaximum);

    //     // Approve the router to spend the specifed `amountInMaximum` of DAI.
    //     // In production, you should choose the maximum amount to spend based on oracles or other data sources to acheive a better swap.
    //     TransferHelper.safeApprove(DAI, address(swapRouter), amountInMaximum);

    //     ISwapRouter.ExactOutputSingleParams memory params =
    //         ISwapRouter.ExactOutputSingleParams({
    //             tokenIn: DAI,
    //             tokenOut: WETH9,
    //             fee: poolFee,
    //             recipient: msg.sender,
    //             deadline: block.timestamp,
    //             amountOut: amountOut,
    //             amountInMaximum: amountInMaximum,
    //             sqrtPriceLimitX96: 0
    //         });

    //     // Executes the swap returning the amountIn needed to spend to receive the desired amountOut.
    //     amountIn = swapRouter.exactOutputSingle(params);

    //     // For exact output swaps, the amountInMaximum may not have all been spent.
    //     // If the actual amount spent (amountIn) is less than the specified maximum amount, we must refund the msg.sender and approve the swapRouter to spend 0.
    //     if (amountIn < amountInMaximum) {
    //         TransferHelper.safeApprove(DAI, address(swapRouter), 0);
    //         TransferHelper.safeTransfer(DAI, msg.sender, amountInMaximum - amountIn);
    //     }
    // }
}