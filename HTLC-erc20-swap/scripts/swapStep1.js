const { ethers } = require("hardhat")

var contractGLD;
var HTLCswap;
var decimal;
const HASH= '0x65462b0520ef7d3df61b9992ed3bea0c56ead753be7c8b3614e0ce01e4cac41b'
//const SECRET= 'secret'
const PREFIX_LENTH= 2
const FIELD_LENTH= 32 * 2
const HOUR = 3600

async function printBallances() {
  const ballance_Alice = await contractGLD.balanceOf(process.env.ACCOUNT_ALICE);
  const ballance_Bob   = await contractGLD.balanceOf(process.env.ACCOUNT_BOB);
  const ballance_HTLC  = await contractGLD.balanceOf(process.env.CC_SWAP_GOLD);

  console.log('ERC20 ballances=>Alice:  - GLD: ' + ballance_Alice / (10 ** decimal) + '.');
  console.log('ERC20 ballances=>Bob  :  - GLD: ' + ballance_Bob   / (10 ** decimal) + '.');
  console.log('ERC20 ballances=>HTLC :  - GLD: ' + ballance_HTLC  / (10 ** decimal) + '.');
  console.log('--------------------------------------------------------------------------------');
}
async function printFinalBallances() {
  console.log('----F-I-N-A-L----B-A-L-L-A-N-C-E-S----------------------------------------------');
  console.log('--------------------------------------------------------------------------------');
  await printBallances();
}
async function printInitiakBallances() {
  console.log('--------------------------------------------------------------------------------');
  console.log('----I-N-I-T-I-A-L----B-A-L-L-A-N-C-E-S------------------------------------------');
  console.log('--------------------------------------------------------------------------------');
  await printBallances();
}
async function init() {
  const contractHTLC = await ethers.getContractFactory("HTLCTokenSwap")
  const contractFactoryGold = await ethers.getContractFactory("GLDToken")
  contractGLD = contractFactoryGold.attach(process.env.CC_GLD);
  HTLCswap = contractHTLC.attach(process.env.CC_SWAP_GOLD);
  decimal = await contractGLD.decimals();
  await printInitiakBallances();
}

async function printAllowances() {
  console.log('ERC20 Bob is allowed to take from Alice=> GLD: ' + 
  await contractGLD.allowance(process.env.ACCOUNT_ALICE, process.env.CC_SWAP_GOLD) / (10 ** decimal) + '.');
  console.log('--------------------------------------------------------------------------------');
}

async function swapStep1() {
  await init();

  tx = await contractGLD.approve(process.env.CC_SWAP_GOLD, 1 * (10 ** decimal));
  await tx.wait(); 

  tx = await HTLCswap.newSwap(process.env.ACCOUNT_BOB, !process.argv[2] ? HASH : process.argv[2], HOUR * 2, 1 * (10 ** decimal));
  const receipt = await tx.wait()
  const swapId = parseInt(receipt.logs[2].data.substring(0,66));
  console.log('Created swap definition with id: ' + swapId);
  field = receipt.logs[2].data.substring(PREFIX_LENTH + 5 * FIELD_LENTH,PREFIX_LENTH + 6 * FIELD_LENTH)
  console.log('With hash lock value...........: 0x' + field);
  field = receipt.logs[2].data.substring(PREFIX_LENTH + 6 * FIELD_LENTH,PREFIX_LENTH + 7 * FIELD_LENTH)
  console.log('With time lock value...........: ' + new Date(parseInt('0x'+field)*1000));
  console.log('--------------------------------------------------------------------------------');
  await printFinalBallances();
}

swapStep1()