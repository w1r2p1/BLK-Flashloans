// # PLUGINS IMPORTS //
require("dotenv").config()
const { web3 } = require("./config/config-networks")

// # COMPONENTS IMPORTS //
const { pricing, arbitrage } = require("./functions")
const { AMOUNT_DAI_WEI } = require("./shared/constants")

/////////////////////////////////////////////////////////////////////////////

const bootstrap = async () => {
  console.log("STAAAARTED!!")

  web3.eth.subscribe("newBlockHeaders").on("data", async (block) => {
    console.log(`New block received. Block # ${block.number}`)

    const { daiFromUniswap, daiFromKyber } = await pricing()
    logger(daiFromUniswap, daiFromKyber)
    arbitrage(daiFromUniswap, daiFromKyber)
  })
}

bootstrap()

function logger(daiFromUniswap, daiFromKyber) {
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
