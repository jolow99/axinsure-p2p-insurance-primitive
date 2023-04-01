// Hardhat test for AxinsureOracle.sol
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AxinsureOracle", function () {
  it("Should return the true for checkOracle", async function () {
    const AxinsureOracle = await ethers.getContractFactory("AxinsureOracle");
    const axinsureOracle = await AxinsureOracle.deploy();
    await axinsureOracle.deployed();

    const result = await axinsureOracle.checkOracle();
    expect(result).to.deep.equal([true, true]);
  });
});
