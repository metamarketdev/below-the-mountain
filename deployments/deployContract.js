module.exports = async (name, args) => {
  console.log("Deploying contract:", name);
  const contractFactory = await ethers.getContractFactory(name);
  return await contractFactory.deploy(...args);
};
