const { ipcRenderer } = require('electron');

class DuckAnimator {
  constructor() {
    this.canvas = document.getElementById('duck-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 120;
    this.canvas.height = 120;

    // Sprite sheet config
    this.spriteSheet = new Image();
    this.spriteSheet.src = '../assets/sprites/duck-sprite.png';
    
    // Animation frame dimensions: 32x32 px
    // Sprite sheet: 1024x576 = 32 frames horizontally x 18 frames vertically
    this.frameWidth = 32;
    this.frameHeight = 32;
    
    // Animation states (single row layout: idle(4) + walk(6) + quack(4) + sleep(3) = 17 frames)
    this.animations = {
      idle: { frames: 4, fps: 6, startX: 0, startY: 0 },
      walk: { frames: 6, fps: 10, startX: 128, startY: 0 },
      quack: { frames: 4, fps: 8, startX: 320, startY: 0 },
      sleep: { frames: 3, fps: 4, startX: 448, startY: 0 }
    };

    this.currentState = 'idle';
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.isAnimating = true;
    
    // Position on screen
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    
    // State timers
    this.stateTimer = 0;
    this.stateDuration = 3000; // ms
    
    // Drag functionality
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    this.setupEventListeners();
    this.setupIPC();
    this.animate();
  }

  setupEventListeners() {
    const container = document.getElementById('duck-container');
    
    container.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.dragStartX = e.clientX - this.x;
      this.dragStartY = e.clientY - this.y;
    });

    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.x = e.clientX - this.dragStartX;
        this.y = e.clientY - this.dragStartY;
      }
    });

    document.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Double click to trigger quack
    container.addEventListener('dblclick', () => {
      this.setState('quack');
    });

    // Right click context menu (native)
    container.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }

  setupIPC() {
    // Listen for CLI task completion signal
    ipcRenderer.on('task-complete', () => {
      this.quack();
    });

    // Listen for state change requests
    ipcRenderer.on('set-state', (event, state) => {
      if (this.animations[state]) {
        this.setState(state);
      }
    });
  }

  setState(newState) {
    if (newState === this.currentState && newState !== 'quack') return;
    
    this.currentState = newState;
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.stateTimer = 0;
    
    ipcRenderer.send('duck-state-change', newState);

    // Auto-transition after state duration
    if (newState !== 'idle' && newState !== 'walk') {
      this.stateTimer = setTimeout(() => {
        this.setState('idle');
      }, this.stateDuration);
    }
  }

  quack() {
    this.setState('quack');
    ipcRenderer.send('duck-quack');
    
    // Play sound if available (placeholder)
    try {
      const audio = new Audio('../assets/sounds/quack.mp3');
      audio.play().catch(() => {});
    } catch (e) {
      console.log('Sound not available');
    }
  }

  update() {
    const anim = this.animations[this.currentState];
    
    // Update frame
    this.frameCounter++;
    const frameDuration = Math.floor(60 / anim.fps);
    
    if (this.frameCounter >= frameDuration) {
      this.frameCounter = 0;
      this.currentFrame++;
      
      if (this.currentFrame >= anim.frames) {
        this.currentFrame = 0;
        
        // After quack/sleep, go back to idle
        if (this.currentState === 'quack' || this.currentState === 'sleep') {
          this.setState('idle');
        }
      }
    }

    // Occasionally change to walk
    if (this.currentState === 'idle' && Math.random() < 0.01) {
      this.setState('walk');
      this.vx = (Math.random() > 0.5 ? 1 : -1) * 2;
    }

    // Random sleep
    if (this.currentState === 'walk' && Math.random() < 0.005) {
      this.setState('sleep');
    }

    // Update position (walk movement)
    if (this.currentState === 'walk') {
      this.x += this.vx;
      
      // Bounce off edges
      if (this.x < 0 || this.x > window.innerWidth - 120) {
        this.vx *= -1;
        this.x = Math.max(0, Math.min(this.x, window.innerWidth - 120));
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!this.spriteSheet.complete) return;

    const anim = this.animations[this.currentState];
    const sourceX = anim.startX + (this.currentFrame * this.frameWidth);
    const sourceY = anim.startY;

    // Draw sprite frame centered on canvas
    this.ctx.drawImage(
      this.spriteSheet,
      sourceX, sourceY,
      this.frameWidth, this.frameHeight,
      (this.canvas.width - this.frameWidth) / 2,
      (this.canvas.height - this.frameHeight) / 2,
      this.frameWidth, this.frameHeight
    );
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new DuckAnimator();
});