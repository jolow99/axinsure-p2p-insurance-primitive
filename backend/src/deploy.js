"use strict";

const {
  utils: { deployContract },
} = require("@axelar-network/axelar-local-dev");

const AxinsureCollector = rootRequire(
  "artifacts/src/AxinsureCollector.sol/AxinsureCollector.json"
);

const AxinsureCore = rootRequire(
  "artifacts/src/AxinsureCore.sol/AxinsureCore.json"
);

const AxinsureOracle = rootRequire(
  "artifacts/src/AxinsureOracle.sol/AxinsureOracle.json"
);

const { defaultAbiCoder } = require("ethers/lib/utils");

async function deploy(chain, wallet) {
  // Variables for deployment
  const paymentToken = "aUSDC";
  const gatewayAddress = chain.gateway;
  const gasServiceAddress = chain.gasService;

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

  // Call createInsurancePolicy from the Core contract
  console.log(`Creating insurance policy for ${chain.name}.`);

  // const addPolicyTx = await chain.coreContract.createInsurancePolicy(
  //   chain.oracleContract.address,
  //   1000,
  //   100,
  //   10,
  //   { gasLimit: 200000 }
  // );
  // await addPolicyTx.wait();

  const readFunctionTx = await chain.coreContract.getPaymentToken();
  // await readFunctionTx.wait();
  console.log(readFunctionTx);
}

async function execute(evmChain, wallet, options) {
  // const args = options.args || [];

  async function logValue() {
    console.log(
      `value at ${evmChain.name} is "${await evmChain.contract.value()}"`
    );
    // const resources = await client.getAccountResources(client.owner.address());
    // const resource = resources.find(
    //   (r) => r.type === `${client.owner.address()}::hello_world::MessageHolder`
    // );
    // const msg = resource.data.message;
    // console.log(`value at Aptos is "${msg}"`);
  }

  console.log("--- Initially ---");
  await logValue();

  // Currently, our SDK can't calculate bridge fee for Aptos, so we just use a fixed value.
  const gasLimit = 3e5;
  const gasPrice = 1;

  // const tx = await evmChain.contract.setRemoteValue(
  //   "aptos",
  //   `${client.owner.address()}::hello_world`,
  //   messageEvmToAptos,
  //   {
  //     value: BigInt(Math.floor(gasLimit * gasPrice)),
  //   }
  // );
  // await tx.wait();

  const payload = new HexString(
    defaultAbiCoder.encode(["string"], [messageAptosToEvm])
  ).toUint8Array();
  await client.submitTransactionAndWait(client.owner.address(), {
    function: `${client.owner.address()}::hello_world::call`,
    type_arguments: [],
    arguments: [
      evmChain.name,
      evmChain.contract.address,
      payload,
      gasLimit * gasPrice,
    ],
  });

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  await sleep(3000);

  console.log("--- After ---");
  await logValue();
}

module.exports = {
  deploy,
  execute,
};
