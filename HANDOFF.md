# St. Vincent's Nurse Roster Companion — Project Handoff Document

> **Live Production URL:** [https://st-vincents-roster.vercel.app](https://st-vincents-roster.vercel.app)  
> **Source Repository:** [iamnarace/st-vincents-nurse-roster](https://github.com/iamnarace/st-vincents-nurse-roster)  
> **Target Ward:** St. Vincent's Hospital Sydney — Ward 9 North / GSS  
> **Primary User:** Richa Budhathoki ❤️ (Registered Nurse, Split Night Roster)

---

## 1. Executive Summary & Purpose

Hospital ward nursing rosters are typically published as complex, high-density Excel spreadsheets spanning dozens of staff across rotating shifts (Morning, Evening, Night Duty, ADOs, and Leave). Nurses often struggle to quickly ascertain:
1. *When is my next shift, what time does it start, and when does my current duty end?*
2. *If I need a rest day or family event, which colleagues are scheduled OFF and legally eligible to swap with me without violating hospital fatigue rules?*
3. *How do I easily sync rotating hospital shifts with my mobile Google/Apple Calendar?*

This project is a **mobile-first, reactive Web/PWA Application** designed specifically for Richa Budhathoki and her colleagues on Ward 9 North. It transforms the hospital's static 28-day Excel schedule into an intuitive personal companion with instant shift clarity, live countdown timers, safe turnaround checking, and one-tap WhatsApp swap messaging.

---

## 2. Requirements & Key User Directives

| Requirement | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Strict Privacy & Respect** | Never display the word *"wife"* in UI, labels, or tooltips. Pin Richa at the top of staff selection marked with a subtle heart emoji (`Richa Budhathoki ❤️`). | ✅ Complete |
| **No Administrative Claims** | Excluded hospital administrative compliance notices to maintain user privacy as an independent personal companion. | ✅ Complete |
| **Roster Sheet Fidelity** | Transcribed and locked the official 4-week hospital roster (**12th Oct – 8th Nov 2026**) across all 33 staff exactly as published on the paper ward sheet. | ✅ Complete |
| **Live Time & Dynamic Countdown** | Replaced mock text with a reactive hook recalculating every 30 seconds against local `new Date()`. Dynamically reports shift completion, active duty, and upcoming start times down to the minute. | ✅ Complete |
| **Fatigue-Compliant Swap Engine** | Evaluates who is OFF, who CAN take the shift, and flags turnaround violations (e.g., Night duty ending 07:30 cannot work Morning at 07:00). | ✅ Complete |
| **Mobile Ward Usability** | Replaced cumbersome 32-column horizontal scrolling on phones with a touch-friendly **Day-by-Day View** featuring date pills and categorized team cards. | ✅ Complete |
| **Calendar Sync** | Built RFC-5545 compliant `.ics` generator with exact shift times and ward locations for Google Calendar and Apple Calendar. | ✅ Complete |
| **Custom PWA App Icon** | Extracted and embedded the custom SVG app icon (`gemini-svg.svg`) for mobile home screens. | ✅ Complete |

---

## 3. Core Architecture & Tech Stack

- **Framework:** React 18.3 + TypeScript
- **Bundler & Build Tool:** Vite 5.4
- **Styling:** Tailwind CSS (utility-first, responsive, healthcare color palette)
- **Icons:** Lucide React
- **Data Persistence:** LocalStorage cache with version-keyed invalidation (`st_vincents_roster_data_v6`)
- **Calendar Standard:** iCalendar (`.ics`) MIME format
- **Hosting & CI/CD:** Vercel Production (`iad1` edge CDN), automatic deployments via Vercel CLI & GitHub `main`

---

## 4. Key Modules & Features Implemented

### 4.1 Personal Calendar & Live Time Engine (`PersonalCalendarView.tsx`)
- **Reactive Shift Status:**
  - `completed_today`: Displays `✅ Evening Shift finished today at 21:30` when current time is past shift finish time.
  - `on_duty`: Displays `⚡ Currently On Duty • Finishes in [X] hrs [Y] mins`.
  - `upcoming_today`: Displays `⏱️ Shift starts in [X] hrs [Y] mins`.
  - `off_duty`: Displays `🛋️ Off Duty Today (Scheduled Rest Day)`.
- **Next Shift Lookahead:** Automatically scans future dates to identify the next rostered duty and calculates a live countdown (e.g., `Tomorrow at 21:00 • Starts in 22 hrs 18 mins`).
- **Contextual Health & Rest Badges:**
  - ⚠️ *Night shift ahead. Protect your sleep schedule today.*
  - 🛡️ *Post-Night Duty rest protected day.*
  - ⚠️ *Short turnaround: Evening shift followed by early Morning tomorrow.*
  - 🎉 *Enjoy your allocated rest day off (ADO).*

### 4.2 Safe Turnaround & Shift Swap Engine (`swapEngine.ts` & `ShiftSwapModal.tsx`)
Whenever a shift swap is triggered for a specific date, the engine calculates three core metrics:
1. **Total OFF / ADO Today:** Number of colleagues not rostered to work on that day.
2. **Can Do Shift (Fully Rested):** Number of OFF colleagues whose previous and subsequent shifts comply with hospital rest standards:
   - **Night-to-Morning Protection:** If the shift to cover is Morning (`07:00 – 15:30`), any colleague who worked Night Duty (`21:00 – 07:30`) on the previous night is **blocked** (0 hours break before 07:00).
   - **Morning-after-Night Protection:** If the shift to cover is Night (`21:00 – 07:30`), any colleague rostered for Morning on the following day is **blocked** (Night ends 07:30, conflicting with 07:00 start).
   - **Evening-after-Night Protection:** Night shift ending 07:30 into Evening starting 13:00 has only 5.5 hours rest (violates the minimum 10-hour hospital break policy).
   - **Annual Leave Exclusion:** Anyone on approved leave (`AL`) is excluded from ward coverage.
3. **Fatigue Conflict Count:** Exact number of colleagues restricted by turnaround rules, each displayed with their specific rationale.
4. **1-Tap WhatsApp Integration:**
   - Pre-fills message: `"Hi [Name], I noticed you're off this [Day, Date]. Would you be open to swapping shifts with me for my [Shift]?"`
   - Copies text to clipboard and opens `https://wa.me/?text=...` simultaneously.

### 4.3 Mobile Ward Directory (`WardMasterView.tsx`)
- **Day-by-Day Mode (Default on Mobile):**
  - Horizontal swipeable date selector with day numbers, day abbreviations, and a glowing `TODAY` pill.
  - Headcount summary bar: AM Team count, PM Team count, ND Team count, Off/ADO count.
  - Four distinct section cards:
    - 🟡 **Morning Team (AM • 07:00 – 15:30)**
    - 🟢 **Evening Team (PM • 13:00 – 21:30)**
    - 🟣 **Night Duty (ND • 21:00 – 07:30)**
    - 🔵 **Off Duty & ADO Colleagues (Direct Swap Candidates)**
- **Full Matrix Mode:** Comprehensive 32-column spreadsheet matrix with sticky staff names, sticky headcount footers, and cell-by-cell shift codes.

### 4.4 Verified Official Roster Data (`rosterData.ts`)
The schedule matches the 4-week ward roster sheet (**12th October to 8th November 2026**):
- **Richa Budhathoki (Split Night RN):**
  - **Week 1:** 12: `OFF`, 13: `E`, 14: `E`, 15: `OFF`, 16: `M`, 17: `M`, 18: `M`
  - **Week 2:** 19: `N`, 20: `N`, 21: `OFF`, 22: `OFF`, 23: `E`, 24: `E`, 25: `E`
  - **Week 3:** 26: `E`, 27: `E`, 28: `OFF`, 29: `E`, 30: `ADO`, 31: `OFF`, 01: `M`
  - **Week 4:** 02: `M`, 03: `N`, 04: `OFF`, 05: `E`, 06: `N`, 07: `OFF`, 08: `OFF`
- **Full Ward Staff Included:** 33 staff across Management (Helen White NUM, Kate Wheatley CNE, Heather Mackrory CareC, Sasi Piksultong CSO), RN In Charge, RN, TSPRN, and EEN.

---

## 5. Maintenance & Operations

### How to Run Locally
```bash
cd "C:\Users\NareshAdmin\.gemini\antigravity\scratch\st-vincents-roster"
npm install
npm run dev
```

### How to Deploy Updates to Production
```bash
# 1. Build and test
npm run build

# 2. Commit and push to GitHub
git add .
git commit -m "Update roster features"
git push origin main

# 3. Deploy to Vercel production
npx --yes vercel --prod --yes
```

### Updating Roster for Future Months
- When a new monthly roster arrives, edit `src/data/rosterData.ts` or click the **"Upload Roster"** button in the app header to parse an `.xlsx` file directly.
- Bumping `STORAGE_KEY` in `src/App.tsx` (e.g., from `v6` to `v7`) ensures returning mobile users automatically receive the updated schedule without needing to clear browser cache.
