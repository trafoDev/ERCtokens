const { ethers } = require("hardhat")

async function main() {

  var deployer;
  deployer = await ethers.getSigner(process.env.ACCOUNT_ALICE);
  const contractFactoryG = await ethers.getContractFactory("HTLCTokenSwap", deployer)
  const GLDTokenSwap = await contractFactoryG.deploy(process.env.CC_GLD)

  deployer = await ethers.getSigner(process.env.ACCOUNT_BOB);
  const contractFactoryS = await ethers.getContractFactory("HTLCTokenSwap", deployer)
  const SLVTokenSwap = await contractFactoryS.deploy(process.env.CC_SLV)

  await GLDTokenSwap.deployed()
  console.log(`Contract for swapping Gold   successfully deployed to ${GLDTokenSwap.address} from  ${GLDTokenSwap.signer.address} `)
  await SLVTokenSwap.deployed()
  console.log(`Contract for swapping Silver successfully deployed to ${SLVTokenSwap.address} from  ${SLVTokenSwap.signer.address} `)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


