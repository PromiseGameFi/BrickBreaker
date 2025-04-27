export default function Brick(level, bricks, canvas, brick) {
  brick.width = canvas.width / 5 - 1;
  let newbricks = [];
  if (!bricks) {
    return [];
  }
  // If all the levels are filled
  if (bricks.length >= 5 * level) {
    return;
  }

  // Brick Formation here
  for (let i = 0; i < 5 * level; i++) {
    let newBrick = new SingleBrick(
      brick.x + brick.width,
      brick.y,
      brick.width,
      brick.height,
      brick.colors
    );
    newbricks.push(newBrick);
    // newBrick.draw();
    brick.x += brick.width + 1;
    if (brick.x + brick.width >= canvas.width) {
      brick.x = 0.5;
      brick.y += brick.height + 1;
    }
  }
  return newbricks;
}

class SingleBrick {
  constructor(x, y, w, h, c) {
    this.x = x - w;
    this.y = y;
    this.width = w;
    this.height = h;
    this.colors = c;
    this.broke = false;
  }
  draw(ctx) {
    ctx.beginPath();
    
    // Create gradient for main brick
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, this.colors[1]);
    gradient.addColorStop(1, '#134959');
    
    // Draw main brick body
    ctx.fillStyle = this.broke ? "rgba(19, 73, 89, 0)" : gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    if (!this.broke) {
      // Add top highlight for bevel effect
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.width, this.y);
      ctx.lineTo(this.x + this.width - 4, this.y + 4);
      ctx.lineTo(this.x + 4, this.y + 4);
      ctx.fill();
      
      // Add bottom shadow for bevel effect
      ctx.beginPath();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.moveTo(this.x, this.y + this.height);
      ctx.lineTo(this.x + this.width, this.y + this.height);
      ctx.lineTo(this.x + this.width - 4, this.y + this.height - 4);
      ctx.lineTo(this.x + 4, this.y + this.height - 4);
      ctx.fill();
      
      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.colors[1];
    }
  }
}