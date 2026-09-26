/**
 * Scroll Animations & Hero Sequence
 * Uses GSAP + ScrollTrigger for cinematic reveal effects,
 * tilt cards, and the hero intro sequence.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class AnimationController {
  constructor() {
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Play the hero intro sequence — typewriter-like reveal.
   * Returns a promise that resolves when the hero button is clicked.
   */
  playHeroSequence() {
    return new Promise((resolve) => {
      const greeting = document.getElementById('hero-greeting');
      const heading = document.getElementById('hero-heading');
      const subtext = document.getElementById('hero-subtext');
      const btn = document.getElementById('hero-btn');
      const promise = document.getElementById('hero-promise');

      if (this.isReduced) {
        // Show everything immediately
        [greeting, heading, subtext, btn, promise].forEach((el) => {
          if (el) { el.style.opacity = '1'; el.style.transform = 'none'; }
        });
        btn?.addEventListener('click', () => resolve(), { once: true });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(greeting, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.8,
      })
      .to(heading, {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.3,
      })
      .to(subtext, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, '-=0.2')
      .to(btn, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
      }, '-=0.2')
      .to(promise, {
        opacity: 1,
        duration: 0.6,
      }, '-=0.3');

      // Set initial states
      gsap.set([greeting, heading, subtext, btn], {
        y: 30,
      });
      gsap.set(btn, {
        scale: 0.95,
      });

      btn?.addEventListener('click', () => resolve(), { once: true });
    });
  }

  /**
   * Transition from hero to main content.
   */
  transitionToMain() {
    return new Promise((resolve) => {
      const hero = document.getElementById('hero');
      const main = document.getElementById('main-content');

      if (this.isReduced) {
        if (hero) hero.style.display = 'none';
        if (main) {
          main.classList.add('visible');
        }
        resolve();
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          if (hero) hero.style.display = 'none';
          resolve();
        },
      });

      tl.to(hero, {
        opacity: 0,
        y: -60,
        scale: 0.97,
        duration: 0.9,
        ease: 'power2.inOut',
      })
      .call(() => {
        if (main) {
          main.classList.add('visible');
        }
      })
      .fromTo(main, {
        opacity: 0,
        y: 40,
      }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.2');
    });
  }

  /**
   * Initialize all scroll-triggered reveal animations.
   */
  initScrollAnimations() {
    if (this.isReduced) {
      // Just show everything
      document.querySelectorAll('.reveal-up').forEach((el) => {
        el.classList.add('revealed');
      });
      return;
    }

    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach((el, index) => {
      gsap.fromTo(el,
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 60%',
            toggleActions: 'play none none none',
          },
          delay: (el.closest('.confession__grid, .playful__grid'))
            ? (Array.from(el.parentElement.children).indexOf(el) * 0.12)
            : 0,
        }
      );
    });

    // Parallax-like subtle movements for section headings
    document.querySelectorAll('.section__heading').forEach((heading) => {
      gsap.fromTo(heading,
        { y: 30 },
        {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: heading,
            start: 'top 90%',
            end: 'top 40%',
            scrub: 1,
          },
        }
      );
    });
  }

  /**
   * Final question reveal sequence.
   */
  playFinalQuestionSequence() {
    const so = document.getElementById('final-so');
    const question = document.getElementById('final-question-text');
    const buttons = document.getElementById('final-buttons');

    if (this.isReduced) {
      [so, question, buttons].forEach((el) => {
        if (el) { el.style.opacity = '1'; }
      });
      return;
    }

    ScrollTrigger.create({
      trigger: '#final-question',
      start: 'top 60%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();

        tl.to(so, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        })
        .to(question, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
        }, '-=0.2')
        .to(buttons, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.5,
        });

        gsap.set([so, question], { y: 20 });
        gsap.set(buttons, { y: 15 });
      },
    });
  }

  /**
   * Celebration reveal sequence.
   */
  playCelebrationSequence() {
    return new Promise((resolve) => {
      const section = document.getElementById('celebration');
      const heading = document.getElementById('celebration-heading');
      const love = document.getElementById('celebration-love');
      const joke = document.getElementById('celebration-joke');

      if (!section) { resolve(); return; }

      section.classList.add('visible');

      if (this.isReduced) {
        [heading, love, joke].forEach((el) => {
          if (el) el.style.opacity = '1';
        });
        resolve();
        return;
      }

      const tl = gsap.timeline({ onComplete: resolve });

      tl.to(heading, {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        delay: 0.5,
      })
      .to(love, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.2')
      .to(joke, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.1');

      gsap.set(heading, { scale: 0.8 });
      gsap.set([love, joke], { y: 20 });
    });
  }

  /**
   * Tilt effect for confession cards (desktop only).
   */
  initTiltCards() {
    if (this.isTouch) return;

    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800,
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power2.out',
        });
      });
    });
  }
}
