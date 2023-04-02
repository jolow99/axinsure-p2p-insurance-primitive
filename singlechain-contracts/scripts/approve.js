// Deploy AxinsureCore and AxinsureOracle contracts
const hre = require("hardhat");
const erc20Abi = require("../abi/erc20.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(
    "0xe3abcb47c4176d2570f69502ae4e771ee828ab8624bbc7f6acd5946d42298402",
    provider
  );

  //// Function Execution

  const aUSDCTokenAddress = ethers.utils.getAddress(
    "0x2c852e740B62308c46DD29B982FBb650D063Bd07"
  ); // Polygon mumbai

  const abi = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",

    // Authenticated Functions
    "function transfer(address to, uint amount) returns (bool)",

    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)",
  ];

  const aUSDC = new ethers.Contract(aUSDCTokenAddress, abi, signer);

  const aUSDCWithSigner = aUSDC.connect(signer);

  // Get balance of aUSDC
  const balance = await aUSDCWithSigner.balanceOf(signer.address);

  // // // const aUSDCWithSigner = aUSDC.connect(signer);

  // // // Approve AxinsureCore to spend aUSDC
  // // const approveTx = await aUSDCWithSigner.approve(
  // //   axinsureCoreAddress,
  // //   ethers.utils.parseUnits("10", 6)
  // // );

  // // await approveTx.wait();
  // // console.log("aUSDC approved to AxinsureCore");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
