# TEDxCIT 2027: "The Untapped" — Native "Apply to Speak" & MongoDB Atlas Guide

## Overview

The "Apply to Speak" flow allows candidates and nominators to submit applications directly inside the TEDxCIT 2027 website without third-party Google Forms. All submissions are validated, sanitized, rate-limited, and persisted in **MongoDB Atlas**.

---

## 1. Application Flow & Architecture

### A. Modal Launcher
- Clicking **"APPLY TO SPEAK"** on any page (Desktop Navbar, Mobile Menu, About Section CTA, or direct `/apply-to-speak`) opens an accessible modal with dark overlay, keyboard focus trap, Esc and backdrop dismissal.
- Presents two cards:
  1. **Anonymous Voices** &rarr; navigates to `/apply/anonymous-voices`
  2. **Speaker Nomination** &rarr; navigates to `/apply/speaker-nomination`

### B. Form 1: Anonymous Voices (`/apply/anonymous-voices`)
- **Eligibility:** Exclusive to Students of CIT Group of Institutions.
- **Theme:** "The Untapped" &bull; 11 February 2027.
- **Deadline Enforcement:** Automatically validates deadline (default `25 January 2027`). After deadline, the form displays a "Registrations Closed" banner and the API rejects new submissions.
- **Fields Collected:**
  - Full Name, Email (`@citchennai.net` recommended), Contact Number (10-digit Indian), Communication Email, Social/LinkedIn links.
  - Institution (CIT / CITAR), Graduation Year (2027–2030), Department, Section.
  - Talk Details: Talk Title, Core Message, Unique Perspective, Vision Bridge, Theme Relevance, Criticism Response, Talk Structure.
  - Recorded Speech (3-5 min): Shareable Link (Google Drive, YouTube, or Vimeo).
- **Security & UX:**
  - **Duplicate Prevention:** Unique MongoDB index on student email ensures each candidate can only apply once. Duplicate attempts receive a friendly alert.
  - **Autosave Draft:** Automatically stores drafts in `localStorage` (`tedx_draft_anonymous_voices`) so answers are never lost on accidental refresh.

### C. Form 2: Speaker Nomination (`/apply/speaker-nomination`)
- **Theme:** "The Untapped" &bull; 11 February 2027.
- **Deadline Enforcement:** The admin portal can set a closing date and time; nominations remain open when no deadline is set.
- **Queries Contact:** Shubhavi R V (+91 63840 93306) | Sachin G (+91 97910 31117).
- **Conditional Workflow:**
  - Nominator Details: Full Name, Email, Contact Number, Communication Email, Work Status (Student / Working Professional), Current Profession, Organization.
  - Question: *"Are you nominating yourself?"* (Yes / No)
  - **If "Yes" (Self-Nomination):** Collects Biography, Social Links, Media Links, Unique Idea, Key Takeaways.
  - **If "No" (Nominating Someone Else):** Collects Nominee Name, Qualification, Organization, Bio, Social Links, Media Links, Unique Perspective.
  - *Hidden branch fields are strictly discarded and never validated or stored.*
  - **Autosave Draft:** Automatically stores drafts in `localStorage` (`tedx_draft_speaker_nomination`).

### D. Admin Curation Portal (`/admin`)
- Accessible at `/admin` or `/admin/submissions`.
- Protected by a short-lived, signed HttpOnly session cookie. The admin password is submitted only during sign-in and is never saved in browser storage.
- **Capabilities:**
  - View both collections (**Anonymous Voices** & **Speaker Nominations**).
  - Search by applicant name, email, or talk title.
  - Filter by status: `submitted`, `shortlisted`, `rejected`.
  - Review full pitch details, talk structures, and candidate recordings.
  - 1-click status update buttons.
  - Toggle each form on or off; disabled forms are hidden from the public application chooser and cannot accept submissions.
  - Set and save closing dates and times for both forms. The Speaker Nomination deadline can be left blank to keep that form open indefinitely.
  - 1-click **CSV Export** for committee deliberation.

---

## 2. MongoDB Atlas Configuration

The application stores all data in two MongoDB collections:
- `anonymousVoices`
- `speakerNominations`

### Step-by-Step Setup:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a free **M0 Sandbox** cluster (AWS, ap-south-1 Mumbai or nearest).
3. **Database Access:**
   - Click **Database Access** &rarr; **Add New Database User**.
   - Create a user (e.g., `tedx_admin`) with a strong password. Choose **Read and write to any database**.
4. **Network Access (IP Whitelist):**
   - Click **Network Access** &rarr; **Add IP Address**.
   - For local development and serverless (Vercel) hosting, add `0.0.0.0/0` (Allow Access from Anywhere).
5. **Get Connection String:**
   - Go to **Clusters** &rarr; Click **Connect** &rarr; Select **Drivers** (Node.js).
   - Copy your connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tedxcit2027?retryWrites=true&w=majority
     ```
6. **Set Environment Variable:**
   - In `backend/.env`:
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tedxcit2027?retryWrites=true&w=majority
     ADMIN_PASSWORD=your_secure_admin_password
     ADMIN_SESSION_SECRET=your_separate_random_session_secret
     ```
   - In **Vercel Dashboard** (Settings &rarr; Environment Variables):
     - Add `MONGODB_URI`
     - Add `ADMIN_PASSWORD`
     - Add `ADMIN_SESSION_SECRET`

*(Note: If `MONGODB_URI` is not set during local testing, the backend gracefully activates an in-memory store so the app never crashes.)*

---

## 3. Running Locally

### Terminal 1: Backend
```bash
npm run dev:backend
# Or: node backend/src/server.js
# Runs on http://localhost:5000
```

### Terminal 2: Frontend
```bash
npm run dev:frontend
# Runs on http://localhost:5173
```

Open `http://localhost:5173` in your browser. All `/api` and `/uploads` requests are automatically proxied from Vite to the Express backend.

---

## 4. Running Backend Verification Tests

Run the automated test suite covering registration, payments, native submissions, duplicate email rejections, and admin authentication:
```bash
npm run test:backend
# Output: TEST SUMMARY: 20 PASSED, 0 FAILED
```
