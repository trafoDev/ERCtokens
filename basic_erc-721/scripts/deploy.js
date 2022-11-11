const { ethers } = require("hardhat")

async function main() {
  const contractFactory = await ethers.getContractFactory("CryptoRafal")
  const cryptoRafal = await contractFactory.deploy("CryptoRafal", "CRAFAL")

  await cryptoRafal.deployed()
  console.log(`Contract successfully deployed to ${cryptoRafal.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


