/* ============================================================
   WEDDING INVITATION — CONFIGURATION
   ============================================================ */

var CONFIG = {

  /* ---------- 1. THE COUPLE ---------- */
  couple: {
    bride:        "Tehreem",
    groom:        "Mohammed Hassan",
    brideArabic:  "تحريم",
    groomArabic:  "محمد حسّان",
    initials:     { bride: "T", groom: "H" },
    tagline:      "are getting married",
    pageTitle:    "Tehreem & Mohammed Hassan — Wedding Invitation"
  },

  /* ---------- 2. RELIGIOUS / CULTURAL FRAMING ---------- */
  faith: {
    islamic: true,
    bismillahArabic: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ",
    bismillahEnglish: "In the name of Allah, the Most Gracious, the Most Merciful",
    verseArabic: "وَخَلَقْنَاكُمْ أَزْوَاجًا",
    verseEnglish: "“And We created you in pairs.”",
    verseRef: "Surah An-Naba · 78:8",
    closingArabic: "بَارَكَ اللهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    closingEnglish: "May Allah bless you both, and unite you in goodness."
  },

  /* ---------- 3. THE INVITATION TEXT ---------- */
  invitation: {
    intro: "With hearts full of gratitude to the Almighty, we joyfully invite you and your family to share in the celebration of our wedding.",
    brideSide: {
      label:   "Bride",
      parents: "Daughter of Mrs. Reshma & Mr. Irfan Mulla",
      place:   "Mumbai / Thane"
    },
    groomSide: {
      label:   "Groom",
      parents: "Son of Mrs. Afroz & Mr. Feroz Khan",
      place:   "Mumbai / Thane"
    },
    note: "Your gracious presence and heartfelt duas are our greatest blessing.",
    monogramLine: "Together with our families"
  },

  /* ---------- 4. EVENTS ---------- */
  events: [
    {
      name:    "Wedding Celebration",
      iso:     "2026-11-10T19:00:00+05:30",
      dateText:"Tuesday, 10 November 2026",
      timeText:"7:00 PM onwards",
      venue:   "Vincent Wedding Lawn",
      address: "A206, Mumbai - Pune Rd, Rashid Compound, Kausa, Mumbra, Thane, Maharashtra 400612",
      mapUrl:  "https://maps.app.goo.gl/Zx25BPtS6i8JmFtR6?g_st=ic"
    }
  ],

  /* ---------- 5. COUNTDOWN ---------- */
  countdownEventIndex: 0,

  /* ---------- 6. MAP ---------- */
  mapEmbedSrc: "https://maps.google.com/maps?q=Vincent+wedding+lawn,+Kausa,+Mumbra,+Thane&t=&z=15&ie=UTF8&iwloc=&output=embed",

  /* ---------- 7. MUSIC ---------- */
  music: {
    enabled: true,
    title:   "Zariya",
    src:     "assets/audio/zariya.mp3",
    volume:  0.45,
    loop:    true
  },

  /* ---------- 8. RSVP / CONTACT ---------- */
  rsvp: {
    enabled: true,
    heading: "RSVP",
    text:    "Kindly grace the occasion with your presence and prayers.",
    whatsappNumber: "",
    whatsappMessage: "Assalamu Alaikum! We are honored to attend the wedding of Tehreem & Mohammed Hassan.",
    contacts: [
      { name: "Awaiting to welcome", phone: "Family & Friends", text: "Family & Friends" }
    ]
  },

  /* ---------- 9. FOOTER ---------- */
  footer: {
    line: "Celebrating the union of Tehreem & Mohammed Hassan"
  }
};

/* make the config visible to main.js in every browser */
window.CONFIG = CONFIG;
