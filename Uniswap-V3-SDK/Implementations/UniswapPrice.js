require('dotenv').config()
const { abi : IUniswapV3FactoryABI } = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json')
const { abi : QuoterABI } = require('@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json')
const { ethers } = require('ethers')

const ALCHEMY_TEST_URL_MAINNET = process.env.ALCHEMY_TEST_URL_MAINNET
const WALLET_ADDRESS = process.env.WALLET_ADDRESS
const WALLET_SECRET = process.env.WALLET_SECRET

const web3provider = new ethers.providers.JsonRpcProvider(ALCHEMY_TEST_URL_MAINNET)

const FactoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

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
    console.log(typeof poolAddress)

    //gettng Arithmetic Mean Tick
    const amountIn = ethers.utils.parseUnits(amount, 18)
    const quotedAmountOut = await QuoterContract.callStatic.quoteExactInputSingle(
        token0Address,
        token1Address,
        fee,
        amountIn,
        0
    )
    const amountOut = ethers.utils.formatUnits(quotedAmountOut, 6)
    console.log(amountOut)

    //getting Amounts Out
}

mainFunc(WETH, USDC, 3000, '1')


