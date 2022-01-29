module.exports = async (name, args) => {
  console.log('Deploying:', name);
  const contractFactory = await ethers.getContractFactory(name);
  const deployedContract = await contractFactory.deploy(...args);

  console.log(
    '\u001b[' +
      32 +
      'm' +
      `https://testnet.snowtrace.io/address/${deployedContract.address}` +
      '\u001b[0m',
  );

  return deployedContract;
};
