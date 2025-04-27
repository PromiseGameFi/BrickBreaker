import React, { useState, useEffect } from "react";
import { readContract } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { defineChain } from "thirdweb/chains";
import { client } from "../client";

const HighScoreDisplay = () => {
  const [highScore, setHighScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const activeAccount = useActiveAccount();

  // Get the contract instance
  const contract = {
    client,
    chain: defineChain(50312),
    address: "0x348137454b78C6eA082D7bb8aA8bFf6fFF428924",
  };

  useEffect(() => {
    let intervalId;
    
    const fetchHighScore = async () => {
      try {
        // Only show loading on initial fetch
        if (highScore === null) {
          setLoading(true);
        }
        
        if (!activeAccount || !activeAccount.address) {
          setHighScore(null);
          setError("Please connect your wallet to view your high score");
          setLoading(false);
          return;
        }

        const playerAddress = activeAccount.address;
        
        // Call the highScores function on the contract
        const data = await readContract({
          contract,
          method: "function highScores(address) view returns (uint256)",
          params: [playerAddress],
        });

        setHighScore(Number(data));
        setError(null);
      } catch (err) {
        console.error("", err);
        setError("");
        setHighScore(null);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchHighScore();
    
    // Set up polling interval (every 5 seconds)
    intervalId = setInterval(fetchHighScore, 1000);
    
    // Clean up interval on component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeAccount]);

  return (
    <div className="high-score-container">
      <h3>Your High Score</h3>
      {loading ? (
        
        <div className="score-display">
        <span className="score-value">{highScore}</span>
      </div>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="score-display">
          <span className="score-value">{highScore}</span>
        </div>
      )}
    </div>
  );
};

export default HighScoreDisplay;