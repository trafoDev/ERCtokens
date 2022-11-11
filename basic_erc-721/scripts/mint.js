const { ethers } = require("hardhat")
const cryptoBeetlesJSON = require("../artifacts/contracts/CryptoRafal.sol/CryptoRafal.json")

async function main() {

  const abi = cryptoBeetlesJSON.abi
  const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');
  const wallet = new ethers.Wallet('2f93e5f985bbed6309cc39ecaa9dd1d3487c9cb2380e26e0bc9726a5427d06f9', provider)
  const signer = wallet.connect(provider)
  const cryptoBeetles = new ethers.Contract('0xDfc9B55c17Bb8EFEBf617A618AdB5A77069732A2', abi, signer)
  await cryptoBeetles.mint("https://ipfs.io/ipfs/QmZW6t9jfNnomP4j1mqZ5htCMjBBuALceMPRwwyvWms2Fq")
  console.log('NFT minted!')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
