export function BallMovement(ctx, ballObj) {
  let data = new Ball(ballObj.x, ballObj.y, ballObj.rad);
  data.draw(ctx);

  // Add a maximum speed cap
  const maxSpeed = 4; // Adjust this value to your preference
  
  // Cap the speed if it exceeds the maximum
  if (Math.abs(ballObj.dx) > maxSpeed) {
    ballObj.dx = Math.sign(ballObj.dx) * maxSpeed;
  }
  if (Math.abs(ballObj.dy) > maxSpeed) {
    ballObj.dy = Math.sign(ballObj.dy) * maxSpeed;
  }

  ballObj.x += ballObj.dx;
  ballObj.y += ballObj.dy;
}

class Ball {
  constructor(x, y, rad) {
    this.x = x;
    this.y = y;
    this.rad = rad;
  }
  draw(ctx) {
    ctx.beginPath();
    
    // Create gradient for ball
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.rad
    );
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(0.7, '#ff6b6b');
    gradient.addColorStop(1, '#ff4757');
    
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.rad, 0, 2 * Math.PI);
    
    // Add glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff6b6b';
    ctx.fill();
    
    // Add shine effect
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.arc(this.x - this.rad/3, this.y - this.rad/3, this.rad/4, 0, 2 * Math.PI);
    ctx.fill();
  }
}
