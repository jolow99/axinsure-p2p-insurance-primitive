"use strict";
require("dotenv").config();
const {
  executeEVMExample,
  executeAptosExample,
  checkEnv,
  getExamplePath,
  getWallet,
  getEVMChains,
} = require("./libs");

console.log("Args are: ", process.argv);
const env = process.argv[2];
const args = process.argv.slice(3);

// Check the environment. If it is not valid, exit.
checkEnv(env);

// Get the example object.
const example = require(getExamplePath());

// Get the wallet.
const wallet = getWallet();

// This will execute an deploy script. The deploy script must have an `execute` function.
// This executes the EVM chains only.
const chains = getEVMChains(env, selectedChains);
executeEVMExample(env, chains, args, wallet, example);
