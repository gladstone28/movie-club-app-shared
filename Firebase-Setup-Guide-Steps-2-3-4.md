# Firebase Setup Guide (Steps 2, 3, and 4)

This guide walks you through creating a Firebase project, enabling Firestore, and wiring your config into the Movie Club app. No prior Firebase knowledge needed.

---

## Step 2 — Create a Firebase Project (and Web App)

1. **Open Firebase Console**  
   Visit: https://console.firebase.google.com/

2. **Create a project**
   - Click **“Add project”** (or **“Create project”**).
   - Enter a **Project name** (e.g., `movie-club-shared`).
   - Click **Continue** through the steps (you can keep defaults).  
   - Click **Create project** → wait until it finishes → **Continue**.

3. **Add a Web App to your project**
   - In your new project’s dashboard, click **“Add app”** (</> **Web**).  
   - App nickname: e.g., `movie-club-web` (nickname is just for you).  
   - You do **not** need Firebase Hosting right now (you can enable later).  
   - Click **Register app**.
   - Firebase shows a code snippet with a **config object** like this:
     ```js
     const firebaseConfig = {
       apiKey: "AIza...",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.appspot.com",
       messagingSenderId: "1234567890",
       appId: "1:1234567890:web:abcdef123456"
     };
     ```
   - Leave this tab open or copy the object somewhere safe (you’ll paste it in Step 4).

---

## Step 3 — Enable Firestore Database

1. From the left sidebar, click **Build → Firestore Database**.
2. Click **Create database**.
3. Choose **Start in test mode** (for initial setup).  
   - Test mode is easiest while getting started. You can switch to stricter rules later.
4. Choose a **location** (region). Any region is fine; picking a region close to Jamaica may reduce latency.
5. Click **Enable**. Firestore will provision in a few seconds.

> ✅ When done, you’ll see a **Firestore** page with a “Start collection” button. We **don’t** need to create a collection manually—the app will create documents in the `movies` collection automatically the first time you **Add a movie** or **Seed samples**.

---

## Step 4 — Wire Your Config Into the App

1. **Unzip** `movie-club-app-shared.zip`.
2. In the unzipped folder, locate:
   - `firebase-config.sample.js`
3. **Duplicate** it and rename the copy to:
   - `firebase-config.js`
4. Open `firebase-config.js` in a text editor (e.g., VS Code).
5. **Paste your config** from Step 2 into `firebase-config.js`. It should look like this:
   ```js
   // firebase-config.js
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
6. **Save** the file.

That’s it! Now open `index.html` in your browser (double‑click, or right‑click → **Open with Live Server** in VS Code).

---

## Optional: Seed Sample Movies

- In the app UI, click **🌱 Seed samples** once. This will create a handful of popular movies in your shared Firestore collection so members immediately see content.
- You can also add your own movies via the **Add a movie (shared)** form.

---

## Quick Troubleshooting

- **I don’t see new movies appear for other members.**  
  Ensure everyone is using the **same files** with your `firebase-config.js`. If one person still has the `.sample` file, they’ll be connected to nothing.

- **Permission errors when adding movies.**  
  Make sure Firestore is in **Test mode** while setting up. Later, we can tighten security rules.

- **Blank page or console errors about imports.**  
  Double‑check that `app.js` is loaded with `type="module"` in `index.html`, and that `firebase-config.js` sits next to `app.js`.

- **Where is the data?**  
  In Firebase Console: **Build → Firestore Database**. You’ll see a `movies` collection once you add/seed a movie.

---

## Next Steps (optional hardening)

- Add **Firebase Authentication** (Google/Email) so only members can add movies.
- Replace “Test mode” rules with stricter security rules.
- Deploy to **GitHub Pages / Netlify / Vercel** and share the link with members.

If you want, I can do the authentication and secure rules for you next.
