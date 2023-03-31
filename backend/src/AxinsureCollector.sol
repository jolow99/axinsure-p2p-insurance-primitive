// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "lib/axelar-cgp-solidity/contracts/interfaces/IAxelarGateway.sol";
import "lib/axelar-gmp-sdk-solidity/contracts/utils/AddressString.sol";

struct InsurancePolicy{
    address oracleAddress;
    uint256 fundingAmount;
    uint256 payoutAmount;
    uint256 premiumsCost;
    uint256 policyNumber;
    uint256 premiumsTotal;
    bool isPolicyActive;
}

contract AxinsureCollector {
    address public paymentToken; // Token which premiums are collected and distributed in
    address public axinsureCoreDstAddress; // Destination Address of the core contract
    string public axinsureCoreDstChain; // Destination chain of the core contract
    address public axelarGatewayAddress; // Axelar Gateway Address on the current chain
    
    constructor() {}

    function collectPremiums(uint256 policyNumber) public {
        InsurancePolicy memory insurancePolicy = InsurancePolicies[policyNumber];

        // Transfer the amount of payment token from the sender to this contract. Ensure user has approved the contract.
        IERC20(paymentToken).transferFrom(msg.sender, address(this), amount);

        // Transfer the amount of payment token from this contract to the destination chain using Axelar GMP
        IAxelarGateway axelarGateway = IAxelarGateway(axelarGatewayAddress);
        axelarGateway.callContractWithToken(axinsureCoreDstChain, axinsureCoreDstAddress, abi.encodeWithSignature("collectPremiums(uint256)", amount), paymentToken, amount);

    }

    // Create a function to receive payouts in payment token
    function collectPayouts(uint256 amount) public {
        // Use Axelar GMP to interact with axinsure core contract on the destination chain and call the payout function
        
    }


}
