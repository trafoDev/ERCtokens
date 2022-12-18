const { ethers } = require("hardhat")

var contractGold;
var contractSwap;
var contractSilver;
var decimal1;
var decimal2;

async function printBallances() {
  const ballanceA_Alice = await contractGold.balanceOf(process.env.ACCOUNT_ALICE);
  const ballanceA_Bob   = await contractGold.balanceOf(process.env.ACCOUNT_BOB);
  const ballanceB_Bob   = await contractSilver.balanceOf(process.env.ACCOUNT_BOB);
  const ballanceB_Alice = await contractSilver.balanceOf(process.env.ACCOUNT_ALICE);

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
  const contractTokenSwap = await ethers.getContractFactory("TokenSwap")
  const contractFactoryGold = await ethers.getContractFactory("GLDToken")
  const contractFactorySilver = await ethers.getContractFactory("SLVToken", signerBob)
  contractGold = contractFactoryGold.attach(process.env.CC_GLD);
  contractSwap = contractTokenSwap.attach(process.env.CC_SWAP);
  contractSilver = contractFactorySilver.attach(process.env.CC_SLV);
  decimal1 = await contractGold.decimals();
  decimal2 = await contractSilver.decimals();
  await printInitiakBallances();
}

async function swap() {
  await init();

  var tx = await contractGold.approve(process.env.CC_SWAP, 1 * (10 ** decimal1));
  await tx.wait(); 
  tx = await contractSwap.newSwap(process.env.CC_GLD, 1 * (10 ** decimal1), 2 * (10 ** decimal2));
  const receipt = await tx.wait()
  const swapId = parseInt(receipt.logs[2].data.substring(0,66));
  console.log('Created swap definition with id: ' + swapId);
  console.log('--------------------------------------------------------------------------------');
  await printBallances();

  console.log('Canceling swap - id: ' + swapId);
  console.log('--------------------------------------------------------------------------------');
  tx1 = await contractSwap.cancelSwap(swapId);
  await tx1.wait();
  await printBallances();

  console.log('Finalizing swap - id: ' + swapId);
  console.log('--------------------------------------------------------------------------------');
  tx = await contractSilver.approve(process.env.CC_SWAP, 2 * (10 ** decimal2));
  await tx.wait(); 
  contractSwap = await contractSwap.connect(signerBob);
  tx1 = await contractSwap.finalizeSwap(swapId);
  await tx1.wait();
  printBallances();
}

swap().catch((e) => {
  console.log(e.reason);
  console.log('--------------------------------------------------------------------------------');
  printFinalBallances();
})
