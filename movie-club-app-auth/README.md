# Movie Club (Shared + Auth) – Setup

This version adds **Firebase Authentication (Google Sign‑In)**. Only signed‑in members can **Add** or **🌱 Seed** movies. Everyone can **read** the shared list (you can tighten this later).

## 1) Firebase project & web app
- Create a project at https://console.firebase.google.com/
- Add a **Web app** (</>) and copy the **config object**

## 2) Enable Google Sign‑In
- In Firebase Console → **Build → Authentication → Get started**
- Go to **Sign‑in method** → enable **Google**
- Save. (Authorized domains usually include `localhost` and any deployed host like `*.netlify.app`)

## 3) Enable Firestore
- **Build → Firestore Database → Create database**
- Start in **Test mode** (change rules later)

## 4) Add your config
- In this folder, copy `firebase-config.sample.js` → **`firebase-config.js`**
- Paste your config into `firebase-config.js`

## 5) (Recommended) Firestore security rules
While testing you can stay in Test mode. For a simple rule set that allows reads for everyone but writes only for signed‑in users:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /movies/{id} {
      allow read: if true;              // public reads (or use request.auth != null for members-only)
      allow create, update, delete: if request.auth != null;
    }
  }
}
```
Firebase Console → **Build → Firestore Database → Rules** → paste → **Publish**.

## 6) Run the app
- Open `index.html` (double‑click or use VS Code **Live Server**)
- Click **🔐 Sign in** (Google)
- Add a movie or click **🌱 Seed samples**

## Notes
- Selections in the right column stay **private** on each device (localStorage)
- Each movie document includes `createdBy` metadata (`uid`, `name`, `email`) and `createdAt`
- Works offline; syncs when back online
