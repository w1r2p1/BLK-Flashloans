module.exports = (web3, abis, addresses) => {
  const kyber = new web3.eth.Contract(
    abis.kyberNetworkProxy,
    addresses.kyber.kyberNetworkProxy
  )

  return { kyber }
}
