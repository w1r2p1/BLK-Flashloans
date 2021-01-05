require("dotenv").config()
const network = require("./config/config-networks")
const { web3, abis, addresses, chainId } = network.mainnet
const { kyber } = require("./config/config-providers")(web3, abis, addresses)
const { queryDaiAndWethData } = require("./pricing/uniswap")
const { TokenAmount } = require("@uniswap/sdk")

const ONE_WEI = web3.utils.toBN(web3.utils.toWei("1"))
const AMOUNT_DAI_WEI = web3.utils.toBN(web3.utils.toWei("20000"))
const DIRECTION = {
  KYBER_TO_UNISWAP: 0,
  UNISWAP_TO_KYBER: 1,
}

const bootstrap = async () => {
  let ethPrice

  const updateEthPrice = async () => {
    const results = await kyber.methods
      .getExpectedRate(
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        addresses.tokens.dai,
        1
      )
      .call()

    ethPrice = web3.utils
      .toBN("1")
      .mul(web3.utils.toBN(results.expectedRate))
      .div(ONE_WEI)
  }

  await updateEthPrice()
  setInterval(updateEthPrice, 15000)

  // web3.eth.subscribe("newBlockHeaders").on("data", async (block) => {
  //   console.log(`New block received. Block # ${block.number}`)
  // })

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

  console.log(
    `Kyber -> Uniswap. Dai input / output: ${web3.utils.fromWei(
      AMOUNT_DAI_WEI.toString()
    )} / ${web3.utils.fromWei(daiFromUniswap.toString())}`
  )
  console.log(
    `Uniswap -> Kyber. Dai input / output: ${web3.utils.fromWei(
      AMOUNT_DAI_WEI.toString()
    )} / ${web3.utils.fromWei(daiFromKyber.toString())}`
  )
}

bootstrap()
