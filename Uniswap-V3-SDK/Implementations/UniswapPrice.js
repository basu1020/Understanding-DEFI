require('dotenv').config()
const { abi : IUniswapV3FactoryABI } = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json')
const { abi : QuoterABI } = require('@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json')
const { ethers } = require('ethers')

const ALCHEMY_TEST_URL = process.env.ALCHEMY_TEST_URL
const WALLET_ADDRESS = process.env.WALLET_ADDRESS
const WALLET_SECRET = process.env.WALLET_SECRET

const web3provider = new ethers.providers.JsonRpcProvider(ALCHEMY_TEST_URL)

const FactoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
const WETH = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
const LINK = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
const DAI = '0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60'
const UNI = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
const USDC = '0x07865c6e87b9f70255377e024ace6630c1eaa37f'

const FactoryContract = new ethers.Contract(
    FactoryAddress,
    IUniswapV3FactoryABI,
    web3provider
)

const QuoterContract = new ethers.Contract(
    quoterAddress,
    QuoterABI,
    web3provider
)

const wallet = new ethers.Wallet(WALLET_SECRET)
const connectedWallet = wallet.connect(web3provider)

const mainFunc = async (token0Address, token1Address, fee, amount) => {

    //getting Pool Address 
    const poolAddress = await FactoryContract.connect(connectedWallet).getPool(token0Address, token1Address, fee)
    console.log(poolAddress)

    //gettng Arithmetic Mean Tick
    const amountIn = ethers.utils.parseUnits(amount, 18)
    const quotedAmountOut = await QuoterContract.callStatic.quoteExactInputSingle(
        token0Address,
        token1Address,
        fee,
        amountIn,
        0
    )
    const amountOut = ethers.utils.formatUnits(quotedAmountOut, 18)
    console.log(amountOut)

    //getting Amounts Out
}

mainFunc(WETH, UNI, 3000, '1')
// mainFunc(WETH, DAI, 3000, '1')
// mainFunc(WETH, LINK, 3000, '1') 
// mainFunc(LINK, USDC, 3000, '1')
// mainFunc(UNI, DAI, 3000, '1')
// mainFunc(UNI, USDC, 3000, '1') 




