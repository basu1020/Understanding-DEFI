require('dotenv').config()
const { AlphaRouter } = require('@uniswap/smart-order-router')
const {Token,
    CurrencyAmount,
    TradeType,
    Percent 
} = require('@uniswap/sdk-core')
const { ethers, 
    BigNumber 
} = require('ethers')
const JSBI = require('jsbi')
const ERC20ABI = require('./abi.json')

const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'

const WALLET_ADDRESS = process.env.WALLET_ADDRESS
const WALLET_SECRET = process.env.WALLET_SECRET
const ALCHEMY_TEST_URL = process.env.ALCHEMY_TEST_URL

const web3Provider = new ethers.providers.JsonRpcProvider(ALCHEMY_TEST_URL)
const chainId = 5

//initiating router
const router = new AlphaRouter({
    chainId: chainId,
    provider: web3Provider
})

const name0 = 'WETH Token'
const symbol0 = 'WETH'
const decimals0 = 18
const address0 = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'

const name1 = 'Uniswap token'
const symbol1 = 'UNI'
const decimals1 = 18
const address1 = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'

const WETH = new Token(chainId, address0, decimals0, symbol0, name0)
const UNI = new Token(chainId, address1, decimals1, symbol1, name1)

const wei = ethers.utils.parseUnits('0.001', 18)
const inputAmmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei))

async function main () {

    // Calling route : The route method returns all the swap calldata and gas information needed for submitting an optimal swap to the chain.
    const route = await router.route (
        inputAmmount,
        UNI,
        TradeType.EXACT_INPUT,
        {
            recipient: WALLET_ADDRESS,
            slippageTolerance: new Percent(25, 100),
            deadline: Math.floor(Date.now()/1000 + 1800)
        }
    )

    // displaying some information dervied from route. 
    console.log("Gas",BigNumber.from(route.gasPriceWei)) // gasInfo
    console.log("Trade Pairs", route.trade) // Trading pair
    console.log("Amount of Sent Token", route.quote)
    console.log("Route", route.route)

    // preparing transaction object
    const transaction = {
        data: route.methodParameters.calldata,
        to: V3_SWAP_ROUTER_ADDRESS,
        value: BigNumber.from(route.methodParameters.value),
        from: WALLET_ADDRESS,
        gasPrice: BigNumber.from(route.gasPriceWei),
        gasLimit: ethers.utils.hexlify(1000000)
    } 

    // connecting wallet
    const wallet = new ethers.Wallet(WALLET_SECRET)
    const connectedWallet = wallet.connect(web3Provider)

    // approving the V3 router for WETH token. 
    const approvalAmount = ethers.utils.parseUnits('0.001', 18).toString()
    const contract0 = new ethers.Contract(address0, ERC20ABI, web3Provider)
    await contract0.connect(connectedWallet).approve(
        V3_SWAP_ROUTER_ADDRESS,
        approvalAmount
    )

    //sending the Transaction
    await connectedWallet.sendTransaction(transaction)
    // tradeTransaction.wait()
} 

main()