const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, './.env')});
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = process.env.MNEMONIC;
const apiKey = process.env.INFURA_API_KEY;
const Web3 = require("web3");
const web3 = new Web3();
const NonceTrackerSubprovider = require("web3-provider-engine/subproviders/nonce-tracker");


module.exports = {
    migrations_directory: "./migrations",
    solc: {
        optimizer: {
            enabled: true,
            runs: 500
        }
    },
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        },
        kovan:  {
            provider: () => new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/${process.env.INFURA_API_KEY}`),
            network_id: 42,
            gas: 1698712,
            gasPrice: 65000000000
        },
        ropsten:  {
            provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}`),
            network_id: 3,
            gas: 698712,
            gasPrice: 65000000000
        },
        rinkeby:  {
            provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`), 
            network_id: 4,
            gas: 698712,
            gasPrice: web3.toWei("3", "gwei"),
        },
        mainnet: {
            provider: () => {
                const nonceTracker = new NonceTrackerSubprovider();
                const wallet = new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`)
                wallet.engine._providers.unshift(nonceTracker);
                nonceTracker.setEngine(wallet.engine);
                return wallet;
            },
            gas: 698712,
            gasPrice: web3.toWei("3", "gwei"),
            network_id: "1",
        }
    }
};
