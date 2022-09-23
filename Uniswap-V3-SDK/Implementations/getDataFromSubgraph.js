const axios = require('axios')

const URL = ' https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'

query = `
{
    pools(order: volumeUSD, orderDirection: desc, first: 10){
        id,
        volumeUSD,
        liquidity
        totalValueLockedUSD
        token0 {
            symbol
        }
        token1 {
            symbol
        }
    }
}
`

axios.post(URL, {query: query}).then((result) => {
    console.log(result.data.data)
})
