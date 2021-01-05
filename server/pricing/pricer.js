const { Fetcher, TokenAmount } = require("@uniswap/sdk")

const queryPricing = async (web3, kyber, addresses, chainId) => {
  const AMOUNT_DAI_WEI = web3.utils.toBN(web3.utils.toWei("20000"))
  const ONE_WEI = web3.utils.toBN(web3.utils.toWei("1"))

  const { daiWeth, dai, weth } = await queryDaiAndWethData(addresses, chainId)
  const amountsEth = await Promise.all([
    kyber.methods
      .getExpectedRate(
        addresses.tokens.dai,
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        AMOUNT_DAI_WEI
      )
      .call(),

    daiWeth.getOutputAmount(new TokenAmount(dai, AMOUNT_DAI_WEI)),
  ])

  const ethFromKyber = AMOUNT_DAI_WEI.mul(
    web3.utils.toBN(amountsEth[0].expectedRate)
  ).div(ONE_WEI)

  const ethFromUniswap = web3.utils.toBN(amountsEth[1][0].raw.toString())

  const amountsDai = await Promise.all([
    kyber.methods
      .getExpectedRate(
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        addresses.tokens.dai,
        ethFromUniswap.toString()
      )
      .call(),
    daiWeth.getOutputAmount(new TokenAmount(weth, ethFromKyber.toString())),
  ])

  const daiFromKyber = ethFromUniswap
    .mul(web3.utils.toBN(amountsDai[0].expectedRate))
    .div(ONE_WEI)

  const daiFromUniswap = web3.utils.toBN(amountsDai[1][0].raw.toString())

  return {
    AMOUNT_DAI_WEI,
    ONE_WEI,
    daiFromKyber,
    daiFromUniswap,
  }
}

module.exports = { queryPricing }

async function queryDaiAndWethData(addresses, chainId) {
  const [dai, weth] = await Promise.all(
    [addresses.tokens.dai, addresses.tokens.weth].map((tokenAddress) =>
      Fetcher.fetchTokenData(chainId, tokenAddress)
    )
  )

  const daiWeth = await Fetcher.fetchPairData(dai, weth)
  return { daiWeth, dai, weth }
}
