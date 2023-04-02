// Deploy AxinsureCore and AxinsureOracle contracts
const hre = require("hardhat");
const erc20Abi = require("../abi/erc20.json");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider();
  const signer = provider.getSigner();

  // Deploy AxinsureOracle
  const AxinsureOracle = await hre.ethers.getContractFactory("AxinsureOracle");
  const axinsureOracle = await AxinsureOracle.deploy();
  await axinsureOracle.deployed();
  console.log("AxinsureOracle deployed to:", axinsureOracle.address);

  // Deploy AxinsureCore
  const paymentToken = "aUSDC";

  // Polygon
  const axelarGatewayAddress = "0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B";
  const gasReceiverAddress = "0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6";

  const AxinsureCore = await hre.ethers.getContractFactory("AxinsureCore");
  const axinsureCore = await AxinsureCore.deploy(
    "aUSDC",
    axelarGatewayAddress,
    gasReceiverAddress
  );
  await axinsureCore.deployed();
  console.log("AxinsureCore deployed to:", axinsureCore.address);

  const aUSDCTokenAddress = ethers.utils.getAddress(
    "0x2c852e740B62308c46DD29B982FBb650D063Bd07"
  ); // Polygon mumbai

  // const aUSDC = new ethers.Contract(aUSDCTokenAddress, erc20Abi, provider);
  // const aUSDCWithSigner = aUSDC.connect(signer);

  // // Approve AxinsureCore to spend aUSDC
  // const approveTx = await aUSDCWithSigner.approve(
  //   axinsureCore.address,
  //   ethers.utils.parseUnits("100000", 6)
  // );

  // await approveTx.wait();

  // Deploy AxinsureCollector on Polygon
  const AxinsureCollector = await hre.ethers.getContractFactory(
    "AxinsureCollector"
  );

  const axinsureCollector = await AxinsureCollector.deploy(
    axinsureCore.address,
    "Polygon",
    axelarGatewayAddress,
    paymentToken,
    gasReceiverAddress
  );
  await axinsureCollector.deployed();
  console.log("AxinsureCollector deployed to:", axinsureCollector.address);

  // // Call createInsurancePolicy on AxinsureCore
  // const createInsurancePolicyTx = await axinsureCore.createInsurancePolicy(
  //   axinsureOracle.address,
  //   100,
  //   10,
  //   1
  // );
  // await createInsurancePolicyTx.wait();
  // console.log("createInsurancePolicyTx:", createInsurancePolicyTx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
