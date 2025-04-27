import { ethers } from 'ethers';
import abi from './abi.json';


// Contract address from your existing code
const CONTRACT_ADDRESS = "0x348137454b78C6eA082D7bb8aA8bFf6fFF428924";

// Create a provider - you can use any provider that works with your network
// For ethers.js v6, we need to use JsonRpcProvider directly
const provider = new ethers.JsonRpcProvider("https://dream-rpc.somnia.network");

// Function to update high score using ethers.js
export const updateHighScoreWithEthers = async (playerAddress, score) => {
  try {
    // Get admin private key from environment variable
    //const adminPrivateKey = process.env.PRIVATE_KEY || "c07e07469ba61840ee5d5846a622afe8353e4ca15a48b16ecb7dfc30a25afda3";
    const adminPrivateKey = process.env.REACT_APP_PRIVATE_KEY;
    
    if (!adminPrivateKey) {
      console.error("Admin private key is not configured");
      return null;
    }

    // Create a wallet instance with the private key
    const wallet = new ethers.Wallet(adminPrivateKey, provider);
    
    // Create a contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
    
    console.log("Updating high score for player:", playerAddress, "with score:", score);
    
    // Call the updateHighScore function
    const tx = await contract.updateHighScore(playerAddress, score);
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    
    console.log("High score updated successfully, transaction hash:", receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error("Error updating high score:", error);
    return null;
  }
};