# axinsure-p2p-insurance-primitive# axinsure-p2p-insurance-primitive

### Setup

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

6. Execute function in AxinsureCollector contract deployed across chains with Axelar

```bash
npm run execute local "Avalanche" "Fantom" 100 0xBa86A5719722B02a5D5e388999C25f3333c7A9fb
```
