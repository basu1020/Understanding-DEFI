const {ethers, artifacts} = require('hardhat')
const {expect} = require('chai')

const WETH9 = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const Decimal_01 = 18n
        
const DAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
const Decimal_02 = 18n

const swapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

describe("Implementing Swap on Uniswap V3", () => {
    it("Should swap tokens", async () => {

        const [owner] = await ethers.getSigners();

        const ContractInstance = await ethers.getContractFactory('UniswapV3Swap');
        const swapContract = await ContractInstance.deploy();
        
        const abi = [
            'function approve(address guy, uint wad) public returns(bool)',
            'function deposit() public payable',
            'function balanceOf(address account) public view returns(uint256)',
            'function withdraw(uint wad) public',
            'function allowance(address owner, address spender) public view returns (uint256)'
        ];

        const tokenWETH9 = new ethers.Contract(WETH9, abi, owner);
        
        const amountIn = "1";

        // const depositTx = await tokenWETH9.deposit({value: ethers.utils.parseEther(amountIn)})
        // await depositTx.wait()

        const balanceTx = await tokenWETH9.balanceOf(owner.address)
        console.log(balanceTx)

        const approveTx = await tokenWETH9.approve(swapContract.address, ethers.utils.parseEther(amountIn));
        await approveTx.wait()

        const ApprovalCheckingTx = await tokenWETH9.allowance(owner.address, swapContract.address)
        console.log(ApprovalCheckingTx)

        console.log(WETH9)
        console.log(typeof swapContract)
        console.log(ethers.utils.isAddress(WETH9))

        const AmountOut = await swapContract.swapExactInputSingle(ethers.utils.getAddress(WETH9), ethers.utils.getAddress(DAI), 3000, ethers.utils.parseEther(amountIn), 10, {gasLimit : 40000});
        AmountOut.wait()

        console.log(AmountOut);
    })
})