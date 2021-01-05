const { Fetcher, TokenAmount } = require("@uniswap/sdk")

const network = require("../config/config-networks")
const { web3, abis, addresses, chainId } = network.mainnet
const { kyber } = require("../config/config-providers")(web3, abis, addresses)

const ONE_WEI = web3.utils.toBN(web3.utils.toWei("1"))
const AMOUNT_DAI_WEI = web3.utils.toBN(web3.utils.toWei("20000"))
const queryPricing = async () => {
  const { daiWeth, dai, weth } = await queryDaiAndWethData(addresses, chainId)

  ////////
  const { ethFromKyber, ethFromUniswap } = await getETH(daiWeth, dai)

  ////// / / // /////
  const kyberDAIAmount = await kyber.methods
    .getExpectedRate(
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      addresses.tokens.dai,
      ethFromUniswap.toString()
    )
    .call()

  const uniswapDAIAmount = daiWeth.getOutputAmount(
    new TokenAmount(weth, ethFromKyber.toString())
  )

  const daiFromKyber = ethFromUniswap
    .mul(web3.utils.toBN(kyberDAIAmount.expectedRate))
    .div(ONE_WEI)

  const daiFromUniswap = web3.utils.toBN(uniswapDAIAmount[0].raw.toString())

  return {
    AMOUNT_DAI_WEI,
    ONE_WEI,
    daiFromKyber,
    daiFromUniswap,
  }
}

module.exports = { queryPricing }

async function getETH(daiWeth, dai) {
  const kyberETHAmount = await kyber.methods
    .getExpectedRate(
      addresses.tokens.dai,
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      AMOUNT_DAI_WEI
    )
    .call()

  const uniswapETHAmount = await daiWeth.getOutputAmount(
    new TokenAmount(dai, AMOUNT_DAI_WEI)
  )

  const ethFromKyber = AMOUNT_DAI_WEI.mul(
    web3.utils.toBN(kyberETHAmount.expectedRate)
  ).div(ONE_WEI)

  const ethFromUniswap = web3.utils.toBN(uniswapETHAmount[0].raw.toString())

  return { ethFromKyber, ethFromUniswap }
}

async function queryDaiAndWethData(addresses, chainId) {
  const [dai, weth] = await Promise.all(
    [addresses.tokens.dai, addresses.tokens.weth].map((tokenAddress) =>
      Fetcher.fetchTokenData(chainId, tokenAddress)
    )
  )

  const daiWeth = await Fetcher.fetchPairData(dai, weth)
  return { daiWeth, dai, weth }
}