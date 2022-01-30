const fs = require('fs');
const hre = require('hardhat');
const deployContract = require('../deployments/deployContract');
const ethUtils = require('../utils.js');
const networks = require('../networks.js');

// hh verify "0x48d90737e118351a43077968871ec78dd66873bb"  --network fuji --show-stack-traces

const GOLD_NAME = 'Mountain Gold';
const GOLD_SYMBOL = 'MGLD';

const TOOLS_NAME = 'Mountain Tools';
const TOOLS_SYMBOL = 'MTLS';

const CLAIMS_NAME = 'Mountain Claims';
const CLAIMS_SYMBOL = 'MCLM';

function getContractData(contract) {
  return {
    address: contract.address,
    abi: JSON.parse(contract.interface.format('json')),
  };
}

async function main() {
  let goldContract, itemsContract, craftingContract, toolsContract, claimsContract;
  let network = networks[hre.network.name];

  let [owner] = await ethers.getSigners();
  let balance = await owner.getBalance();

  console.log('Deploying...');

  claimsContract = await deployContract('Claims', [CLAIMS_NAME, CLAIMS_SYMBOL]);
  await claimsContract.deployTransaction.wait();

  goldContract = await deployContract('Gold', [GOLD_NAME, GOLD_SYMBOL]);
  await goldContract.deployTransaction.wait();

  itemsContract = await deployContract('Items', ['']);
  await itemsContract.deployTransaction.wait();

  toolsContract = await deployContract('Tools', [TOOLS_NAME, TOOLS_SYMBOL]);
  await toolsContract.deployTransaction.wait();

  craftingContract = await deployContract('Crafting', [
    toolsContract.address,
    itemsContract.address,
  ]);
  await craftingContract.deployTransaction.wait();

  console.log('Initializing states...');

  await toolsContract.authorize(craftingContract.address, true, true);
  await itemsContract.authorize(craftingContract.address, true, true);

  // await craftingContract.addRecipe('Stone pickaxe', 1, 3, 1);

  fs.writeFileSync('src/contracts/Claims.json', JSON.stringify(getContractData(claimsContract)));
  fs.writeFileSync('src/contracts/Gold.json', JSON.stringify(getContractData(goldContract)));
  fs.writeFileSync('src/contracts/Items.json', JSON.stringify(getContractData(itemsContract)));
  fs.writeFileSync('src/contracts/Tools.json', JSON.stringify(getContractData(toolsContract)));
  fs.writeFileSync(
    'src/contracts/Crafting.json',
    JSON.stringify(getContractData(craftingContract)),
  );

  // Auto verify

  // try {
  //   console.log('Verifying...');

  //   // Wait a few confirmations to make sure the bytecode is not empty
  //   await goldContract.deployTransaction.wait(6);

  //   await hre.run('verify:verify', {
  //     address: goldContract.address,
  //     network: hre.network.name,
  //     constructorArguments: [GOLD_NAME, GOLD_SYMBOL],
  //     // libraries: {
  //     //   LibraryName: libraryContract.address,
  //     // },
  //   });
  // } catch (err) {
  //   console.log('Verification failed:', err.message);
  //   console.error(err);
  // }
}

main()
  .then(() => {
    console.log('✅ All Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
