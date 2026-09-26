/**
 * ♥ FOR YOU ♥
 * Main application entry point.
 * Orchestrates all modules into one cinematic romantic experience.
 */

import './styles/index.css';
import { CONFIG } from './config.js';
import { ParticleSystem } from './modules/particles.js';
import { CustomCursor } from './modules/cursor.js';
import { MusicPlayer } from './modules/music.js';
import { PhotoGallery } from './modules/gallery.js';
import { AnimationController } from './modules/animations.js';
import { CelebrationEffect } from './modules/celebration.js';
import { FloatingNav } from './modules/navigation.js';
import { FloatingPhrases } from './modules/phrases.js';
import { UnlockScreen } from './modules/unlock.js';

class App {
  constructor() {
    this.animations = new AnimationController();
    this.celebration = new CelebrationEffect();
    this.nav = new FloatingNav();
    this.init();
  }

  async init() {
    // Initialize ambient background systems
    new ParticleSystem();
    new CustomCursor();
    this.musicPlayer = new MusicPlayer(CONFIG.music);
    new FloatingPhrases();

    // Populate love letter
    this.populateLoveLetter();

    // Initialize secret entrance unlock screen
    const unlockScreen = new UnlockScreen(CONFIG.unlockDate, () => {
      // Fade music in over 2.5s at 25% volume after user interaction (unlock)
      this.musicPlayer.fadeIn(0.25, 2500);
      this.musicPlayer.showControl();
    });

    // Wait for successful secret date unlock
    await unlockScreen.start();

    // Optional subtle mobile notice if opened on a phone screen
    await UnlockScreen.checkMobileNotice();

    // Play hero sequence, wait for user button click ("Give me a minute...")
    await this.animations.playHeroSequence();

    // Transition to main content
    await this.animations.transitionToMain();

    // Initialize main content systems
    new PhotoGallery();
    this.animations.initScrollAnimations();
    this.animations.initTiltCards();
    this.animations.playFinalQuestionSequence();

    // Show navigation
    this.nav.show();

    // Setup final interaction
    this.setupFinalInteraction();
  }

  populateLoveLetter() {
    const letterContent = document.getElementById('letter-content');
    const letterSignature = document.getElementById('letter-signature');

    if (letterContent) {
      letterContent.textContent = CONFIG.loveLetter.trim();
    }
    if (letterSignature) {
      letterSignature.textContent = CONFIG.signature;
    }
  }

  setupFinalInteraction() {
    const btnYes = document.getElementById('btn-yes');
    const btnMad = document.getElementById('btn-mad');
    const stillMadModal = document.getElementById('still-mad-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalOverlay = stillMadModal?.querySelector('.modal__overlay');
    const finalQuestion = document.getElementById('final-question');

    // "Yes" button
    btnYes?.addEventListener('click', async () => {
      // Hide the question
      if (finalQuestion) {
        finalQuestion.style.opacity = '0';
        finalQuestion.style.transition = 'opacity 0.6s';
      }

      // Wait a beat
      await this.delay(600);

      if (finalQuestion) finalQuestion.style.display = 'none';

      // Trigger celebration
      this.celebration.trigger();

      // Show celebration section
      await this.animations.playCelebrationSequence();

      // Show final photo after a delay
      await this.delay(2000);
      const finalPhotoSection = document.getElementById('final-photo-section');
      if (finalPhotoSection) {
        finalPhotoSection.classList.add('visible');
        finalPhotoSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // "I'm still mad" button
    btnMad?.addEventListener('click', () => {
      if (stillMadModal) {
        stillMadModal.classList.add('visible');
      }
    });

    // Close modal
    const closeModal = () => {
      if (stillMadModal) {
        stillMadModal.classList.remove('visible');
      }
    };

    modalCloseBtn?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && stillMadModal?.classList.contains('visible')) {
        closeModal();
      }
    });
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Launch when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}
