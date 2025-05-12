import React, { useState, useEffect, useRef } from 'react';
import { getHighScorePlayersCount, getHighScoresBatch, formatAddress } from '../services/leaderboardService';
import '../index.css';

const Leaderboard = ({ isVisible, onClose }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  
  const BATCH_SIZE = 10; // Number of scores to fetch per batch
  const lastScoreElementRef = useRef();
  
  // Function to load initial data
  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Get total count of players
      const count = await getHighScorePlayersCount();
      setTotalPlayers(count);
      
      // Get first batch of scores
      if (count > 0) {
        const initialScores = await getHighScoresBatch(0, BATCH_SIZE);
        // Sort scores by score value in descending order
        const sortedScores = initialScores.sort((a, b) => Number(b.score) - Number(a.score));
        setScores(sortedScores);
        setHasMore(initialScores.length < count);
      } else {
        setScores([]);
        setHasMore(false);
      }
      
      setPage(1);
      setLoading(false);
    } catch (err) {
      setError("Failed to load leaderboard data");
      setLoading(false);
      console.error("Error loading leaderboard:", err);
    }
  };
  
  // Function to load more data
  const loadMoreData = async () => {
    if (loading || !hasMore) return;
    
    try {
      setLoading(true);
      const nextBatch = await getHighScoresBatch(page * BATCH_SIZE, BATCH_SIZE);
      
      if (nextBatch.length > 0) {
        // Combine existing scores with new batch and sort everything
        const combinedScores = [...scores, ...nextBatch];
        const sortedScores = combinedScores.sort((a, b) => Number(b.score) - Number(a.score));
        
        setScores(sortedScores);
        setPage(prevPage => prevPage + 1);
        setHasMore(combinedScores.length < totalPlayers);
      } else {
        setHasMore(false);
      }
      
      setLoading(false);
    } catch (err) {
      setError("Failed to load more scores");
      setLoading(false);
      console.error("Error loading more scores:", err);
    }
  };
  
  // Handle scroll event for infinite scrolling
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      if (hasMore && !loading) {
        loadMoreData();
      }
    }
  };
  
  // Load initial data when component becomes visible
  useEffect(() => {
    if (isVisible) {
      loadInitialData();
    }
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="leaderboard-modal">
      <div className="leaderboard-container">
        <div className="leaderboard-header-row">
          <h2 className="leaderboard-title">Top Players</h2>
          <button className="leaderboard-close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="leaderboard-table-header">
          <div className="leaderboard-rank">Rank</div>
          <div className="leaderboard-address">Player</div>
          <div className="leaderboard-score">Score</div>
        </div>
        
        <div 
          className="leaderboard-scrollable"
          onScroll={handleScroll}
        >
          {scores.length > 0 ? (
            scores.map((score, index) => (
              <div 
                className="leaderboard-item" 
                key={`${score.address}-${index}`}
                ref={index === scores.length - 1 ? lastScoreElementRef : null}
              >
                <div className="leaderboard-rank">{index + 1}</div>
                <div 
                  className="leaderboard-address" 
                  title={score.address}
                >
                  {formatAddress(score.address)}
                </div>
                <div className="leaderboard-score">{score.score}</div>
              </div>
            ))
          ) : loading ? (
            <div className="leaderboard-loading">Loading scores...</div>
          ) : (
            <div className="leaderboard-empty">No scores available</div>
          )}
          
          {loading && scores.length > 0 && (
            <div className="leaderboard-loading">Loading more scores...</div>
          )}
          
          {error && (
            <div className="leaderboard-error">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;