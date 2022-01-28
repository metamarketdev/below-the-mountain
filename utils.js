module.exports = {
  waitHours: (n) => {
    ethers.provider.send('evm_increaseTime', [3600 * n]);
    ethers.provider.send('evm_mine', []);
  },

  logTokenBalance: (n) => {
    console.log(ethers.BigNumber.from(n).div(1000000).div(1000000).div(1000000).toString());
  },

  logBigNumber: (num) => {
    console.log(ethers.BigNumber.from(num).toString());
  },

  getNativeDisplayBalance: (num) => {
    return ethers.BigNumber.from(num).div(1000000).div(1000000).div(1000).toNumber() / 1000
  },

  getNumber: (num) => {
    return ethers.BigNumber.from(num).div(1000000).div(1000000).div(1000000);
  },

  getMaxInteger: () => {
    return ethers.BigNumber.from(2).pow(256).sub(1);
  },

  addDecimals: (num, decimals=18) => {
    return ethers.BigNumber.from(10).pow(decimals).mul(num);
  },

  removeDecimals: (num) => {
    return ethers.BigNumber.from(num).div(1000000).div(1000000).div(1000000);
  },

  logDustBalance: async (ownerAddress, contract) => {
    let balance = await contract.balanceOf(ownerAddress);
    let stringBalance = await ethers.BigNumber.from(balance._hex).div(addDecimals(1)).toString();
    console.log(stringBalance);
  },

  logToolDetails: async (details) => {
    const efficiency = await ethers.BigNumber.from(details['efficiency']).toString();
    const durability = await ethers.BigNumber.from(details['durability']).toString();
    console.log({ efficiency, durability });
  },

  logClaimDetails: async (details) => {
    let x = await ethers.BigNumber.from(details['x']._hex).toString();
    let y = await ethers.BigNumber.from(details['y']._hex).toString();
    console.log({ x, y });
  },
};
