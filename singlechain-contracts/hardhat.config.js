require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    buildbear: {
      url: "https://rpc.buildbear.io/Dizzy_Quarsh_Panaka_56ad75f5",
      accounts: [
        "0xe3abcb47c4176d2570f69502ae4e771ee828ab8624bbc7f6acd5946d42298402",
      ],
    },
  },

  etherscan: {
    apiKey: {
      buildbear: "verifyContracts",
    },
    customChains: [
      {
        network: "buildbear",
        chainId: 8120,
        // Insert the ChainId received from BuildBear Dashboard
        urls: {
          apiURL:
            "https://rpc.buildbear.io/verify/etherscan/Dizzy_Quarsh_Panaka_56ad75f5",
          browserURL:
            "https://explorer.buildbear.io/node/Dizzy_Quarsh_Panaka_56ad75f5",
        },
      },
    ],
  },
};
