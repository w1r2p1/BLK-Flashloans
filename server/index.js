require("dotenv").config()
const network = require("./config/config-networks")
const { web3, abis, addresses, chainId } = network.mainnet
const { kyber } = require("./config/config-providers")(web3, abis, addresses)
const { queryPricing } = require("./pricing/pricer")

const arbitrage = require("./arbitrage")

const bootstrap = async () => {
  // web3.eth.subscribe("newBlockHeaders").on("data", async (block) => {
  //   console.log(`New block received. Block # ${block.number}`)
  // })

  const {
    AMOUNT_DAI_WEI,
    ONE_WEI,
    daiFromKyber,
    daiFromUniswap,
  } = await queryPricing(web3, kyber, addresses, chainId)

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

  arbitrage(
    web3,
    kyber,
    addresses,
    daiFromUniswap,
    daiFromKyber,
    AMOUNT_DAI_WEI,
    ONE_WEI
  )
}

bootstrap()
