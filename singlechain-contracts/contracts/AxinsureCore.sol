// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// import "@openzeppelin/contracts/token/ERC20/extensions/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/utils/AddressString.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol';

interface IOracle{
    function checkOracle() external view returns (bool[2] calldata);
}

struct InsurancePolicy{
    address insurerAddress;
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

contract AxinsureCore is Ownable, AxelarExecutable {
    /// Token which premiums are collected and distributed in
    string public paymentToken; 
    address public paymentTokenAddress;

    /// Array of all policies
    InsurancePolicy[] public InsurancePolicies;

    /// Maps policyNumber to an array of UserDetails
    mapping (uint256 => UserDetails[]) public policyUsers;

    /// Maps chain to AxinsureCollector address
    mapping (string => address) public axInsureCollectors;

    // / Axelar Variables
    IAxelarGasService public immutable gasService;



    constructor(string memory _paymentToken, address _axelarGatewayAddress, address _gasReceiver) AxelarExecutable(_axelarGatewayAddress) {
        paymentToken = _paymentToken;
        paymentTokenAddress = gateway.tokenAddresses(_paymentToken);

        gasService = IAxelarGasService(_gasReceiver);
    }

    event newPolicyAdded(uint256 indexed policyNumber, address indexed insurerAddress, address oracleAddress, uint256 fundingAmount, uint256 payoutAmount, uint256 premiumsCost);
    event newUserAdded(uint256 indexed policyNumber, string indexed userChain, address userAddress);

    // Getter function for paymentToken
    function getPaymentToken() public view returns (string memory) {
        return paymentToken;
    }

    /// Creates a new InsurancePolicy
    function createInsurancePolicy(address oracleAddress, uint256 fundingAmount, uint256 payoutAmount, uint256 premiumsCost) public {
        require(fundingAmount >= premiumsCost, "Funding amount is insufficient to cover premiums");

        // Insurer transfers fund to the insurance policy contract
        // IERC20(paymentTokenAddress).approve(address(this), fundingAmount);
        IERC20(paymentTokenAddress).transferFrom(msg.sender, address(this), fundingAmount);

        uint256 policyNumber = InsurancePolicies.length + 1;

        // Create a new InsurancePolicy struct and add it to the InsurancePolicies array
        InsurancePolicy memory insurancePolicy = InsurancePolicy(msg.sender, oracleAddress, fundingAmount, payoutAmount, premiumsCost, policyNumber, 0, true);

        InsurancePolicies.push(insurancePolicy);
        
        emit newPolicyAdded(policyNumber, msg.sender, oracleAddress, fundingAmount, payoutAmount, premiumsCost);
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

        // Checks the oracle to see if conditions are met
        IOracle oracle = IOracle(insurancePolicy.oracleAddress);
        bool[2] memory oracleResult = oracle.checkOracle();

        // If conditions are met, send payout to all users in the policy
        if (oracleResult[0] && oracleResult[1]) {
            uint256 numOfPolicyUsers = policyUsers[policyNumber].length;
            for (uint256 i = 0; i < numOfPolicyUsers; i++) {
                // Send payout to each user in the policy
                UserDetails memory userDetails = policyUsers[policyNumber][i];
                gateway.sendToken(userDetails.userChain, AddressToString.toString(userDetails.userAddress), "aUSDC", insurancePolicy.payoutAmount);
            }
            // Send remaining funds to the insurer
            uint256 remainingFunds = insurancePolicy.fundingAmount - numOfPolicyUsers * insurancePolicy.payoutAmount;

            // TODO: Placeholder
            gateway.sendToken("axelar", AddressToString.toString(insurancePolicy.insurerAddress), "aUSDC", remainingFunds);

            // Set policy to inactive
            insurancePolicy.isPolicyActive = false;
        } else if (oracleResult[0] && !oracleResult[1]) {
            // Send remaining funds to the insurer
            gateway.sendToken("axelar", AddressToString.toString(insurancePolicy.insurerAddress), "aUSDC", insurancePolicy.fundingAmount);

            // Set policy to inactive
            insurancePolicy.isPolicyActive = false;
        } else {
            // Do nothing
        }
    }

    /// Add a collector contract address for a chain.
    /// Can only be called by the owner of the contract.
    function addCollector(string calldata chain, address collectorAddress) public onlyOwner{
        axInsureCollectors[chain] = collectorAddress;
    }

    /// Executes addPolicyUser() by the collector contract for core contract.
    function  _executeWithToken(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload,
        string calldata,
        uint256
    ) internal override {
        // Decode the payload 
        (uint256 policyNumber, address userAddress) = abi.decode(payload, (uint256,address));
        
        // Check if source address and chain belong in the same mapping
        // Convert sourceAddress to address type
        address sourceAddressConverted = StringToAddress.toAddress(sourceAddress);

        require(axInsureCollectors[sourceChain] == sourceAddressConverted, "Source address and chain do not belong in the same mapping");

        addPolicyUser(policyNumber, sourceChain, userAddress);
    }
}
