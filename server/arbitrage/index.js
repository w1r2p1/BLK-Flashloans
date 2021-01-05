const network = require("../config/config-networks")
const { web3, abis, addresses } = network.mainnet
const { kyber } = require("../config/config-providers")(web3, abis, addresses)
const { AMOUNT_DAI_WEI, ONE_WEI } = require("../shared/constants")

const DIRECTION = {
  KYBER_TO_UNISWAP: 0,
  UNISWAP_TO_KYBER: 1,
}

module.exports = async (daiFromUniswap, daiFromKyber) => {
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

  if (daiFromUniswap.gt(AMOUNT_DAI_WEI)) {
    const tx = flashloan.methods.initiateFlashloan(
      addresses.dydx.solo,
      addresses.tokens.dai,
      AMOUNT_DAI_WEI,
      DIRECTION.KYBER_TO_UNISWAP
    )
    const [gasPrice, gasCost] = await Promise.all([
      web3.eth.getGasPrice(),
      tx.estimateGas({ from: admin }),
    ])

    const txCost = web3.utils
      .toBN(gasCost)
      .mul(web3.utils.toBN(gasPrice))
      .mul(ethPrice)

    const profit = daiFromUniswap.sub(AMOUNT_DAI_WEI).sub(txCost)

    if (profit > 0) {
      console.log("Arb opportunity found Kyber -> Uniswap!")
      console.log(`Expected profit: ${web3.utils.fromWei(profit)} Dai`)
      const data = tx.encodeABI()
      const txData = {
        from: admin,
        to: flashloan.options.address,
        data,
        gas: gasCost,
        gasPrice,
      }
      const receipt = await web3.eth.sendTransaction(txData)
      console.log(`Transaction hash: ${receipt.transactionHash}`)
    }
  }

  if (daiFromKyber.gt(AMOUNT_DAI_WEI)) {
    const tx = flashloan.methods.initiateFlashloan(
      addresses.dydx.solo,
      addresses.tokens.dai,
      AMOUNT_DAI_WEI,
      DIRECTION.UNISWAP_TO_KYBER
    )
    const [gasPrice, gasCost] = await Promise.all([
      web3.eth.getGasPrice(),
      tx.estimateGas({ from: admin }),
    ])
    const txCost = web3.utils
      .toBN(gasCost)
      .mul(web3.utils.toBN(gasPrice))
      .mul(ethPrice)
    const profit = daiFromKyber.sub(AMOUNT_DAI_WEI).sub(txCost)

    if (profit > 0) {
      console.log("Arb opportunity found Uniswap -> Kyber!")
      console.log(`Expected profit: ${web3.utils.fromWei(profit)} Dai`)
      const data = tx.encodeABI()
      const txData = {
        from: admin,
        to: flashloan.options.address,
        data,
        gas: gasCost,
        gasPrice,
      }
      const receipt = await web3.eth.sendTransaction(txData)
      console.log(`Transaction hash: ${receipt.transactionHash}`)
    }
  }
}
