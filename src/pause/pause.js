import React, { useEffect, useRef, useState, useCallback } from "react";

const Pause = () => {
  const [isPaused, setIsPaused] = useState(false);
  const animationFrameId = useRef(null);

  // Game update logic
  const updateGame = useCallback(() => {
    if (!isPaused) {
      console.log("Game Running..."); // Replace this with your actual game logic
    }
    animationFrameId.current = requestAnimationFrame(updateGame);
  }, [isPaused]);

  // Start the game loop and handle ESC key
  useEffect(() => {
    // Start the game loop on mount
    animationFrameId.current = requestAnimationFrame(updateGame);

    // Pause/resume on ESC
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [updateGame]);

  return (
    <div>
      <h2>{isPaused ? "Game Paused" : "Game Running"}</h2>
    </div>
  );
};

export default Pause;
