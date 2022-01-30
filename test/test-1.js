const { expect, should } = require('chai');
const { ethers } = require('hardhat');
const deployContract = require('../deployments/deployContract');
const ethUtils = require('../utils.js');

ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR); // turn off warnings

describe('All contracts', () => {
  let owner, addr1, addr2;
  let goldContract;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    // goldContract = await deployContract('Gold');
  });

  it('Should do some tests', async () => {
    // ...
  });
});
