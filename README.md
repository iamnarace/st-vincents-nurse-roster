# 🏥 St. Vincent's Public Hospital - Ward 9 North Roster & Shift Swap Portal

An intelligent, mobile-first nurse roster management and smart shift swap portal designed specifically for **St. Vincent's Public Hospital (Ward 9 North / GSS)**.

Converts complex, cluttered hospital Excel spreadsheets into a clean, stress-reducing interactive dashboard with smart fatigue policy compliance and 1-tap WhatsApp shift swap communication.

---

## 🌟 Key Features

### 1. 📱 Personal Dashboard (Her Hub)
- **Mobile-First Calendar View**: Instant, crystal-clear view of upcoming shifts without squinting at huge spreadsheets.
- **Authentic Hospital Color Badges**:
  - `M` / `M1` / `MI` / `M10` (Morning Shift): **Warm Yellow / Amber** (07:00 – 15:30)
  - `E` / `E1` / `EI` / `E6` / `E10` (Evening Shift): **Mint / Emerald Green** (13:00 – 21:30)
  - `N` / `N1` / `NI` (Night Duty): **Purple / Pink** (21:00 – 07:30)
  - `ADO` / `ADO4` / `ADO6` / `ADO10` (Allocated Day Off): **Sky Blue**
  - `AL` / `AL6` (Annual Leave): **Orange / Gold**
  - `D` (NUM / CNE Management): **Slate Grey** (08:00 – 16:30)
  - `SD` (Study Day): **Teal**
- **Smart Fatigue & Safe Work Alerts**:
  - ⚠️ **Short Turnaround Alert**: Automatically flags evening shifts followed by morning shifts (<10 hours rest).
  - 🛡️ **Rest Protected Badge**: Protects mandatory recovery day after night duty.
- **Countdown Widgets**:
  - Live countdown to next shift with start/finish times.
  - "X shifts remaining until next ADO / Annual Leave" rest milestone tracker.

### 2. ⚡ The Smart Shift-Swap Engine
- **Intelligent Hospital Matching**: When a nurse taps any shift:
  - Finds colleagues who are **OFF** or on **ADO**.
  - Automatically filters out nurses who worked a **Night Shift the night before** (protecting sleep rest cycles).
  - Filters out colleagues already on **Annual Leave (AL)**.
- **1-Click WhatsApp & SMS Dispatch**:
  - Automatically copies pre-formatted text:  
    `"Hi [Name], are you open to swapping your schedule on [Day, Date] for my [Shift] at St. Vincent's Ward 9 North? Let me know, thanks!"`
  - Direct WhatsApp launch button (`wa.me/?text=...`).
- **Real-Time Simulation**: "Swap Now" button simulates the instant shift exchange on both the personal schedule and the master ward roster.

### 3. 📋 Ward Master Roster View
- Complete interactive digital replica of the 4-week ward roster sheet (`12th October - 8th November 2026`).
- Sticky staff names and roles column (`NUM`, `CNE`, `RN`, `TSPRN`, `EEN`).
- Filter by Section or search by nurse name.
- **Date & Duty Inspector**: Filter by specific date and duty team (Morning, Evening, Night).
- Live bottom headcount summary row (`AM Team`, `PM Team`, `ND Team`).

### 4. 📅 Family Calendar Sync (.ics Export)
- Generate standard `.ics` calendar files.
- Easily import shifts into **Google Calendar**, **Apple Calendar**, or Outlook.

### 5. 📂 Excel Import & Export
- Integrated with `xlsx` to parse new monthly hospital roster spreadsheets or export modifications back into Excel.

---

## 🚀 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/iamnarace/st-vincents-nurse-roster.git
cd st-vincents-roster

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) using your GitHub account (`iamnarace`).
3. Click **"Add New..."** ➔ **"Project"**.
4. Select `st-vincents-nurse-roster`.
5. Framework Preset: **Vite** (Vercel automatically detects this).
6. Click **Deploy**. Your app will be live with a free custom URL (e.g. `st-vincents-roster.vercel.app`) in under 1 minute!
