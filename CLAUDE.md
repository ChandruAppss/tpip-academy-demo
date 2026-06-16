# TPIP Academy LMS — Claude Context File

This file is read automatically by Claude Code at the start of every session.
It gives full context so Claude can continue development without re-explanation.

---

## What This Project Is

**TPIP Academy** (Transform Passion Into Profession) is a **multi-sport sports coaching LMS** (Learning Management System) built for serious athletes across all sports — not just cricket. It connects athletes with certified coaches through video analysis, live 1-on-1 sessions, and AI-powered performance tracking.

**Tagline:** "The first AI that knows your whole game."

**World-first claim:** TPIP Sports AI reads video submissions, session history, coach notes, and performance scores to build a complete athlete profile and generate personalised improvement plans.

---

## Project Status

**Phase:** Live MVP — actively being developed and improved.

**Current live URL:** https://tpip-academy.vercel.app

**GitHub repo:** https://github.com/troiwebz/tpip-live (private)

**Last deployment:** Pushed via Vercel CLI from local. Future deploys: `git push` then `vercel --prod`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Routing | React Router v6 |
| State | Zustand (`authStore.js`) |
| Backend/DB | Supabase (PostgreSQL + Auth) |
| Deployment | Vercel |
| Styling | Inline React styles (NO CSS files — all styles are inline JSX) |
| Fonts | Sora, IBM Plex Mono (Google Fonts) |

**Important:** This project uses **100% inline styles** — no Tailwind, no CSS modules, no styled-components. All styling is done via `style={{}}` props directly in JSX.

---

## Environment Variables

File: `.env` (not committed to git)

```
VITE_SUPABASE_URL=https://lrcyhnnvenphjnncwxat.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyY3lobm52ZW5waGpubmN3eGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzExNzMsImV4cCI6MjA5NTQ0NzE3M30.ss_kdiHTaMaLbsBZfVmEsZ0Mn3jT8Or4QBt9ojTEzxU
VITE_API_URL=http://localhost:3000
```

---

## Folder Structure

```
TPIP-Live/
├── public/                    # Static assets (logo, images, videos)
│   └── tpip-logo.png          # Main logo — black bg, shield icon. Uses mix-blend-mode: screen on dark navbars
├── src/
│   ├── App.jsx                # All routes defined here
│   ├── store/
│   │   └── authStore.js       # Zustand auth store — profile, role, logout
│   ├── services/
│   │   ├── supabase.js        # Supabase client
│   │   └── api.js             # API helpers
│   ├── components/
│   │   └── common/
│   │       └── ProtectedRoute.jsx
│   └── pages/
│       ├── Landing/
│       │   ├── Landing.jsx    # Homepage — main marketing page (largest file)
│       │   ├── Login.jsx      # Login with demo credentials
│       │   ├── Register.jsx
│       │   └── Enroll.jsx
│       ├── About/
│       │   └── AboutPage.jsx
│       ├── Coaches/
│       │   └── CoachesPage.jsx  # Public coaches listing — expandable rows + sport filter
│       ├── Programs/
│       │   └── ProgramsPage.jsx
│       ├── Admin/             # Admin panel (role: admin)
│       ├── Coach/             # Coach panel (role: coach)
│       └── Student/           # Student panel (role: student)
├── vercel.json                # Vercel config — rewrites SPA routes to index.html
├── vite.config.js
└── CLAUDE.md                  # This file
```

---

## Routes

### Public
| Path | Component |
|---|---|
| `/` | Landing.jsx |
| `/login` | Login.jsx |
| `/register` | Register.jsx |
| `/coaches` | CoachesPage.jsx |
| `/programs` | ProgramsPage.jsx |
| `/about` | AboutPage.jsx |
| `/enroll` | Enroll.jsx |
| `/verify/:certId` | VerifyCertificate.jsx |

### Admin (role: admin)
`/admin`, `/admin/coaches`, `/admin/students`, `/admin/programs`, `/admin/sessions`, `/admin/certificates`, `/admin/payments`, `/admin/academies`, `/admin/settings`, `/admin/ai-settings`, `/admin/payouts`, `/admin/payout-settings`

### Coach (role: coach)
`/coach`, `/coach/students`, `/coach/students/:id`, `/coach/courses`, `/coach/courses/:id/builder`, `/coach/drills`, `/coach/sessions`, `/coach/submissions`, `/coach/assessments`, `/coach/earnings`, `/coach/profile`, `/coach/availability`

### Student (role: student)
`/student`, `/student/sessions`, `/student/sessions/calendar`, `/student/sessions/:id`, `/student/coaches`, `/student/coaches/:id`, `/student/courses`, `/student/courses/:id`, `/student/submissions`, `/student/progress`, `/student/certificates`, `/student/ai`, `/student/ai-chat`, `/student/chat`, `/student/payments`, `/student/profile`, `/student/discover`, `/student/book`

---

## Design System

### Color Palette
```js
BG      = '#0d1117'   // Main dark background
BG5     = '#11141d'   // Slightly lighter bg
BG14    = '#12161f'   // Card background
CARD    = '#161b22'   // Nav/card bg
BORDER  = '#21262d'   // Border color
STR     = 'rgba(124,142,165,0.18)'  // Subtle border

LIME    = '#adff2f'   // Primary accent (navbars, active states)
LEMON   = '#d0ff00'   // Secondary accent
PURPLE  = '#8d59ff'   // CTA buttons, highlights
BLUE    = '#227eff'   // Info, links
GREEN   = '#09f647'   // Online status, success
YELLOW  = '#fff049'   // Ratings, warnings
```

### Logo
- File: `/public/tpip-logo.png`
- Has black background — use `mixBlendMode: 'screen'` to make it transparent on dark navbars
- Size in navbars: `width: 150, height: 56`
- Size in landing navbar: `width: 190, height: 52`

### Fonts
- **Sora** — headings, names, numbers
- **IBM Plex Mono** — labels, badges, tags, monospace data
- **System UI** — body text, nav links

### CSS Animations (defined in Landing.jsx `<style>` block)
- `card-float`, `shine-sweep`, `icon-pulse`, `shimmer-purple`
- `ai-scan`, `ai-float`, `ai-ring`, `ai-blink`
- `chevron-pulse` (glowing chevron on coach rows)
- `online-blink` (pulsing green dot for online coaches)
- `fadeUp` — section entrance animation

---

## Key Components in Landing.jsx

### Counter (scroll-triggered count-up)
```jsx
function Counter({ n, s = '', d = 1800, dec = 0, fixed = false })
```
Uses RAF-based cubic ease-out. Triggers on IntersectionObserver.

### TypeWriter
Cycles through an array of words with typing/deleting animation.
```jsx
<TypeWriter words={['Cricket','Football','Tennis']} color='#adff2f' />
```

### ReviewSlider
Auto-scrolling horizontal review strip. Used in student testimonials section.

---

## Landing Page Sections (in order)

1. **Navbar** — centered logo, `[Programs][Coaches][Students] [LOGO] [Pricing][About] [Login][Enroll]`
2. **Hero** — centered, 2-line heading, stats row (128K+ Students, 6K+ Sessions, 4.9★, 95%)
3. **OUR IMPACT** — 4 animated stat cards with count-up, shine sweep, verified badge
4. **WHY TPIP IS DIFFERENT** — left copy + right embedded coaching mockup
5. **HOW IT WORKS** — coloured step cards
6. **FEATURES** — TypeWriter cycling sports, 6 feature cards
7. **COACHES** — expandable rows with sport filter + online/offline status
8. **SPORTS AI** — world-first AI block with chat mockup on right
9. **WHAT EVERY STUDENT GETS** — gold tint section
10. **PRICING** — tabbed switcher
11. **TESTIMONIALS** — review cards + slider
12. **FOOTER**

---

## Coaches Section (Landing.jsx + CoachesPage.jsx)

Both pages use the same **expandable rows + sport filter** design:

- Filter pills: `All | Cricket | Football | Athletics | Badminton | Tennis | Swimming`
- Each row: `# | Avatar (initials) | Name + Role | Sport badge | Rating | Exp | Status | Chevron`
- Click row → expands bio, specialties chips, stats, "Book session →" CTA
- **Online/Offline** — random per coach (`_onl()` function), green blinking dot on avatar
- **Chevron** — glows in coach accent color with `chevron-pulse` animation when collapsed
- 6–7 coaches per sport tab
- Scrollable container: `maxHeight: 440px` on landing, `520px` on CoachesPage

### Coach data structure
```js
{
  name, role, sub, initials, color, sport,
  students, rating, exp, online,
  bio, specialties: []
}
```

---

## Sports AI Block (Landing.jsx)

Located after the Coaches section. Shows:
- Left: copy with 4 feature rows + "Try TPIP AI for free →" CTA
- Right: **AI Chat mockup** — not a dashboard, a conversation interface showing:
  - AI avatar with pulsing green online dot
  - "WORLD FIRST 🌍" badge
  - Chat messages: AI scanned 12 sessions + 8 clips → user asks "What should I focus on?" → AI replies with 3 priority chips (HIGH IMPACT / MEDIUM / QUICK WIN)
  - Typing indicator (3 bouncing dots)
  - Input bar "Ask your AI coach anything…"
  - Scan-line animation running through card

---

## Navbar Rules

- **Landing page navbar:** `justifyContent: 'center'`, logo absolutely centered
- **Admin/Coach/Student layouts:** Logo centered with `position: absolute, left: 50%, transform: translateX(-50%)`
- Logo uses `mixBlendMode: 'screen'` — do NOT wrap in a white pill/box
- Nav links use `padding: '6px 10px'`, active state gets `background: LIME, color: '#000'`

---

## About Page

- Stats: `95% Performance Gains | 4.9★ Average Rating | 128K+ Students | Since 2020`
- CountUp animation with IntersectionObserver trigger
- Hero floating stat: "128K+" in lime green

---

## What Has Been Removed / Is Banned

- ❌ All cricket-specific references: BCCI, NCA, batting, bowling, fielding (as sport names)
- ❌ White pill wrapper around logo
- ❌ YouTube review block (replaced with Sports AI block)
- ❌ Any mention of "Apify", "API", "MCP", "scraper" in user-facing content
- ❌ LibreOffice dependency
- ❌ Thai/Japanese/Korean/Arabic characters in PDFs

---

## Demo Login Credentials (from Login.jsx)

| Role | Email | Password |
|---|---|---|
| Admin | admin@tpip.com | admin1234 |
| Coach | rahul.coach@tpip.com | coach1234 |
| Student | arjun@tpip.com | student1234 |

---

## How to Run Locally

```bash
cd /path/to/TPIP-Live
npm install
npm run dev
# Runs on http://localhost:5173 (or 5174 if port taken)
```

## How to Deploy

```bash
# After making changes:
git add .
git commit -m "your message"
git push

# Then deploy to Vercel:
npx vercel --prod

# Set alias after deploy (keeps clean URL):
npx vercel alias [new-deployment-url] tpip-academy
```

**Live URL always:** https://tpip-academy.vercel.app

---

## Account Credentials for Handoff

| Platform | Username | Email |
|---|---|---|
| GitHub | troiwebz | troiwebz@gmail.com |
| Vercel | troiwebz | troiwebz@gmail.com |
| Supabase | — | troiwebz@gmail.com |

**Supabase Project ID:** `lrcyhnnvenphjnncwxat`

---

## Pending / Next Steps

- [ ] Connect Vercel to GitHub for auto-deploy on `git push`
- [ ] Add Supabase team member: vaishnavi.licreativetechnology@gmail.com
- [ ] Implement actual Sports AI backend (currently mockup UI only)
- [ ] Make AI chat block interactive (real conversation, not static mockup)
- [ ] Add real coach photos to CoachesPage
- [ ] Mobile responsive pass on Landing page
- [ ] Backend API already scaffolded in `api/backend.js` — needs Supabase integration

---

## Important Rules for Claude

1. **Never use CSS files** — all styles must be inline `style={{}}` in JSX
2. **Never mention Apify, MCP, scrapers** in any user-facing content
3. **No cricket-only references** — TPIP is all-sports
4. **Logo always uses `mixBlendMode: 'screen'`** on dark backgrounds
5. **Do not add comments** to code unless the WHY is non-obvious
6. **Do not refactor** beyond what the task requires
7. **Build passes required** — always run `npx vite build` and verify 0 errors before reporting done
8. **Apostrophes in JS strings** — use plain text (no `'s`) inside single-quoted strings or use template literals
