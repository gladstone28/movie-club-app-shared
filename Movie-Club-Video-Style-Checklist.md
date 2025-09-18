# Movie Club (Shared) — Quick Video‑Style Checklist

Use this as a storyboard + teleprompter to record a short how‑to video for your members. Target length: **2–3 minutes**.

---

## 🎛 Recording Setup (quick)
- **Resolution:** 1080p (1920×1080)
- **Mic:** Any headset or laptop mic is fine
- **Cursor:** Slow, deliberate movements; brief pauses on clicks
- **Captions:** Turn on auto‑captions when posting (YouTube, WhatsApp, etc.)

**Screen recorder shortcuts**
- **Windows 10/11:** `Win + Alt + R` (Xbox Game Bar) → Start/Stop recording  
- **macOS:** `Shift + ⌘ + 5` → Record selected area or entire screen

---

## 🎬 Scene List (with on‑screen text + voiceover)

### 0) Cold Open (00:00–00:05)
**On‑screen text:** “Set up our SHARED Movie Club app in 3 steps”  
**Voiceover:** “In two minutes, I’ll show you how we’ll all share the same movie list.”

---

### 1) Create Firebase Project (00:05–00:45)
**Action:** Navigate to **https://console.firebase.google.com** → *Add project* → name it `movie-club-shared` → **Create project** → **Continue**.  
**On‑screen text (lower‑third):** “Firebase → Add project”  
**Voiceover:**  
- “Open the Firebase console and click **Add project**.”  
- “Name it *movie-club-shared*, then click **Create project**.”  
- “When it’s ready, click **Continue** to open the dashboard.”

**Shot tip:** Zoom to the “Add project” button and Project name field.

---

### 2) Add a Web App (00:45–01:15)
**Action:** Click **Add app** (</>) → choose **Web** → nickname `movie-club-web` → **Register app**.  
**On‑screen text:** “Add Web app (</>)”  
**Voiceover:**  
- “Click **Add app**, choose **Web**.”  
- “Enter a nickname and click **Register app**.”  
- “Copy the **config object**—we’ll paste it into our app files.”

**Shot tip:** Highlight the `const firebaseConfig = { … }` block.

---

### 3) Enable Firestore (01:15–01:45)
**Action:** Left sidebar → **Build → Firestore Database** → **Create database** → **Start in test mode** → **Enable**.  
**On‑screen text:** “Build → Firestore → Create database (Test mode)”  
**Voiceover:**  
- “Now enable Firestore. Go to **Build**, then **Firestore Database**.”  
- “Choose **Create database**, start in **Test mode**, and click **Enable**.”

**Shot tip:** Pause briefly on “Test mode” so viewers can read it.

---

### 4) Paste Config into App (01:45–02:10)
**Action:** Open your unzipped app folder → **duplicate** `firebase-config.sample.js` → **rename** to `firebase-config.js` → **paste** the config.  
**On‑screen text:** “firebase-config.sample.js → firebase-config.js”  
**Voiceover:**  
- “In the app folder, copy `firebase-config.sample.js` to `firebase-config.js`.”  
- “Open it and paste the config you copied from Firebase.”  
- “Save the file.”

**Shot tip:** Show VS Code side‑by‑side with the Firebase config snippet.

---

### 5) Run & Seed (02:10–02:30)
**Action:** Open `index.html` (double‑click or VS Code *Live Server*) → Click **🌱 Seed samples** once.  
**On‑screen text:** “Open index.html → Seed samples”  
**Voiceover:**  
- “Open `index.html` in your browser.”  
- “Click **Seed samples** to add starter movies for everyone.”

**Shot tip:** Check the list updates in real time; click Add movie.

---

### 6) Share (02:30–02:45)
**Action:** Deploy folder to **GitHub Pages** / **Netlify** *(drag‑and‑drop)* → Copy the public link.  
**On‑screen text:** “Share the link with your club”  
**Voiceover:** “Deploy to GitHub Pages or Netlify, then share the link with your club.”

---

## ✅ On‑Screen Checklist Overlay (use as you record)
- [ ] Firebase project created
- [ ] Web app added (config copied)
- [ ] Firestore enabled (Test mode)
- [ ] `firebase-config.js` updated
- [ ] App opened
- [ ] Samples seeded
- [ ] Link shared

---

## 🧰 Troubleshooting (bonus cutaways)
**No movies appear?** Ensure everyone has your `firebase-config.js`.  
**Permission error?** Confirm Firestore is in **Test mode** while setting up.  
**Blank page?** Make sure `index.html` loads `app.js` with `type="module"` and the `firebase-config.js` file is in the same folder.

---

## 📦 What to send to members
- The **hosted link** (GitHub Pages / Netlify)
- The **video** you just recorded (optional, 2–3 mins)
- A 1‑line note: “Open the link, click Seed once if empty, and start adding movies.”

Good to go! 🎬
