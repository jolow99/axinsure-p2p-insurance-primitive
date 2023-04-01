// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "lib/axelar-cgp-solidity/contracts/interfaces/IAxelarGateway.sol";
import "lib/axelar-gmp-sdk-solidity/contracts/utils/AddressString.sol";


interface IOracle{
    function checkOracle() external view returns (bool[2] calldata);
}

struct InsurancePolicy{
    address oracleAddress;
    uint256 fundingAmount;
    uint256 payoutAmount;
    uint256 premiumsCost;
    uint256 policyNumber;
    uint256 premiumsTotal;
    bool isPolicyActive;
}

struct UserDetails{
    string userChain;
    address userAddress;
}

contract AxinsureCore is Ownable{
    /// Token which premiums are collected and distributed in
    address public paymentToken; 

    /// Axelar Gateway Address on the current chain
    address public axelarGatewayAddress;

    // Array of all policies
    InsurancePolicy[] public InsurancePolicies;

    /// Maps policyNumber to an array of UserDetails
    mapping (uint256 => UserDetails[]) public policyUsers;

    /// Maps chain to AxinsureCollector address
    mapping (string => address) public axInsureCollectors;


    constructor(address _paymentToken, address _axelarGatewayAddress) {
        paymentToken = _paymentToken;
        axelarGatewayAddress = _axelarGatewayAddress;
    }

    event newPolicyAdded(uint256 indexed policyNumber,  address oracleAddress, uint256 fundingAmount, uint256 payoutAmount, uint256 premiumsCost);
    event newUserAdded(uint256 indexed policyNumber, string indexed userChain, address userAddress);

    /// Creates a new InsurancePolicy
    function addInsurancePolicy(address oracleAddress, uint256 fundingAmount, uint256 payoutAmount, uint256 premiumsCost) public {
        require(fundingAmount >= premiumsCost, "Funding amount is insufficient to cover premiums");
        IERC20Metadata(paymentToken).transferFrom(msg.sender, address(this), fundingAmount);
        uint256 policyNumber = InsurancePolicies.length + 1;

        // Create a new InsurancePolicy struct and add it to the InsurancePolicies array
        InsurancePolicy memory insurancePolicy = InsurancePolicy(oracleAddress, fundingAmount, payoutAmount, premiumsCost, policyNumber, 0, true);
        InsurancePolicies.push(insurancePolicy);
        emit newPolicyAdded(policyNumber, oracleAddress, fundingAmount, payoutAmount, premiumsCost);
    }

    /// Adds user to a specifc InsurancePolicy 
    function addPolicyUser(uint256 policyNumber, string calldata userChain, address userAddress) public {
        InsurancePolicy memory insurancePolicy = InsurancePolicies[policyNumber];

        // Check if the policy has enough funding to cover the new user
        require(insurancePolicy.premiumsCost + insurancePolicy.premiumsTotal < insurancePolicy.fundingAmount, "Insufficient funding to insure additional users");

        UserDetails memory userDetails = UserDetails(userChain, userAddress);
        policyUsers[policyNumber].push(userDetails);
        insurancePolicy.premiumsTotal += insurancePolicy.premiumsCost;
        emit newUserAdded(policyNumber, userChain, userAddress);
    }

    /// Checks if policy is active
    /// Queries the oracle to check if conditions are met
    /// If conditions met, sends payout to all users in the policy in their respective chains
    function checkOracleAndPayout(uint256 policyNumber) public {
        InsurancePolicy memory insurancePolicy = InsurancePolicies[policyNumber];
        require(insurancePolicy.isPolicyActive, "Policy is not active");
        IOracle oracle = IOracle(insurancePolicy.oracleAddress);
        bool[2] memory oracleResult = oracle.checkOracle();
        IAxelarGateway axelarGateway = IAxelarGateway(axelarGatewayAddress);
        if (oracleResult[0] && oracleResult[1]) {
            uint256 eachPayout = insurancePolicy.payoutAmount / policyUsers[policyNumber].length;
            for (uint256 i = 0; i < policyUsers[policyNumber].length; i++) {
                // Send payout to each user in the policy
                UserDetails memory userDetails = policyUsers[policyNumber][i];
                axelarGateway.sendToken(userDetails.userChain, AddressToString.toString(userDetails.userAddress), IERC20Metadata(paymentToken).symbol(), eachPayout);

                // TODO does the policy need to be deleted after payout?
            }
        }
    }

    /// Add a collector contract address for a chain.
    /// Can only be called by the owner of the contract.
    function addCollector(string calldata chain, address collectorAddress) public onlyOwner{
        axInsureCollectors[chain] = collectorAddress;
    }
}
