const { ethers } = require("hardhat")

async function main() {

  var deployer;
  deployer = await ethers.getSigner(process.env.ACCOUNT_ALICE);
  const contractFactoryG = await ethers.getContractFactory("GLDToken", deployer)
  const GLDToken = await contractFactoryG.deploy(100)

  deployer = await ethers.getSigner(process.env.ACCOUNT_BOB);
  const contractFactoryS = await ethers.getContractFactory("SLVToken", deployer)
  const SLVToken = await contractFactoryS.deploy(200)

  await GLDToken.deployed()
  console.log(`Contract for Gold   successfully deployed to ${GLDToken.address} from  ${GLDToken.signer.address} `)
  await SLVToken.deployed()
  console.log(`Contract for Silver successfully deployed to ${SLVToken.address} from  ${SLVToken.signer.address} `)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


