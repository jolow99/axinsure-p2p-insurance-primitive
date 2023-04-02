require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    avalanche_fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [
        "0xe3abcb47c4176d2570f69502ae4e771ee828ab8624bbc7f6acd5946d42298402",
      ],
    },
    polygon_mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [
        "0xe3abcb47c4176d2570f69502ae4e771ee828ab8624bbc7f6acd5946d42298402",
      ],
    },
    buildbear: {
      url: "https://rpc.buildbear.io/Drunk_Rugor_Nass_8d3194db",
      accounts: [
        "0xe3abcb47c4176d2570f69502ae4e771ee828ab8624bbc7f6acd5946d42298402",
      ],
    },
  },

  etherscan: {
    apiKey: {
      buildbear: "verifyContracts",
      polygonMumbai: "KYI4HC428Q54B4AWFSUMTYXJV5FAP46TYE",
      avalancheFujiTestnet: "PNUQDN7DNKZ2DTMWQWWDXIZ2BHA5AEGXEZ",
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
