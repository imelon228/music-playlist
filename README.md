# WaveList - Music Playlist Website

Final Project, Web Technologies (IT-2504), Astana IT University.

## Project topic and objectives
WaveList is a responsive, Spotify-inspired website about music: songs, albums and artists. The goals of the project were:
- build a consistent multi-page website with HTML5, CSS3, JavaScript and jQuery;
- let visitors browse the catalog and manage their own playlist;
- personalize the experience with a saved light / dark theme and a sign-in system;
- connect the site to a real public API to show live music data;
- publish the finished site online with GitHub Pages.

## Group members
- Fariddin
- Aidyn
- Ilyas

## Links
- Deployed website (GitHub Pages): https://imelon228.github.io/music-playlist/
- GitHub repository: https://github.com/imelon228/music-playlist

## Website structure
```
index.html      Home
songs.html      Songs
albums.html     Albums
artists.html    Artists and gallery
api.html        Music API explorer
faq.html        FAQ
signin.html     Sign in / registration / profile
contact.html    Contact form
css/style.css   Single stylesheet for all pages
js/script.js    All JavaScript and jQuery code
images/         Album covers and artist photos
```

| Page | Content |
|---|---|
| Home | Hero section, featured albums, link to the API page, top artists |
| Songs | Playlist table with search, genre filter and add / edit / delete |
| Albums | Album grid with live search and category filter |
| Artists | Artist cards and an image gallery with a lightbox |
| Music API | Live track search powered by the iTunes Search API |
| FAQ | Six questions with sliding answers |
| Sign In | Sign in, registration and profile view |
| Contact | Contact / song suggestion form with validation |

Every page uses the same navigation bar (with the theme toggle and sign-in area) and the same footer, so all links work from every page.

## Implemented features

### HTML & CSS
- Semantic HTML5 elements (`header`, `nav`, `main`, `section`, `footer`) and an external stylesheet
- One design system built with CSS variables (colors, fonts, spacing), Flexbox and CSS Grid, Bootstrap 5 for forms and grid
- Responsive layout for desktop, tablet and mobile (media queries at 992px, 768px and 576px)

### JavaScript
- **Light / dark theme:** the toggle button switches the theme on every page. The choice is saved in `localStorage` (`wavelist_theme`), applied before the page renders and kept after refresh.
- **Sign in:** form with validation (email format, password length, password match, strength meter). The signed-in user is stored in `localStorage` (`wavelist_user`) and stays signed in after refresh. The navbar shows the user's name and a Sign Out button, and signing out clears the saved state.
- **Songs table:** search, genre filter and add / edit / delete, saved in `localStorage`.
- **Albums and gallery:** album search and category filter, lightbox with keyboard and arrow navigation.

### jQuery
- FAQ with 6 questions about the project. Clicking a question opens or closes its answer with `.slideToggle(300)`, and a `+` / `-` indicator shows the current state.

### API integration
- Public API: iTunes Search API (`https://itunes.apple.com/search`), no API key required.
- Data is requested with `fetch()` and parsed as JSON.
- Results are rendered dynamically as track cards (artwork, title, artist, album, genre, 30-second audio preview).
- User interaction: search form, quick-pick artist buttons and a genre filter.
- Error handling: loading state, network and HTTP errors with a retry button, an empty-results message and a live status badge.

## Development process
1. **Planning:** we chose the music topic, agreed on the page list and the shared design (colors, fonts, navigation).
2. **Base version:** we built the first version of the site with the catalog pages, the songs table and the responsive layout.
3. **Restructuring:** the site was split into separate pages with one shared navigation bar, header and footer.
4. **New features:** theme toggle, sign-in with `localStorage`, jQuery FAQ and the iTunes API page were added.
5. **Testing and polishing:** we checked every page in light and dark mode and at different screen sizes, fixed text contrast and spacing issues and tested the API error states.
6. **Deployment:** the project was published with GitHub Pages and the API was checked on the deployed site.

## Individual contributions
| Member | Responsibilities |
|---|---|
| **Fariddin** | HTML structure and navigation for the Home, Songs, FAQ and Contact pages; FAQ accordion with jQuery `.slideToggle()`; songs table (search, filter, add / edit / delete with `localStorage`); contact form handling; README |
| **Aidyn** | CSS design system and responsive layout; light / dark theme toggle and its `localStorage` persistence; Albums and Artists pages with album search / filter and the lightbox gallery; visual polish and testing on different screen sizes |
| **Ilyas** | Sign in and registration with validation and the `localStorage` session; signed-in state and Sign Out in the navbar; Music API page with the iTunes API integration (fetch, rendering, search, filter, error handling); GitHub Pages deployment |

## Screenshots
Screenshots of the main pages (home, songs, albums, artists, music API, FAQ open, sign in, light and dark theme, mobile view) are stored in the `screenshots/` folder and included in the project report.

## AI usage
The project was designed and developed by the team. AI tools were used as a supporting assistant for a small part of the work: debugging, fixing text contrast and heading spacing in the CSS, improving API error handling and drafting this README. The team reviewed all of the code. The use of AI is acknowledged in this README and in the project report.

## Run locally
Use a local server (the Live Server extension in VS Code, or `python -m http.server 8000`) and open `http://localhost:8000`. Opening the HTML files directly from disk can block the API requests.
