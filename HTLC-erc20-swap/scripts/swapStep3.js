const { ethers } = require("hardhat")

var contractSLV;
var HTLCswap;
var decimal;
const HASH= '0x65462b0520ef7d3df61b9992ed3bea0c56ead753be7c8b3614e0ce01e4cac41b'
const SECRET= 'secret'
const PREFIX_LENTH= 2
const FIELD_LENTH= 32 * 2
const HOUR = 3600

async function printBallances() {
  const ballance_Alice = await contractSLV.balanceOf(process.env.ACCOUNT_ALICE);
  const ballance_Bob   = await contractSLV.balanceOf(process.env.ACCOUNT_BOB);
  const ballance_HTLC  = await contractSLV.balanceOf(process.env.CC_SWAP_SILVER);

  console.log('ERC20 ballances=>Alice:  - SLV: ' + ballance_Alice / (10 ** decimal) + '.');
  console.log('ERC20 ballances=>Bob  :  - SLV: ' + ballance_Bob   / (10 ** decimal) + '.');
  console.log('ERC20 ballances=>HTLC :  - SLV: ' + ballance_HTLC  / (10 ** decimal) + '.');
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
  const contractFactorySilver = await ethers.getContractFactory("SLVToken")
  contractSLV = contractFactorySilver.attach(process.env.CC_SLV);
  HTLCswap = contractHTLC.attach(process.env.CC_SWAP_SILVER);
  decimal = await contractSLV.decimals();
  await printInitiakBallances();
}

async function printAllowances() {
  console.log('ERC20 Bob is allowed to take from Bob=> SLV: ' + 
  await contractSLV.allowance(process.env.ACCOUNT_BOB, process.env.CC_SWAP_SILVER) / (10 ** decimal) + '.');
  console.log('--------------------------------------------------------------------------------');
}

async function swapStep3() {
  if(!process.argv[2]) {
    console.log("You have to indicate the swap Id")
    return;
  }
  await init();

  try {
    tx = await HTLCswap.finalizeSwap(process.argv[2], !process.argv[3] ? SECRET : process.argv[3]);
    const receipt = await tx.wait()
    const swapId = parseInt(receipt.logs[1].data.substring(0,66));
    console.log('Finalized swap with an id .....: ' + swapId);
    console.log('With the password..............: ' + Buffer.from(receipt.logs[1].data.substring(PREFIX_LENTH + 3 * FIELD_LENTH,PREFIX_LENTH + 4 * FIELD_LENTH), 'hex'));
  } catch (error) {
    console.error(error.reason);
  }
  console.log('--------------------------------------------------------------------------------');
  await printFinalBallances();
}

swapStep3()