// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LoanApprovalRegistry is Ownable {
    enum Decision {
        APPROVED,
        REJECTED
    }

    struct LoanApproval {
        uint256 loanId;
        Decision decision;
        address admin;
        uint256 timestamp;
    }

    mapping(uint256 => LoanApproval) public approvals;

    event LoanDecisionRecorded(
        uint256 indexed loanId,
        Decision decision,
        address indexed admin,
        uint256 timestamp
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    function recordDecision(
        uint256 loanId,
        Decision decision
    ) external onlyOwner {
        require(approvals[loanId].timestamp == 0, "Decision already recorded");

        approvals[loanId] = LoanApproval({
            loanId: loanId,
            decision: decision,
            admin: msg.sender,
            timestamp: block.timestamp
        });

        emit LoanDecisionRecorded(
            loanId,
            decision,
            msg.sender,
            block.timestamp
        );
    }

    function getDecision(uint256 loanId)
        external
        view
        returns (LoanApproval memory)
    {
        return approvals[loanId];
    }
}
