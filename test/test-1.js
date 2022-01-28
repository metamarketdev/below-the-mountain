const { expect, should } = require("chai");
const { ethers } = require("hardhat");
const deployContract = require("../deployments/deployContract");
const ethUtils = require("../utils.js");

ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR); // turn off warnings

describe("All contracts", () => {
  let owner, addr1, addr2;
  let factoryContract;

  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    factoryContract = await deployContract("CollectionFactory");
  });

  it("Should create collection", async () => {
    await factoryContract.deployNewContract();

    let contracts = await factoryContract.getContractForIndex(1);
    console.log(contracts);
  });
});
