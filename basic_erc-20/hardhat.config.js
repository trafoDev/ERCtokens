require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.17", 
  networks:  {
    mumbai: {
      url: 'https://polygon-testnet.public.blastapi.io',
      accounts: [process.env.MY_WALLET_PRIVATE_KEY]
}
  }
};
