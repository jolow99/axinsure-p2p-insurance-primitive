// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/utils/AddressString.sol";


contract AxinsureCollector is AxelarExecutable{
    string public paymentToken; // Token which premiums are collected and distributed in
    address public axinsureCoreDstAddress; // Destination Address of the core contract
    string public axinsureCoreDstChain; // Destination chain of the core contract

    IAxelarGasService public immutable gasService;

    constructor(address _axinsureCoreDstAddress, string memory _axinsureCoreDstChain, address _axelarGatewayAddress, string memory _paymentToken, address _gasReceiver) AxelarExecutable(_axelarGatewayAddress) {
        axinsureCoreDstAddress = _axinsureCoreDstAddress;
        axinsureCoreDstChain = _axinsureCoreDstChain;
        paymentToken = _paymentToken;
        gasService = IAxelarGasService(_gasReceiver);
    }

    /// Allows the insuree to collect payouts from the destination chain to the current chain
    /// Triggers an oracle check on the destination chain
    function collectPayoutsOnDstChain(uint256 policyNumber) public {
        // 1. Use Axelar GMP to interact with axinsure core contract on the destination chain and call the payout function
        gateway.callContract(axinsureCoreDstChain, AddressToString.toString(axinsureCoreDstAddress), abi.encodeWithSignature("checkOracleAndPayout(uint256)", policyNumber));

        // 2. TODO: Add in a check to ensure that the payout was successful
    }

    /// Allows the user to purchase a policy on the host chain
    function addPolicyUserOnDstChain(uint256 policyNumber) public payable {
        address tokenAddress = gateway.tokenAddresses(paymentToken);

        // 1. TODO: Somehow get the insurance policy information from the destination chain
        uint256 premiumsCost = 100;

        // 2. Collect premiums from the user based on the premiumsCost of the policy, and approve gateway to transfer tokens
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), premiumsCost);
        IERC20(tokenAddress).approve(address(gateway), premiumsCost);

        // 3. Pay gas and transfer the premiums to InsuranceCore and call the addPolicyUser function
        bytes memory payload = abi.encode(policyNumber, msg.sender);
        string memory axinsureCoreDstAddressStr = AddressToString.toString(axinsureCoreDstAddress);

        if (msg.value > 0 ) {
            gasService.payNativeGasForContractCallWithToken{ value: msg.value}(
                address(this),
                axinsureCoreDstChain,
                axinsureCoreDstAddressStr,
                payload,
                paymentToken,
                premiumsCost,
                msg.sender
            );
        }

        // Calls the contract on the dst chain which has AxinsureCore.sol deployed
        gateway.callContractWithToken(axinsureCoreDstChain, axinsureCoreDstAddressStr, payload, paymentToken, premiumsCost);
        
        // 4. TODO: Add in a check to ensure that the policy was successfully added
        
    }
}


