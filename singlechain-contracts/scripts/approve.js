// Deploy AxinsureCore and AxinsureOracle contracts
const hre = require("hardhat");
const erc20Abi = require("../abi/erc20.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(
    "0xe3abcb47c4176d2570f69502ae4e771ee828ab8624bbc7f6acd5946d42298402",
    provider
  );

  console.log("signer address:", signer.address);

  // Deploy AxinsureCore
  const paymentToken = "aUSDC";

  // Polygon
  const axelarGatewayAddress = "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B";
  const gasReceiverAddress = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";

  const axinsureCoreAddress = "0x9B2DE210Cf202C6F292E599054F9Bf911CE638A8";

  //// Function Execution

  const aUSDCTokenAddress = ethers.utils.getAddress(
    "0x2c852e740B62308c46DD29B982FBb650D063Bd07"
  ); // Polygon mumbai

  const aUSDCWithSigner = new ethers.Contract(
    aUSDCTokenAddress,
    erc20Abi,
    signer
  );

  // const aUSDCWithSigner = await hre.ethers.getContractAt(
  //   "aUSDC",
  //   "0x2c852e740B62308c46DD29B982FBb650D063Bd07",
  //   signer
  // );

  // get contract balance
  const balance = await aUSDCWithSigner.name();
  console.log("aUSDC balance:", balance);

  // // const aUSDCWithSigner = aUSDC.connect(signer);

  // // Approve AxinsureCore to spend aUSDC
  // const approveTx = await aUSDCWithSigner.approve(
  //   axinsureCoreAddress,
  //   ethers.utils.parseUnits("10", 6)
  // );

  // await approveTx.wait();
  // console.log("aUSDC approved to AxinsureCore");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
