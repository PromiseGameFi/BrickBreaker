export default (ctx, canvas, paddleProps) => {
  class Paddle {
    constructor(x) {
      this.x = x;
      this.y = canvas.height - 30;
      this.height = 20;
      this.width = paddleProps.width;
      this.colors = ["red", "#FFA62B"];
    }
    
    move() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.width, this.height);
      
      // Create gradient for paddle
      const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
      gradient.addColorStop(0, '#ff6b6b');
      gradient.addColorStop(1, '#ff8787');
      
      ctx.fillStyle = gradient;
      ctx.strokeStyle = '#ff4757';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ff6b6b';
      
      // Add rounded corners
      ctx.beginPath();
      ctx.roundRect(this.x, this.y, this.width, this.height, 10);
      ctx.fill();
      ctx.stroke();
      
      // Add metallic shine
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.roundRect(this.x + 10, this.y + 2, this.width - 20, 3, 2);
      ctx.fill();
    }
  }

  let paddle = new Paddle(paddleProps.x);
  paddle.move();
  if (paddleProps.x <= 0) {
    paddleProps.x = 0;
  } else if (paddleProps.x + paddleProps.width >= canvas.width) {
    paddleProps.x = canvas.width - paddleProps.width;
  }
};
