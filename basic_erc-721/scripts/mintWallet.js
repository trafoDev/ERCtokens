require('dotenv').config();
const { ethers } = require("hardhat")
const cryptoRafalJSON = require("../artifacts/contracts/CryptoRafal.sol/CryptoRafal.json")

async function main() {

  const abi = cryptoRafalJSON.abi
  const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
  const wallet = new ethers.Wallet(process.env.MY_WALLET_PRIVATE_KEY, provider)
  const signer = wallet.connect(provider)
  const cryptoRafal = new ethers.Contract('0xDfc9B55c17Bb8EFEBf617A618AdB5A77069732A2', abi, signer)
  await cryptoRafal.mint("https://ipfs.io/ipfs/QmZW6t9jfNnomP4j1mqZ5htCMjBBuALceMPRwwyvWms2Fq")
  console.log('NFT minted!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
