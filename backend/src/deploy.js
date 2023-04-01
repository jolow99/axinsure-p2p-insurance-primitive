"use strict";

const {
  utils: { deployContract },
} = require("@axelar-network/axelar-local-dev");

const AxinsureCollector = rootRequire(
  "../artifacts/src/AxinsureCollector.sol/AxinsureCollector.json"
);

const AxinsureCore = rootRequire(
  "../artifacts/src/AxinsureCore.sol/AxinsureCore.json"
);

const AxinsureOracle = rootRequire(
  "../artifacts/src/AxinsureOracle.sol/AxinsureOracle.json"
);

const { defaultAbiCoder } = require("ethers/lib/utils");

async function deploy(chain, wallet) {
  // Deploy AxinsureOracle contract
  console.log(`Deploying AxinsureOracle for ${chain.name}.`);
  chain.contract = await deployContract(wallet, AxinsureOracle, [
    chain.gateway,
    chain.gasService,
  ]);
  console.log(
    `Deployed AxinsureOracle for ${chain.name} at ${chain.contract.address}.`
  );
}

// async function execute(evmChain, wallet, options) {
//   const args = options.args || [];
//   const client = new AptosNetwork(process.env.APTOS_URL);

//   const messageEvmToAptos =
//     args[1] ||
//     `Hello Aptos from ${
//       evmChain.name
//     }, it is ${new Date().toLocaleTimeString()}.`;
//   const messageAptosToEvm =
//     args[2] ||
//     `Hello ${
//       evmChain.name
//     } from Aptos, it is ${new Date().toLocaleTimeString()}.`;

//   async function logValue() {
//     console.log(
//       `value at ${evmChain.name} is "${await evmChain.contract.value()}"`
//     );
//     const resources = await client.getAccountResources(client.owner.address());
//     const resource = resources.find(
//       (r) => r.type === `${client.owner.address()}::hello_world::MessageHolder`
//     );
//     const msg = resource.data.message;
//     console.log(`value at Aptos is "${msg}"`);
//   }

//   console.log("--- Initially ---");
//   await logValue();

//   // Currently, our SDK can't calculate bridge fee for Aptos, so we just use a fixed value.
//   const gasLimit = 3e5;
//   const gasPrice = 1;

//   const tx = await evmChain.contract.setRemoteValue(
//     "aptos",
//     `${client.owner.address()}::hello_world`,
//     messageEvmToAptos,
//     {
//       value: BigInt(Math.floor(gasLimit * gasPrice)),
//     }
//   );
//   await tx.wait();

//   const payload = new HexString(
//     defaultAbiCoder.encode(["string"], [messageAptosToEvm])
//   ).toUint8Array();
//   await client.submitTransactionAndWait(client.owner.address(), {
//     function: `${client.owner.address()}::hello_world::call`,
//     type_arguments: [],
//     arguments: [
//       evmChain.name,
//       evmChain.contract.address,
//       payload,
//       gasLimit * gasPrice,
//     ],
//   });

//   const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   await sleep(3000);

//   console.log("--- After ---");
//   await logValue();
// }

module.exports = {
  preDeploy,
  deploy,
  execute,
};
