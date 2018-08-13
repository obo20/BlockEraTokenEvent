const Wallet = require('ethers').Wallet;
const fs = require('fs');
const path = require('path');


require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

module.exports = (callback) => {

  const COLORS = process.env.COLORS.split(',');
  const NAMES = process.env.NAMES.split(',');

  //this file has all the needed json info
  const FILENAME = path.resolve(__dirname, process.env.OUTPUT_FILENAME);

  //this file simply has comma separated private keys
  const PRIVATE_FILENAME = path.resolve(__dirname, process.env.OUTPUT_PRIVATE_FILENAME);

  fs.writeFileSync(FILENAME, '[\n');

  COLORS.map((color, colorIndex) => {
    NAMES.map((name, nameIndex) => {
      let wallet = Wallet.createRandom();
      let index = (colorIndex * NAMES.length) + nameIndex + 1;
      let account = {
        id: index,
        public: wallet.address,
        private: wallet.privateKey,
        color: color,
        name: name
      };
      fs.appendFileSync(FILENAME, JSON.stringify(account));
      fs.appendFileSync(PRIVATE_FILENAME, `${account.private}, ${account.color} ${account.name}`);
      (index != COLORS.length * NAMES.length) ? fs.appendFileSync(FILENAME, ',\n') : '';
      (index != COLORS.length * NAMES.length) ? fs.appendFileSync(PRIVATE_FILENAME, ',\n') : '';
    });
    console.log(`wrote ${NAMES.length} keys to file ${FILENAME}`);
  });


  fs.appendFileSync(FILENAME, ']');
}
