/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                                                                  ║
 * ║              ♥  PERSONALIZE YOUR APOLOGY HERE  ♥                ║
 * ║                                                                  ║
 * ║   Edit the values below to make this website truly yours.       ║
 * ║   Everything is in one place so you don't have to dig           ║
 * ║   through the code.                                              ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * HOW TO ADD YOUR PHOTOS:
 * ─────────────────────────
 * 1. Create a folder:  public/assets/photos/
 * 2. Drop your photos there (photo1.jpg, photo2.jpg, etc.)
 * 3. Update the 'photos' array below with filenames and captions
 *
 * HOW TO ADD YOUR SONG:
 * ─────────────────────────
 * 1. Place your mp3 file at:  public/assets/our-song.mp3
 * 2. Update the 'music' path below if you renamed it
 *
 * HOW TO ADD THE FINAL SPECIAL PHOTO:
 * ─────────────────────────────────────
 * 1. Place the photo at:  public/assets/favourite-photo.jpg
 * 2. Update 'finalPhoto' below if you renamed it
 */

export const CONFIG = {

  // ── Her name (shown in subtle, personal touches) ──────────────
  girlfriendName: "Bacha",

  // ── Background music file path ────────────────────────────────
  // Place your mp3 in public/assets/
  music: "/assets/our-song.mp3",

  // ── Photo gallery ─────────────────────────────────────────────
  // Add as many photos as you want. Each needs a src and caption.
  // Photos go in public/assets/photos/
  photos: [
    {
      src: "/assets/photos/photo1.jpg",
      caption: "One of my favourite memories. ❤️",
    },
    {
      src: "/assets/photos/photo2.jpg",
      caption: "You looked so cute here.",
    },
    {
      src: "/assets/photos/photo3.jpg",
      caption: "I smile every time I see this.",
    },
  ],

  // ── Photo display mode ────────────────────────────────────────
  // "gallery"    → Photos only in the gallery section
  // "background" → Photos float as subtle background elements
  // "both"       → Gallery + floating background photos
  photoMode: "gallery",

  // ── Special final photo ───────────────────────────────────────
  // Shown at the very end after the celebration
  // Place in public/assets/
  finalPhoto: "/assets/favourite-photo.jpg",

  // ── Your personal love letter ─────────────────────────────────
  // Write from the heart. Line breaks are preserved.
  loveLetter: `I know words aren't always enough.
And I know I haven't always been perfect at saying the right thing at the right time.

But what I do know is that you're the person I want to figure it all out with.
Every argument, every misunderstanding, every moment where I mess up —
none of it changes how I feel about you.

You make even ordinary days feel like something worth remembering.
And I never want to be the reason you feel anything less than loved.

So here I am. Not with excuses. Not with "but I didn't mean it."
Just with a genuine, from-the-bottom-of-my-heart apology.

I'm sorry. I love you. And I'll do better.

Manna loves her Bacha so mmuchh ❤️`,

  // ── How you sign the love letter ──────────────────────────────
  signature: "— from your idiot ❤️",

  // ── Floating romantic phrases (appear subtly throughout) ──────
  floatingPhrases: [
    "still my favourite person",
    "you + me",
    "one more chance?",
    "Manna loves her Bacha so mmuchh",
    "i'm sorry ❤️",
    "always yours",
  ],
};
