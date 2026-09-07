/* ============================================================
   WEDDING INVITATION — JAVASCRIPT LOGIC & LIVING BACKDROP ENGINE
   Mohammed Hassan & Tehreem · Vincent Wedding Lawn
   ============================================================ */

(function () {
  "use strict";

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var setText = function (id, value) { var el = document.getElementById(id); if (el) el.textContent = value || ""; };
  var setHTML = function (id, value) { var el = document.getElementById(id); if (el) el.innerHTML = value || ""; };
  var hide    = function (el) { if (el) el.style.display = "none"; };

  var C = (typeof CONFIG !== "undefined" && CONFIG) || window.CONFIG || {};

  /* ---------------------------------------------------------
     1. TEXT CONTENT
     --------------------------------------------------------- */

  function fillContent() {
    var c = C.couple || {};
    document.title = c.pageTitle || (c.bride + " & " + c.groom);

    ["env-bride", "hero-bride"].forEach(function (id) { setText(id, c.bride); });
    ["env-groom", "hero-groom"].forEach(function (id) { setText(id, c.groom); });
    setText("cardBride", c.bride);
    setText("cardGroom", c.groom);
    setText("hero-tagline", c.tagline);
    setText("closingNames", c.bride + " & " + c.groom);

    if (c.brideArabic || c.groomArabic) {
      setText("hero-arabic", [c.brideArabic, c.groomArabic].filter(Boolean).join("  &  "));
    }

    /* Faith block */
    var f = C.faith || {};
    if (f.islamic) {
      setText("bismillah", f.bismillahArabic);
      setText("bismillahEn", f.bismillahEnglish);
      setText("verseAr", f.verseArabic);
      setText("verseEn", f.verseEnglish);
      setText("verseRef", f.verseRef);
      setText("closingAr", f.closingArabic);
      setText("closingEn", f.closingEnglish);
    } else {
      hide($("#bismillah")); hide($("#bismillahEn")); hide($("#verseSection"));
      hide($("#closingAr"));
      setText("closingEn", "With joy and gratitude, we look forward to celebrating with you.");
    }

    /* Invitation text */
    var inv = C.invitation || {};
    setText("inviteIntro", inv.intro);
    setText("inviteNote", inv.note);
    if (inv.brideSide) {
      setText("brideLabel", inv.brideSide.label);
      setHTML("brideParents", inv.brideSide.parents);
      setText("bridePlace", inv.brideSide.place);
    }
    if (inv.groomSide) {
      setText("groomLabel", inv.groomSide.label);
      setHTML("groomParents", inv.groomSide.parents);
      setText("groomPlace", inv.groomSide.place);
    }

    /* Monogram wreath & seal (Tehreem & Hassan -> T & H) */
    var ini = c.initials || {};
    var bInitial = ini.bride || (c.bride || "").charAt(0) || "T";
    var gInitial = ini.groom || (c.groom || "").charAt(0) || "H";
    setText("monoBride", bInitial);
    setText("monoGroom", gInitial);
    setText("monogramLine", inv.monogramLine);
    var sealMono = $(".seal-monogram");
    if (sealMono) sealMono.textContent = bInitial + " & " + gInitial;

    setText("footerLine", C.footer && C.footer.line);

    /* Envelope + hero date, taken from countdown event */
    var ev = mainEvent();
    if (ev) {
      setText("env-date", ev.dateText);
      setText("hero-date", ev.dateText + (ev.timeText ? "  ·  " + ev.timeText : "") + (ev.venue ? "  ·  " + ev.venue : ""));
    }

    /* Personalised greeting:  index.html?to=Ahmed%20Family  */
    var to = new URLSearchParams(location.search).get("to");
    if (to) setText("env-guest", "Honored Guest: " + decodeURIComponent(to));
  }

  function mainEvent() {
    var list = C.events || [];
    return list[C.countdownEventIndex || 0] || list[0];
  }

  /* ---------------------------------------------------------
     2. EVENTS
     --------------------------------------------------------- */

  function renderEvents() {
    var grid = $("#eventsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    (C.events || []).forEach(function (ev) {
      var card = document.createElement("article");
      card.className = "event-card reveal";
      card.innerHTML =
        '<img src="assets/images/floral/floral_corner.png" class="card-floral-corner card-floral-corner--tl" alt="" aria-hidden="true">' +
        '<img src="assets/images/floral/floral_corner.png" class="card-floral-corner card-floral-corner--br" alt="" aria-hidden="true">' +
        '<div class="event-card__floral-crown" aria-hidden="true"><img src="assets/images/floral/floral_divider_bar.png" alt="" class="event-floral-bar"></div>' +
        '<p class="event-card__name"></p>' +
        '<p class="event-card__date"></p>' +
        '<p class="event-card__time"></p>' +
        '<p class="event-card__venue"></p>' +
        '<p class="event-card__addr"></p>';
      $(".event-card__name",  card).textContent = ev.name || "";
      $(".event-card__date",  card).textContent = ev.dateText || "";
      $(".event-card__time",  card).textContent = ev.timeText || "";
      $(".event-card__venue", card).textContent = ev.venue || "";
      $(".event-card__addr",  card).textContent = ev.address || "";
      if (ev.mapUrl) {
        var a = document.createElement("a");
        a.className = "btn";
        a.href = ev.mapUrl;
        a.target = "_blank";
        a.rel = "noopener";
        a.innerHTML = "<span>Get Directions</span>";
        card.appendChild(a);
      }
      grid.appendChild(card);
    });
  }

  /* ---------------------------------------------------------
     3. COUNTDOWN TIMER
     --------------------------------------------------------- */

  function startCountdown() {
    var ev = mainEvent();
    if (!ev || !ev.iso) return;
    var target = new Date(ev.iso).getTime();
    if (isNaN(target)) return;

    var pad = function (n) { return String(n).padStart(2, "0"); };

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        ["cd-d", "cd-h", "cd-m", "cd-s"].forEach(function (id) { setText(id, "00"); });
        setText("cdMsg", "Today is the joyous day! Welcome!");
        clearInterval(timer);
        return;
      }
      var s = Math.floor(diff / 1000);
      setText("cd-d", pad(Math.floor(s / 86400)));
      setText("cd-h", pad(Math.floor(s % 86400 / 3600)));
      setText("cd-m", pad(Math.floor(s % 3600 / 60)));
      setText("cd-s", pad(s % 60));
    }
    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------
     4. MAP & DIRECTIONS
     --------------------------------------------------------- */

  function renderMap() {
    var wrap = $("#mapWrap");
    var actions = $("#mapActions");
    var ev = mainEvent();

    if (wrap) {
      if (C.mapEmbedSrc) {
        wrap.innerHTML = "";
        var f = document.createElement("iframe");
        f.src = C.mapEmbedSrc;
        f.loading = "lazy";
        f.referrerPolicy = "no-referrer-when-downgrade";
        f.title = "Vincent Wedding Lawn location";
        f.allowFullscreen = true;
        wrap.appendChild(f);
      } else {
        hide(wrap);
      }
    }

    if (ev && ev.mapUrl && actions) {
      actions.innerHTML = "";
      var a = document.createElement("a");
      a.className = "btn btn--solid";
      a.href = ev.mapUrl;
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = "<span>Open in Google Maps</span>";
      actions.appendChild(a);
    }
  }

  /* ---------------------------------------------------------
     5. RSVP
     --------------------------------------------------------- */

  function renderRsvp() {
    var r = C.rsvp || {};
    if (!r.enabled) { hide($("#rsvpSection")); return; }

    setText("rsvpHeading", r.heading || "RSVP");
    setText("rsvpText", r.text);

    var actions = $("#rsvpActions");
    if (actions) {
      actions.innerHTML = "";
      if (r.whatsappNumber) {
        var a = document.createElement("a");
        a.className = "btn btn--solid";
        a.href = "https://wa.me/" + r.whatsappNumber + "?text=" + encodeURIComponent(r.whatsappMessage || "");
        a.target = "_blank";
        a.rel = "noopener";
        a.innerHTML = "<span>Confirm via WhatsApp</span>";
        actions.appendChild(a);
      }
    }

    var box = $("#rsvpContacts");
    if (box) {
      box.innerHTML = "";
      (r.contacts || []).forEach(function (c) {
        var d = document.createElement("div");
        d.className = "rsvp__contact";
        if (c.name) {
          var s = document.createElement("strong");
          s.textContent = c.name;
          d.appendChild(s);
        }
        var val = c.text || c.phone || c.value || "";
        if (val) {
          var isPhone = /^[\d\s\+\-\(\)]+$/.test(val);
          if (isPhone) {
            var link = document.createElement("a");
            link.href = "tel:" + String(val).replace(/\s/g, "");
            link.textContent = val;
            d.appendChild(link);
          } else if (c.url) {
            var link = document.createElement("a");
            link.href = c.url;
            link.target = "_blank";
            link.rel = "noopener";
            link.textContent = val;
            d.appendChild(link);
          } else {
            var span = document.createElement("span");
            span.className = "rsvp__contact-val";
            span.textContent = val;
            d.appendChild(span);
          }
        }
        box.appendChild(d);
      });
    }
  }

  /* ---------------------------------------------------------
     6. SHARE & CALENDAR
     --------------------------------------------------------- */

  function wireShare() {
    var btn = $("#shareBtn");
    if (!btn) return;
    var title = (C.couple.bride || "Tehreem") + " & " + (C.couple.groom || "Mohammed Hassan") + " — Wedding Invitation";
    btn.addEventListener("click", function () {
      if (navigator.share) {
        navigator.share({
          title: title,
          text: "You are joyfully invited to the wedding of " + (C.couple.bride || "Tehreem") + " & " + (C.couple.groom || "Mohammed Hassan") + " on 10 November 2026 at Vincent Wedding Lawn.",
          url: location.href
        }).catch(function () {});
      } else if (navigator.clipboard) {
        var label = btn.querySelector("span") || btn;
        navigator.clipboard.writeText(location.href).then(function () {
          label.textContent = "Link copied to clipboard";
          setTimeout(function () { label.textContent = "Share this invitation"; }, 2400);
        });
      }
    });
  }

  function wireCalendar() {
    var btn = $("#calBtn");
    var ev = mainEvent();
    if (!btn || !ev || !ev.iso) { hide(btn); return; }

    btn.addEventListener("click", function () {
      var start = new Date(ev.iso);
      var end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
      var fmt = function (d) { return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"; };
      var summary = (C.couple.groom || "Mohammed Hassan") + " & " + (C.couple.bride || "Tehreem") + " Wedding Celebration";

      var ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding Invitation//EN",
        "BEGIN:VEVENT",
        "UID:" + Date.now() + "@vincentwedding",
        "DTSTAMP:" + fmt(new Date()),
        "DTSTART:" + fmt(start),
        "DTEND:" + fmt(end),
        "SUMMARY:" + summary,
        "LOCATION:" + [ev.venue, ev.address].filter(Boolean).join(", "),
        "DESCRIPTION:" + (ev.name || "Wedding Celebration") + " at " + (ev.venue || "Vincent Wedding Lawn"),
        "END:VEVENT", "END:VCALENDAR"
      ].join("\r\n");

      var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "Mohammed_Hassan_and_Tehreem_Wedding.ics";
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  /* ---------------------------------------------------------
     7. BACKGROUND MUSIC (BGM)
     --------------------------------------------------------- */

  var audio = $("#bgm");
  var musicBtn = $("#musicBtn");

  var userExplicitlyPaused = false;
  var fadeInterval = null;

  function setupMusic() {
    var m = C.music || {};
    if (!m.enabled || !m.src) { hide(musicBtn); return; }
    audio.src = m.src;
    audio.loop = true;
    audio.setAttribute("loop", "");
    audio.setAttribute("playsinline", "");
    audio.volume = typeof m.volume === "number" ? m.volume : 0.45;
    if (musicBtn) musicBtn.hidden = false;

    if (musicBtn) {
      musicBtn.addEventListener("click", function () {
        if (audio.paused) {
          userExplicitlyPaused = false;
          playMusic(2500);
        } else {
          userExplicitlyPaused = true;
          audio.pause();
          paintMusic();
        }
      });
    }

    /* Seamless continuous playback: re-trigger on track end */
    audio.addEventListener("ended", function () {
      audio.currentTime = 0;
      var p = audio.play();
      if (p && p.catch) p.catch(function () {});
    });

    audio.addEventListener("play", paintMusic);
    audio.addEventListener("pause", paintMusic);
    audio.addEventListener("error", function () {
      console.info("Audio track error or pending user interaction.");
    });

    /* Auto-resume when guest returns to tab/browser */
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && !userExplicitlyPaused && !document.body.classList.contains("is-locked")) {
        if (audio.paused) {
          audio.play().catch(function () {});
        }
      }
    });

    /* Keep music alive during scroll / touch interaction */
    function keepAlive() {
      if (!userExplicitlyPaused && !document.body.classList.contains("is-locked")) {
        if (audio.paused) {
          audio.play().catch(function () {});
        }
      }
    }
    window.addEventListener("scroll", keepAlive, { passive: true });
    document.addEventListener("touchstart", keepAlive, { passive: true });

    paintMusic();
  }

  /* Slow starting gentle fade-in for elegant entrance */
  function playMusic(fadeDuration) {
    var m = C.music || {};
    if (!m.enabled || !m.src) return;
    var target = typeof m.volume === "number" ? m.volume : 0.45;
    userExplicitlyPaused = false;
    var duration = typeof fadeDuration === "number" ? fadeDuration : 3500;

    if (audio.paused) {
      audio.volume = 0;
      var p = audio.play();
      if (p && p.catch) {
        p.catch(function () {});
      }
      if (fadeInterval) clearInterval(fadeInterval);
      var startTime = Date.now();
      fadeInterval = setInterval(function () {
        var elapsed = Date.now() - startTime;
        var progress = Math.min(1, elapsed / duration);
        // Quadratic ease-in: starts whisper-soft and gently ascends
        var ease = progress * progress;
        audio.volume = Math.min(target, target * ease);
        if (progress >= 1) {
          audio.volume = target;
          clearInterval(fadeInterval);
          fadeInterval = null;
        }
      }, 50);
    } else {
      audio.volume = target;
    }
  }

  function paintMusic() {
    if (!musicBtn) return;
    var isPlaying = !audio.paused;
    musicBtn.classList.toggle("is-playing", isPlaying);
    musicBtn.classList.toggle("is-muted", !isPlaying);
    var trackName = (C.music && C.music.title) ? C.music.title : "Zariya";
    var label = isPlaying ? "Pause BGM (" + trackName + ")" : "Play BGM (" + trackName + ")";
    musicBtn.setAttribute("aria-label", label);
    musicBtn.setAttribute("title", label);
    var tooltip = musicBtn.querySelector(".ctrl-btn__tooltip");
    if (tooltip) {
      tooltip.textContent = isPlaying ? "Playing: " + trackName : "Play: " + trackName;
    }
  }

  /* ---------------------------------------------------------
     8. ENVELOPE UNVEIL
     --------------------------------------------------------- */

  function wireEnvelope() {
    var env = $("#envelope");
    var openBtn = $("#openBtn");
    if (!openBtn || !env) return;

    function openEnvelopeNow(withAudio) {
      env.classList.add("is-open");
      document.body.classList.remove("is-locked");
      window.scrollTo(0, 0);
      if (withAudio) playMusic(4000);
      setTimeout(function () { env.style.display = "none"; }, 1100);
      revealNow();
    }

    openBtn.addEventListener("click", function () {
      openEnvelopeNow(true);
    });

    if (window.location.search.indexOf("open=1") !== -1 || window.location.hash.indexOf("open") !== -1) {
      openEnvelopeNow(false);
      var hash = window.location.hash;
      if (hash && hash !== "#open") {
        setTimeout(function () {
          var targetEl = $(hash);
          if (targetEl) targetEl.scrollIntoView();
        }, 150);
      }
    }
  }

  /* ---------------------------------------------------------
     9. SCROLL REVEAL
     --------------------------------------------------------- */

  var observer;

  function setupReveal() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        observer.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    $$(".reveal").forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 110 + "ms";
      observer.observe(el);
    });
  }

  function revealNow() {
    $$(".hero .reveal").forEach(function (el) {
      el.style.transitionDelay = "0ms";
      el.classList.add("is-in");
    });
  }

  /* ---------------------------------------------------------
     10. THEME SWITCHER (Velvet Maroon <-> Royal Champagne)
     --------------------------------------------------------- */

  function setupThemeToggle() {
    var btn = $("#themeToggle");
    if (!btn) return;
    var html = document.documentElement;

    var savedTheme = localStorage.getItem("wedding_theme");
    if (savedTheme) {
      html.setAttribute("data-theme", savedTheme);
    } else {
      html.setAttribute("data-theme", "maroon");
    }

    btn.addEventListener("click", function () {
      var current = html.getAttribute("data-theme") || "maroon";
      var next = (current === "maroon" || current === "twilight") ? "champagne" : "maroon";
      html.setAttribute("data-theme", next);
      localStorage.setItem("wedding_theme", next);
      if (window.updateBackdropTheme) {
        window.updateBackdropTheme(next);
      }
    });
  }

  /* ---------------------------------------------------------
     11. DYNAMIC LIVING BACKDROP CANVAS (STARS & GOLDEN FIREFLIES)
     --------------------------------------------------------- */

  function setupBackdropCanvas() {
    var canvas = $("#backdropCanvas");
    if (!canvas) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    var ctx = canvas.getContext("2d");
    var width = 0;
    var height = 0;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [];
    var interactiveSparks = [];
    var mouse = { x: -1000, y: -1000, active: false };
    var animFrame = null;
    var theme = document.documentElement.getAttribute("data-theme") || "maroon";

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Particle Factory
    var count = width < 600 ? 32 : 55;
    for (var i = 0; i < count; i++) {
      particles.push(createFirefly(true));
    }

    function createFirefly(randomY) {
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : height + 10 + Math.random() * 20,
        radius: 1.2 + Math.random() * 2.6,
        glowRadius: 8 + Math.random() * 18,
        speedY: -(0.25 + Math.random() * 0.55),
        speedX: (Math.random() - 0.5) * 0.35,
        swingAmp: 15 + Math.random() * 25,
        swingFreq: 0.0015 + Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2,
        opacity: 0.2 + Math.random() * 0.7,
        twinkleSpeed: 0.02 + Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI * 2
      };
    }

    // Touch & Mouse interaction
    function onPointerMove(e) {
      var x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
      var y = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
      if (x != null && y != null) {
        mouse.x = x;
        mouse.y = y;
        mouse.active = true;
        if (interactiveSparks.length < 24) {
          interactiveSparks.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 2.2,
            vy: (Math.random() - 0.5) * 2.2 - 0.5,
            radius: 1.2 + Math.random() * 1.8,
            life: 1
          });
        }
      }
    }

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });

    window.updateBackdropTheme = function (newTheme) {
      theme = newTheme;
    };

    var now = 0;
    function render(time) {
      now = time || 0;
      ctx.clearRect(0, 0, width, height);

      var isChampagne = theme === "champagne";
      var baseR = isChampagne ? 248 : 242;
      var baseG = isChampagne ? 218 : 202;
      var baseB = isChampagne ? 140 : 126;

      // Draw living fireflies
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.y += p.speedY;
        p.x += Math.sin(now * p.swingFreq + p.phase) * 0.45 + p.speedX;

        // Interactive gentle repulsion/attraction
        if (mouse.active) {
          var dx = p.x - mouse.x;
          var dy = p.y - mouse.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 1) {
            p.x += (dx / dist) * 1.2;
            p.y += (dy / dist) * 1.2;
          }
        }

        var curOpacity = p.opacity * (0.55 + 0.45 * Math.sin(now * p.twinkleSpeed + p.twinklePhase));

        // Radial glowing halo
        var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowRadius);
        g.addColorStop(0, "rgba(" + baseR + "," + baseG + "," + baseB + "," + (curOpacity * 0.85) + ")");
        g.addColorStop(0.3, "rgba(" + baseR + "," + (baseG - 20) + "," + (baseB - 20) + "," + (curOpacity * 0.35) + ")");
        g.addColorStop(1, "rgba(" + baseR + "," + baseG + "," + baseB + ",0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Core bright ember
        ctx.fillStyle = "rgba(255, 252, 240, " + Math.min(1, curOpacity * 1.3) + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Recycle particle
        if (p.y < -30 || p.x < -40 || p.x > width + 40) {
          particles[i] = createFirefly(false);
        }
      }

      // Draw interactive touch/drag sparks
      for (var s = interactiveSparks.length - 1; s >= 0; s--) {
        var sp = interactiveSparks[s];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= 0.025;
        if (sp.life <= 0) {
          interactiveSparks.splice(s, 1);
          continue;
        }
        ctx.fillStyle = "rgba(255, 245, 205, " + sp.life * 0.9 + ")";
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius * sp.life, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrame = requestAnimationFrame(render);
    }

    animFrame = requestAnimationFrame(render);

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        if (animFrame) cancelAnimationFrame(animFrame);
      } else {
        animFrame = requestAnimationFrame(render);
      }
    });
  }

  /* ---------------------------------------------------------
     BOOT EVERYTHING
     --------------------------------------------------------- */

  fillContent();
  renderEvents();
  renderRsvp();
  renderMap();
  startCountdown();
  setupMusic();
  wireEnvelope();
  wireShare();
  wireCalendar();
  setupThemeToggle();
  setupBackdropCanvas();
  setupReveal();

})();
