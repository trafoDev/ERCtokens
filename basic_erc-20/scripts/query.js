const { ethers } = require("hardhat")
const CONTRACT_ADDRESS_1 = "0x955c42cb11c635E46a305665a644eE60f0Ed2c6D"
const CONTRACT_ADDRESS_2 = "0x81b544758FaC3632ee117353021Fbd2a472fFb87"
const MY_ACCOUNT = "0x44499Fe5aa2E14Ca7857d1d4B939630b8160F39a"

async function query(_URI) {
  const contractFactory = await ethers.getContractFactory("GLDToken")
  const accountAdd = MY_ACCOUNT;

  const contractAdd1 = CONTRACT_ADDRESS_1;
  const contract1 = contractFactory.attach(contractAdd1);
  const contractAdd2 = CONTRACT_ADDRESS_2;
  const contract2 = contractFactory.attach(contractAdd2);

  const totalSupplay1 = await contract1.totalSupply();
  const ballance1 = await contract1.balanceOf(accountAdd);
  const decimal1 = await contract1.decimals();
  console.log('Contract: ' + contractAdd1 + ' - total supplay: ' + totalSupplay1);
  console.log('Account:  ' + accountAdd   + ' - ballance: ' + ballance1 + ' (decimals: ' + decimal1 + ')');
  console.log('--------------------------------------------------------------------------------');

  const totalSupplay2 = await contract2.totalSupply();
  const ballance2 = await contract2.balanceOf(accountAdd);
  const decimal2 = await contract2.decimals();
  console.log('Contract: ' + contractAdd2 + ' - total supplay: ' + totalSupplay2);
  console.log('Account:  ' + accountAdd   + ' - ballance: ' + ballance2 + ' (decimals: ' + decimal2 + ')');
}
query().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});

