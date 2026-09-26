/**
 * Music Player
 * Floating music toggle with graceful error handling.
 * Remembers play state in sessionStorage.
 */

export class MusicPlayer {
  constructor(musicPath) {
    this.btn = document.getElementById('music-toggle');
    if (!this.btn) return;

    this.audio = new Audio(musicPath);
    this.audio.loop = true;
    this.audio.volume = 0.3;
    this.audio.preload = 'auto';
    this.isPlaying = false;
    this.hasError = false;

    // Graceful error handling if file doesn't exist
    this.audio.addEventListener('error', () => {
      this.hasError = true;
      this.btn.title = 'Add your song at /assets/our-song.mp3';
      this.btn.style.opacity = '0.5';
    });

    // Restore state
    if (sessionStorage.getItem('musicPlaying') === 'true') {
      this.play();
    }

    this.btn.addEventListener('click', () => this.toggle());
  }

  async play() {
    if (this.hasError) return;
    try {
      await this.audio.play();
      this.isPlaying = true;
      this.btn.classList.add('playing');
      this.btn.title = 'Pause music';
      sessionStorage.setItem('musicPlaying', 'true');
    } catch (err) {
      // Browser blocked autoplay, will work after user interaction
      console.log('Music autoplay blocked. Click the music button to play.');
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.btn.classList.remove('playing');
    this.btn.title = 'Play our song';
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
