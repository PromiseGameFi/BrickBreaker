import React, { useEffect, useRef, useState } from "react";
import { BallMovement } from "./BallMovement";
import data from "../../data";
import WallCollision from "./util/WallCollision";
import Paddle from "./Paddle";
import Brick from "./Brick";
import BrickCollision from "./util/BrickCollision";
import PaddleHit from "./util/PaddleHit";
import PlayerStats from "./PlayerStats";
import AllBroken from "./util/AllBroke";
import ResetBall from "./util/ResetBall";
//for wallets
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "../../client";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { defineChain } from "thirdweb";
import ScoreUpdater from "../../services/scoreUpdater";
import HighScoreDisplay from "../../components/HighScoreDisplay";
import BackgroundMusic from "../../components/BackgroundMusic";
import Leaderboard from '../../components/Leaderboard';
import LeaderboardButton from '../../components/LeaderboardButton';



let bricks = [];
let { ballObj, paddleProps, brickObj, player } = data;
export default function Board() {

    // Add state for music
    const [musicPlaying, setMusicPlaying] = useState(false);
    // Add state for volume
    const [volume, setVolume] = useState(0.5); // Default volume at 50%

    // Add state to store original ball speed
    const [originalBallSpeed, setOriginalBallSpeed] = useState(null);

    

    // Add a function to handle volume change
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };
  

      // Start music when game starts
  useEffect(() => {
    // Start music when component mounts
    setMusicPlaying(true);
    
    return () => {
      // Stop music when component unmounts
      setMusicPlaying(false);
    };
  }, []);
  
  // Add a function to toggle music
  const toggleMusic = () => {
    setMusicPlaying(prev => !prev);
  };

  //contract
  const { updateScore } = ScoreUpdater();
  //contract 

  const canvasRef = useRef(null);
  const renderRef = useRef(null);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameState, setGameState] = useState("waiting"); // "waiting", "playing", "paused"
  const [gameStats, setGameStats] = useState({
    lives: player.lives,
    score: player.score,
    level: player.level,
    name: player.name
  });

 // Modify the ESC key handler to control ball speed
 useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      if (gameState === "playing") {
        // Store original speeds before pausing
        setOriginalBallSpeed({ dx: ballObj.dx, dy: ballObj.dy });
        // Set ball speed to zero
        ballObj.dx = 0;
        ballObj.dy = 0;
        setGameState("paused");
      } else if (gameState === "paused" || gameState === "leaderboard-open") {
        // Restore original speeds
        if (originalBallSpeed) {
          ballObj.dx = originalBallSpeed.dx;
          ballObj.dy = originalBallSpeed.dy;
        }
        setGameState("playing");
      }
    }
  };

  
  // Add event listener
  window.addEventListener('keydown', handleKeyDown);
  
  // Clean up
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [gameState, originalBallSpeed]);

  // Set initial game state to playing when component mounts
  useEffect(() => {
    setGameState("playing");
    return () => {
      // Cleanup if needed
    };
  }, []);

  const updateStats = () => {
    setGameStats({
      lives: player.lives,
      score: player.score,
      level: player.level,
      name: player.name
    });
  };

  const render = () => {
    

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    paddleProps.y = canvas.height - 30;

    // Assign Bricks
    let newBrickSet = Brick(player.level, bricks, canvas, brickObj);

    if (newBrickSet && newBrickSet.length > 0) {
      bricks = newBrickSet;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    PlayerStats(ctx, player, canvas);

    // Display Bricks
    bricks.map((brick) => {
      return brick.draw(ctx);
    });

    // Handle Ball Movement
    BallMovement(ctx, ballObj);

    // Check all broken
    AllBroken(bricks, player, canvas, ballObj);

    
    // Ball and Wall Collision
    WallCollision(ballObj, canvas, player, paddleProps);

    // Brick Collision
    let brickCollision;

    for (let i = 0; i < bricks.length; i++) {
      brickCollision = BrickCollision(ballObj, bricks[i]);

      if (brickCollision.hit && !bricks[i].broke) {
        if (brickCollision.axis === "X") {
          ballObj.dx *= -1;
          bricks[i].broke = true;
        } else if (brickCollision.axis === "Y") {
          ballObj.dy *= -1;
          bricks[i].broke = true;
        }
        player.score += 10;

       
      }
    }
    if (player.lives === 0) {
      setShowGameOver(true);

      return;
    }
    Paddle(ctx, canvas, paddleProps);

    // Paddle + Ball Collision
    PaddleHit(ballObj, paddleProps);

    // Update stats whenever they change
    if (gameStats.lives !== player.lives ||
        gameStats.score !== player.score ||
        gameStats.level !== player.level) {
      updateStats();
    }


// Draw pause overlay if game is paused
if (gameState === "paused" || gameState === "leaderboard-open") {
  // Only draw pause overlay if actually paused (not when leaderboard is open)
  if (gameState === "paused") {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    // Semi-transparent overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Pause text
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME PAUSED", canvas.width / 2, canvas.height / 2 - 30);
    ctx.font = "20px Arial";
    ctx.fillText("Press ESC to resume", canvas.width / 2, canvas.height / 2 + 10);
  }
  
  renderRef.current = requestAnimationFrame(render);
  return;
}
    renderRef.current = requestAnimationFrame(render);
  };

  useEffect(() => {
    render();
    return () => {
      if (renderRef.current) {
        cancelAnimationFrame(renderRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event) => {
    paddleProps.x =
      event.clientX -
      (window.innerWidth < 900 ? 10 : (window.innerWidth * 20) / 200) -
      paddleProps.width / 2 -
      10;
  };

  const handleRestart = () => {
    const canvas = canvasRef.current;
    player.lives = 5;
    player.level = 1;
    player.score = 0;
    ballObj.x = paddleProps.x;
    ballObj.y = paddleProps.y - 30;
    ballObj.dx = 6 * (Math.random() * 2 - 1);
    ballObj.dy = -6;
    bricks.length = 0;
    setShowGameOver(false);
    updateScore(gameStats.score);
    render(); // Now render is accessible
  };
//for wallet
  const wallets = [
    inAppWallet({
      auth: { options: ["email", "passkey", "google"] },
      chains: [defineChain(50312)],
    }), 

    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("me.rainbow"),
    
  ];


  return ( 
    
    
    <div style={{ textAlign: "center" }}>
  
      {/* Add pause overlay for mobile users */}
    {gameState === "paused" && (
      <div className="pause-overlay">
        <div className="pause-content">
          <h2>Game Paused</h2>
          <p>Press ESC to resume</p>
          <button 
            className="resume-btn"
            onClick={() => {
              if (originalBallSpeed) {
                ballObj.dx = originalBallSpeed.dx;
                ballObj.dy = originalBallSpeed.dy;
              }
              setGameState("playing");
            }}
          >
            Resume Game
          </button>
        </div>
      </div>
    )}
      
      <div className="top-right-button-container">
      <ConnectButton
              client={client}
              connectButton={{
                label: "Sign In",
                style: {
                  fontSize:"0.75rem !important",
                  height: "2.5rem !important",
                }
              }}
              chain={defineChain(50312)}
              
              appMetadata={{
                name: "Brick Breaker Game",
                url: window.location.origin,
              }}
            />
            
      </div>
      <h1 className="gameHeader">Brick Breaker</h1>
      <canvas
        id="canvas"
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onContextMenu={(e) => e.preventDefault()}
        height="500"
        width={
          window.innerWidth < 900
            ? window.innerWidth - 20
            : window.innerWidth - (window.innerWidth * 20) / 100
        }
      />
      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">PLAYER</span>
          <span className="player-name">{gameStats.name}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">LEVEL</span>
          <span className="stat-value">{gameStats.level}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">LIVES</span>
          <div className="lives-container">
            {[...Array(gameStats.lives)].map((_, i) => (
              <span key={i} className="life-icon">♥</span>
            ))}
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-label">SCORE</span>
          <span className="stat-value">{gameStats.score}</span>
        </div>
      </div>
      {showGameOver  && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p> Final Score: {gameStats.score}</p>
          <button className="retry-btn" onClick={handleRestart}>
            Play Again
          </button>
        </div>
      )}
      <div className="top-left-score-container">
    <HighScoreDisplay />
    <LeaderboardButton 
      setGameState={setGameState}
      gameState={gameState}
      originalBallSpeed={originalBallSpeed}
      setOriginalBallSpeed={setOriginalBallSpeed}
      ballObj={ballObj}
    />
      </div>

      {/* Add background music component with volume */}
      <BackgroundMusic isPlaying={musicPlaying} volume={volume} />
      
      {/* Add music control button and volume slider */}
      <div className="audio-controls">
        <button 
          className="music-control-btn"
          onClick={() => setMusicPlaying(prev => !prev)}
        >
          {musicPlaying ? "🔊" : "🔇"}
        </button>
        
        {/* Volume slider */}
        <div className="volume-control">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
    
  );
}