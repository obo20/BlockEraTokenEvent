const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

const fs = require('fs');
const FILENAME = path.resolve(__dirname, process.env.OUTPUT_FILENAME);
const delay = 15 * 1000 // 2 seconds

console.log(`Sending One transaction every ${delay / 1000} seconds`);


module.exports = (callback) => {
  let accounts = JSON.parse(fs.readFileSync(FILENAME, {encoding: "utf8"}));
  web3.eth.getCoinbase((err, coinbase) => {
    for(let i=0; i<accounts.length; i++) {
      wait(i).then(() => {
        web3.eth.sendTransaction({from: coinbase, to: accounts[i].public, value: process.env.INITIAL_WEI}, (err, res) => {
          if (err) console.error(err);
          console.log(`sent ${i+1}/${accounts.length} transactions with hash: ${res}`);
        })
      })
      .catch((e) => {
        console.log('THERE WAS AN ERROR, LOG WRITTEN TO error.log');
        fs.appendFileSync(path.resolve(__dirname, 'error.log'), `Account ${accounts[i].public} failed: ${e} \n`);
      });
    }
  });
}


function wait(i) {
  return new Promise((res, rej) => {
    return setTimeout(() => res(true), delay*i);
  });
}
