// const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider")
var NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker")

const path = require("path")
require("dotenv").config()

console.log(process.env.INFURA_API_KEY)
module.exports = {
  contracts_build_directory: path.join(__dirname, "server/contracts"),

  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      // gas: 20000000,
      network_id: "*",
      skipDryRun: true,
    },
    ropsten: {
      provider: () => {
        var wallet = new HDWalletProvider(
          process.env.DEPLOYMENT_ACCOUNT_KEY,
          "https://ropsten.infura.io/v3/" + process.env.INFURA_API_KEY
        )
        var nonceTracker = new NonceTrackerSubprovider()
        wallet.engine._providers.unshift(nonceTracker)
        nonceTracker.setEngine(wallet.engine)
        return wallet
      },
      network_id: 3,
      gas: 5000000,
      gasPrice: 5000000000, // 5 Gwei
      skipDryRun: true,
    },
    kovan: {
      provider: () => {
        var wallet = new HDWalletProvider(
          process.env.DEPLOYMENT_ACCOUNT_KEY,
          "https://kovan.infura.io/v3/" + process.env.INFURA_API_KEY
        )
        var nonceTracker = new NonceTrackerSubprovider()
        wallet.engine._providers.unshift(nonceTracker)
        nonceTracker.setEngine(wallet.engine)
        return wallet
      },
      network_id: 42,
      gas: 5000000,
      gasPrice: 5000000000, // 5 Gwei
      skipDryRun: true,
    },
    mainnet: {
      provider: new HDWalletProvider(
        process.env.DEPLOYMENT_ACCOUNT_KEY,
        "https://mainnet.infura.io/v3/" + process.env.INFURA_API_KEY
      ),
      network_id: 1,
      gas: 5000000,
      gasPrice: 5000000000, // 5 Gwei
    },
  },
  compilers: {
    solc: {
      version: "^0.6.6",
    },
  },
}
