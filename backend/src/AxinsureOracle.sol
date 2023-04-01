// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract AxinsureOracle {
    struct OracleStatus {
        bool isOracleActive;
        bool isConditionValid;
    }

    constructor() {}

    function checkOracle() public pure returns (bool[2] memory) {
        // In the future this will be implemented as a chainlink function which queries an external API.
        OracleStatus memory oracleStatus = OracleStatus(true, true);
        return [oracleStatus.isOracleActive, oracleStatus.isConditionValid];
    }
}