pragma solidity ^0.8.0;

contract BillingVerification {
    struct Bill {
        uint256 estimatedCost;
        uint256 hospitalCost;
        bool verified;
    }

    mapping(address => Bill[]) public bills;

    function verifyBill(uint256 _estimatedCost, uint256 _hospitalCost) public {
        bool isVerified = _hospitalCost <= _estimatedCost;
        bills[msg.sender].push(Bill(_estimatedCost, _hospitalCost, isVerified));
    }

    function getBills(address _user) public view returns (Bill[] memory) {
        return bills[_user];
    }
}