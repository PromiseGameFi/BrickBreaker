// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameScores {
    address public admin;

    mapping(address => uint256) public totalScores;
    mapping(address => uint256) public highScores;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addToScore(address player, uint256 score) external  {
        totalScores[player] += score;
    }

    function updateHighScore(address player, uint256 score) external {
        if (score > highScores[player]) {
            highScores[player] = score;
        }
    }
}
