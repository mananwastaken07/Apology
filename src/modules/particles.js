/**
 * Background Particle System
 * Creates dreamy floating bokeh, sparkles, and tiny hearts
 * on a fullscreen canvas for a romantic atmosphere.
 */

export class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.isReduced) return;

    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const count = Math.min(Math.floor((this.width * this.height) / 18000), 60);
    this.particles = [];

    for (let i = 0; i < count; i++) {
      const type = Math.random();
      if (type < 0.45) {
        this.particles.push(this.createBokeh());
      } else if (type < 0.82) {
        this.particles.push(this.createSparkle());
      } else {
        this.particles.push(this.createHeart());
      }
    }
  }

  createBokeh() {
    return {
      type: 'bokeh',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: 20 + Math.random() * 60,
      opacity: 0.03 + Math.random() * 0.06,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: -0.05 - Math.random() * 0.15,
      hue: 340 + Math.random() * 30,      // pink range
      saturation: 60 + Math.random() * 30,
      lightness: 75 + Math.random() * 15,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.003 + Math.random() * 0.005,
    };
  }

  createSparkle() {
    return {
      type: 'sparkle',
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      size: 1.5 + Math.random() * 2.5,
      opacity: 0.15 + Math.random() * 0.35,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -0.1 - Math.random() * 0.2,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.04,
      life: 1,
    };
  }

  createHeart() {
    return {
      type: 'heart',
      x: Math.random() * this.width,
      y: this.height + Math.random() * 100,
      size: 4 + Math.random() * 6,
      opacity: 0.08 + Math.random() * 0.12,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -0.15 - Math.random() * 0.25,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.005,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.008 + Math.random() * 0.01,
    };
  }

  drawBokeh(p) {
    this.ctx.save();
    const pulse = Math.sin(p.pulse) * 0.015;
    const currentOpacity = p.opacity + pulse;

    const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    gradient.addColorStop(0, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${currentOpacity})`);
    gradient.addColorStop(0.6, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${currentOpacity * 0.4})`);
    gradient.addColorStop(1, `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, 0)`);

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawSparkle(p) {
    this.ctx.save();
    const twinkle = (Math.sin(p.twinkle) + 1) / 2;
    const currentOpacity = p.opacity * twinkle;

    if (currentOpacity < 0.02) {
      this.ctx.restore();
      return;
    }

    this.ctx.globalAlpha = currentOpacity;
    this.ctx.fillStyle = `hsla(350, 70%, 90%, 1)`;
    this.ctx.shadowColor = `hsla(350, 80%, 85%, 0.8)`;
    this.ctx.shadowBlur = 6;

    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawHeart(p) {
    this.ctx.save();
    this.ctx.globalAlpha = p.opacity;
    this.ctx.translate(p.x, p.y);
    this.ctx.rotate(p.rotation);
    this.ctx.scale(p.size / 10, p.size / 10);

    this.ctx.fillStyle = `hsla(345, 65%, 75%, 1)`;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -3);
    this.ctx.bezierCurveTo(-5, -10, -12, -5, -7, 2);
    this.ctx.lineTo(0, 8);
    this.ctx.lineTo(7, 2);
    this.ctx.bezierCurveTo(12, -5, 5, -10, 0, -3);
    this.ctx.fill();
    this.ctx.restore();
  }

  updateParticle(p) {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.type === 'bokeh') {
      p.pulse += p.pulseSpeed;
    } else if (p.type === 'sparkle') {
      p.twinkle += p.twinkleSpeed;
    } else if (p.type === 'heart') {
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.x += Math.sin(p.wobble) * 0.3;
    }

    // Wrap around
    const margin = 100;
    if (p.y < -margin) {
      p.y = this.height + margin;
      p.x = Math.random() * this.width;
    }
    if (p.x < -margin) p.x = this.width + margin;
    if (p.x > this.width + margin) p.x = -margin;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const p of this.particles) {
      this.updateParticle(p);
      if (p.type === 'bokeh') this.drawBokeh(p);
      else if (p.type === 'sparkle') this.drawSparkle(p);
      else if (p.type === 'heart') this.drawHeart(p);
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}
