import React, { useEffect, useRef } from 'react';

const BackgroundMusic = ({ isPlaying = true, volume = 0.4 }) => {
  const audioRef = useRef(null);

  // Handle initial play and user interaction
  useEffect(() => {
    const audioElement = audioRef.current;
    
    // Function to attempt playback
    const attemptPlay = () => {
      if (isPlaying && audioElement) {
        audioElement.volume = volume;
        audioElement.play().catch(error => {
          console.log("Autoplay prevented, waiting for user interaction:", error);
        });
      }
    };
    
    // Try to play immediately
    attemptPlay();
    
    // Add event listeners for user interaction to enable audio
    const userInteractionEvents = ['click', 'touchstart', 'keydown'];
    
    const handleUserInteraction = () => {
      if (isPlaying && audioElement && audioElement.paused) {
        attemptPlay();
        // Remove event listeners after successful play
        userInteractionEvents.forEach(event => {
          document.removeEventListener(event, handleUserInteraction);
        });
      }
    };
    
    // Add event listeners
    userInteractionEvents.forEach(event => {
      document.addEventListener(event, handleUserInteraction);
    });
    
    // Cleanup
    return () => {
      userInteractionEvents.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Play prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <audio 
      ref={audioRef}
      src="/music/game-music.mp3" 
      loop
      preload="auto"
      muted={volume === 0}
    />
  );
};

export default BackgroundMusic;