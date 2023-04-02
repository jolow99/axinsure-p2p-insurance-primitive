# Introduction

Axinsure is a new DeFi primitive that enables the easy creation of peer-to-peer insurance protocols.

With Axinsure, anybody can use insurance products from any chain, without having to worry about the underlying technology.

Users can also become insurers, creating automatic, cross-chain disbursements based on changes that happened in the real world.

# Problem

Our proof-of-concept highlights a potential use case in agriculture to increase accessibility of weather insurance for farmers.

# Potential Use Cases

1. Weather Insurance: Farmers are able to buy insurance for their crops based on weather conditions.
2. Peer-to-peer bets: Balaji 1million btc, or sports betting

# How It Works

The technology is built using Chainlink Functions and Automations for off-chain monitoring of events, Axelar for cross-chain pooling of liquidity, and Thirdweb for deployment across multiple chains.

# How To Run Locally

1. Git clone
2. Install Dependencies

- This project uses [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/).
- This project uses Axelar and Thirdweb dependencies.
- Please have Solidity and Javascript installed

```bash
npm install
```

3. Set up Private keys for Axelar

Set environment variables
You can get started quickly with a random local key and .env file by running

`npm run setup`

Or you can manually copy the example .env.example file and fill in your EVM private key. See the example Metamask Instructions for exporting your private keys.

cp .env.example .env
Then update to your own private key.

#### Print wallet balances

This script will print your wallet balances for each chain.

`npm run check-balance [local|testnet]`
If not specify, this will print balances of the wallet for testnet.

Running the local chains
`npm run start`
Leave this node running on a separate terminal before deploying and testing the dApps.

3. Start the local chains

```bash
npm run start
```

4. Deploy singular contract on Testnet

```bash
npx hardhat run scripts/deploy.js --network polygon_mumbai
npx hardhat run scripts/deploy-collector-avax.js --network avalanche_fuji
```

Or using BuildBear

```bash
npx hardhat run scripts/deploy.js --network buildbear
```

5. Deploy AxinsureCollector contract on Multichain

```bash
npm run deploy-hardhat local
```

This will deploy AxinsureCollector on Polygon and Eth and Fantom.

To deploy on testnet, run

```bash
npm run deploy-hardhat testnet
```

Verify the contract on Etherscan

```bash
npx hardhat verify --network polygon_mumbai DEPLOYED_CONTRACT_ADDRESS
```

6. Execute function in AxinsureCollector contract deployed across chains with Axelar

```bash
npm run execute local "Avalanche" "Fantom" 100 0xBa86A5719722B02a5D5e388999C25f3333c7A9fb
```
