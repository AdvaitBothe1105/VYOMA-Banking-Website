// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TxHashStore {
    event HashRecorded(bytes32 indexed hash, address indexed sender);

    bytes32[] private hashes;

    function record(bytes32 hash) external {
        hashes.push(hash);
        emit HashRecorded(hash, msg.sender);
    }

    function getCount() external view returns (uint256) {
        return hashes.length;
    }

    function getHash(uint256 index) external view returns (bytes32) {
        return hashes[index];
    }
}