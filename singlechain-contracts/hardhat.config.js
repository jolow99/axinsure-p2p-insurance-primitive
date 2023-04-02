require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    avalanche_fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [process.env.PRIVATE_KEY],
    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY],
    },
    buildbear: {
      url: "https://rpc.buildbear.io/Drunk_Rugor_Nass_8d3194db",
      accounts: [process.env.PRIVATE_KEY],
    },
  },

  etherscan: {
    apiKey: {
      buildbear: "verifyContracts",
      polygonMumbai: process.env.POLYGON_MUMBAI_API_KEY,
      avalancheFujiTestnet: process.env.AVALANCHE_FUJI_API_KEY,
    },
    customChains: [
      {
        network: "buildbear",
        chainId: 8120,
        // Insert the ChainId received from BuildBear Dashboard
        urls: {
          apiURL:
            "https://rpc.buildbear.io/verify/etherscan/Drunk_Rugor_Nass_8d3194db",
          browserURL:
            "https://explorer.buildbear.io/node/Drunk_Rugor_Nass_8d3194db",
        },
      },
    ],
  },
};
