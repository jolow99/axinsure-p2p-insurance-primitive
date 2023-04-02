# Single Chain Contracts

- This repo contains the contracts for Single chain.

AxInsureCore is the main contract that is deployed on the blockchain. It contains the logic for the insurance policies and the claims.

AxinsureOracle is the contract that is used to get the conditions for the payouts. It is deployed on the blockchain and is used by the AxInsureCore contract.

### Commands

Testing

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
```

Deployment

```shell
npx hardhat node
npx hardhat run scripts/deploy.js
npx hardhat run --network localhost scripts/deploy.js
```
