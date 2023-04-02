"use strict";

const {
  utils: { deployContract },
} = require("@axelar-network/axelar-local-dev");
const { getDefaultProvider, Contract, ethers } = require("ethers");

const AxinsureCollector = rootRequire(
  "artifacts/src/AxinsureCollector.sol/AxinsureCollector.json"
);

const AxinsureCore = rootRequire(
  "artifacts/src/AxinsureCore.sol/AxinsureCore.json"
);

const AxinsureOracle = rootRequire(
  "artifacts/src/AxinsureOracle.sol/AxinsureOracle.json"
);

const Gateway = rootRequire(
  "artifacts/@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol/IAxelarGateway.json"
);

const IERC20 = rootRequire(
  "artifacts/@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol/IERC20.json"
);

const { defaultAbiCoder } = require("ethers/lib/utils");

async function deploy(chain, wallet) {
  console.log(`Deploying contracts for ${chain.name}.`);

  // Variables for deployment
  const paymentToken = "aUSDC";
  const gatewayAddress = chain.gateway;
  const gasServiceAddress = chain.gasService;

  // Setup
  const provider = getDefaultProvider(chain.rpc);
  chain.wallet = wallet.connect(provider);
  const gateway = new Contract(chain.gateway, Gateway.abi, chain.wallet);
  
  // USDC contract
  const usdcAddress = await gateway.tokenAddresses("aUSDC");
  chain.usdc = new Contract(usdcAddress, IERC20.abi, chain.wallet);

  // TODO: In the real version, Core and Oracle contract will be deployed on a main host chain. i.e Polygon

  // Deploy AxinsureOracle contract
  console.log(`Deploying AxinsureOracle for ${chain.name}.`);
  chain.oracleContract = await deployContract(wallet, AxinsureOracle);
  console.log(
    `Deployed AxinsureOracle for ${chain.name} at ${chain.oracleContract.address}.`
  );

  // Deploy AxinsureCore contract
  console.log(`Deploying AxinsureCore for ${chain.name}.`);
  chain.coreContract = await deployContract(wallet, AxinsureCore, [
    paymentToken,
    gatewayAddress,
    gasServiceAddress,
  ]);
  const coreAddress = chain.coreContract.address;
  console.log(`Deployed AxinsureCore for ${chain.name} at ${coreAddress}.`);

  // Deploy AxinsureCollector contract
  console.log(`Deploying AxinsureCollector for ${chain.name}.`);
  chain.collectorContract = await deployContract(wallet, AxinsureCollector, [
    coreAddress,
    chain.name,
    gatewayAddress,
    paymentToken,
    gasServiceAddress,
  ]);
  const collectorAddress = chain.collectorContract.address;
  console.log(
    `Deployed AxinsureCollector for ${chain.name} at ${collectorAddress}.`
  );
}

async function execute(chain, wallet, options) {
  const args = options.args || [];
  const { source, destination, oracleContract } = options;
  const amount = Math.floor(parseFloat(args[2])) * 1e6 || 10e6;
  const accounts = args.slice(3);
  if (accounts.length === 0) accounts.push(wallet.address);

  async function logAccountBalances() {
    for (const account of accounts) {
      console.log(
        `${account} has ${
          (await destination.usdc.balanceOf(account)) / 1e6
        } aUSDC`
      );
    }
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  console.log("--- Initially ---");
  await logAccountBalances();
  const fee = await calculateBridgeFee(source, destination);
  const balance = await destination.usdc.balanceOf(accounts[0]);

  const approveTx = await source.usdc.approve(source.contract.address, amount);
  await approveTx.wait();

  const sendTx = await source.contract.sendToMany(
    destination.name,
    destination.contract.address,
    accounts,
    "aUSDC",
    amount,
    {
      value: fee,
    }
  );
  await sendTx.wait();

  while (true) {
    const updatedBalance = await destination.usdc.balanceOf(accounts[0]);

    if (updatedBalance.gt(balance)) {
      break;
    }

    await sleep(1000);
  }

  console.log("--- After ---");
  await logAccountBalances();
}

module.exports = {
  deploy,
  execute,
};
