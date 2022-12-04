const { ethers } = require("hardhat")
const pressAnyKey = require('press-any-key');

var contractAlice;
var contractBob;
var contractFactorySwap;
var decimal1;
var decimal2;
var tx;

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
async function printAllowances(cc) {
  console.log('--------------------------------------------------------------------------------');
  console.log('ERC20 Swap contract is allowed to take from Alice=> GLD: ' + 
              await contractAlice.allowance(process.env.ACCOUNT_ALICE, cc) / (10 ** decimal1) + '.');
  console.log('ERC20 Swap contract is allowed to take from BOB=> SLV  : ' + 
              await contractBob.allowance(process.env.ACCOUNT_BOB, cc)   / (10 ** decimal2) + '.');
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
async function depoySwap( _token1, _owner1, _amount1, _token2, _owner2, _amount2) {
  contractFactorySwap = await ethers.getContractFactory("TokenSwap")
  const TokenSwap = await contractFactorySwap.deploy(_token1, _owner1, _amount1, _token2, _owner2, _amount2)
  await TokenSwap.deployed()
  return TokenSwap.address;
}
async function isBobHonest() {
  var res = false;
  await pressAnyKey("Press any key to continue or CTRL+C for Bob to withdraw from the swap trade.", {ctrlC: "reject" }).then(()=> {res = true;}).catch(()=> {
    console.log('----W-I-T-H-D-R-A-W-I-N-G--F-R-O-M--T-H-E--T-R-A-N-S-A-C-T-I-O-N----------------');
    console.log('--------------------------------------------------------------------------------');
    res = false;
  });
  return res;
}

async function swap3() {
  await init();
  const ccSwap = await depoySwap( process.env.CC_ALICE, process.env.ACCOUNT_ALICE, 10 * (10 ** decimal1), 
                                  process.env.CC_BOB, process.env.ACCOUNT_BOB, 20 * (10 ** decimal2)); 
  console.log('----D-E-P-L-O-Y-E-D--S-W-A-P--C-O-N-T-R-A-C-T-----------------------------------');
  console.log('--------------------------------------------------------------------------------');
  console.log('Deployed contract address: ' + ccSwap);
  
  await contractAlice.approve(ccSwap, 10 * (10 ** decimal1));
  tx = await contractBob.approve(ccSwap, 20 * (10 ** decimal2));
  await tx.wait(); 
  await printAllowances(ccSwap);

  if (false === (await isBobHonest())) { await contractBob.approve(ccSwap, 0);}

  contractSwap = contractFactorySwap.attach(ccSwap);
  tx = await contractSwap.swap();
  await tx.wait(); 
}

swap3().then(() => printFinalBallances()).catch((error) => {
  console.log('----E-R-R-O-R-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!-!---------------');
  console.log(error.reason);
  console.log('--------------------------------------------------------------------------------');
  printFinalBallances();}
)
