const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

const fs = require('fs');
const FILENAME = path.resolve(__dirname, process.env.OUTPUT_FILENAME);
const delay = 15 * 1000 // 2 seconds

module.exports = (callback) => {
  let accounts = JSON.parse(fs.readFileSync(FILENAME, {encoding: "utf8"}));
  web3.eth.getCoinbase(async (err, coinbase) => {
    for(let i=0; i<accounts.length; i++) {
      await transferFunds(coinbase, accounts[i].public)
    };
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
          console.log('wasnt included in this block');
          if(+res > 0) {
            filter.stopWatching((err, res) => {
              console.log('included!');
              resolve();
            });
          }
        });
      }
    })
  });
}
