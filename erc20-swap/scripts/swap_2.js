const { ethers } = require("hardhat")
const pressAnyKey = require('press-any-key');

var contractAlice;
var contractBob;
var decimal1;
var decimal2;
var tx, tx1;


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
  await printBallances();
}
async function printAllowances() {
  console.log('ERC20 Bob is allowed to take from Alice=> GLD: ' + 
              await contractAlice.allowance(process.env.ACCOUNT_ALICE, process.env.ACCOUNT_BOB) / (10 ** decimal1) + '.');
  console.log('ERC20 Alice is allowed to take from BOB=> SLV: ' + 
              await contractBob.allowance(process.env.ACCOUNT_BOB, process.env.ACCOUNT_ALICE)   / (10 ** decimal2) + '.');
  console.log('--------------------------------------------------------------------------------');
}
async function printInitiakBallances() {
  console.log('--------------------------------------------------------------------------------');
  console.log('----I-N-I-T-I-A-L----B-A-L-L-A-N-C-E-S------------------------------------------');
  console.log('--------------------------------------------------------------------------------');
  printBallances();
}
async function init() {
  signerBob = await ethers.getSigner(process.env.ACCOUNT_BOB);
  signerAlice = await ethers.getSigner(process.env.ACCOUNT_Alice);
  const contractFactoryGold = await ethers.getContractFactory("GLDToken", signerAlice)
  const contractFactorySilver = await ethers.getContractFactory("SLVToken", signerBob)
  contractAlice = contractFactoryGold.attach(process.env.CC_ALICE);
  contractBob = contractFactorySilver.attach(process.env.CC_BOB);
  decimal1 = await contractAlice.decimals();
  decimal2 = await contractBob.decimals()

  await printInitiakBallances();
}

async function sawp2() {
  await init();
  await contractAlice.approve(process.env.ACCOUNT_BOB, 5 * (10 ** decimal1));
  tx = await contractBob.approve(process.env.ACCOUNT_ALICE, 10 * (10 ** decimal2));
  await tx.wait(); 
  await printAllowances();

  contractAlice = await contractAlice.connect(signerBob);
  tx = await contractAlice.transferFrom(process.env.ACCOUNT_ALICE, process.env.ACCOUNT_BOB, 5 * (10 ** decimal1))
  await tx.wait();
  await printBallances();

  await pressAnyKey("Press any key to continue or CTRL+C for Bob to withdraw from the swap trade.", {ctrlC: "reject" }).catch(()=> {
    console.log('----W-I-T-H-D-R-A-W-I-N-G--F-R-O-M--T-H-E--T-R-A-N-S-A-C-T-I-O-N----------------');
    console.log('--------------------------------------------------------------------------------');
    contractBob.approve(process.env.ACCOUNT_ALICE, 0);
  });
  contractBob = await contractBob.connect(signerAlice);
  tx = await contractBob.transferFrom(process.env.ACCOUNT_BOB, process.env.ACCOUNT_ALICE,  10 * (10 ** decimal2))
  await tx.wait();
}

sawp2().then(() => printFinalBallances()).catch((error) => {
  console.log('----E-R-R-O-R-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!---------------');
  console.log(error.reason);
  console.log('--------------------------------------------------------------------------------');
  printFinalBallances();}
)
