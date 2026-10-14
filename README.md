# NORUSH — You Are Enough 🧠📱

> **Digital Well-being & Social Media Awareness Campaign**  
> *"Beyond the curated feeds: An honest, empathetic reflection on social media and mental well-being."*

---

## 🌟 Overview

**NORUSH — You Are Enough** is an interactive, responsive web experience created to deconstruct digital perfectionism and illuminate the emotional realities of modern social media algorithms. Developed using modern web standards, an aesthetic dark mode, and fluent **CEFR B2 British English**, the application approaches youth mental health with tact, nuance, and grounded psychological evidence.

---

## 🚀 Key Features & Interactive Modules

1. **Aesthetic & Subtle Hero Cover**:
   - A mature, nuanced introduction avoiding sensationalism.
   - Grounding reflection: *"We often compare our ordinary behind-the-scenes moments with everyone else’s polished highlights."*

2. **TikTok Simulator (9:16 Vertical Smartphone)**:
   - Full native TikTok overlay with creator avatar, like counters, comments, and rotating vinyl record.
   - Interactive button **"Reveal the Reality"**:
     - **Curated Filter (`@peaceful_days`)**: 05:00 AM, golden morning lighting, flawless routine, aesthetic hashtags.
     - **Authentic Reality (`@the_real_story`)**: 02:45 AM, 15 repeated takes, skipped breakfast, honest human vulnerability.
   - Chromatic glitch effect on state transition.

3. **Digital Psychology & Cognitive Biases**:
   - The Selection Bias (comparing raw footage to curated trailers).
   - Social Comparison Loop (Festinger’s theory and self-worth erosion).
   - Variable Dopamine Loops (the slot-machine design of notifications).

4. **Official Statistical Evidence**:
   - Animated counter cards with verified data from:
     - **American Psychological Association (APA)**: 46% of adolescents feel more critical of their body image.
     - **U.S. Surgeon General's Advisory**: +3x likelihood of anxiety or low mood with heavy daily use.
     - **UNICEF**: 97% of teenagers consume retouched content daily.

5. **3D Perspective Flip Cards (Myths vs. Realities)**:
   - 180° rotation on click, tap, or hover.
   - Examines online happiness, fitness aesthetics, and rapid influencer wealth.

6. **Behind the Smile (Hidden Profiles)**:
   - Instagram-style creator cards (`@sophie_travels`, `@matt_fitness`, `@lucas_ventures`).
   - Interactive switch **"Reveal What Is Hidden"** that desaturates the image and unveils the real emotional strain (burnout, muscle dysmorphia, startup debt).

7. **The Reading Lounge (In-Depth Educational Essays)**:
   - Dedicated, distraction-free reading space with 4 expandable essays:
     - *The Architecture of the Highlight Reel: Why We Compare (3 min read)*
     - *Body Image in the Age of Micro-Editing & Digital Filters (4 min read)*
     - *The Dopamine Slot Machine: How Infinite Scroll Works (3 min read)*
     - *Reclaiming Digital Peace: Practical Boundaries That Work (4 min read)*
   - Key takeaway callouts in each article.

8. **Anonymous Community Survey (Firebase Firestore v10 + Local Fallback)**:
   - Age selector, daily hours slider, 1-to-5 emoji rating, and optional reflection.
   - Real-time community trend bar updates.

9. **Support & Crisis Guidance (Argentina, Chaco & Resistencia)**:
   - **Línea 102 Chaco**: Free 24/7 youth protection line across Chaco province.
   - **Hospital Dr. Julio C. Perrando (Guardia de Salud Mental - Resistencia)**: Av. 9 de Julio 1100, Resistencia, Chaco / Tel: `(0362) 445-7288`.
   - **Centro de Asistencia al Suicida (CAS - Argentina)**: Línea `135` / `(011) 5275-1135` (24 horas, gratuito).
   - **Salud Mental Responde (Ministerio de Salud de la Nación)**: `0800-999-0091`.
   - **Emergencias Médicas Chaco**: `107` / `911`.
   - **Verified Health Portals**: *argentina.gob.ar/salud/mental*, *hablemosdetodo.gob.ar*, *hospitalbonaparte.anlis.gob.ar*, and the WHO Youth Mental Health portal.

---

## 📱 Responsive Experience: Two Distinct Layouts

The site adapts its **structure** (not only its styling) depending on the device.

### 🖥️ Desktop (1024px and wider)
Unchanged from the original design: a single continuous page where the header
navigation scrolls you through every section.

### 📲 Phone & Tablet (1023px and below)
A focused, **minimalist** experience that removes the endless scroll:

- **Hub screen (initial view):** a calm cover — hero, the campaign badges, the
  **full index of every section** and a single discreet line with the free 24/7
  helplines (102 / 135).
- **Nothing is hidden behind the menu:** the hub lists all nine destinations,
  grouped exactly like the drawer (*Experience* / *Understand* / *Resources*),
  each with a one-line description. Five of them are already on screen before
  any scrolling. Both lists mark the section you are standing in.
- **One section at a time:** picking a destination opens that section inside a
  fixed app shell. The others are hidden, so there is no endless scrolling.
- **The drawer is the compact index:** the **three-bar button** in the app bar
  still opens the full grouped list, which matters once you are inside a
  section and want to jump somewhere else without going back.
- **App bar:** shows the current section title and a **back button** to the hub.
- **URL aware:** opening `index.html#survey` (or any section) lands directly on
  that section, and the browser / Android back button returns to the hub.

**Card grids never leave a gap.** Rows of three (Psychology, Evidence, Myths,
Profiles) use three columns on desktop and, on tablets, two columns with the
last card spanning the full width. The four essays sit in a 2×2 block and the
five verified links stretch to fill their last row. Below 600px everything
collapses to a single column.

**Technical notes**

- The switch is driven by `matchMedia("(max-width: 1023px)")` and the
  `body.app-mode` class, so a rotation or a window resize swaps layouts live and
  restores the classic desktop page automatically.
- `.app-shell` uses `display: contents` on desktop, which makes the wrapper
  completely invisible and leaves the original markup semantics untouched.
- All app-mode rules live inside a single `@media (max-width: 1023px)` block and
  are scoped to `body.app-mode`, so the page still works without JavaScript.

---

## 🎨 Design System — Apple Design Language

The interface follows Apple's design principles, translated to the web.

| Principle | How it is applied |
| --- | --- |
| **Purpose** | One accent colour (`#3d9bff`) instead of a six-colour neon palette. The ambient glow blobs were removed entirely. |
| **Simplicity** | The hub is a calm cover followed by a plain, grouped list. Nothing is hidden behind the menu, and the drawer never contradicts the list — they are the same structure. |
| **Craft** | Hairline separators, continuous (pill) corner radii, one spacing scale, no arbitrary values. |
| **Restraint** | Emphasis comes from weight, size and leading — never from gradient text or glows. |

### Typography
Uses the **platform system font** (`-apple-system` / SF Pro), so there is no webfont
request and no flash of unstyled text. Tracking and leading are size-specific, as
Apple specifies:

- **Display** (hero, statistics): `letter-spacing: -0.035em` → `-0.045em`, `line-height: 1.04`
- **Headings**: `letter-spacing: -0.022em`, `line-height: 1.08`
- **Body**: `letter-spacing: -0.011em`, `line-height: 1.47`
- **Small text**: slight positive tracking for legibility

### Motion
`script.js` contains a **spring engine** (`springTo()`) built on an analytic damped
harmonic oscillator:

- **Damping ratio** (overshoot) and **response** (speed) as the two designer-facing parameters.
- Starts from the element's **live on-screen value**, so an interruption never jumps.
- Carries **velocity across reversals** — reversing mid-flight blends instead of hard-cutting.
- Drawer and sheet springs use `zeta 0.85` (a little overshoot, because opening is a
  physical action); everything else defaults to critically damped `1.0`.
- `prefers-reduced-motion` skips the spring and lands on the target value.

Press feedback responds on **`pointerdown`**, not on release, via a `--press` custom
property consumed by the CSS transforms.

### Materials & depth
- Translucent chrome: `backdrop-filter: blur() saturate()` with content scrolling underneath.
- **Scroll edge effect** instead of a hard divider under the header.
- Material weight encodes hierarchy; nothing stacks a light translucent surface on another.

### Accessibility
- `prefers-reduced-motion` — cross-fades replace slides and flips.
- `prefers-reduced-transparency` — surfaces become solid.
- `prefers-contrast: more` — near-solid backgrounds, defined borders.
- `forced-colors: active` — Windows High Contrast support.
- **Lighthouse: 100 accessibility / 100 best practices / 100 SEO.**

### Appearance — light and dark
A sun/moon toggle sits in the app bar. The choice is stored in
`localStorage` and, on a first visit, seeded from `prefers-color-scheme`,
so the page matches the operating system out of the box. A tiny inline
script in `<head>` resolves the theme **before first paint**, so there is
never a flash of the wrong background, and the `theme-color` meta tag is
kept in step with the page.

Both appearances were tuned separately: the light palette darkens the
accent and the system colours so text still clears 4.5:1 on white, while
the phone mockup and the TikTok screen keep their own fixed dark inks
because they imitate a real device.

---

## 🔥 Firebase Setup (optional, ~5 minutes)

The community survey stores responses in **Firebase Firestore**. Until a project
is connected it keeps working and saves to the browser only — the privacy note
and the confirmation message adapt so the page never claims a sync that did
not happen.

### 1. Create the project
1. Sign in at [console.firebase.google.com](https://console.firebase.google.com).
2. **Add project** — name it (e.g. `norush`). Analytics are not needed.
3. Click the **Web** icon `</>` to register a web app. Skip Firebase Hosting.

### 2. Paste the credentials
Firebase shows a `firebaseConfig` object. Copy the values into
**`firebase-config.js`**, replacing every `YOUR_...` placeholder.

### 3. Create the database
1. Menu → **Firestore Database** → **Create database**.
2. Choose **Start in production mode**.
3. Pick a region near you: `southamerica-east1` is closest to Argentina.

### 4. Publish the rules — this part is not optional
Open the **Rules** tab and paste `firestore.rules` from this project, then
**Publish**.

Without these rules the survey is unsafe: the default "test mode" lets any
visitor read back every response other people sent. The rules in this project
make the collection **write-only** — anyone can add an anonymous answer, and
nobody can read, update or delete answers from the browser.

### 5. Deploy
Upload the folder to any static host (GitHub Pages, Netlify, Firebase Hosting).
No build step is needed — it is plain HTML, CSS and JavaScript.

### What gets stored
| Field | Example |
| --- | --- |
| `age_range` | `19_24` |
| `daily_hours` | `3.5` |
| `impact_score` | `4` |
| `reflection` | free text, max 2000 characters |
| `created_at` | ISO timestamp |

No name, email, phone or IP is ever requested or stored. The rules explicitly
reject any document containing those keys.

---

## 📂 Project Structure

```
detras-de-la-pantalla/
├── index.html        # Semantic HTML5 in British English (B2)
├── styles.css        # Apple design system: materials, type scale, app shell, hub
├── script.js         # Spring engine, press feedback, simulator, app shell, survey
├── firebase-config.js   # Paste your Firebase credentials here
├── firestore.rules       # Firestore security rules (write-only collection)
├── assets/           # Local media (tiktok_filtro.jpg, tiktok_ladob.jpg)
└── README.md         # Documentation and deployment instructions
```

---

## 💻 How to Open & Test Locally

- Double-click [`index.html`](file:///C:/Users/dylan/.gemini/antigravity/scratch/detras-de-la-pantalla/index.html) to open in any web browser.
- Alternatively, right-click `index.html` in VS Code and choose **"Open with Live Server"**.
