/**
 * Floating Phrases
 * Occasionally shows subtle romantic text floating across the screen.
 */

import { CONFIG } from '../config.js';

export class FloatingPhrases {
  constructor() {
    this.container = document.getElementById('floating-phrases');
    this.phrases = CONFIG.floatingPhrases || [];
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.isReduced || !this.container || this.phrases.length === 0) return;

    // Start showing phrases after a delay
    setTimeout(() => this.start(), 5000);
  }

  start() {
    this.showPhrase();
    this.interval = setInterval(() => this.showPhrase(), 10000 + Math.random() * 8000);
  }

  showPhrase() {
    const text = this.phrases[Math.floor(Math.random() * this.phrases.length)];
    const el = document.createElement('span');
    el.className = 'floating-phrase';
    el.textContent = text;

    // Random position
    el.style.left = `${10 + Math.random() * 70}%`;
    el.style.bottom = `${5 + Math.random() * 30}%`;

    this.container.appendChild(el);

    // Remove after animation
    setTimeout(() => {
      el.remove();
    }, 8500);
  }

  destroy() {
    if (this.interval) clearInterval(this.interval);
  }
}
