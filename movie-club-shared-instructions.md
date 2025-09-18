# Movie Club (Shared) – Setup Instructions

This guide explains how to set up the **shared movie club app** so all members use the same movie list in real time.

---

## 1. Unzip the App
- Download and unzip **`movie-club-app-shared.zip`**.

---

## 2. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** → follow the steps.
3. Inside your project, click **Add app** → **Web app (</>)**.
4. Copy the **Firebase config object** it gives you.

---

## 3. Enable Firestore Database
1. In Firebase console: **Build → Firestore Database**.
2. Click **Create database**.
3. Start in **Test mode** (you can secure later).

---

## 4. Configure Your App
1. In the unzipped folder, duplicate the file:
   ```
   firebase-config.sample.js → firebase-config.js
   ```
2. Paste your Firebase config inside `firebase-config.js`.

---

## 5. Run the App
- Open `index.html` in your browser (double-click, or use VS Code’s **Live Server** extension).

---

## 6. Seed Sample Movies (Optional)
- Click the **🌱 Seed samples** button once to load initial movies into the shared list.

---

## 7. Share with Members
- Host the unzipped folder on:
  - **GitHub Pages** (free, link sharing)
  - **Netlify / Vercel** (drag-and-drop deploy)
- Or share the folder directly with your club members.

---

## Notes
- **Shared**: Movie list is in Firestore → all members see updates instantly.
- **Private**: Each member’s selections are stored in their own browser (localStorage).
- **Offline**: Firestore persistence lets the app work even if connection drops (syncs later).
