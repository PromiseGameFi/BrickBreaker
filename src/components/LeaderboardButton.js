import React, { useState } from 'react';
import Leaderboard from './Leaderboard';
import '../index.css';

const LeaderboardButton = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const toggleLeaderboard = () => {
    setShowLeaderboard(prev => !prev);
  };
  
  return (
    <>
      <button 
        className="leaderboard-trigger-btn"
        onClick={toggleLeaderboard}
      >
        🏆 Leaderboard
      </button>
      
      <Leaderboard 
        isVisible={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)} 
      />
    </>
  );
};

export default LeaderboardButton;