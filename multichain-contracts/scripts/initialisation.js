// Script to deploy and verify contracts on EVM chains.
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const axinsureOracle = await ethers.getContractFactory("AxinsureOracle");
  const AxinsureOracle = await axinsureOracle.deploy();

  console.log("AxinsureOracle address:", AxinsureOracle.address);
}
