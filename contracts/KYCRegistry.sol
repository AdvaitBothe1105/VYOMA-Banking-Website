// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title KYCRegistry
 * @notice Stores immutable on-chain proof that a user's KYC has been verified
 *         without storing any personal data.
 */
contract KYCRegistry is Ownable {

    struct KYCRecord {
        bytes32 kycHash;        // Hash of off-chain KYC metadata
        address verifiedBy;     // Verifier (admin) address
        uint256 verifiedAt;     // Timestamp
    }

    // user wallet => KYC record
    mapping(address => KYCRecord) private kycRecords;

    // user wallet => verification status
    mapping(address => bool) public isVerified;

    event KYCVerified(
        address indexed user,
        bytes32 kycHash,
        address indexed verifier,
        uint256 timestamp
    );

    /**
     * @dev Pass deployer as initial owner (OpenZeppelin v5 requirement)
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Attest that a user's KYC is verified
     * @dev Only callable by contract owner (bank / compliance authority)
     */
    function attestKYC(address user, bytes32 kycHash) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(!isVerified[user], "KYC already verified");

        kycRecords[user] = KYCRecord({
            kycHash: kycHash,
            verifiedBy: msg.sender,
            verifiedAt: block.timestamp
        });

        isVerified[user] = true;

        emit KYCVerified(user, kycHash, msg.sender, block.timestamp);
    }

    /**
     * @notice Get full KYC record for auditing
     */
    function getKYCRecord(address user)
        external
        view
        returns (
            bytes32 kycHash,
            address verifiedBy,
            uint256 verifiedAt
        )
    {
        require(isVerified[user], "KYC not verified");

        KYCRecord memory record = kycRecords[user];
        return (
            record.kycHash,
            record.verifiedBy,
            record.verifiedAt
        );
    }
}
