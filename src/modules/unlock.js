/**
 * Unlock Screen Module
 * Full-screen cinematic password/date entry screen.
 * Keeps the main website completely concealed until the correct secret date is entered.
 */

import gsap from 'gsap';

export class UnlockScreen {
  constructor(unlockConfig, onUnlockSuccess) {
    this.config = unlockConfig || { day: 14, month: 9, year: 2026 };
    this.onUnlockSuccess = onUnlockSuccess;

    // DOM Elements
    this.screen = document.getElementById('unlock-screen');
    this.canvas = document.getElementById('unlock-particles-canvas');
    this.heartIcon = document.getElementById('unlock-heart-icon');
    this.line1 = document.getElementById('unlock-line-1');
    this.line2 = document.getElementById('unlock-line-2');
    this.line3 = document.getElementById('unlock-line-3');
    this.form = document.getElementById('unlock-form');
    this.inputsBox = document.getElementById('unlock-inputs-box');
    this.inputDD = document.getElementById('unlock-dd');
    this.inputMM = document.getElementById('unlock-mm');
    this.inputYYYY = document.getElementById('unlock-yyyy');
    this.unlockBtn = document.getElementById('unlock-btn');
    this.feedback = document.getElementById('unlock-feedback');
    this.successBox = document.getElementById('unlock-success-box');
    this.successText = document.getElementById('unlock-success-text');
    this.glowingHeart = document.getElementById('unlock-glowing-heart');

    // Wrong answer messages rotation
    this.wrongMessages = [
      "Hmm... try again. ❤️",
      "Not quite. 🥺",
      "You know this one. 😭",
      "One more try. ❤️"
    ];
    this.wrongAttemptIndex = 0;
    this.isUnlocked = false;

    if (this.canvas) {
      this.initParticleCanvas();
    }

    this.setupInputEvents();
  }

  /**
   * Play opening cinematic reveal animation.
   * Returns a promise that resolves when date is successfully unlocked.
   */
  start() {
    return new Promise((resolve) => {
      this.resolveUnlock = resolve;

      // Ensure elements start hidden
      gsap.set([this.heartIcon, this.line1, this.line2, this.line3, this.form], {
        opacity: 0,
        y: 20,
      });

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      // 1. Initial 1s pause with dreamy background, then reveal small glowing heart
      tl.to(this.heartIcon, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        delay: 1.0,
      })
      // 2. Reveal "Before you come in..."
      .to(this.line1, {
        opacity: 1,
        y: 0,
        duration: 0.9,
      }, '+=' + 0.3)
      // 3. Reveal "I need one thing from you. ❤️"
      .to(this.line2, {
        opacity: 1,
        y: 0,
        duration: 1.0,
      }, '+=' + 0.6)
      // 4. Reveal "Enter the date."
      .to(this.line3, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, '+=' + 0.4)
      // 5. Reveal date input fields & unlock button
      .to(this.form, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        onComplete: () => {
          if (this.inputDD) {
            this.inputDD.focus();
          }
        },
      }, '+=' + 0.2);
    });
  }

  /**
   * Setup date input auto-focus, backspace navigation, and submission handlers.
   */
  setupInputEvents() {
    const inputs = [this.inputDD, this.inputMM, this.inputYYYY];

    inputs.forEach((input, index) => {
      if (!input) return;

      // Only allow numbers
      input.addEventListener('input', (e) => {
        const cleanVal = e.target.value.replace(/\D/g, '');
        e.target.value = cleanVal;

        const maxLen = parseInt(input.getAttribute('maxlength'), 10) || 2;
        if (cleanVal.length >= maxLen) {
          // Auto advance focus to next input field
          if (index < inputs.length - 1) {
            inputs[index + 1].focus();
            inputs[index + 1].select();
          }
        }
      });

      // Handle Backspace navigation
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && index > 0) {
          inputs[index - 1].focus();
        }
      });
    });

    // Handle form submit (by button click or Enter key)
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.validateDate();
      });
    }
  }

  /**
   * Validate entered date against CONFIG.unlockDate
   */
  async validateDate() {
    if (this.isUnlocked) return;

    const day = parseInt(this.inputDD.value, 10);
    const month = parseInt(this.inputMM.value, 10);
    const year = parseInt(this.inputYYYY.value, 10);

    const isCorrect = (
      day === this.config.day &&
      month === this.config.month &&
      year === this.config.year
    );

    if (isCorrect) {
      this.isUnlocked = true;
      if (this.onUnlockSuccess) {
        this.onUnlockSuccess();
      }
      await this.playSuccessSequence();
      if (this.resolveUnlock) {
        this.resolveUnlock();
      }
    } else {
      this.playWrongSequence();
    }
  }

  /**
   * Handle wrong answer animation:
   * Shake input box, show playful message, reset fields.
   */
  playWrongSequence() {
    if (!this.inputsBox) return;

    // Trigger subtle shake animation
    this.inputsBox.classList.remove('shake-error');
    // Force reflow
    void this.inputsBox.offsetWidth;
    this.inputsBox.classList.add('shake-error');

    // Display playful message
    const msg = this.wrongMessages[this.wrongAttemptIndex % this.wrongMessages.length];
    this.wrongAttemptIndex++;

    if (this.feedback) {
      this.feedback.textContent = msg;
      this.feedback.classList.remove('visible');
      void this.feedback.offsetWidth;
      this.feedback.classList.add('visible');
    }

    // Reset input fields gracefully
    setTimeout(() => {
      [this.inputDD, this.inputMM, this.inputYYYY].forEach(inp => {
        if (inp) inp.value = '';
      });
      if (this.inputDD) this.inputDD.focus();
    }, 300);
  }

  /**
   * Play cinematic unlock success sequence:
   * 1. Inputs softly disappear
   * 2. Reveal "You remembered. ❤️"
   * 3. Glowing heart appears, pulses, and expands
   * 4. Particles burst & smooth fade transition into main site
   */
  playSuccessSequence() {
    return new Promise((resolve) => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

      // 1. Softly disappear input form and text lines
      tl.to([this.form, this.line1, this.line2, this.line3, this.heartIcon], {
        opacity: 0,
        y: -15,
        duration: 0.6,
      })
      // 2. Show success box ("You remembered. ❤️")
      .call(() => {
        if (this.successBox) {
          this.successBox.setAttribute('aria-hidden', 'false');
          this.successBox.classList.add('visible');
        }
      })
      .fromTo(this.successText, {
        opacity: 0,
        y: 20,
        scale: 0.9,
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.0,
      })
      // 3. Pause 1 second, then reveal glowing heart
      .to(this.glowingHeart, {
        opacity: 1,
        scale: 1.2,
        duration: 0.8,
        ease: 'back.out(1.7)',
      }, '+=' + 0.8)
      // 4. Heart expands & soft pink glow expands across screen
      .to(this.glowingHeart, {
        scale: 28,
        opacity: 0.15,
        duration: 1.4,
        ease: 'power3.in',
        onStart: () => {
          this.triggerBurstParticles();
        }
      })
      // 5. Fade out entire unlock screen
      .to(this.screen, {
        opacity: 0,
        duration: 1.2,
        onComplete: () => {
          if (this.screen) {
            this.screen.style.display = 'none';
          }
          resolve();
        }
      }, '-=0.4');
    });
  }

  /**
   * Subtle particle canvas background for unlock screen
   */
  initParticleCanvas() {
    const ctx = this.canvas.getContext('2d');
    let width = (this.canvas.width = window.innerWidth);
    let height = (this.canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = this.canvas.width = window.innerWidth;
      height = this.canvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2,
      isHeart: Math.random() > 0.65,
    }));

    this.burstParticles = [];

    const animate = () => {
      if (this.screen && this.screen.style.display === 'none') return;
      ctx.clearRect(0, 0, width, height);

      // Draw background particles
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.isHeart) {
          ctx.fillStyle = '#F2B5C1';
          ctx.font = '12px serif';
          ctx.fillText('♥', p.x, p.y);
        } else {
          ctx.fillStyle = '#FDE8ED';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw burst particles during success transition
      if (this.burstParticles.length > 0) {
        this.burstParticles.forEach((bp, idx) => {
          bp.x += bp.vx;
          bp.y += bp.vy;
          bp.alpha -= 0.012;
          bp.scale *= 0.99;

          if (bp.alpha > 0) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, bp.alpha);
            ctx.fillStyle = bp.color;
            ctx.font = `${14 * bp.scale}px sans-serif`;
            ctx.fillText(bp.char, bp.x, bp.y);
            ctx.restore();
          } else {
            this.burstParticles.splice(idx, 1);
          }
        });
      }

      requestAnimationFrame(animate);
    };

    animate();
  }

  triggerBurstParticles() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const colors = ['#F2B5C1', '#C9929D', '#E8A0B0', '#FFF0F3', '#B76E79'];
    const chars = ['♥', '✨', '🌸', '💖'];

    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.burstParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        scale: Math.random() * 0.8 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        char: chars[Math.floor(Math.random() * chars.length)],
      });
    }
  }

  /**
   * Mobile experience prompt check
   */
  static checkMobileNotice() {
    return new Promise((resolve) => {
      const isMobile = 'ontouchstart' in window || window.innerWidth <= 768;
      const modal = document.getElementById('mobile-notice-modal');
      const continueBtn = document.getElementById('mobile-continue-btn');

      if (!isMobile || !modal || !continueBtn) {
        resolve();
        return;
      }

      modal.classList.add('visible');

      const handleContinue = () => {
        modal.classList.remove('visible');
        continueBtn.removeEventListener('click', handleContinue);
        resolve();
      };

      continueBtn.addEventListener('click', handleContinue);
    });
  }
}
