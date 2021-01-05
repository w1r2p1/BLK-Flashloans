module.exports = async (daiFromUniswap, daiFromKyber) => {
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
