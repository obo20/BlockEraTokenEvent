const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

const fs = require('fs');
const FILENAME = path.resolve(__dirname, process.env.OUTPUT_FILENAME);
const ERROR_FILENAME = path.resolve(__dirname, process.env.ERROR_FILENAME);
const FUNDED_ACCOUNTS_FILE = path.resolve(__dirname, process.env.FUNDED_ACCOUNTS_FILE);
const delay = 3 * 1000 // 2 seconds
let fundedAccounts = JSON.parse(fs.readFileSync(FUNDED_ACCOUNTS_FILE, {encoding: "utf8"}).toString());

module.exports = (callback) => {
    let accounts = JSON.parse(fs.readFileSync(FILENAME, {encoding: "utf8"}));
    web3.eth.getCoinbase(async (err, coinbase) => {
        for(let i=0; i<accounts.length; i++) {
            let fundedFlag = false;
            fundedAccounts.forEach( account => {
                if(account.address == accounts[i].public) {
                    fundedFlag = true;
                }
            });
            console.log(`${accounts[i].public} funded = ${fundedFlag}`)
            if(!fundedFlag) {
                await transferFunds(coinbase, accounts[i].public)
            }
        }
    });
}


function transferFunds(from, to, amount) {
    return new Promise((resolve, reject) => {
        web3.eth.sendTransaction({from, to, value: process.env.INITIAL_WEI}, (err, res) => {
            if (err) console.error(err);
            console.log(`sent ${to} funds with hash: ${res}`);
            confirmTransaction(to)
                .then(() => {
                    resolve(res)
                });
        })
    });
}

function confirmTransaction(address) {
    return new Promise((resolve, rej) => {
        let filter = web3.eth.filter('latest');
        filter.watch((err, res) => {
            if(!err) {
                web3.eth.getBalance(address, (err, res) => {
                    console.log('waiting...');
                    if(+res > 0) {
                        filter.stopWatching((err, res) => {
                            fundedAccounts.push({
                               address: address
                            });
                            fs.writeFile(FUNDED_ACCOUNTS_FILE, JSON.stringify(fundedAccounts));
                            console.log('included!');
                            resolve();
                        });
                    }
                });
            } else {
              console.log(err);
                fs.appendFileSync(ERROR_FILENAME, `address,\n`);
            }
        })
    });
}