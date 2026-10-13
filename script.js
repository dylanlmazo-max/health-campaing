/**
 * HAVE ALREADY I? — INTERACTIVE CORE LOGIC
 * Written in natural British English (CEFR B2)
 *
 * Features:
 * 1. Spring engine (interruptible, velocity-aware) — the motion backbone
 * 2. Press feedback on pointer-down for every interactive control
 * 3. TikTok 9:16 Interactive Simulator (Filter vs. Authentic Reality)
 * 4. 3D Flip Cards (Myths vs. Realities)
 * 5. Hidden Profiles ("Behind the Smile")
 * 6. Animated statistics counters
 * 7. The Reading Lounge (expandable essays)
 * 8. Anonymous Community Survey (Firestore v10 + LocalStorage fallback)
 * 9. Responsive app shell: hub + grouped drawer on phone and tablet
 */

// ===============================================================
// 0. SPRING ENGINE
// -----------------------------------------------------------------
// A spring has no fixed duration: its settle time emerges from the
// parameters. Because it always animates from the current on-screen
// value and accepts an initial velocity, it stays interruptible — the
// user can redirect it mid-flight without a visible jump.
// ===============================================================

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/** Every running spring, keyed by element, so a retarget can blend. */
const activeSprings = new WeakMap();

/**
 * Physical constants behind Apple's two designer-facing parameters.
 * zeta = damping ratio (1 = critically damped, no overshoot)
 * omega = angular frequency, derived from `response`
 */
function springProfile(zeta, response) {
  const omega = (2 * Math.PI) / response;
  return { zeta, omega };
}

/**
 * Animate an element's numeric CSS property with a spring.
 * Starts from the live computed value (the presentation value), so an
 * interruption never jumps.
 *
 * @param {Element} el
 * @param {string} property  e.g. "transformX", "opacity"
 * @param {number} target
 * @param {object} [options] { zeta, response, velocity, unit, onUpdate, onComplete }
 */
function springTo(el, property, target, options = {}) {
  if (!el) return;

  // Reduced motion: land on the target, no movement.
  if (prefersReducedMotion.matches) {
    const read = readSpringValue(el, property);
    if (options.onUpdate) options.onUpdate(read ?? target, target);
    applySpringValue(el, property, target, options.unit || "");
    if (options.onComplete) options.onComplete();
    return;
  }

  // Carry over any in-flight animation so reversal never hard-cuts.
  const running = activeSprings.get(el);
  const current = (running && running.property === property)
    ? running.value
    : (readSpringValue(el, property) ?? target);

  // Instant re-target to the same place: nothing to do.
  if (Math.abs(current - target) < 0.01) {
    if (options.onUpdate) options.onUpdate(current, target);
    if (options.onComplete) options.onComplete();
    return;
  }

  const { zeta, omega } = springProfile(
    options.zeta ?? 1,
    options.response ?? 0.4
  );

  // Apple ships relative velocity when normalising; Motion takes px/s.
  let velocity = options.velocity ?? 0;
  if (options.velocityIsRelative && (target - current) !== 0) {
    velocity = (target - current) * options.velocity;
  }

  const x0 = current - target;              // displacement from rest
  let rafId = 0;
  let startTime = 0;
  let stopped = false;

  const state = {
    property,
    value: current,
    stop() {
      stopped = true;
      cancelAnimationFrame(rafId);
      activeSprings.delete(el);
    }
  };

  function step(now) {
    if (stopped) return;
    if (!startTime) startTime = now;

    const elapsed = Math.min((now - startTime) / 1000, 0.35);
    const t = omega * elapsed;

    // Analytic solution for a damped harmonic oscillator.
    let position;
    if (zeta < 1) {
      const wd = omega * Math.sqrt(1 - zeta * zeta);
      const decay = Math.exp(-zeta * omega * elapsed);
      position = decay * (
        x0 * Math.cos(wd * elapsed) +
        ((velocity + zeta * omega * x0) / wd) * Math.sin(wd * elapsed)
      );
    } else {
      position = (x0 + (velocity + omega * x0) * elapsed) * Math.exp(-omega * elapsed);
    }

    const next = target + position;
    state.value = next;
    applySpringValue(el, property, next, options.unit || "");

    if (options.onUpdate) options.onUpdate(next, target);

    // Settled when both displacement and velocity are negligible.
    if (elapsed > 0.35 || Math.abs(next - target) < 0.01) {
      applySpringValue(el, property, target, options.unit || "");
      activeSprings.delete(el);
      if (options.onComplete) options.onComplete();
      return;
    }

    rafId = requestAnimationFrame(step);
  }

  // If something else is animating this element, stop it cleanly first.
  if (running && running !== state) running.stop();

  activeSprings.set(el, state);
  rafId = requestAnimationFrame(step);
}

/** Read the element's current on-screen value for a spring property. */
function readSpringValue(el, property) {
  const cs = window.getComputedStyle(el);
  if (property === "opacity") {
    const v = parseFloat(cs.opacity);
    return Number.isFinite(v) ? v : 1;
  }
  if (property === "transformX" || property === "scale") {
    const t = cs.transform;
    if (!t || t === "none") return property === "scale" ? 1 : 0;
    const m = new DOMMatrixReadOnly(t);
    return property === "transformX" ? m.m41 : m.a;
  }
  return null;
}

function applySpringValue(el, property, value, unit) {
  if (property === "opacity") {
    el.style.opacity = String(Math.min(1, Math.max(0, value)));
  } else if (property === "transformX") {
    el.style.transform = `translate3d(${value}${unit || "px"}, 0, 0)`;
  } else if (property === "scale") {
    el.style.transform = `scale(${value})`;
  }
}

// ===============================================================
// 0b. PRESS FEEDBACK — respond on pointer-down, not on release
// ===============================================================
function initPressFeedback() {
  const PRESSABLE = [
    ".btn", ".nav-link", ".action-btn", ".profile-switch-btn",
    ".btn-read-more", ".rating-box", ".hotline-link",
    ".verified-link-card", ".flip-card", ".hub-support-line a"
  ].join(",");

  document.querySelectorAll(PRESSABLE).forEach(el => {
    // Visual highlight the instant the finger lands.
    el.addEventListener("pointerdown", () => {
      el.style.setProperty("--press", "1");
    }, { passive: true });

    const release = () => el.style.setProperty("--press", "0");
    el.addEventListener("pointerup", release, { passive: true });
    el.addEventListener("pointercancel", release, { passive: true });
    el.addEventListener("pointerleave", release, { passive: true });
  });
}

// ===============================================================
// 0c. APPEARANCE — light / dark
// -----------------------------------------------------------------
// The choice is persisted and, on a first visit, seeded from the
// operating system so the page never flashes the wrong appearance.
// ===============================================================
const THEME_KEY = "norush_theme";

function readStoredTheme() {
  try { return localStorage.getItem(THEME_KEY); } catch { return null; }
}

function storeTheme(theme) {
  try { localStorage.setItem(THEME_KEY, theme); } catch { /* private mode */ }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);

  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    const isDark = theme === "dark";
    // The label and the icon both name the mode you would switch TO.
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light appearance" : "Switch to dark appearance"
    );
  }

  // Keep the browser chrome (address bar on mobile) in step with the page.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#000000" : "#ffffff");

  document.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
}

function initTheme() {
  const systemLight = window.matchMedia("(prefers-color-scheme: light)");
  const stored = readStoredTheme();

  // No stored preference: follow the system, and keep following it live.
  applyTheme(stored || (systemLight.matches ? "light" : "dark"));

  const onSystemChange = (e) => {
    if (!readStoredTheme()) applyTheme(e.matches ? "light" : "dark");
  };
  if (typeof systemLight.addEventListener === "function") {
    systemLight.addEventListener("change", onSystemChange);
  } else if (typeof systemLight.addListener === "function") {
    systemLight.addListener(onSystemChange);
  }

  const toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
      storeTheme(next);
      applyTheme(next);
    });
  }
}

// ===============================================================
// 0d. SURVEY PRIVACY NOTE
// -----------------------------------------------------------------
// The copy must not promise a shared database that is not actually
// connected, so it adapts to the real configuration.
// ===============================================================
function initSurveyPrivacyNote() {
  const note = document.getElementById("surveyStorageNote");
  if (!note) return;

  const configured = Boolean(window.NORUSH_FIREBASE_CONFIG) &&
    ["apiKey", "authDomain", "projectId", "appId"].every(
      (k) => window.NORUSH_FIREBASE_CONFIG[k] &&
             !String(window.NORUSH_FIREBASE_CONFIG[k]).startsWith("YOUR_")
    );

  if (!configured) {
    note.textContent =
      "on this device only, because the shared database is not connected yet";
  }
}

// ===============================================================
// 1. TIKTOK SIMULATOR DATA (B2 BRITISH ENGLISH)
// ===============================================================
const simulatorData = {
  filtro: {
    mode: "filtro",
    badgeText: "✨ Curated Filter",
    badgeDotClass: "filter-dot",
    clock: "05:00 AM",
    image: "assets/tiktok_filtro.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&q=80",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    handle: "@peaceful_days",
    verified: true,
    caption: "5:00 AM morning routine ✨ Cultivating calm, daily discipline and mindful habits. Take care of your energy and everything aligns #mindfulmorning #aesthetic #wellbeing #morningroutine",
    likes: "248.5K",
    likesRaw: 248500,
    comments: "3,812",
    btnLabel: "Reveal the Reality",
    btnIcon: '<i class="fa-solid fa-masks-theater"></i>',
    ticker: "original audio - @peaceful_days • Chill Aesthetic Morning Lofi",
    insightActive: false
  },
  ladoB: {
    mode: "ladoB",
    badgeText: "🌱 Authentic Reality",
    badgeDotClass: "reality-dot",
    clock: "02:45 AM",
    image: "assets/tiktok_ladob.jpg",
    fallbackImage: "https://images.unsplash.com/photo-1541199249251-f713e6145474?auto=format&fit=crop&w=720&q=80",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    handle: "@the_real_story",
    verified: false,
    caption: "Behind the camera: retook this clip fifteen times, running late for lecture, skipped breakfast, feeling an uneasy pressure to appear flawless. It is completely alright not to feel sorted all the time #TheRealStory #BehindTheScreen #HonestMoments",
    likes: "14.2K",
    likesRaw: 14200,
    comments: "492",
    btnLabel: "Return to Filtered View",
    btnIcon: '<i class="fa-solid fa-wand-magic-sparkles"></i>',
    ticker: "original audio - @the_real_story • Thoughts & Unspoken Pressure",
    insightActive: true
  }
};

let currentSimulatorMode = "filtro";
let isUserLiked = false;

function initSimulator() {
  const btnToggle = document.getElementById("btnToggleLadoB");
  const mediaImg = document.getElementById("simulatorMediaImg");
  const glitchOverlay = document.getElementById("glitchOverlay");
  const modeBadgeText = document.getElementById("modeBadgeText");
  const modeBadge = document.getElementById("modeBadge");
  const screenClock = document.getElementById("screenClock");
  const authorAvatar = document.getElementById("authorAvatar");
  const creatorHandle = document.getElementById("creatorHandle");
  const verifiedBadge = document.getElementById("verifiedBadge");
  const postCaption = document.getElementById("postCaption");
  const likeCounter = document.getElementById("likeCounter");
  const commentCounter = document.getElementById("commentCounter");
  const toggleLabel = document.getElementById("toggleLabel");
  const toggleIcon = document.getElementById("toggleIcon");
  const musicTicker = document.getElementById("musicTicker");
  const realityInsightCard = document.getElementById("realityInsightCard");

  if (!btnToggle || !mediaImg) {
    console.warn("Simulator elements not found in DOM");
    return;
  }

  btnToggle.addEventListener("click", (e) => {
    e.preventDefault();
    if (glitchOverlay) glitchOverlay.classList.add("glitch-active");

    currentSimulatorMode = currentSimulatorMode === "filtro" ? "ladoB" : "filtro";
    const data = simulatorData[currentSimulatorMode];

    setTimeout(() => {
      mediaImg.onerror = () => { mediaImg.src = data.fallbackImage; };
      mediaImg.src = data.image;
      mediaImg.alt = `TikTok Preview: ${data.badgeText}`;
      if (authorAvatar) authorAvatar.src = data.avatar;
      if (modeBadgeText) modeBadgeText.textContent = data.badgeText;
      if (screenClock) screenClock.textContent = data.clock;
      if (creatorHandle) creatorHandle.textContent = data.handle;
      if (postCaption) postCaption.textContent = data.caption;
      if (musicTicker) musicTicker.textContent = data.ticker;
      if (toggleLabel) toggleLabel.textContent = data.btnLabel;
      if (toggleIcon) toggleIcon.innerHTML = data.btnIcon;

      if (likeCounter) {
        likeCounter.textContent = isUserLiked ? formatNumber(data.likesRaw + 1) : data.likes;
      }
      if (commentCounter) commentCounter.textContent = data.comments;

      if (verifiedBadge) {
        verifiedBadge.style.display = data.verified ? "inline-block" : "none";
      }

      if (modeBadge) {
        const dot = modeBadge.querySelector(".badge-dot");
        if (dot) dot.className = `badge-dot ${data.badgeDotClass}`;
      }

      if (realityInsightCard) {
        if (data.insightActive) {
          realityInsightCard.classList.add("active");
        } else {
          realityInsightCard.classList.remove("active");
        }
      }
    }, 180);

    setTimeout(() => {
      if (glitchOverlay) glitchOverlay.classList.remove("glitch-active");
    }, 450);
  });

  // Like button interaction
  const likeBtn = document.getElementById("likeBtn");
  if (likeBtn) {
    likeBtn.addEventListener("click", () => {
      isUserLiked = !isUserLiked;
      likeBtn.classList.toggle("liked", isUserLiked);
      const baseLikes = simulatorData[currentSimulatorMode].likesRaw;
      const count = isUserLiked ? baseLikes + 1 : baseLikes;
      if (likeCounter) likeCounter.textContent = formatNumber(count);
    });
  }

  // Comments button interaction
  const commentBtn = document.getElementById("commentBtn");
  if (commentBtn) {
    commentBtn.addEventListener("click", () => {
      showToast("💬 Over 90% of comments assume 'effortless perfection', unaware of the quiet pressure behind it.");
    });
  }

  // Share button interaction
  const shareBtn = document.getElementById("shareBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({
          title: "Have already I?",
          text: "A gentle reflection on social media and mental well-being.",
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard?.writeText(window.location.href);
        showToast("🔗 Awareness link copied to clipboard!");
      }
    });
  }
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// ===============================================================
// 2. 3D FLIP CARDS (MYTHS VS. REALITIES)
// ===============================================================
function initFlipCards() {
  const flipCards = document.querySelectorAll(".flip-card");
  flipCards.forEach(card => {
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        card.classList.toggle("is-flipped");
      }
    });
  });
}

// ===============================================================
// 3. HIDDEN PROFILES ("BEHIND THE SMILE")
// ===============================================================
function initHiddenProfiles() {
  const switchBtns = document.querySelectorAll(".profile-switch-btn");
  switchBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const card = btn.closest(".profile-card");
      if (!card) return;

      const isRealityActive = card.classList.toggle("reality-active");
      const btnText = btn.querySelector(".switch-btn-text");
      const btnIcon = btn.querySelector("i");

      if (isRealityActive) {
        if (btnText) btnText.textContent = "Hide Reality";
        if (btnIcon) btnIcon.className = "fa-solid fa-eye";
      } else {
        if (btnText) btnText.textContent = "Reveal What Is Hidden";
        if (btnIcon) btnIcon.className = "fa-solid fa-eye-slash";
      }
    });
  });
}

// ===============================================================
// 4. ANIMATED STATISTICS COUNTERS (GUARANTEED FALLBACK)
// ===============================================================
function initStatsCounter() {
  const statNumbers = document.querySelectorAll(".stat-number");
  if (!statNumbers.length) return;

  let hasAnimated = false;

  function runAnimation() {
    if (hasAnimated) return;
    hasAnimated = true;
    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute("data-target"), 10) || 0;
      animateSingleCounter(el, target);
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    statNumbers.forEach(num => observer.observe(num));
  } else {
    // Fallback if IntersectionObserver is unavailable
    runAnimation();
  }

  // Safety timer: after 3 seconds, ensure numbers are displayed even if not yet scrolled
  setTimeout(() => {
    statNumbers.forEach(el => {
      if (el.textContent === "0" || el.textContent === "") {
        const target = el.getAttribute("data-target");
        if (target) el.textContent = target;
      }
    });
  }, 2500);
}

function animateSingleCounter(element, target) {
  let start = 0;
  const duration = 1500;
  const stepTime = Math.max(Math.floor(duration / (target || 1)), 25);

  const timer = setInterval(() => {
    start += 1;
    element.textContent = start;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    }
  }, stepTime);
}

// ===============================================================
// 5. THE READING LOUNGE (EXPANDABLE ARTICLES)
// ===============================================================
function initReadingLounge() {
  const readMoreBtns = document.querySelectorAll(".btn-read-more");
  readMoreBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".reading-article-card");
      if (!card) return;

      const isExpanded = card.classList.toggle("expanded");
      const btnText = btn.querySelector(".read-more-text");
      const btnIcon = btn.querySelector("i");

      if (isExpanded) {
        if (btnText) btnText.textContent = "Close Reflection";
        if (btnIcon) btnIcon.className = "fa-solid fa-chevron-up";
      } else {
        if (btnText) btnText.textContent = "Read Full Article";
        if (btnIcon) btnIcon.className = "fa-solid fa-chevron-down";
      }
    });
  });
}

// ===============================================================
// 6. ANONYMOUS SURVEY & FIRESTORE INTEGRATION
// ===============================================================
function initSurvey() {
  const form = document.getElementById("surveyForm");
  const hoursInput = document.getElementById("surveyHours");
  const rangeDisplay = document.getElementById("rangeValueDisplay");
  const feedback = document.getElementById("surveyFeedback");
  const submitBtn = document.getElementById("submitSurveyBtn");
  const btnText = submitBtn?.querySelector(".btn-text");
  const btnSpinner = submitBtn?.querySelector(".btn-spinner");

  if (!form) return;

  if (hoursInput && rangeDisplay) {
    hoursInput.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value).toFixed(1);
      rangeDisplay.textContent = `${val} hrs/day`;
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const age = form.age?.value;
    const hours = parseFloat(hoursInput?.value || 3);
    const impactLevel = form.impact_level?.value;
    const reflection = document.getElementById("surveyReflection")?.value.trim() || "";

    if (!age) {
      showFormFeedback("Please select your age group.", "error");
      return;
    }

    if (!impactLevel) {
      showFormFeedback("Please indicate how much comparison affects your well-being.", "error");
      return;
    }

    setButtonLoading(true);

    const surveyData = {
      age_range: age,
      daily_hours: hours,
      impact_score: parseInt(impactLevel, 10),
      reflection: reflection || "No comment provided",
      created_at: new Date().toISOString()
    };

    // Always keep a local copy first: if the network or Firestore fails,
    // the response is never lost.
    saveToLocalStorage(surveyData);

    // Then try the cloud. The message reflects what actually happened
    // rather than always claiming a sync that may not have run.
    let storedOnline = false;
    try {
      storedOnline = await trySyncToFirestore(surveyData);
    } catch (err) {
      console.warn("Unexpected survey error:", err);
    }

    if (storedOnline) {
      showFormFeedback(
        "Thank you for sharing your experience. Your anonymous response has been recorded and helps illuminate digital well-being.",
        "success"
      );
    } else {
      showFormFeedback(
        "Thank you for sharing. Your response has been saved on this device only — it could not be sent to the shared database right now.",
        "success"
      );
    }

    form.reset();
    if (rangeDisplay) rangeDisplay.textContent = "3.0 hrs/day";
    updateLiveCommunityStats(surveyData.impact_score, surveyData.daily_hours);
    setButtonLoading(false);
  });

  function setButtonLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    if (loading) {
      btnText?.classList.add("hidden");
      btnSpinner?.classList.remove("hidden");
    } else {
      btnText?.classList.remove("hidden");
      btnSpinner?.classList.add("hidden");
    }
  }

  function showFormFeedback(message, type) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = `form-feedback ${type}`;
    feedback.classList.remove("hidden");
    if (type === "success") {
      setTimeout(() => {
        feedback.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  }

  function saveToLocalStorage(data) {
    const existing = JSON.parse(localStorage.getItem("behind_screen_surveys") || "[]");
    existing.push(data);
    localStorage.setItem("behind_screen_surveys", JSON.stringify(existing));
  }

  function updateLiveCommunityStats(score, hours) {
    const barHighImpact = document.getElementById("barHighImpact");
    const statHighImpactPct = document.getElementById("statHighImpactPct");
    const barAvgHours = document.getElementById("barAvgHours");
    const statAvgHours = document.getElementById("statAvgHours");

    if (score >= 3 && barHighImpact && statHighImpactPct) {
      barHighImpact.style.width = "82%";
      statHighImpactPct.textContent = "82%";
    }
    if (barAvgHours && statAvgHours) {
      const avg = ((3.8 + hours) / 2).toFixed(1);
      statAvgHours.textContent = `${avg} hrs/day`;
    }
  }

  // ---------------------------------------------------------------
  // Firestore sync — the response is sent anonymously and can never be
  // read back from the browser. See firebase-config.js and
  // firestore.rules for setup and the reason the rules are so strict.
  // ---------------------------------------------------------------
  const REQUIRED_CONFIG_KEYS = ["apiKey", "authDomain", "projectId", "appId"];

  /** True only when firebase-config.js holds real values. */
  function hasFirebaseConfig() {
    const cfg = window.NORUSH_FIREBASE_CONFIG;
    if (!cfg) return false;
    return REQUIRED_CONFIG_KEYS.every(
      (key) => cfg[key] && !String(cfg[key]).startsWith("YOUR_")
    );
  }

  /** Loads the SDK once and returns a ready Firestore handle. */
  let dbPromise = null;
  function getFirestoreDb() {
    if (dbPromise) return dbPromise;

    dbPromise = (async () => {
      const cfg = window.NORUSH_FIREBASE_CONFIG;
      const { initializeApp } = await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"
      );
      const { getFirestore } = await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
      );
      return getFirestore(initializeApp(cfg));
    })();

    // Let the next attempt retry cleanly if this one failed.
    dbPromise.catch(() => { dbPromise = null; });
    return dbPromise;
  }

  /**
   * Sends one anonymous response to Firestore.
   * Resolves to true when it was stored, false when it fell back to
   * local storage (no config, offline, or the rules rejected it).
   */
  async function trySyncToFirestore(data) {
    if (!hasFirebaseConfig()) return false;

    try {
      const { collection, addDoc, serverTimestamp } = await import(
        "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
      );
      const db = await getFirestoreDb();

      await addDoc(collection(db, "encuestas_salud_mental"), {
        age_range: data.age_range,
        daily_hours: data.daily_hours,
        impact_score: data.impact_score,
        reflection: data.reflection,
        created_at: data.created_at,
        server_timestamp: serverTimestamp()
      });

      return true;
    } catch (err) {
      console.warn("Firestore sync failed; keeping the local copy:", err);
      return false;
    }
  }
}

// ===============================================================
// 7. NAVIGATION: DESKTOP LINKS / MOBILE DRAWER / CUSTOM TOAST
// ===============================================================
function closeDrawer() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const navList = document.querySelector(".nav-list");
  const scrim = document.getElementById("navScrim");

  if (navList) navList.classList.remove("active");
  if (scrim) scrim.hidden = true;
  document.body.classList.remove("nav-open");
  if (menuBtn) {
    menuBtn.setAttribute("aria-expanded", "false");
    const icon = menuBtn.querySelector("i");
    if (icon) {
      icon.classList.add("fa-bars");
      icon.classList.remove("fa-xmark");
    }
  }
}

function initNavigation() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const navList = document.querySelector(".nav-list");
  const scrim = document.getElementById("navScrim");

  if (menuBtn && navList) {
    menuBtn.addEventListener("click", () => {
      const willOpen = !navList.classList.contains("active");
      navList.classList.toggle("active", willOpen);
      if (scrim) scrim.hidden = !willOpen;
      document.body.classList.toggle("nav-open", willOpen);
      menuBtn.setAttribute("aria-expanded", String(willOpen));
      const icon = menuBtn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars", !willOpen);
        icon.classList.toggle("fa-xmark", willOpen);
      }

      // Apple ships drawer/sheet springs slightly under-damped (0.8),
      // because opening a sheet is a physical, momentum-carrying action.
      if (willOpen && isAppMode()) {
        navList.style.transform = "translate3d(100%, 0, 0)";
        springTo(navList, "transformX", 0, { zeta: 0.85, response: 0.35 });
      } else if (!willOpen && isAppMode()) {
        springTo(navList, "transformX", 320, {
          zeta: 1,
          response: 0.3,
          onComplete: () => { navList.style.transform = ""; }
        });
      }
    });

    navList.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => closeDrawer());
    });

    // Tapping the dim layer closes the drawer
    if (scrim) scrim.addEventListener("click", closeDrawer);

    // Escape closes the drawer on every device
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navList.classList.contains("active")) {
        closeDrawer();
        menuBtn.focus();
      }
    });
  }

  initHeaderScrollEdge();
}

/** Scroll edge effect: the chrome materialises only once content passes under it. */
function initHeaderScrollEdge() {
  const header = document.querySelector(".site-header");
  const shell = document.getElementById("appShell");
  if (!header) return;

  let ticking = false;

  // The active scroller changes with the layout: the window on desktop,
  // the app shell on phone and tablet. Read both and take the larger.
  function update() {
    const windowY = window.scrollY || 0;
    const shellY = shell ? shell.scrollTop : 0;
    header.classList.toggle("is-scrolled", Math.max(windowY, shellY) > 8);
    ticking = false;
  }

  // A single class toggle is cheap, and a timer (rather than rAF) keeps
  // this working even when the tab is not being painted.
  function onScroll() {
    if (ticking) return;
    ticking = true;
    setTimeout(update, 16);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  if (shell) shell.addEventListener("scroll", onScroll, { passive: true });
  update();
}

// ===============================================================
// 8. RESPONSIVE APP SHELL (HUB + INTERNAL MENU)
// -----------------------------------------------------------------
// Desktop (1024px and wider): nothing changes, the page keeps its
// continuous scroll. Phone & tablet: a hub screen welcomes the visitor
// and every other section opens one at a time inside the same shell,
// which removes the endless scrolling.
// ===============================================================
const APP_MODE_QUERY = window.matchMedia("(max-width: 1023px)");

const appViews = {
  simulator: { selector: "#simulator", title: "TikTok Simulator", icon: '<i class="fa-brands fa-tiktok"></i>' },
  psychology: { selector: "#psychology", title: "Digital Psychology", icon: '<i class="fa-solid fa-brain"></i>' },
  evidence: { selector: "#evidence", title: "The Evidence", icon: '<i class="fa-solid fa-chart-simple"></i>' },
  myths: { selector: "#myths", title: "Myths vs. Realities", icon: '<i class="fa-solid fa-rotate"></i>' },
  profiles: { selector: "#profiles", title: "Behind the Smile", icon: '<i class="fa-solid fa-mask"></i>' },
  "reading-lounge": { selector: "#reading-lounge", title: "The Reading Lounge", icon: '<i class="fa-solid fa-book-open"></i>' },
  survey: { selector: "#survey", title: "Community Survey", icon: '<i class="fa-solid fa-clipboard-check"></i>' },
  support: { selector: "#support", title: "Support & Hotlines", icon: '<i class="fa-solid fa-hand-holding-heart"></i>' },
  "about-us": { selector: "#about-us", title: "Our Movement (UNNE)", icon: '<i class="fa-solid fa-graduation-cap"></i>' }
};

function isAppMode() {
  return APP_MODE_QUERY.matches;
}

function syncHeaderHeight() {
  const header = document.querySelector(".site-header");
  if (!header || !isAppMode()) return;
  const height = Math.round(header.getBoundingClientRect().height);
  if (height > 0) {
    document.documentElement.style.setProperty("--app-header-h", `${height}px`);
  }
}

/** The screen currently mounted in the app shell; null means the hub. */
let activeViewKey = null;

/** Show a single section (or the hub when viewKey is null) */
function showAppView(viewKey, options = {}) {
  if (!isAppMode()) return;

  const { updateHash = true } = options;
  const shell = document.getElementById("appShell");
  const hub = document.getElementById("hub");
  const titleEl = document.getElementById("appViewTitle");
  const footer = document.querySelector(".app-shell > footer");
  const navLinks = document.querySelectorAll(".nav-list .nav-link");

  if (!shell || !hub) return;

  // Ignore a request for the screen that is already showing. Without this,
  // two calls in the same tick reset opacity to 0 twice and the screen
  // flickers instead of animating in.
  if (!options.force && activeViewKey === (viewKey || null)) return;

  document.querySelectorAll(".app-shell > main > section").forEach(section => {
    section.classList.remove("app-view-active");
  });

  if (viewKey && appViews[viewKey]) {
    const view = appViews[viewKey];
    const target = document.querySelector(view.selector);
    if (!target) return;

    target.classList.add("app-view-active");
    hub.classList.add("app-view-hidden");
    document.body.classList.add("app-in-view");

    if (titleEl) titleEl.textContent = view.title;
    if (footer) footer.classList.remove("app-footer-visible");

    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${viewKey}`);
    });

    if (updateHash && window.location.hash !== `#${viewKey}`) {
      history.pushState({ view: viewKey }, "", `#${viewKey}`);
    }
  } else {
    // Back to the hub
    hub.classList.remove("app-view-hidden");
    document.body.classList.remove("app-in-view");

    if (titleEl) titleEl.textContent = "Hub";
    if (footer) footer.classList.add("app-footer-visible");

    navLinks.forEach(link => link.classList.remove("active"));

    if (updateHash && window.location.hash !== "#hub") {
      history.pushState({ view: "hub" }, "", "#hub");
    }
  }

  syncHeaderHeight();
  shell.scrollTop = 0;

  activeViewKey = viewKey || null;

  // Materialise the incoming screen. Start from the live value and let the
  // spring carry it to 1, so a fast re-tap never produces a jump (§3).
  const incoming = viewKey && appViews[viewKey]
    ? document.querySelector(appViews[viewKey].selector)
    : hub;
  if (incoming) {
    const from = parseFloat(getComputedStyle(incoming).opacity);
    if (Number.isFinite(from) && from < 1) {
      springTo(incoming, "opacity", 1, { zeta: 1, response: 0.32 });
    } else {
      incoming.style.opacity = "";
    }
  }
}

/** Keep the header height in sync while the shell scrolls */
function initAppScrollBehaviour() {
  const shell = document.getElementById("appShell");
  if (!shell) return;
  shell.addEventListener("scroll", () => {
    syncHeaderHeight();
  }, { passive: true });
}

function initAppShell() {
  const hub = document.getElementById("hub");
  const backBtn = document.getElementById("appBackBtn");
  const brandLogo = document.getElementById("brandLogo");
  const shell = document.getElementById("appShell");

  if (!hub || !shell) return;

  // Every internal link becomes a view switch while in app mode
  document.addEventListener("click", (e) => {
    if (!isAppMode()) return;

    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute("href").slice(1);
    if (!targetId) return;

    const isHubTarget = targetId === "hero" || targetId === "hub";
    const isViewTarget = !!appViews[targetId];

    if (isHubTarget || isViewTarget) {
      // In the app shell we swap screens, so the browser must not
      // perform its default in-page jump.
      e.preventDefault();
      showAppView(isViewTarget ? targetId : null);
    }
  });

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      showAppView(null);
    });
  }

  // NOTE: the brand logo (href="#hero") is intentionally NOT given its own
  // click handler. The delegated document listener above already treats it
  // as a hub target, and registering a second one made showAppView run
  // twice per tap — restarting the entrance spring and making the hub
  // flash and vanish.

  // Browser / Android back button
  window.addEventListener("popstate", () => {
    if (!isAppMode()) return;
    const hash = window.location.hash.slice(1);
    showAppView(appViews[hash] ? hash : null, { updateHash: false });
  });

  // React to rotation, resizing and orientation changes
  const handleModeChange = () => {
    document.body.classList.toggle("app-mode", isAppMode());

    if (isAppMode()) {
      closeDrawer();
      const hash = window.location.hash.slice(1);
      showAppView(appViews[hash] ? hash : null, { updateHash: false });
      syncHeaderHeight();
    } else {
      // Back on desktop: restore the classic continuous page
      document.body.classList.remove("app-in-view", "app-mode");
      document.querySelectorAll(".app-shell > main > section").forEach(s => s.classList.remove("app-view-active"));
      hub.classList.remove("app-view-hidden");
      const footer = document.querySelector(".app-shell > footer");
      if (footer) footer.classList.remove("app-footer-visible");
    }
  };

  if (typeof APP_MODE_QUERY.addEventListener === "function") {
    APP_MODE_QUERY.addEventListener("change", handleModeChange);
  } else if (typeof APP_MODE_QUERY.addListener === "function") {
    APP_MODE_QUERY.addListener(handleModeChange);
  }

  window.addEventListener("resize", syncHeaderHeight, { passive: true });
  window.addEventListener("orientationchange", () => {
    setTimeout(syncHeaderHeight, 120);
  });

  initAppScrollBehaviour();
  handleModeChange();
}

function showToast(message) {
  let toast = document.getElementById("customToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "customToast";
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%) translateY(100px)";
    toast.style.background = "rgba(18, 21, 33, 0.95)";
    toast.style.border = "1px solid rgba(254, 44, 85, 0.4)";
    toast.style.color = "#ffffff";
    toast.style.padding = "0.75rem 1.4rem";
    toast.style.borderRadius = "9999px";
    toast.style.fontSize = "0.88rem";
    toast.style.fontWeight = "600";
    toast.style.zIndex = "9999";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.6)";
    toast.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    toast.style.opacity = "0";
    toast.style.pointerEvents = "none";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(100px)";
  }, 3400);
}

// ===============================================================
// FOOLPROOF INITIALIZATION (RUNS REGARDLESS OF READYSTATE)
// ===============================================================
function startApplication() {
  initTheme();
  initSurveyPrivacyNote();
  initPressFeedback();
  initSimulator();
  initFlipCards();
  initHiddenProfiles();
  initStatsCounter();
  initReadingLounge();
  initSurvey();
  initNavigation();
  initAppShell();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApplication);
} else {
  startApplication();
}
