import React, { useState } from 'react';
import Leaderboard from './Leaderboard';


const LeaderboardButton = ({ setGameState, gameState, originalBallSpeed, setOriginalBallSpeed, ballObj }) => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleToggleLeaderboard = () => {
    if (!showLeaderboard) {
      // Store original ball speed before pausing
      if (gameState === "playing") {
        setOriginalBallSpeed({ dx: ballObj.dx, dy: ballObj.dy });
        // Pause the game without showing pause UI
        ballObj.dx = 0;
        ballObj.dy = 0;
        setGameState("leaderboard-open");
      }
    } else {
      // Resume the game when closing leaderboard
      if (gameState === "leaderboard-open" && originalBallSpeed) {
        ballObj.dx = originalBallSpeed.dx;
        ballObj.dy = originalBallSpeed.dy;
        setGameState("playing");
      }
    }
    
    setShowLeaderboard(!showLeaderboard);
  };

  const handleCloseLeaderboard = () => {
    // Resume the game when closing leaderboard
    if (gameState === "leaderboard-open" && originalBallSpeed) {
      ballObj.dx = originalBallSpeed.dx;
      ballObj.dy = originalBallSpeed.dy;
      setGameState("playing");
    }
    
    setShowLeaderboard(false);
  };

  return (
    <>
      <button 
        className="leaderboard-trigger-btn"
        onClick={handleToggleLeaderboard}
      >
       Leaderboard
      </button>
      
      <Leaderboard 
        isVisible={showLeaderboard} 
        onClose={handleCloseLeaderboard} 
      />
    </>
  );
};

export default LeaderboardButton;