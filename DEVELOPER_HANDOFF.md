# TPIP Academy — Developer Handoff Document

**Prepared for:** vaishnavi.licreativetechnology@gmail.com
**Project owner:** troiwebz@gmail.com
**Date:** June 2026

---

## Project Overview

TPIP Academy (Transform Passion Into Profession) is a multi-sport sports coaching LMS. It allows athletes to connect with certified coaches for live 1-on-1 sessions, video analysis, and AI-powered performance tracking across all sports.

**World-first claim:** TPIP Sports AI is the first AI to analyse a complete athlete profile (video, sessions, coach notes, scores) and generate a personalised improvement plan.

---

## Live URLs

| Environment | URL |
|---|---|
| Production | https://tpip-academy.vercel.app |
| Vercel Dashboard | https://vercel.com/troiwebzs-projects/frontend |
| GitHub Repo | https://github.com/troiwebz/tpip-live |

---

## Account Access

| Platform | Username / Email | Notes |
|---|---|---|
| GitHub | troiwebz / troiwebz@gmail.com | Request collaborator access to `tpip-live` repo |
| Vercel | troiwebz / troiwebz@gmail.com | Hobby plan — one deployer only. Use your own Vercel account by importing the GitHub repo |
| Supabase | troiwebz@gmail.com | Project ID: `lrcyhnnvenphjnncwxat` — request team invite |

---

## Tech Stack

- **Frontend:** React 19 + Vite 8
- **Routing:** React Router v6
- **State Management:** Zustand
- **Database + Auth:** Supabase
- **Deployment:** Vercel
- **Styling:** 100% inline React styles — NO CSS files, no Tailwind

---

## Setup — Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/troiwebz/tpip-live.git
cd tpip-live
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file in root
```env
VITE_SUPABASE_URL=https://lrcyhnnvenphjnncwxat.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyY3lobm52ZW5waGpubmN3eGF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzExNzMsImV4cCI6MjA5NTQ0NzE3M30.ss_kdiHTaMaLbsBZfVmEsZ0Mn3jT8Or4QBt9ojTEzxU
VITE_API_URL=http://localhost:3000
```

### 4. Start dev server
```bash
npm run dev
# Opens at http://localhost:5173
```

---

## Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@tpip.com | admin1234 |
| Coach | rahul.coach@tpip.com | coach1234 |
| Student | arjun@tpip.com | student1234 |

---

## Deploy to Vercel

### Option A — Using your own Vercel account (recommended)
1. Go to https://vercel.com and log in
2. Click **Add New Project**
3. Import `troiwebz/tpip-live` from GitHub
4. Set environment variables (same as `.env` above)
5. Deploy — Vercel auto-detects Vite and builds correctly

### Option B — Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod

# After deploy, set clean URL alias:
vercel alias [deployment-url] tpip-academy
```

---

## Key Files to Know

| File | Purpose |
|---|---|
| `src/pages/Landing/Landing.jsx` | Main homepage — all sections, animations, coaches block, AI block |
| `src/pages/Coaches/CoachesPage.jsx` | Public coaches listing with expandable rows + sport filter |
| `src/pages/About/AboutPage.jsx` | About page with animated stats |
| `src/App.jsx` | All routes |
| `src/store/authStore.js` | Auth state (Zustand) |
| `src/services/supabase.js` | Supabase client |
| `api/backend.js` | Vercel serverless API (scaffolded, needs Supabase integration) |
| `vercel.json` | Vercel config — SPA rewrites |
| `CLAUDE.md` | Full Claude AI context file — read this for complete project rules |

---

## Design Rules (Must Follow)

1. **All styles are inline** — `style={{ color: '#fff', fontSize: 14 }}` — never create `.css` files
2. **Logo** — always use `mixBlendMode: 'screen'` on dark backgrounds — no white box wrapper
3. **No cricket-only content** — TPIP is all-sports. Remove BCCI, NCA, batting/bowling/fielding as sport names
4. **Fonts:** Sora (headings), IBM Plex Mono (labels/badges), system-ui (body)
5. **Color accents:** LIME `#adff2f`, PURPLE `#8d59ff`, BLUE `#227eff`, GREEN `#09f647`

---

## What's Already Built

### Public Pages
- ✅ Landing page (full marketing site with all sections)
- ✅ Coaches page (expandable list with sport filter)
- ✅ Programs page
- ✅ About page with animated stats
- ✅ Login / Register / Enroll pages

### Admin Panel (`/admin`)
- ✅ Dashboard, Students, Coaches, Programs, Sessions
- ✅ Certificates, Payments, Payouts, Academies, AI Settings, Settings

### Coach Panel (`/coach`)
- ✅ Dashboard, Students, Courses, Drills, Sessions
- ✅ Submissions (video reviews), Assessments, Earnings, Profile, Availability

### Student Panel (`/student`)
- ✅ Dashboard, Sessions, Courses, Progress, Certificates
- ✅ AI Analysis, AI Chat, Coach Discovery, Payments, Profile

---

## What's Pending / Next Steps

- [ ] Sports AI — currently a UI mockup. Needs real backend integration
- [ ] Auto-deploy on GitHub push (connect GitHub to Vercel in dashboard)
- [ ] Real coach photos on CoachesPage
- [ ] Mobile responsive pass on Landing page
- [ ] Backend API in `api/backend.js` needs full Supabase integration
- [ ] Supabase tables need to be verified/seeded for production

---

## Using Claude Code for Development

This project has a `CLAUDE.md` file in the root. When you open the project in Claude Code, Claude automatically reads it and understands:
- Full project context
- Design rules
- What's done and what's pending
- All component structures
- Deployment process

Just run `claude` in the project folder and Claude will pick up from exactly where development left off.

---

## Contact

**Project Owner:** Hemachandiran
**Email:** troiwebz@gmail.com
