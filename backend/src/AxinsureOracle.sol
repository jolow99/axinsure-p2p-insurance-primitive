// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


contract AxinsurOracle {
    bool[2] public oracleStatus;

    constructor() {}

    function checkOracle() public returns (bool[2] memory) {
        // In the future this will be implemented as a chainlink function which queries an external API.
        oracleStatus[0] = true;
        oracleStatus[1] = true;
        return oracleStatus;
    }
}