# WaveList - Music Playlist Website

Final Project, Web Technologies (IT-2504), Astana IT University.

## Topic
WaveList is a responsive, Spotify-inspired website about music: songs, albums and artists. Visitors can browse the catalog, manage their own playlist, sign in, switch between light and dark themes and discover live tracks through a public music API.

## Group members
- Fariddin
- Aidyn
- Ilyas

## Links
- Deployed website (GitHub Pages): https://imelon228.github.io/music-playlist/
- GitHub repository: https://github.com/imelon228/music-playlist

## Pages
| Page | Description |
|---|---|
| `index.html` | Home: hero section, featured albums, top artists, link to the API page |
| `songs.html` | Playlist table with search, genre filter and add / edit / delete |
| `albums.html` | Album grid with live search and category filter |
| `artists.html` | Artist cards and an image gallery with a lightbox |
| `api.html` | Music API explorer (iTunes Search API) |
| `faq.html` | FAQ accordion |
| `signin.html` | Sign in, registration and profile |
| `contact.html` | Contact / song suggestion form |

All pages share the same header with navigation, theme toggle and sign-in area, and the same footer.

## Implemented features

**HTML & CSS**
- Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `footer`), external stylesheet `css/style.css`
- Flexbox and CSS Grid layouts, Bootstrap 5 for the grid and form components
- Responsive design for desktop, tablet and mobile (media queries at 992px, 768px and 576px)
- One consistent design system built on CSS variables (colors, fonts, spacing)

**JavaScript**
- Light / dark theme toggle. The choice is saved in `localStorage` (`wavelist_theme`), applied before the page renders and kept on every page after a refresh
- Sign in and registration with input validation (email format, password length, password match, strength meter). The signed-in user is saved in `localStorage` (`wavelist_user`) and survives a refresh. Signed-in users see their name and a Sign Out button in the navbar, and Sign Out clears the saved state
- Songs table with search, genre filter and add / edit / delete. Changes are saved in `localStorage`
- Albums search and category filter, image gallery with a lightbox (keyboard and arrow navigation)

**jQuery**
- FAQ with 6 questions about the project. Answers open and close with `.slideToggle(300)` and a `+` / `-` indicator shows the state

**API integration**
- iTunes Search API, called with `fetch()` and parsed as JSON
- Track cards are rendered dynamically: artwork, title, artist, album, genre and a 30-second audio preview
- Interaction: search form, quick-pick artist buttons and a genre filter
- Error handling: loading state, HTTP and network errors with a retry button, an empty-results message and a live API status badge

## Technologies
HTML5, CSS3, JavaScript, jQuery 3.7, Bootstrap 5.3, Google Fonts (Montserrat), iTunes Search API, GitHub Pages.

## Work distribution
| Member | Responsibilities |
|---|---|
| Fariddin | HTML structure and navigation for `index`, `songs`, `faq` and `contact` pages; FAQ accordion with jQuery `.slideToggle()`; songs table (search, filter, add / edit / delete with `localStorage`); contact form handling; README |
| Aidyn | CSS design system and responsive layout; light / dark theme toggle and `localStorage` persistence; `albums` and `artists` pages with album search / filter and the lightbox gallery; visual polish and testing on different screen sizes |
| Ilyas | Sign in, registration, validation and `localStorage` session on `signin.html`; navbar signed-in state and Sign Out; `api.html` with the iTunes API integration (fetch, rendering, search, filter, error handling); GitHub Pages deployment |

## AI usage
The project was designed and written by the team. AI tools were used as a supporting assistant for a limited part of the work: help with debugging, fixing text contrast and heading spacing in the CSS, improving the API status and retry behavior, and drafting this README. The team reviewed and understands all of the code.

## Run locally
Open the folder with a local server (for example the Live Server extension in VS Code, or `python -m http.server 8000`) and visit `http://localhost:8000`. Opening the HTML files directly from disk can block the API requests.
