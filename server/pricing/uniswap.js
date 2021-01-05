const { Fetcher } = require("@uniswap/sdk")

const queryDaiAndWethData = async (addresses, chainId) => {
  const [dai, weth] = await Promise.all(
    [addresses.tokens.dai, addresses.tokens.weth].map((tokenAddress) =>
      Fetcher.fetchTokenData(chainId, tokenAddress)
    )
  )

  const daiWeth = await Fetcher.fetchPairData(dai, weth)
  return { daiWeth, dai, weth }
}
module.exports = { queryDaiAndWethData }
