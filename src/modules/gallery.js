/**
 * Photo Gallery
 * Masonry layout with lightbox, lazy loading, and background photo mode.
 */

import { CONFIG } from '../config.js';
import { getAssetPath } from '../utils.js';

export class PhotoGallery {
  constructor() {
    this.galleryEl = document.getElementById('photo-gallery');
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxCaption = document.getElementById('lightbox-caption');
    this.lightboxClose = document.getElementById('lightbox-close');
    this.lightboxOverlay = this.lightbox?.querySelector('.lightbox__overlay');

    this.photos = CONFIG.photos || [];
    this.photoMode = CONFIG.photoMode || 'gallery';

    this.init();
  }

  init() {
    // Build gallery
    if (this.photoMode === 'gallery' || this.photoMode === 'both') {
      this.buildGallery();
    } else {
      this.showEmptyGallery();
    }

    // Build background photos
    if (this.photoMode === 'background' || this.photoMode === 'both') {
      this.buildBackgroundPhotos();
    }

    // Setup lightbox
    this.setupLightbox();

    // Setup final photo
    this.setupFinalPhoto();
  }

  buildGallery() {
    if (!this.galleryEl) return;

    if (this.photos.length === 0) {
      this.showEmptyGallery();
      return;
    }

    // Rotation variations for that personal, slightly messy feel
    const rotations = [-2, 1.5, -1, 2, -1.5, 0.8, -0.5, 1.2];

    this.photos.forEach((photo, index) => {
      const item = document.createElement('div');
      item.className = 'gallery__item reveal-up';
      item.style.setProperty('--rotation', `${rotations[index % rotations.length]}deg`);
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View photo: ${photo.caption}`);

      const img = document.createElement('img');
      img.className = 'gallery__img';
      img.alt = photo.caption || `Memory ${index + 1}`;
      img.loading = 'lazy';
      img.dataset.src = getAssetPath(photo.src);

      // Placeholder background while loading
      img.style.backgroundColor = '#fde8ed';
      img.style.minHeight = '200px';

      const caption = document.createElement('div');
      caption.className = 'gallery__caption';
      caption.textContent = photo.caption || '';

      item.appendChild(img);
      item.appendChild(caption);

      // Open lightbox on click
      item.addEventListener('click', () => this.openLightbox(photo));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openLightbox(photo);
        }
      });

      this.galleryEl.appendChild(item);
    });

    // Lazy load with Intersection Observer
    this.lazyLoad();
  }

  showEmptyGallery() {
    if (!this.galleryEl) return;
    this.galleryEl.classList.add('gallery--empty');
    this.galleryEl.innerHTML = `<p>Add your photos in the config to fill this gallery ❤️</p>`;
  }

  lazyLoad() {
    const images = this.galleryEl?.querySelectorAll('img[data-src]');
    if (!images || images.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.style.minHeight = '';

          // Handle load error gracefully
          img.addEventListener('error', () => {
            img.style.minHeight = '200px';
            img.style.backgroundColor = '#fde8ed';
            img.alt = 'Photo placeholder — add your photo here';
          });

          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px',
    });

    images.forEach((img) => observer.observe(img));
  }

  buildBackgroundPhotos() {
    const container = document.getElementById('photo-bg-container');
    if (!container || this.photos.length === 0) return;

    this.photos.forEach((photo, index) => {
      const img = document.createElement('img');
      img.className = 'photo-bg-item';
      img.src = getAssetPath(photo.src);
      img.alt = '';
      img.loading = 'lazy';

      // Random positioning
      const size = 150 + Math.random() * 200;
      img.style.width = `${size}px`;
      img.style.height = `${size}px`;
      img.style.left = `${Math.random() * 80}%`;
      img.style.top = `${Math.random() * 80}%`;
      img.style.animationDelay = `${index * 5}s`;
      img.style.animationDuration = `${25 + Math.random() * 15}s`;

      img.addEventListener('error', () => {
        img.style.display = 'none';
      });

      container.appendChild(img);
    });
  }

  setupLightbox() {
    if (!this.lightbox) return;

    // Close lightbox
    this.lightboxClose?.addEventListener('click', () => this.closeLightbox());
    this.lightboxOverlay?.addEventListener('click', () => this.closeLightbox());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('visible')) {
        this.closeLightbox();
      }
    });
  }

  openLightbox(photo) {
    if (!this.lightbox || !this.lightboxImg) return;

    this.lightboxImg.src = getAssetPath(photo.src);
    this.lightboxImg.alt = photo.caption || '';
    if (this.lightboxCaption) {
      this.lightboxCaption.textContent = photo.caption || '';
    }
    this.lightbox.classList.add('visible');
    document.body.style.overflow = 'hidden';

    // Focus close button for accessibility
    setTimeout(() => this.lightboxClose?.focus(), 100);
  }

  closeLightbox() {
    if (!this.lightbox) return;
    this.lightbox.classList.remove('visible');
    document.body.style.overflow = '';
  }

  setupFinalPhoto() {
    const img = document.getElementById('final-photo-img');
    if (img && CONFIG.finalPhoto) {
      img.src = getAssetPath(CONFIG.finalPhoto);
      img.addEventListener('error', () => {
        // Hide final photo section if image doesn't load
        const section = document.getElementById('final-photo-section');
        if (section) section.style.display = 'none';
      });
    }
  }
}
