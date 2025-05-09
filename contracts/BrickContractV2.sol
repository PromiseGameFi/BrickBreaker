// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameScores {
    address public admin;

    // Store player scores
    mapping(address => uint256) public totalScores;
    mapping(address => uint256) public highScores;
    
    // Array to store all player addresses with high scores
    address[] public highScorePlayers;
    
    // Mapping to check if a player is already in the highScorePlayers array
    mapping(address => bool) public isHighScorePlayer;
    
    // Event to emit when a new high score is set
    event NewHighScore(address player, uint256 score);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function addToScore(address player, uint256 score) onlyAdmin external {
        totalScores[player] += score;
    }

    function updateHighScore(address player, uint256 score) onlyAdmin external {
        if (score > highScores[player]) {
            highScores[player] = score;
            
            // Add player to highScorePlayers array if not already there
            if (!isHighScorePlayer[player]) {
                highScorePlayers.push(player);
                isHighScorePlayer[player] = true;
            }
            
            // Emit event for frontend to listen to
            emit NewHighScore(player, score);
        }
    }
    
    // Get all players with high scores
    function getAllHighScorePlayers() external view returns (address[] memory) {
        return highScorePlayers;
    }
    
    // Get the number of players with high scores
    function getHighScorePlayersCount() external view returns (uint256) {
        return highScorePlayers.length;
    }
    
    // Get high scores for a batch of players (for pagination in frontend)
    function getHighScoresBatch(uint256 start, uint256 size) external view returns (address[] memory players, uint256[] memory scores) {
        uint256 end = start + size;
        if (end > highScorePlayers.length) {
            end = highScorePlayers.length;
        }
        
        uint256 resultSize = end - start;
        players = new address[](resultSize);
        scores = new uint256[](resultSize);
        
        for (uint256 i = 0; i < resultSize; i++) {
            address player = highScorePlayers[start + i];
            players[i] = player;
            scores[i] = highScores[player];
        }
        
        return (players, scores);
    }
}