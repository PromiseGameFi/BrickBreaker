import { ethers } from 'ethers';
import abi from './abi.json';

// Contract address from your existing code
const CONTRACT_ADDRESS = "0x8Ff06d6811A171aFdf641d1De9fEB9Aa83ACf8BD";

// Create a provider
const provider = new ethers.JsonRpcProvider("https://dream-rpc.somnia.network");

// Create a contract instance for read-only operations
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

// Function to get the total number of high score players
export const getHighScorePlayersCount = async () => {
  try {
    const count = await contract.getHighScorePlayersCount();
    return Number(count);
  } catch (error) {
    console.error("Error getting high score players count:", error);
    return 0;
  }
};

// Function to get a batch of high scores
export const getHighScoresBatch = async (start, size) => {
  try {
    const result = await contract.getHighScoresBatch(start, size);
    
    // Format the result into an array of objects
    const formattedScores = [];
    for (let i = 0; i < result.players.length; i++) {
      formattedScores.push({
        address: result.players[i],
        score: Number(result.scores[i])
      });
    }
    
    return formattedScores;
  } catch (error) {
    console.error("Error getting high scores batch:", error);
    return [];
  }
};

// Function to format address for display (0x1234...5678)
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};