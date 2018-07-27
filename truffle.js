require('dotenv').config({path: './../.env'});
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = process.env.MNEMONIC;

const Web3 = require("web3");
const web3 = new Web3();

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
        ropsten:  {
            provider: new HDWalletProvider(mnemonic, `https://ropsten.infura.io/${process.env.MNEMONIC}`),
            network_id: 3,
            gas: 698712,
            gasPrice: 65000000000
        },
        mainnet: {
            provider: new HDWalletProvider(mnemonic, `https://mainnet.infura.io/${process.env.MNEMONIC}`),
            gas: 698712,
            gasPrice: web3.toWei("3", "gwei"),
            network_id: "1",
        }
    }
};