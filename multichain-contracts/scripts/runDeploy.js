const {
  deploy,
  checkEnv,
  getEVMChains,
  getExamplePath,
  getWallet,
} = require("./libs");

const env = process.argv[2];
const chainsToDeploy = process.argv.slice(3);

// Check the environment. If it is not valid, exit.
checkEnv(env);

// Get the example object.
const example = require(getExamplePath());

// Get the chains for the environment.
const chains = getEVMChains(env, chainsToDeploy);

// Get the wallet.
const wallet = getWallet();

// This will execute an example script. The example script must have a `deploy` function.
deploy(env, chains, wallet, example);
