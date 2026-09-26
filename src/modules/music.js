/**
 * Music Player
 * Floating music toggle with graceful error handling.
 * Remembers play state in sessionStorage.
 */

export class MusicPlayer {
  constructor(musicPath) {
    this.btn = document.getElementById('music-toggle');
    this.musicPath = musicPath;

    this.audio = new Audio(musicPath);
    this.audio.loop = true;
    this.audio.volume = 0.25;
    this.audio.preload = 'auto';
    this.isPlaying = false;
    this.hasError = false;

    // Graceful error handling with fallback
    this.audio.addEventListener('error', () => {
      if (this.musicPath !== '/assets/romantic_bg.mp3') {
        console.log('our-song.mp3 not found, trying romantic_bg.mp3 fallback...');
        this.musicPath = '/assets/romantic_bg.mp3';
        this.audio.src = '/assets/romantic_bg.mp3';
        this.audio.load();
      } else {
        this.hasError = true;
        if (this.btn) {
          this.btn.title = 'Add your song at /assets/our-song.mp3';
          this.btn.style.opacity = '0.5';
        }
      }
    });

    if (this.btn) {
      this.btn.addEventListener('click', () => this.toggle());
    }
  }

  showControl() {
    if (this.btn) {
      this.btn.classList.add('visible');
    }
  }

  async fadeIn(targetVolume = 0.25, durationMs = 2500) {
    if (this.hasError) return;
    this.audio.volume = 0;
    try {
      await this.audio.play();
      this.isPlaying = true;
      if (this.btn) {
        this.btn.classList.add('playing');
        this.btn.title = 'Pause music';
      }
      sessionStorage.setItem('musicPlaying', 'true');

      const steps = 30;
      const stepTime = durationMs / steps;
      const volumeStep = targetVolume / steps;

      let currentStep = 0;
      const fadeInterval = setInterval(() => {
        currentStep++;
        this.audio.volume = Math.min(targetVolume, volumeStep * currentStep);
        if (currentStep >= steps) {
          clearInterval(fadeInterval);
        }
      }, stepTime);
    } catch (err) {
      console.log('Music play blocked or failed:', err);
    }
  }

  async play() {
    if (this.hasError) return;
    try {
      await this.audio.play();
      this.isPlaying = true;
      if (this.btn) {
        this.btn.classList.add('playing');
        this.btn.title = 'Pause music';
      }
      sessionStorage.setItem('musicPlaying', 'true');
    } catch (err) {
      console.log('Music autoplay blocked. Click the music button to play.');
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    if (this.btn) {
      this.btn.classList.remove('playing');
      this.btn.title = 'Play our song';
    }
    sessionStorage.setItem('musicPlaying', 'false');
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
}
