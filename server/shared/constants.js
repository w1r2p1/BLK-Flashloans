const network = require("../config/config-networks")
const { web3 } = network.mainnet

const ONE_WEI = web3.utils.toBN(web3.utils.toWei("1"))
const AMOUNT_DAI_WEI = web3.utils.toBN(web3.utils.toWei("20000"))

module.exports = { ONE_WEI, AMOUNT_DAI_WEI }
