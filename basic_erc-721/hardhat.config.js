require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.17", 
  networks:  {
    mumbai: {
      url: 'https://polygon-testnet.public.blastapi.io',
      accounts: ['2f93e5f985bbed6309cc39ecaa9dd1d3487c9cb2380e26e0bc9726a5427d06f9']
    }
  }
};
