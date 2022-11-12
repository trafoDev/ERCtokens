const { ethers } = require("hardhat")

const CONTRACT_ADDRESS = "0xDfc9B55c17Bb8EFEBf617A618AdB5A77069732A2"

async function main(_URI) {
    const NFT = await ethers.getContractFactory("CryptoRafal");
    const contract = NFT.attach(CONTRACT_ADDRESS);
    await contract.mint("https://ipfs.io/ipfs/QmZW6t9jfNnomP4j1mqZ5htCMjBBuALceMPRwwyvWms2Fq").then((txn) => {
        console.log('NFT minted! - ', txn.hash)
        return(txn)
    });
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

