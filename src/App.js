import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import contract from 'truffle-contract'
import NEXTContract from '../build/contracts/DetailedERC20.json'
import { nextWallets } from './deploy/wallets';

import { Switch } from "@blueprintjs/core";
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

const nextMartini = require('./images/martini.png');
const nextCoinMarkets = require('./images/coinMarkets.png');
const nextICOs = require('./images/ico.png');
const nextSVS = require('./images/svs.png');
const nextFarming = require('./images/silo.png');
const nextWallet = require('./images/wallet.png');
const barWallet = nextWallets.find((wallet) => {
    return wallet.id === 'bar';
});

//animals
//new animals
const nextButterfly = require('./images/butterfly.png');
const nextRaccoon = require('./images/raccoon.jpg');
const nextDragon = require('./images/dragon.jpg');
const nextMoose = require('./images/moose.png');
const nextShark = require('./images/shark.png');
const nextGiraffe = require('./images/giraffe.png');
const nextMouse = require('./images/mouse.png');
const nextFrog = require('./images/frog.png');
const nextBat = require('./images/bat.png');
const nextBear = require('./images/bear.png');
const nextPig = require('./images/pig.png');

//old animals
const nextTiger = require('./images/tiger.png');
const nextElephant = require('./images/elephant.png');
const nextDog = require('./images/dog.png');
const nextSnake = require('./images/snake.png');
const nextRabbit = require('./images/rabbit.png');
const nextPanda = require('./images/panda.png');
const nextBird = require('./images/bird.png');
const nextFish = require('./images/fish.png');
const nextSquirrel = require('./images/squirrel.png');
const nextTurtle = require('./images/turtle.png');
const nextHorse = require('./images/horse.png');
const nextCow = require('./images/cow.png');
const nextChicken = require('./images/chicken.png');
const nextMonkey = require('./images/nextMonkey.png');
const nextSnail = require('./images/snail.png');


const startBlock = 5292900;
let checkingFlag = false; //makes sure we're not already checking for events

class App extends Component {
    constructor(props) {
    super(props);
    this.getTransactionList = this.getTransactionList.bind(this);
    this.checkForNewTransactions = this.checkForNewTransactions.bind(this);
    this.getColoredDiv = this.getColoredDiv.bind(this);
    this.getColorHex = this.getColorHex.bind(this);
    this.getAddressImage = this.getAddressImage.bind(this);
    this.toggleBarFilter = this.toggleBarFilter.bind(this);

    this.state = {
        blockNumber: startBlock,
        lastBlockChecked: startBlock,
        web3: null,
        transactions: [],
        barFilter: false
    };
    }

    componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

        getWeb3.then(results => {
          this.setState({
            web3: results.web3
          });

          // Instantiate contract once web3 provided.
          this.instantiateContract()
        })
        .catch(() => {
          console.log('Error finding web3.')
        })
    }

    instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */


      const nextToken = contract(NEXTContract);
      nextToken.setProvider(this.state.web3.currentProvider);
      //
      this.state.web3.eth.getAccounts(() => {
          nextToken.deployed().then((instance) => {

              const abi = instance.abi;
              const contractAtABI = this.state.web3.eth.contract(abi);
              const contractAtAddress = contractAtABI.at(instance.address);

              setInterval(function(){
                  this.checkForNewTransactions(contractAtAddress);
              }.bind(this), 5000);
          });
      });
    }

    checkForNewTransactions(contractAtAddress) {
        if(checkingFlag === true) {
            return;
        }
        let event = contractAtAddress.Transfer({},{fromBlock: this.state.blockNumber, toBlock: 'latest'});
        checkingFlag = true;
        event.get(function(error, result) {
            if(error) {
                console.log(error);
            } else {
                //THIS LINE IS SUSPICIOUS. DOUBLE TEST BEFORE LAUNCH IF YOU HAVE TIME
                if(result.length) {
                    console.log('new transfer', result);
                    const stateTransactionsCopy = this.state.transactions;
                    result.forEach((transaction) => {
                        stateTransactionsCopy.push(transaction);
                    });
                    const sorted = stateTransactionsCopy.sort(function (a, b) {
                        return a.blockNumber - b.blockNumber;
                    });
                    console.log(sorted);
                    this.setState({
                        transactions: sorted,
                        blockNumber: sorted[sorted.length - 1].blockNumber + 1,
                        lastBlockChecked: this.state.blockNumber
                    });
                }
                checkingFlag = false;
            }
        }.bind(this));
    }

    componentDidMount() {
      console.log('mounted');
    }

    getColorHex(color) {
        switch (color) {
            case 'Purple':
                return {
                    backgroundColor: '#8E44AD',
                    textColor: '#000000'
                };
            case 'Orange':
                return {
                    backgroundColor: '#F39C12',
                    textColor: '#000000'
                };
            case 'Red':
                return {
                    backgroundColor: '#FF3333',
                    textColor: '#000000'
                };
            case 'Blue':
                return {
                    backgroundColor: '#33BFFF',
                    textColor: '#000000'
                };
            case 'Green':
                return {
                    backgroundColor: '#2DE24B',
                    textColor: '#000000'
                };
            case 'Brown':
                return {
                    backgroundColor: '#7E5109',
                    textColor: '#000000'
                };
            case 'Teal':
                return {
                    backgroundColor: '#41f4df',
                    textColor: '#000000'
                };
            case 'Black':
                return {
                    backgroundColor: '#000000',
                    textColor: '#FFFFFF'
                };
            case 'Yellow':
                return {
                    backgroundColor: '#F7FF33',
                    textColor: '#000000'
                };
            case 'Gray':
                return {
                    backgroundColor: '#808B96',
                    textColor: '#000000'
                };
            default:
                return {
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000'
                };
        }
    }

    getAddressImage(walletName) {
        switch (walletName) {
            case 'The Bar':
                return nextMartini;
            case 'CoinMarkets':
                return nextCoinMarkets;
            case 'ICOs':
                return nextICOs;
            case 'Simple Vet Solutions':
                return nextSVS;
            case 'CryptoFarming':
                return nextFarming;
            case 'Digital Wallet Help':
                return nextWallet;
            case 'Butterfly':
                return nextButterfly;
            case 'Raccoon':
                return nextRaccoon;
            case 'Dragon':
                return nextDragon;
            case 'Moose':
                return nextMoose;
            case 'Shark':
                return nextShark;
            case 'Giraffe':
                return nextGiraffe;
            case 'Mouse':
                return nextMouse;
            case 'Frog':
                return nextFrog;
            case 'Bat':
                return nextBat;
            case 'Bear':
                return nextBear;
            case 'Pig':
                return nextPig;
            case 'Tiger':
                return nextTiger;
            case 'Elephant':
                return nextElephant;
            case 'Dog':
                return nextDog;
            case 'Snake':
                return nextSnake;
            case 'Rabbit':
                return nextRabbit;
            case 'Panda':
                return nextPanda;
            case 'Bird':
                return nextBird;
            case 'Fish':
                return nextFish;
            case 'Squirrel':
                return nextSquirrel;
            case 'Turtle':
                return nextTurtle;
            case 'Horse':
                return nextHorse;
            case 'Cow':
                return nextCow;
            case 'Chicken':
                return nextChicken;
            case 'Monkey':
                return nextMonkey;
            case 'Snail':
                return nextSnail;
            default:
                return nextTiger;
        }
    }

    getColoredDiv(walletMatch, isSender) {

        if(isSender === true) {
            return(
                <div style={{
                    width: 100,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                    backgroundColor: this.getColorHex(walletMatch.color).backgroundColor}}>
                    <div style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center' }}>
                        <img src={this.getAddressImage(walletMatch.name)}></img>
                    </div>
                </div>
            );
        } else {
            return(
                <div style={{
                    width: 100,
                    height: 79,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                    backgroundColor: this.getColorHex(walletMatch.color).backgroundColor}}>
                    <div style={{
                        width: 70,
                        height: 70,
                        borderRadius: 35,
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center' }}>
                        <img src={this.getAddressImage(walletMatch.name)}></img>
                    </div>
                </div>
            );
        }
    }

    getTransactionList() {
      const transactions = [];
      this.state.transactions.reverse().forEach((transaction) => {

          const senderMatch = nextWallets.find((wallet) => {
              return transaction.args.from.toLowerCase() === wallet.public.toLowerCase();
          });

          const receiverMatch = nextWallets.find((wallet) => {
              return transaction.args.to.toLowerCase() === wallet.public.toLowerCase();
          });

          if( senderMatch && receiverMatch && (!this.state.barFilter || (this.state.barFilter && receiverMatch.public === barWallet.public)) && transactions.length < 20) {
              transactions.push(
                  <div key={transaction.transactionHash}>
                      <div style={{display: 'flex', border: '1.1px solid black', borderRadius: 25, marginBottom: 5, justifyContent: 'space-between'}}>
                          <div style={{ display: 'flex', justifyContent: 'flex-start', width: 500}}>
                              {this.getColoredDiv(senderMatch, true)}
                              <div style={{height: 80, fontSize: 20, marginLeft: 10, display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                                  {`${senderMatch.color} ${senderMatch.name}`}
                              </div>
                          </div>
                          <div style={{width: 100, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40}}>
                              {transaction.args.value.toNumber()}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', width: 500}}>
                              <div style={{height: 80, fontSize: 20, marginRight: 10, display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                                  {`${receiverMatch.color} ${receiverMatch.name}`}
                              </div>
                              {this.getColoredDiv(receiverMatch, false)}
                          </div>
                      </div>
                  </div>
              )
          }
      });
        return transactions;
    }

    toggleBarFilter() {
        const newBarFilterState = !this.state.barFilter;
        this.setState({
            barFilter: newBarFilterState
        })
    }

    render() {
    const transactionList = this.getTransactionList();
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFFFFF'}}>
                <div >NEXT Society Bar Feed</div>
                <div>
                    <Switch checked={this.state.barFilter} label="Bar Filter" onChange={this.toggleBarFilter} />
                </div>
            </div>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <div style={{marginTop: 10}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, marginBottom: 5}}>
                      <div>
                          Sender
                      </div>
                      <div>
                          NEXT Tokens (2 per drink)
                      </div>
                      <div>
                          Receiver
                      </div>
                  </div>
                  {transactionList}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
    }
}

export default App
