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
    string public axinsureCoreDstAddressString;
    string public axinsureCoreDstChain; // Destination chain of the core contract
    address public axelarGatewayAddress; // Axelar Gateway Address on the current chain
    
    constructor(address _axinsureCoreDstAddress, string memory _axinsureCoreDstChain, address _axelarGatewayAddress, address _paymentToken) {
        axinsureCoreDstAddress = _axinsureCoreDstAddress;
        axinsureCoreDstAddressString = AddressToString.toString(_axinsureCoreDstAddress);
        axinsureCoreDstChain = _axinsureCoreDstChain;
        axelarGatewayAddress = _axelarGatewayAddress;
        paymentToken = _paymentToken;
    }
    


    // // Allows the insurer to collect premiums accumulated on the chain of the insurance policy
    // function collectPremiums(uint256 policyNumber) public {
    //     InsurancePolicy memory insurancePolicy = InsurancePolicies[policyNumber];

    //     // Transfer the amount of payment token from the sender to this contract. Ensure user has approved the contract.
    //     IERC20(paymentToken).transferFrom(msg.sender, address(this), amount);

    //     // Transfer the amount of payment token from this contract to the destination chain using Axelar GMP
    //     IAxelarGateway axelarGateway = IAxelarGateway(axelarGatewayAddress);
    //     axelarGateway.callContractWithToken(axinsureCoreDstChain, axinsureCoreDstAddress, abi.encodeWithSignature("collectPremiums(uint256)", amount), paymentToken, amount);

    // }

    // Create a function to receive payouts in payment token
    function collectPayoutsOnDstChain(uint256 amount) public {
        // Use Axelar GMP to interact with axinsure core contract on the destination chain and call the payout function

        // Calls checkOracleAndPayout function on the destination chain
        IAxelarGateway axelarGateway = IAxelarGateway(axelarGatewayAddress);
        axelarGateway.callContract(axinsureCoreDstChain, axinsureCoreDstAddressString, abi.encodeWithSignature("checkOracleAndPayout(uint256)", amount));

        // TODO: Add in a check to ensure that the payout was successful
    }

    /// Allows the user to purchase a policy on the host chain
    function addPolicyUserOnDstChain(uint256 policyNumber, string memory userChain, address userAddress) public {
        // Use Axelar GMP to interact with axinsure core contract on the destination chain and call the addPolicy function

        // Calls addPolicyUser function on the destination chain
        IAxelarGateway axelarGateway = IAxelarGateway(axelarGatewayAddress);
        axelarGateway.callContract(axinsureCoreDstChain, axinsureCoreDstAddressString, abi.encodeWithSignature("addPolicyUser(uint256,string,address)", policyNumber, userChain, userAddress));
        
        // TODO: Add in a check to ensure that the policy was successfully added
        
    }
}


