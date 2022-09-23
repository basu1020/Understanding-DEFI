require('dotenv').config()
const {ethers, BigNumber } = require('ethers')
const { Token } = require('@uniswap/sdk-core')
const { Pool, Position, nearestUsableTick } = require('@uniswap/v3-sdk')
const { abi: IUniswapV3PoolABI } = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json")
const { abi: INonfungiblePositionManagerABI } = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json')

const ERC20ABI = require('../ERC20abi.json')

const ALCHEMY_TEST_URL = process.env.ALCHEMY_TEST_URL
const WALLET_SECRET = process.env.WALLET_SECRET
const WALLET_ADDRESS = process.env.WALLET_ADDRESS

const web3provider = new ethers.providers.JsonRpcProvider(ALCHEMY_TEST_URL)
const wallet = new ethers.Wallet(WALLET_SECRET)
const connectedWallet = wallet.connect(web3provider)

const poolAddress = '0x1d42064Fc4Beb5F8aAF85F4617AE8b3b5B8Bd801'
const FactoryAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const positionManagerAddress = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'

const name0 = 'Wrapped Ether'
const symbol0 = 'WETH'
const decimals0 = 18
const address0 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

const name1 = 'Uniswap Token'
const symbol1 = 'UNI'
const decimals1 = 18
const address1 = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'

const tokenContract0 = new ethers.Contract(address0, ERC20ABI, web3provider)
const tokenContract1 = new ethers.Contract(address1, ERC20ABI, web3provider)

const chainId = 5 // Goerli

const WethToken = new Token(chainId, address0, decimals0, symbol0, name0)
const UniToken = new Token(chainId, address1, decimals1, symbol1, name1)

const nonfungiblePositionManagerContract = new ethers.Contract(
  positionManagerAddress,
  INonfungiblePositionManagerABI,
  web3provider
)

const poolContract = new ethers.Contract(
  poolAddress,
  IUniswapV3PoolABI,
  web3provider
)

// const getPoolData = async (poolContract) => {
//   const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
//     poolContract.tickSpacing(),
//     poolContract.fee(),
//     poolContract.liquidity(),
//     poolContract.slot0(),
//   ])

//   return {
//     tickSpacing: tickSpacing,
//     fee: fee,
//     liquidity: liquidity,
//     sqrtPriceX96: slot0[0],
//     tick: slot0[1],
//   }
// }

const mainFunc = async () => {
  // const PoolData = await getPoolData(poolContract)
  let tickSpacing = 60
  let tick = -54253


  const weth_uni_pool = new Pool(
    WethToken,
    UniToken,
    3000,
    '5258559197145933583203749481',//PoolData.sqrtPriceX96.toString(),
    '150173840867267387442739',//PoolData.liquidity.toString(),
    tick, //PoolData.tick
  )

  const position = new Position({
    pool: weth_uni_pool,
    liquidity: ethers.utils.parseUnits('0.001', 18),
    tickLower: nearestUsableTick(tick, tickSpacing) - tickSpacing * 2,
    tickUpper: nearestUsableTick(tick, tickSpacing) + tickSpacing * 2,
  })

  // approving Postion Manager Contract
  const approvalAmount = ethers.utils.parseUnits('0.01', 18).toString()
  await tokenContract0.connect(connectedWallet).approve(
    positionManagerAddress,
    approvalAmount
  )
  await tokenContract1.connect(connectedWallet).approve(
    positionManagerAddress,
    approvalAmount
  )

  const { amount0: amount0Desired, amount1: amount1Desired } = position.mintAmounts

  params = {
    token0: address0,
    token1: address1,
    fee: 3000,
    tickLower: nearestUsableTick(tick, tickSpacing) - tickSpacing * 2,
    tickUpper: nearestUsableTick(tick, tickSpacing) + tickSpacing * 2,
    amount0Desired: amount0Desired.toString(),
    amount1Desired: amount1Desired.toString(),
    amount0Min: amount0Desired.toString(),
    amount1Min: amount1Desired.toString(),
    recipient: WALLET_ADDRESS,
    deadline: Math.floor(Date.now() / 1000) + (60 * 10)
  }

  nonfungiblePositionManagerContract.connect(connectedWallet).mint(
    params,
    { gasLimit: ethers.utils.hexlify(1000000) }
  ).then((res) => {
    console.log(res)
  })
}

mainFunc()