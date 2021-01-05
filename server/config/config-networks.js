const { ChainId } = require("@uniswap/sdk")
const Web3 = require("web3")

const key = process.env.INFURA_API_KEY
const urls = {
  http: {
    mainnet: "https://mainnet.infura.io/v3/" + key,
    ropsten: "https://ropsten.infura.io/v3/" + key,
    kovan: "https://kovan.infura.io/v3/" + key,
  },
  ws: {
    mainnet: "wss://mainnet.infura.io/ws/v3/" + key,
    ropsten: "wss://ropsten.infura.io/ws/v3/" + key,
    kovan: "wss://kovan.infura.io/ws/v3/" + key,
  },
}

const addresses = require("./addresses")
const abis = require("./abis")

module.exports = {
  mainnet: {
    web3: new Web3(new Web3.providers.WebsocketProvider(urls.ws.mainnet)),
    addresses: addresses.mainnet,
    abis: abis.mainnet,
    chainId: ChainId.MAINNET,
  },
  kovan: {
    web3: new Web3(new Web3.providers.WebsocketProvider(urls.ws.kovan)),
    addresses: addresses.kovan,
    abis: abis.kovan,
    chainId: ChainId.KOVAN,
  },
}
