/**
 * Celebration Effect
 * Soft hearts, sparkles, and gentle confetti when she clicks "Yes".
 */

export class CelebrationEffect {
  constructor() {
    this.canvas = document.getElementById('celebration-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animating = false;
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  trigger() {
    if (this.isReduced) return;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.classList.add('active');
    this.particles = [];

    // Create celebration particles
    const count = Math.min(Math.floor(window.innerWidth / 8), 120);

    for (let i = 0; i < count; i++) {
      const type = Math.random();
      if (type < 0.4) {
        this.particles.push(this.createHeart());
      } else if (type < 0.7) {
        this.particles.push(this.createSparkle());
      } else {
        this.particles.push(this.createConfetti());
      }
    }

    this.animating = true;
    this.animate();

    // Fade out after 5 seconds
    setTimeout(() => {
      this.fadeOut();
    }, 5000);
  }

  createHeart() {
    return {
      type: 'heart',
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + Math.random() * 100,
      size: 6 + Math.random() * 14,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: -1.5 - Math.random() * 2.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      opacity: 0.5 + Math.random() * 0.5,
      hue: 340 + Math.random() * 25,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.02 + Math.random() * 0.03,
    };
  }

  createSparkle() {
    return {
      type: 'sparkle',
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: 2 + Math.random() * 4,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: 0,
      maxOpacity: 0.5 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.03 + Math.random() * 0.05,
    };
  }

  createConfetti() {
    const hues = [345, 350, 355, 0, 20, 30]; // pinks, roses, soft gold
    return {
      type: 'confetti',
      x: Math.random() * this.canvas.width,
      y: -20 - Math.random() * 200,
      width: 4 + Math.random() * 6,
      height: 8 + Math.random() * 12,
      speedX: (Math.random() - 0.5) * 2,
      speedY: 1 + Math.random() * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.08,
      opacity: 0.4 + Math.random() * 0.4,
      hue: hues[Math.floor(Math.random() * hues.length)],
      saturation: 50 + Math.random() * 30,
      lightness: 70 + Math.random() * 20,
      wobble: Math.random() * Math.PI * 2,
    };
  }

  drawHeart(p) {
    this.ctx.save();
    this.ctx.globalAlpha = p.opacity;
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);

    const s = p.size / 10;
    this.ctx.fillStyle = `hsla(${p.hue}, 65%, 75%, 1)`;
    this.ctx.shadowColor = `hsla(${p.hue}, 65%, 75%, 0.4)`;
    this.ctx.shadowBlur = 8;

    this.ctx.beginPath();
    this.ctx.moveTo(0, -3 * s);
    this.ctx.bezierCurveTo(-5 * s, -10 * s, -12 * s, -5 * s, -7 * s, 2 * s);
    this.ctx.lineTo(0, 8 * s);
    this.ctx.lineTo(7 * s, 2 * s);
    this.ctx.bezierCurveTo(12 * s, -5 * s, 5 * s, -10 * s, 0, -3 * s);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawSparkle(p) {
    this.ctx.save();
    p.opacity = p.maxOpacity * ((Math.sin(p.phase) + 1) / 2);
    this.ctx.globalAlpha = p.opacity;
    this.ctx.fillStyle = `hsla(40, 90%, 90%, 1)`;
    this.ctx.shadowColor = `hsla(40, 90%, 85%, 0.6)`;
    this.ctx.shadowBlur = 8;

    // Four-pointed star
    this.ctx.translate(p.x, p.y);
    this.ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI / 2) * i;
      this.ctx.lineTo(Math.cos(angle) * p.size, Math.sin(angle) * p.size);
      const midAngle = angle + Math.PI / 4;
      this.ctx.lineTo(Math.cos(midAngle) * p.size * 0.3, Math.sin(midAngle) * p.size * 0.3);
    }
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.restore();
  }

  drawConfetti(p) {
    this.ctx.save();
    this.ctx.globalAlpha = p.opacity;
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 1)`;
    this.ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
    this.ctx.restore();
  }

  animate() {
    if (!this.animating) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      if (p.type === 'heart') {
        p.x += p.speedX + Math.sin(p.wobble) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;
        p.speedY += 0.01; // slight gravity
        this.drawHeart(p);
      } else if (p.type === 'sparkle') {
        p.x += p.speedX;
        p.y += p.speedY;
        p.phase += p.phaseSpeed;
        this.drawSparkle(p);
      } else if (p.type === 'confetti') {
        p.x += p.speedX + Math.sin(p.wobble) * 0.3;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.wobble += 0.02;
        this.drawConfetti(p);
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  fadeOut() {
    const fade = () => {
      let allGone = true;
      for (const p of this.particles) {
        p.opacity *= 0.96;
        if (p.type === 'sparkle') p.maxOpacity *= 0.96;
        if (p.opacity > 0.01 || (p.maxOpacity && p.maxOpacity > 0.01)) allGone = false;
      }
      if (allGone) {
        this.animating = false;
        this.canvas.classList.remove('active');
      } else {
        requestAnimationFrame(fade);
      }
    };
    fade();
  }
}
