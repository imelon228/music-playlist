# WaveList - Final Project (IT-2504)

> **Web Technologies Final Project**  
> **Course:** Web Technologies, Astana IT University (IT-2504)  
> **Project Topic:** WaveList — Music Playlist, Discovery & Catalog Website  

---

## 👥 Group Members & Contributions
- **Fariddin** — Multi-page HTML5 semantic architecture, JavaScript `localStorage` authentication (Sign-in/Register/Sign-out) and session persistence, README documentation.
- **Aidyn** — CSS3 design system, responsive Flexbox and Grid layouts, Light/Dark theme toggle implementation with CSS variables and `localStorage` persistence, visual asset styling.
- **Ilyas** — Public Music API integration via JavaScript `fetch()` (JSON parsing, audio player controls, error handling), jQuery FAQ section with `.slideToggle()` and dynamic state indicators, interactive CRUD songs table and lightbox gallery.

---

## 🌐 Live Website & Repository
- **Deployed Website (GitHub Pages):** [https://imelon228.github.io/music-playlist/](https://imelon228.github.io/music-playlist/)
- **GitHub Repository:** [https://github.com/imelon228/music-playlist](https://github.com/imelon228/music-playlist)

---

## 📋 Compliance with Final Project Requirements

### 1. General & Architecture Requirements (At least 5 separate pages)
The project is built as a multi-page web application featuring **8 connected pages** sharing a unified, responsive navigation bar:
1. `index.html` — Homepage featuring hero section, highlighted albums, popular artists showcase, and quick links.
2. `songs.html` — Interactive playlist management table with full CRUD operations (add, edit, delete songs), search by title/artist/album, and genre filter buttons. Data persists in `localStorage`.
3. `albums.html` — Album showcase grid with live search and category filters.
4. `artists.html` — Featured artist roster and responsive photo gallery with interactive jQuery lightbox viewer.
5. `api.html` — Live Music API explorer utilizing the public iTunes Search API to discover tracks with audio previews.
6. `faq.html` — Frequently Asked Questions section built with jQuery animations.
7. `signin.html` — Authentication hub featuring user registration, sign-in validation, session display, and sign-out.
8. `contact.html` — User inquiry and song recommendation form with submission feedback.

---

### 2. HTML & CSS (10 Points)
- **Semantic HTML5:** Strict use of `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<table>`, and accessible ARIA attributes.
- **External CSS:** Unified styles in [`css/style.css`](css/style.css).
- **Layouts:** Extensive utilization of CSS Flexbox (navigation, toolbars, contact layout) and CSS Grid (album cards, artist cards, footer).
- **Responsive Design:** Fluid desktop-first media queries (breakpoints at 992px, 768px, and 576px) ensuring clean usability across mobile phones, tablets, and wide monitors.
- **Visual Style:** Modern, Spotify-inspired interface featuring subtle transitions, hover elevations, and customized scrollbars.

---

### 3. JavaScript (20 Points)

#### 🌓 Light / Dark Theme Toggle
- Implemented via dynamic `data-theme` attribute on the root document element.
- The user's selection (`light` or `dark`) is stored in `localStorage` under `wavelist_theme`.
- The theme remains active across page reloads and when navigating between different pages of the website.
- Clean color schemes: dark Spotify theme vs. crisp modern light theme.

#### 🔐 Sign-in & Authentication via `localStorage`
- **Validation:** Validates email formatting and minimum password length (with real-time password strength meter).
- **Persistence:** Non-sensitive user session data (`name`, `email`, `loginDate`) is saved in `localStorage` (`wavelist_user`).
- **Dynamic Interface:** 
  - Unauthenticated users see a **"Sign In"** button in the global navbar.
  - Authenticated users see their profile badge (`👤 [Name]`) and a **"Sign Out"** button across all pages.
- **Sign-Out:** Dedicated button clears session state and immediately reverts the UI to guest mode.

---

### 4. jQuery (10 Points)

#### ❓ FAQ Section with `.slideToggle()`
- Located on [`faq.html`](faq.html) with 6 comprehensive questions tailored to the project topic.
- Smooth slide animation when clicking questions using jQuery `.slideToggle(300)`.
- Dynamic visual indicator (`+` / `−`) that updates in real time to reflect whether an answer is expanded or collapsed.

---

### 5. API Integration (15 Points)

#### 🎵 Public Music API (`fetch()`)
- Integrates the public **iTunes Search API** (`https://itunes.apple.com/search?term=...&entity=song&limit=24`).
- **Data Flow:** Requests data via JavaScript `fetch()`, receives and processes the JSON payload asynchronously.
- **Dynamic Display:** Renders track cards displaying high-resolution artwork, track title, artist name, collection title, genre badge, and a built-in HTML5 `<audio>` player for 30-second audio previews.
- **User Interactions:**
  - Real-time search query form.
  - Quick-pick discovery chips (e.g. *The Weeknd*, *Taylor Swift*, *Daft Punk*, *Billie Eilish*, *Kendrick Lamar*, *Queen*).
  - Client-side genre filtering (Pop, Rock, Hip-Hop, Dance, R&B).
- **Error Handling:** Full try/catch and HTTP status handling with loading spinners, descriptive error alerts, and empty result messages.
- **Deployment Compatibility:** Operates over HTTPS with CORS support, functioning flawlessly on GitHub Pages.

---

## 🤖 AI Usage Policy Acknowledgement (Rule 6)
In strict compliance with **Course Policy Rule 6**, artificial intelligence assistance (Google DeepMind) was used as a supporting development tool for:
1. Refactoring single-page `:target` architecture into a clean multi-page structure.
2. Styling CSS custom properties and dark/light color palette contrasts.
3. Structuring and error-handling the public iTunes API `fetch()` integration.
4. Auditing cross-browser responsiveness and semantic accessibility.

This acknowledgement is also prominently credited in the footer of every page on the deployed website.
