const fs = require('fs');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});
const FILENAME = path.resolve(__dirname, process.env.OUTPUT_FILENAME);

console.log('checking balance, not frozen - just takes a moment');
module.exports = (callback) => {
  let accounts = JSON.parse(fs.readFileSync(FILENAME, {encoding: "utf8"}));
  console.log('-----------------');
  accounts.map((account, index) => {
    setTimeout(() => {
    let publicKey = account.public;
      web3.eth.getBalance(publicKey, (err, res) => {
        if(+res < process.env.INITIAL_WEI) console.log('error' + publicKey + ' does not have fund');
      });
    }, 200 * index);
  });
}
