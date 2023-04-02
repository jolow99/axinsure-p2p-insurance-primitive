# Introduction

Axinsure is a new DeFi primitive that enables the easy creation of peer-to-peer insurance protocols.

With Axinsure, anybody can use insurance products from any chain, without having to worry about the underlying technology.

Users can also become insurers, creating automatic, cross-chain disbursements based on changes that happened in the real world.

# Problem

Our proof-of-concept highlights a potential use case in agriculture to increase accessibility of weather insurance for farmers.

# Potential Use Cases

1. Weather Insurance: Farmers are able to buy insurance for their crops based on weather conditions.
2. Peer-to-peer bets: Users can bet on the outcome of an event, and the winner is automatically paid out. e.g. Balaji BTC to 1 million bet.

# Full Description

The problem with traditional insurance systems is that they are often centralized, which can lead to issues with transparency, trust, and high fees which will be inaccessible for most people.

This is where Axinsure comes in, offering a decentralized and cross-chain solution to the problem of insurance accessibility. With Axinsure, anyone can create and participate in insurance products, without having to worry about the underlying technology or chain.

One potential use case for Axinsure is in agriculture, where farmers may struggle to access weather insurance products. Traditional insurance systems often have high fees and may not be tailored to the specific needs of individual farmers, making it difficult for them to protect their crops from the risks of weather-related damage.

Using Axinsure, farmers can easily buy weather insurance that is specifically designed for their needs, without having to go through a centralized insurance provider. This means they can access insurance products that are tailored to their specific needs, while also benefiting from the security and transparency of a decentralized system.

Another potential use case for Axinsure is in peer-to-peer betting, where users can bet on the outcome of an event and receive automatic payouts. This type of betting is becoming increasingly popular, but traditional platforms often suffer from issues of trust and transparency.

Axinsure solves this problem by using cross-chain messaging to create a secure and transparent betting system that is governed by cryptographic guarantees. Users can place bets knowing that their funds are secure and that the system will automatically payout the winner based on the outcome of the event.

Overall, Axinsure represents an innovative solution to the problem of insurance accessibility, using cross-chain messaging to create a decentralized and transparent system that is accessible to anyone. Its potential use cases in agriculture and peer-to-peer betting demonstrate the versatility and potential of the platform, as it continues to push the boundaries of what is possible in the blockchain space.

# Technical Description

The frontend is built using **Thirdweb** and React.

The smart contracts are written in Solidity and deployed on Polygon and Avalanche using **Thirdweb**.

**Axelar** was used to enable cross-chain pooling of liquidity and cross-chain disbursements.

There are 3 main contracts:

1. `AxinsureOracle`: This contract is an oracle responsible for fetching offchain weather data using Chainlink Automation. It is deployed on our host chain, Polygon.
2. `AxinsureCore`: This contract is responsible for creating insurance policies, and for querying the oracle to issue payouts. It is deployed on our host chain, Polygon.
3. `AxinsureCollector`: This contract is responsible for collecting funds from users and disbursing funds to the winners. It can be deployed on any chain.

Overall, the system works as follows:

- Insurers can create insurance policies on the `AxinsureCore` contract, which will be stored on the host chain. Insurers can create policies for any chain, and can specify the payout amount and payout conditions.
- Users can buy insurance policies on the `AxinsureCore` contract, which will be stored on the host chain. Users can buy policies from chain, and can specify the amount of funds they want to contribute.
- When the payout conditions are met, the `AxinsureCore` contract will query the `AxinsureOracle` contract to get the weather data. If the payout conditions are met, the `AxinsureCore` contract will call the `AxinsureCollector` contract on the host chain to disburse funds to the winners. The disbursement will be done using cross-chain messaging, which will allow the `AxinsureCollector` contract to disburse funds to the winners on the chain where the policy was created.

In summary, the system uses cross-chain messaging to create a decentralized and transparent insurance system that is accessible to anyone and users can easily have payouts without having to worry about bridging assets or the underlying chain.

# Experiences with Axelar

1. Axelar was easy to integrate into the solidity code. A lot of abstraction has evidently been done to reduce the number of lines of code that has to be used.
2. While the Axelar example code was very helpful, it was difficult to adapt it to use within our project as there was no clean template which we could easily integrate from. Instead, our team had to cherry pick different aspects of the code that were relevant to our use case.
3. The aUSDC faucet on Discord was difficult to use as it was rate limited to every 12 hours, and only issued tokens on one chain. Additionally, aUSDC on the different chains were not verified, meaning that we were required to manually craft transactions to call approvals on the aUSDC contract.

**Axelar Transaction** : https://testnet.axelarscan.io/gmp/0xd6f4be3674975626415f2a8fb66fd3231c745ab36dd3679237106512840418bb

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
