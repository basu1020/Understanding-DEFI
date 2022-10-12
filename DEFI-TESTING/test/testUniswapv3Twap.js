const {ethers} = require('hardhat')

const FACTORY = '0x1F98431c8aD98523631AE4a59f267346ea31F984'

//DAI
const TOKEN_0 = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const DECIMALS_0 = 6n //we are making this a BigInt  

//WETH
const TOKEN_1 = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const DECIMALS_1 = 18n

//0x5E72d187505367976EE83010bAd667d39AcBA569

const FEE = 3000

describe('Uniswapv3Twap', () => {
    it("get price", async() => {
        const UniswapV3Twap = await ethers.getContractFactory("UniswapV3Twap")
        const twap = await UniswapV3Twap.deploy(FACTORY, TOKEN_0, TOKEN_1, FEE)
        await twap.deployed()
        
        const price = await twap.estimateAmountOut(TOKEN_1, 10n ** DECIMALS_1, 10)

        console.log(`the price of ETH in terms of DAI is - ${price.toNumber() / 10 ** 6}`)
    })
})

// called at the mainnet fork

