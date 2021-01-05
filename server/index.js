// # PLUGINS IMPORTS //
require("dotenv").config()
const { AMOUNT_DAI_WEI } = require("./shared/constants")
const { web3 } = require("./config/config-networks")

// # COMPONENTS IMPORTS //
const pricing = require("./functions/pricing")
const arbitrage = require("./functions/arbitrage")

/////////////////////////////////////////////////////////////////////////////

const bootstrap = async () => {
  // web3.eth.subscribe("newBlockHeaders").on("data", async (block) => {
  //   console.log(`New block received. Block # ${block.number}`)
  // })

  const { daiFromKyber, daiFromUniswap } = await pricing()

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
