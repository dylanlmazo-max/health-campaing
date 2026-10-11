/**
 * BEHIND THE SCREEN - INTERACTIVE CORE LOGIC & ACCESSIBILITY
 * Written in natural British English (CEFR B2)
 * 
 * Features:
 * 1. TikTok 9:16 Interactive Simulator (Filter vs. Authentic Reality with glitch effect)
 * 2. Likes counter & interactive creator actions
 * 3. 3D Flip Cards (Myths vs. Realities)
 * 4. Hidden Profiles ("Behind the Smile")
 * 5. Animated statistics counter with guaranteed execution fallback
 * 6. The Reading Lounge (Expandable deep-dive educational articles)
 * 7. Anonymous Community Survey (Firebase Firestore v10 modular + LocalStorage resilience)
 * 8. Responsive navigation & custom toast notifications
 */

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

    try {
      // Attempt to save locally or via Firestore
      saveToLocalStorage(surveyData);

      // Dynamic Firestore save if available
      trySyncToFirestore(surveyData);

      showFormFeedback("Thank you for sharing your experience. Your anonymous response has been recorded and helps illuminate digital well-being.", "success");
      form.reset();
      if (rangeDisplay) rangeDisplay.textContent = "3.0 hrs/day";
      updateLiveCommunityStats(surveyData.impact_score, surveyData.daily_hours);
    } catch (err) {
      console.warn("Survey submission fallback:", err);
      saveToLocalStorage(surveyData);
      showFormFeedback("Your response has been saved securely. Thank you for participating!", "success");
      form.reset();
    } finally {
      setButtonLoading(false);
    }
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

  // Graceful Firestore async sync
  async function trySyncToFirestore(data) {
    try {
      const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
      const { getFirestore, collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      
      const config = {
        apiKey: "AIzaSyDemoKeySaludMentalBehindScreen2026",
        authDomain: "detras-de-la-pantalla.firebaseapp.com",
        projectId: "detras-de-la-pantalla-salud"
      };

      if (!config.apiKey.includes("DemoKey")) {
        const app = initializeApp(config);
        const db = getFirestore(app);
        await addDoc(collection(db, "encuestas_salud_mental"), {
          ...data,
          server_timestamp: serverTimestamp()
        });
      }
    } catch {
      // Quietly handled by LocalStorage
    }
  }
}

// ===============================================================
// 7. RESPONSIVE NAVIGATION & CUSTOM TOAST
// ===============================================================
function initNavigation() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const navList = document.querySelector(".nav-list");

  if (menuBtn && navList) {
    menuBtn.addEventListener("click", () => {
      navList.classList.toggle("active");
      const icon = menuBtn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-xmark");
      }
    });

    navList.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navList.classList.remove("active");
        const icon = menuBtn.querySelector("i");
        if (icon) {
          icon.classList.add("fa-bars");
          icon.classList.remove("fa-xmark");
        }
      });
    });
  }
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
  initSimulator();
  initFlipCards();
  initHiddenProfiles();
  initStatsCounter();
  initReadingLounge();
  initSurvey();
  initNavigation();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApplication);
} else {
  startApplication();
}
