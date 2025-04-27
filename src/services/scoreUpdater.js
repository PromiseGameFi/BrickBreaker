import { useActiveAccount } from "thirdweb/react";
import { updateHighScoreWithEthers } from "./ethersService";

export default function ScoreUpdater() {
  // Get the active wallet from ThirdWeb
  const activeAccount = useActiveAccount();
  
  // Function to update the high score
  const updateScore = async (score) => {
    try {
      // Check if there's an active wallet connected
      if (!activeAccount) {
        console.error("No wallet connected. Please connect your wallet first.");
        return null;
      }
      
      // Get the wallet address
      const playerAddress = activeAccount?.address ;
      // Use the score passed as parameter instead of a fixed value
      console.log("Updating score for player:", playerAddress, "with score:", score);
      
      // Call the ethersService to update the high score
      const txHash = await updateHighScoreWithEthers(playerAddress, score);
      
      if (txHash) {
        console.log("Score updated successfully! Transaction hash:", txHash);
        return txHash;
      } else {
        console.error("Failed to update score. No transaction hash returned.");
        return null;
      }
    } catch (error) {
      console.error("Error updating score:", error);
      return null;
    }
  };
  
  // Return the function to be used in other components
  return {
    updateScore
  };
}