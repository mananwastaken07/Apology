/**
 * Custom Romantic Cursor
 * Glowing heart cursor with trail effect, hover states, and click bursts.
 * Automatically disabled on touch devices and prefers-reduced-motion.
 */

export class CustomCursor {
  constructor() {
    this.cursor = document.getElementById('custom-cursor');
    this.trailCanvas = document.getElementById('cursor-trail');
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.isTouch || this.isReduced || !this.cursor || !this.trailCanvas) {
      if (this.cursor) this.cursor.style.display = 'none';
      if (this.trailCanvas) this.trailCanvas.style.display = 'none';
      return;
    }

    this.ctx = this.trailCanvas.getContext('2d');
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.cursorX = this.mouseX;
    this.cursorY = this.mouseY;
    this.trail = [];
    this.maxTrail = 12;
    this.clickParticles = [];
    this.active = false;

    this.init();
  }

  init() {
    // Hide default cursor
    document.body.style.cursor = 'none';

    // Resize canvas
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Track mouse
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      if (!this.active) {
        this.active = true;
        document.body.classList.add('cursor-ready');
      }
    });

    // Hover states
    const interactiveSelector = 'button, a, .gallery__item, .glass-card, [data-tilt], input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) {
        document.body.classList.remove('cursor-hover');
      }
    });

    // Click burst
    document.addEventListener('click', (e) => {
      this.createClickBurst(e.clientX, e.clientY);
    });

    // Start animation
    this.animate();
  }

  resize() {
    this.trailCanvas.width = window.innerWidth;
    this.trailCanvas.height = window.innerHeight;
  }

  createClickBurst(x, y) {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 2;
      const isHeart = Math.random() > 0.5;

      this.clickParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: isHeart ? 6 + Math.random() * 4 : 2 + Math.random() * 2,
        life: 1,
        decay: 0.02 + Math.random() * 0.015,
        isHeart,
        rotation: Math.random() * Math.PI * 2,
      });
    }
  }

  drawHeartShape(ctx, x, y, size) {
    ctx.beginPath();
    const s = size / 10;
    ctx.moveTo(x, y - 3 * s);
    ctx.bezierCurveTo(x - 5 * s, y - 10 * s, x - 12 * s, y - 5 * s, x - 7 * s, y + 2 * s);
    ctx.lineTo(x, y + 8 * s);
    ctx.lineTo(x + 7 * s, y + 2 * s);
    ctx.bezierCurveTo(x + 12 * s, y - 5 * s, x + 5 * s, y - 10 * s, x, y - 3 * s);
    ctx.fill();
  }

  animate() {
    // Smooth cursor following (lerp)
    const ease = 0.15;
    this.cursorX += (this.mouseX - this.cursorX) * ease;
    this.cursorY += (this.mouseY - this.cursorY) * ease;

    // Update cursor position
    this.cursor.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px)`;

    // Add trail point
    this.trail.push({
      x: this.cursorX,
      y: this.cursorY,
      life: 1,
    });

    if (this.trail.length > this.maxTrail) {
      this.trail.shift();
    }

    // Clear trail canvas
    this.ctx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);

    // Draw trail
    for (let i = 0; i < this.trail.length; i++) {
      const point = this.trail[i];
      const progress = i / this.trail.length;
      const size = 2 + progress * 3;
      const opacity = progress * 0.2;

      this.ctx.save();
      this.ctx.globalAlpha = opacity;
      this.ctx.fillStyle = `hsla(345, 70%, 80%, 1)`;
      this.ctx.shadowColor = `hsla(345, 70%, 80%, 0.5)`;
      this.ctx.shadowBlur = 4;

      if (i % 3 === 0 && progress > 0.3) {
        // Tiny heart in trail
        this.drawHeartShape(this.ctx, point.x, point.y, size * 0.8);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(point.x, point.y, size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    // Draw click particles
    for (let i = this.clickParticles.length - 1; i >= 0; i--) {
      const p = this.clickParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // gravity
      p.life -= p.decay;

      if (p.life <= 0) {
        this.clickParticles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.life * 0.7;
      this.ctx.fillStyle = `hsla(345, 70%, 75%, 1)`;
      this.ctx.shadowColor = `hsla(345, 70%, 75%, 0.6)`;
      this.ctx.shadowBlur = 6;

      if (p.isHeart) {
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.drawHeartShape(this.ctx, 0, 0, p.size * p.life);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}
