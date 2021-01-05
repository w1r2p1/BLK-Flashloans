const { Fetcher } = require("@uniswap/sdk")

const returnDaiWeth = async (addresses, chainId) => {
  const [dai, weth] = await Promise.all(
    [addresses.tokens.dai, addresses.tokens.weth].map((tokenAddress) =>
      Fetcher.fetchTokenData(chainId, tokenAddress)
    )
  )

  return await Fetcher.fetchPairData(dai, weth)
}
module.exports = { returnDaiWeth }
