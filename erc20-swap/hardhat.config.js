require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.17", 
  networks:  {
    mumbai: {
      //url: 'https://matic-testnet-archive-rpc.bwarelabs.com',
      //url: 'https://polygon-testnet.public.blastapi.io',
      //url: 'https://polygontestapi.terminet.io/rpc',,
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [process.env.MY_WALLET_PRIVATE_KEY, process.env.TEST_WALLET_PRIVATE_KEY]
}
  }
};
