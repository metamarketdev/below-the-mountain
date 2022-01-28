const fs = require('fs');
const hre = require('hardhat');
const deployContract = require('../deployments/deployContract');
const ethUtils = require('../utils.js');
const networks = require('../networks.js');

// hh verify "0x48d90737e118351a43077968871ec78dd66873bb"  --network fuji --show-stack-traces

const GOLD_NAME = 'Mountain Gold';
const GOLD_SYMBOL = 'MGD';

function getContractData(contract) {
  return {
    address: contract.address,
    abi: JSON.parse(contract.interface.format('json')),
  };
}

async function main() {
  let goldContract;
  let network = networks[hre.network.name];

  let [owner] = await ethers.getSigners();
  let balance = await owner.getBalance();

  console.log('Deploying...');

  goldContract = await deployContract('Gold', [GOLD_NAME, GOLD_SYMBOL]);

  console.log(
    '\u001b[' +
      32 +
      'm' +
      `Deployed! https://testnet.snowtrace.io/address/${goldContract.address}` +
      '\u001b[0m',
  );

  // Write ABIs to files
  try {
    console.log('Writing ABI files...');

    fs.writeFileSync('src/contracts/Gold.json', JSON.stringify(getContractData(goldContract)));
  } catch (err) {
    console.log('ABI creation failed:', err.message);
    console.error(err);
  }

  // Auto verify

  try {
    console.log('Verifying...');

    // Wait a few confirmations to make sure the bytecode is not empty
    await goldContract.deployTransaction.wait(6);

    await hre.run('verify:verify', {
      address: goldContract.address,
      network: hre.network.name,
      constructorArguments: [GOLD_NAME, GOLD_SYMBOL],
      // libraries: {
      //   LibraryName: libraryContract.address,
      // },
    });
  } catch (err) {
    console.log('Verification failed:', err.message);
    console.error(err);
  }
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
