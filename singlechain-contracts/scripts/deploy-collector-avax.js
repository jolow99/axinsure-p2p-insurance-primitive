// Deploy AxinsureCollector on AVAX
const hre = require("hardhat");
const erc20Abi = require("../abi/erc20.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(
    "0xe3abcb47c4176d2570f69502ae4e771ee828ab8624bbc7f6acd5946d42298402",
    provider
  );

  // Deploy AxinsureCore
  const paymentToken = "aUSDC";

  // AVAX
  const axelarGatewayAddress = hre.ethers.utils.getAddress(
    "0xC249632c2D40b9001FE907806902f63038B737Ab"
  );
  const gasReceiverAddress = hre.ethers.utils.getAddress(
    "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6"
  );

  // Deploy AxinsureCollector on AVAX
  const AxinsureCollector = await hre.ethers.getContractFactory(
    "AxinsureCollector"
  );

  const axinsureCoreAddress = hre.ethers.utils.getAddress(
    "0x9B2DE210Cf202C6F292E599054F9Bf911CE638A8"
  );

  const axinsureCollector = await AxinsureCollector.deploy(
    axinsureCoreAddress,
    "Avalanche",
    axelarGatewayAddress,
    paymentToken,
    gasReceiverAddress
  );
  await axinsureCollector.deployed();
  console.log("AxinsureCollector deployed to:", axinsureCollector.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
