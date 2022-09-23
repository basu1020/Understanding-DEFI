const axios = require('axios')
const URL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
require('dotenv').config()
const { ethers } = require('ethers')
const {abi: INonfungiblePositionManagerABI} = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json')

TOKEN_ID_QUERY = `
{
    positions(where: {
        owner: "0x11e4857bb9993a50c685a79afad4e6f65d518dda",
        pool: "0x6c6bc977e13df9b0de53b251522280bb72383700"
    }) {
        id
        owner
    }
}
`

const ALCHEMY_TEST_URL = process.env.ALCHEMY_TEST_URL
const web3Provider = new ethers.providers.JsonRpcBatchProvider(ALCHEMY_TEST_URL)
const positionManagerAddress = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'

async function mainFunc(){
    const result = await axios.post(URL, {query: TOKEN_ID_QUERY})
    const positions = result.data.data.positions
    console.log('positions', positions)

    const nonfungiblePositionManagerContract = new ethers.Contract(
        positionManagerAddress,
        INonfungiblePositionManagerABI,
        web3Provider
    )

    positions.map(p => {
        nonfungiblePositionManagerContract.positions(p.id).then(res => console.log(res))
    })
}


mainFunc()