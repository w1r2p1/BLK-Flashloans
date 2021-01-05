require("dotenv").config()
const network = require("./config/config-networks")
const { web3, abis, addresses, chainId } = network.mainnet
const { kyber } = require("./config/config-providers")(web3, abis, addresses)
const { returnDaiWeth } = require("./pricing/uniswap")

const ONE_WEI = web3.utils.toBN(web3.utils.toWei("1"))
const bootstrap = async () => {
  let ethPrice

  const updateEthPrice = async () => {
    console.log(
      await kyber.methods
        .getExpectedRate(
          "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
          addresses.tokens.dai,
          1
        )
        .call()
    )
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

  const daiWeth = await returnDaiWeth(addresses, chainId)
  console.log(daiWeth)
}

bootstrap()
