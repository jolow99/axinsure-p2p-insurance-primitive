# Introduction

Axinsure is a new DeFi primitive that enables the easy creation of peer-to-peer insurance protocols.

With Axinsure, anybody can use insurance products from any chain, without having to worry about the underlying technology.

Users can also become insurers, creating automatic, cross-chain disbursements based on changes that happened in the real world.  

# Problem 
Our proof-of-concept highlights a potential use case in agriculture to increase accessibility of weather insurance for farmers.

# Potential Use Cases
1. Weather Insurance: Farmers are able to buy insurance for their crops based on weather conditions.
2. Peer-to-peer bets: Users can bet on the outcome of an event, and the winner is automatically paid out. e.g. Balaji BTC to 1 million bet.

# How It Works
The frontend is built using Thirdweb and React. 

The smart contracts are written in Solidity and deployed on Polygon and Avalanche. 

Axelar was used to enable cross-chain pooling of liquidity and cross-chain disbursements.

There are 3 main contracts:
1. AxinsureOracle: This contract is responsible for fetching weather data . It is deployed on our host chain, Polygon.
2. AxinsureCore: This contract is responsible for creating insurance policies, and for querying the oracle to issue payouts. It is deployed on our host chain, Polygon.
3. AxinsureCollector: This contract is responsible for collecting funds from users and disbursing funds to the winners. It can be deployed on any chain.

# Experiences with Axelar 
1. Axelar was easy to integrate into the solidity code. A lot of abstraction has evidently been done to reduce the number of lines of code that has to be used. 
2. While the Axelar example code was very helpful, it was difficult to adapt it to use within our project as there was no clean template which we could easily integrate from. Instead, our team had to cherry pick different aspects of the code that were relevant to our use case.
3. The aUSDC faucet on Discord was difficult to use as it was rate limited to every 12 hours, and only issued tokens on one chain. Additionally, aUSDC on the different chains were not verified, meaning that we were required to manually craft transactions to call approvals on the aUSDC contract.
Transaction: https://testnet.axelarscan.io/gmp/0xd6f4be3674975626415f2a8fb66fd3231c745ab36dd3679237106512840418bb


## Contracts and Deployment

The Contracts are deployed at

**Mumbai**

Oracle:
https://mumbai.polygonscan.com/address/0xc20AB0E840B400B34e0Bd8C00E2898c73047c085#code

Core:
https://mumbai.polygonscan.com/address/0x9B2DE210Cf202C6F292E599054F9Bf911CE638A8#code

Collector:
https://mumbai.polygonscan.com/address/0x9C7E8199271DBC8eb46A1d6CE782760A6aE08190#code

**AVAX Fuji**

Collector:
https://testnet.snowtrace.io/address/0x9B2DE210Cf202C6F292E599054F9Bf911CE638A8#code

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
