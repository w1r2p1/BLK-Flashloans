require("dotenv").config()
const network = require("./config/config-networks")
const { web3 } = network.mainnet
const { queryPricing } = require("./pricing")
const { AMOUNT_DAI_WEI, ONE_WEI } = require("./shared/constants")

const arbitrage = require("./arbitrage")

const bootstrap = async () => {
  // web3.eth.subscribe("newBlockHeaders").on("data", async (block) => {
  //   console.log(`New block received. Block # ${block.number}`)
  // })

  const { daiFromKyber, daiFromUniswap } = await queryPricing()

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

  arbitrage(daiFromUniswap, daiFromKyber)
}

bootstrap()
