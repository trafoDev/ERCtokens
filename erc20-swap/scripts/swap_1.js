const { ethers } = require("hardhat")
const pressAnyKey = require('press-any-key');

var contractAlice;
var contractBob;
var decimal1;
var decimal2;


async function printBallances() {
  const ballanceA_Alice = await contractAlice.balanceOf(process.env.ACCOUNT_ALICE);
  const ballanceA_Bob   = await contractAlice.balanceOf(process.env.ACCOUNT_BOB);
  const ballanceB_Bob   = await contractBob.balanceOf(process.env.ACCOUNT_BOB);
  const ballanceB_Alice = await contractBob.balanceOf(process.env.ACCOUNT_ALICE);

  console.log('ERC20 ballances=>Alice:  - GLD: ' + ballanceA_Alice / (10 ** decimal1) + ' \tSLV: ' + ballanceB_Alice  / (10 ** decimal2) + '.');
  console.log('ERC20 ballances=>Bob  :  - GLD: ' + ballanceA_Bob   / (10 ** decimal1) + ' \tSLV: ' + ballanceB_Bob    / (10 ** decimal2) + '.');
  console.log('--------------------------------------------------------------------------------');
}
async function printFinalBallances() {
  console.log('----F-I-N-A-L----B-A-L-L-A-N-C-E-S----------------------------------------------');
  console.log('--------------------------------------------------------------------------------');
  printBallances();
}
async function printInitiakBallances() {
  console.log('--------------------------------------------------------------------------------');
  console.log('----I-N-I-T-I-A-L----B-A-L-L-A-N-C-E-S------------------------------------------');
  console.log('--------------------------------------------------------------------------------');
  printBallances();
}
async function init() {
  signerBob = await ethers.getSigner(process.env.ACCOUNT_BOB);
  const contractFactoryGold = await ethers.getContractFactory("GLDToken")
  const contractFactorySilver = await ethers.getContractFactory("SLVToken", signerBob)
  contractAlice = contractFactoryGold.attach(process.env.CC_ALICE);
  contractBob = contractFactorySilver.attach(process.env.CC_BOB);
  decimal1 = await contractAlice.decimals();
  decimal2 = await contractBob.decimals();
  await printInitiakBallances();
}

async function swap1() {
  await init();

  var tx = await contractAlice.transfer(process.env.ACCOUNT_BOB, 1 * (10 ** decimal1))
  await tx.wait(); 

  await printBallances();
  await pressAnyKey("Press any key to continue or CTRL+C for Bob to withdraw from the swap trade.", {ctrlC: "reject" });
  
  var tx = await contractBob.transfer(process.env.ACCOUNT_ALICE, 1 * (10 ** decimal1))
  await tx.wait();
}

swap1().then(() => printFinalBallances()).catch(() => {
  console.log('----W-I-T-H-D-R-A-W-I-N-G--F-R-O-M--T-H-E--T-R-A-N-S-A-C-T-I-O-N----------------');
  console.log('--------------------------------------------------------------------------------');
  printFinalBallances();}
)
