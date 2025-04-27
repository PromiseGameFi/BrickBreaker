export default function WallCollision(
  ballObj,
  canvas,
  player,
  paddleProps,
  setLives
) {
  const baseSpeed = 5; // Adjust this to your preferred base speed
  
  if (ballObj.y + ballObj.rad > canvas.height) {
    player.lives--;
    ballObj.x = paddleProps.x;
    ballObj.y = paddleProps.y - 30;
    // Use a more consistent speed with less randomness
    ballObj.dx = baseSpeed * (Math.random() * 0.8 - 0.4); // Less random variation
    ballObj.dy = -baseSpeed; // Consistent upward speed
  }
  if (ballObj.y - ballObj.rad < 0) {
    ballObj.dy *= -1;
  }

  if (ballObj.x + ballObj.rad > canvas.width || ballObj.x - ballObj.rad < 0) {
    ballObj.dx *= -1;
  }
}