const { ethers } = require("hardhat")

async function main() {

  var deployer;
  deployer = await ethers.getSigner(process.env.ACCOUNT_ALICE);
  const contractSwap = await ethers.getContractFactory("TokenSwap", deployer)
  const TokenSwap = await contractSwap.deploy(process.env.CC_GLD, process.env.CC_SLV)

  await TokenSwap.deployed()
  console.log(`The contract for swapping tokens has been successfully deployed to ${TokenSwap.address} from  ${TokenSwap.signer.address} `)
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


