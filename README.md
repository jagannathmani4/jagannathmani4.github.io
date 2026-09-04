# DevPortfolio — Portfolio Site + Admin Panel

A two-page project:

- **`index.php`** — the public portfolio (matches your screenshot: hero, services, about, skills & experience). All content is rendered client-side from a single Firestore document.
- **`admin.php`** — a login-protected dashboard where you edit every field on the site (text, stats, services, gallery images, skills, experience) and upload images/CV files. Text data is saved to **Firebase Firestore**; images and the CV file are uploaded to **Supabase Storage**.

```
project/
├── index.php              public site
├── admin.php               admin dashboard
├── assets/
│   ├── css/style.css       public site styles
│   ├── css/admin.css       admin dashboard styles
│   └── js/
│       ├── config.js        <- put your Firebase & Supabase keys here
│       ├── site.js          renders index.php from Firestore
│       └── admin.js         auth, forms, uploads, save logic
```

No PHP backend code is required for the data layer — Firebase and Supabase are called directly from the browser via their JS SDKs (loaded from CDN as ES modules). The `.php` files exist as the page shell so you can still use PHP includes (headers, footers, routing) if you extend the project later.

## 1. Set up Firebase

1. Go to the [Firebase console](https://console.firebase.google.com/) → **Add project**.
2. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable.**
3. **Authentication → Users → Add user** — create the one account you'll use to log into `/admin.php` (e.g. `mary@example.com`).
4. **Build → Firestore Database → Create database** (start in *production mode*).
5. **Project settings (gear icon) → General → Your apps → Add app → Web**, then copy the `firebaseConfig` object into `assets/js/config.js`.

### Firestore security rules

Restrict writes to your one admin account (replace with your real admin email), everyone else can only read:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolio/main {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == "mary@example.com";
    }
  }
}
```

Paste this under **Firestore Database → Rules** and publish.

## 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. **Storage → New bucket** → name it `portfolio-assets` → make it **Public** (so uploaded images/CVs can be displayed on the site).
3. **Project settings → API** → copy the **Project URL** and **anon public key** into `assets/js/config.js` (`supabaseConfig`).
4. Add storage policies so only your logged-in Firebase user can upload — since Supabase doesn't know about Firebase auth directly, the simplest safe option is:
   - Keep the bucket **read: public**.
   - For **write**, either (a) leave the anon key upload-enabled only while you're the sole person with the admin URL/credentials, or (b) proxy uploads through a small server endpoint that checks a Firebase ID token before forwarding to Supabase with a service-role key, if you want stronger protection.

## 3. Configure the app

Edit `assets/js/config.js`:

```js
export const firebaseConfig = { /* from Firebase console */ };
export const supabaseConfig = {
  url: "https://YOUR_PROJECT_REF.supabase.co",
  anonKey: "YOUR_SUPABASE_ANON_KEY",
  bucket: "portfolio-assets"
};
export const ADMIN_ALLOWED_EMAILS = ["mary@example.com"];
```

`ADMIN_ALLOWED_EMAILS` is a client-side convenience check (signs the user back out if their email isn't listed). It is **not** a security boundary by itself — the Firestore rule above is what actually enforces it.

## 4. Run locally

From the `project/` folder:

```bash
php -S localhost:8000
```

Visit `http://localhost:8000/index.php` for the site and `http://localhost:8000/admin.php` to log in and edit content. The first time you save each section in the admin panel, it creates the Firestore document `portfolio/main` — the public site will start showing your content immediately (no rebuild needed).

## 5. Content model (Firestore doc `portfolio/main`)

```
hero:    { name, title, description, ctaText, ctaLink, profileImageUrl, cvUrl, stats: [{value,label}] }
services: [ { icon, title, description } ]
about:   { subtitle, description, frontend, backend, design, tools, experienceBadge, galleryImages: [url,...] }
skills:  { intro, items: [{name, percent}], experience: [{role, company, period, description}] }
```

## 6. Deploying

Any PHP-capable host works for the two `.php` shells (they're static once served). Firebase and Supabase are called client-side, so no server-side environment variables are needed — just make sure `assets/js/config.js` on the deployed host has the same production keys.
