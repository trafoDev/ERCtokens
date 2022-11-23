const { ethers } = require("hardhat")

async function main() {
  const contractFactory = await ethers.getContractFactory("GLDToken")
  const GLDToken = await contractFactory.deploy(100)

  await GLDToken.deployed()
  console.log(`Contract successfully deployed to ${GLDToken.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


