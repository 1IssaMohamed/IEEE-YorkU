# IEEE YorkU Website — Migration Plan

## Static Site Conversion & Discord Bot Decoupling

> **Purpose:** This document captures the complete plan for converting the IEEE YorkU website
> from a full-stack React + Express application to a static React site deployed on GitHub Pages.
> This migration is driven by the Discord verification system moving to a standalone bot
> (see `ieeebot/BOT_SPECIFICATION.md` for the bot's full spec).

---

## 1. Why This Migration Is Happening

### The Trigger

The Discord invite flow (`POST /api/hardware/request-invite`) — the only dynamic endpoint —
is being replaced by a standalone Discord verification bot. With that endpoint gone, the
Express backend serves **zero dynamic data**. Everything it returns is hardcoded in `data.js`:

| Current Endpoint | What It Returns | Dynamic? |
|---|---|---|
| `GET /api/info` | Hardcoded mission string from `data.js` | No |
| `GET /api/past-events` | Hardcoded events array from `data.js` | No |
| `GET /api/team` | Hardcoded team array from `data.js` | No |
| `GET /api/sponsors` | Hardcoded sponsors array from `data.js` | No |
| `POST /api/hardware/request-invite` | **Moving to Discord bot** | Was the only dynamic one |

Running an Express server to serve static JSON is unjustifiable. The data belongs in the
React frontend as direct imports.

### What We Gain

- **Zero hosting cost** — GitHub Pages is free
- **Zero backend maintenance** — no Express server to keep alive, no SMTP config, no rate limiter to tune
- **Faster page loads** — no API round-trips on mount; data is bundled into the JS
- **Simpler deployment** — `git push` to deploy, no Docker, no VPS for the website
- **Cleaner architecture** — the website does one thing (display club info), the bot does one thing (verify members)

---

## 2. Architectural Decisions

### Decision: Kill the Express Backend

**Rationale:** After removing the Discord invite endpoint, the backend returns only static
data that's already hardcoded in `server/data.js`. There is no database, no user sessions,
no dynamic computation. Every API response is identical regardless of who requests it or when.
This data belongs as frontend imports, not API responses.

### Decision: GitHub Pages (not Vercel)

**Rationale:** Both are free. GitHub Pages is simpler and the team already uses GitHub.
Vercel's extra features (serverless functions, edge middleware) are unnecessary since there's
no backend logic remaining. GitHub Pages provides: free hosting, custom domain support,
auto-deploy from a branch, and HTTPS by default.

### Decision: SimpleAnalytics for Visitor Tracking

**Rationale:** Available free for 1 year via GitHub Student Dev Pack (100k page views/month).
It's a single `<script>` tag — no backend required. Privacy-friendly (no cookies), provides
visitor counts, page views, referrers, and geographic distribution. This was the last
potential reason to keep a backend, and it's solved client-side.

### Decision: Direct Discord Link (not Invite-Gate Modal)

**Rationale:** The `HardwareInviteModal` component and its backend endpoint are being replaced
by the Discord verification bot. The website now simply links to the Discord server with a
permanent invite URL. Verification happens inside Discord, not on the website.

---

## 3. Files to Delete

These files/directories are no longer needed after the migration:

```
server/                          # Entire backend directory
├── .env                         # SMTP creds, Discord bot token (SENSITIVE — ensure not committed)
├── .env.example                 # Template file
├── data.js                      # Data moves to client/src/data/siteData.js
├── index.js                     # Express server — no longer needed
├── package.json                 # Backend dependencies
├── package-lock.json            # Backend lock file
└── node_modules/                # Backend dependencies

client/src/components/HardwareInviteModal.jsx   # Replaced by Discord link
client/src/api/client.js                        # Axios config — no more API calls

Root files that change purpose:
├── package.json                 # Remove server scripts, simplify
└── todo.md                      # Outdated Discord invite plans — archive or clean up
```

> **⚠️ IMPORTANT:** Before deleting `server/.env`, verify it is listed in `.gitignore`.
> It contains real SMTP passwords and a Discord bot token. These credentials are moving
> to the bot's `.env` in the separate bot repository — they should NOT exist in this repo.

---

## 4. Files to Create

### `client/src/data/siteData.js`

This file absorbs the contents of `server/data.js`. The data is identical — just moved
from a backend module to a frontend module.

```javascript
/**
 * IEEE YorkU Website — Static Data
 *
 * All club data previously served by the Express API.
 * Now imported directly by React components.
 */

export const clubMission = "To foster technological innovation, provide professional development opportunities, and build a strong community for engineering and computing students at York University, upholding the core values of IEEE.";

export { pastEvents } from './events.js';    // Or inline here
export { team } from './team.js';            // Or inline here
export { sponsors } from './sponsors.js';    // Or inline here
```

**Implementation note:** You can either put ALL the data in one `siteData.js` file (simpler),
or split into `events.js`, `team.js`, `sponsors.js` for organization. For this amount of data
(~260 lines), a single file is fine.

The data arrays (`pastEvents`, `team`, `sponsors`) are copied verbatim from `server/data.js`.
No transformation needed — the shape is already what the frontend expects.

---

## 5. Files to Modify

### 5.1 `client/src/App.jsx`

**Current behavior:** Fetches data from Express API via Axios on mount, manages loading/error
states, passes data as props to `HomePage`.

**New behavior:** Imports data directly. No loading states needed (data is bundled). No error
states needed (no network calls to fail). Significantly simpler.

#### What to change:

1. **Remove imports:**
   ```diff
   - import api from "./api/client.js";
   + import { clubMission, pastEvents, team, sponsors } from "./data/siteData.js";
   ```

2. **Remove ALL useState for data:**
   ```diff
   - const [pastEvents, setPastEvents] = useState([]);
   - const [team, setTeam] = useState([]);
   - const [sponsors, setSponsors] = useState([]);
   - const [mission, setMission] = useState("");
   - const [sponsorLoading, setSponsorLoading] = useState(true);
   - const [sponsorError, setSponsorError] = useState(null);
   - const [isLoading, setIsLoading] = useState(true);
   - const [error, setError] = useState(null);
   ```

3. **Remove the entire `fetchSponsors` callback and `useEffect` that fetches data:**
   ```diff
   - const fetchSponsors = useCallback(async (signal) => { ... }, []);
   - useEffect(() => { ... fetchData() ... fetchSponsors() ... }, [fetchSponsors]);
   ```

4. **Simplify the `HomePage` props** — remove loading/error/retry props:
   ```diff
     <HomePage
       pastEvents={pastEvents}
       team={team}
       sponsors={sponsors}
   -   sponsorLoading={sponsorLoading}
   -   sponsorError={sponsorError}
   -   onRetrySponsors={handleRetrySponsors}
   -   mission={mission}
   -   isLoading={isLoading}
   -   error={error}
   +   mission={clubMission}
       onNavigate={handleNavigate}
       currentSection={currentSection}
       onSectionInView={handleSectionInView}
       activeGradient={activeGradient}
       modalMessage={modalMessage}
       onCloseModal={handleCloseModal}
     />
   ```

5. **Remove `handleRetrySponsors`** callback — sponsors are now static data.

---

### 5.2 `client/src/pages/Home.jsx`

#### Changes:

1. **Remove HardwareInviteModal import and usage:**
   ```diff
   - import HardwareInviteModal from "../components/HardwareInviteModal.jsx";
   ```

2. **Remove hardware invite modal state:**
   ```diff
   - const [isHardwareInviteModalOpen, setIsHardwareInviteModalOpen] = useState(false);
   ```

3. **Replace "Join Hardware Team" button** with a direct Discord link:
   ```diff
   - <button
   -   type="button"
   -   onClick={() => setIsHardwareInviteModalOpen(true)}
   -   className="group relative inline-flex ..."
   -   aria-haspopup="dialog"
   - >
   -   Join Hardware Team
   -   <svg ...>...</svg>
   - </button>
   + <a
   +   href="https://discord.gg/YOUR_PERMANENT_INVITE"
   +   target="_blank"
   +   rel="noopener noreferrer"
   +   className="group relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-ieee-600 px-8 py-3.5 text-base font-bold text-white transition-[background-color,box-shadow,transform] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98] hover:bg-ieee-700 hover:shadow-lg hover:shadow-ieee-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ieee-600 sm:w-auto"
   + >
   +   Join Hardware Team
   +   <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
   + </a>
   ```

4. **Remove the HardwareInviteModal component from the render tree:**
   ```diff
   - <HardwareInviteModal
   -   isOpen={isHardwareInviteModalOpen}
   -   onClose={() => setIsHardwareInviteModalOpen(false)}
   - />
   ```

5. **Remove loading/error states** — since data is now static, the loading spinner and
   error display blocks can be removed. The content always renders immediately.
   ```diff
   - {isLoading && (
   -   <div className="flex min-h-[60vh] ...">
   -     <LoadingSpinner />
   -   </div>
   - )}
   - {error && !isLoading && (
   -   <div className="flex min-h-[60vh] ...">
   -     <div className="rounded-lg bg-red-50 ...">...</div>
   -   </div>
   - )}
   - {!isLoading && !error && (
   -   <>
          {/* All sections render directly, no conditional */}
   -   </>
   - )}
   ```

6. **Remove sponsor loading/error/retry UI** in the Sponsors section:
   ```diff
   - {sponsorLoading ? (
   -   <LoadingSpinner ... />
   - ) : sponsorError ? (
   -   <div ...>
   -     <button onClick={onRetrySponsors}>Retry</button>
   -   </div>
   - ) : (
       <SponsorRibbon sponsors={sponsors} />
   - )}
   ```

7. **Update PropTypes** — remove `isLoading`, `error`, `sponsorLoading`, `sponsorError`,
   `onRetrySponsors` from both propTypes and defaultProps.

8. **Update footer social links** — replace placeholder URLs with real ones if available:
   ```javascript
   const footerSocialLinks = [
     { label: "Instagram", href: "https://www.instagram.com/ieeeyorku/" },
     { label: "LinkedIn", href: "https://www.linkedin.com/company/ieeeyorku/" },
     { label: "GitHub", href: "https://github.com/YOUR_ORG" }
   ];
   ```

---

### 5.3 `client/src/main.jsx`

No changes needed — this file just renders `<App />` into the DOM.

---

### 5.4 `client/package.json`

Remove `axios` from dependencies:
```diff
  "dependencies": {
-   "axios": "^1.x.x",
    "prop-types": "...",
    "react": "...",
    "react-dom": "..."
  }
```

---

### 5.5 `client/index.html`

Add SimpleAnalytics script tag (for visitor tracking):
```diff
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
+   <!-- SimpleAnalytics — privacy-friendly, no cookies -->
+   <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
+   <noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" referrerpolicy="no-referrer-when-downgrade" /></noscript>
  </body>
```

---

### 5.6 Root `package.json`

The root `package.json` currently orchestrates both client and server. After removing
the server, simplify it or remove it entirely (using only `client/package.json`).

**Option A: Remove root `package.json`** — the project IS the client now. Developers
run `npm run dev` from within `client/`.

**Option B: Keep root as a convenience wrapper** (recommended for easier onboarding):
```json
{
  "name": "ieee-yorku-website",
  "version": "2.0.0",
  "description": "IEEE YorkU student branch website — static React site",
  "private": true,
  "scripts": {
    "install": "npm install --prefix client",
    "dev": "npm run dev --prefix client",
    "build": "npm run build --prefix client",
    "preview": "npm run preview --prefix client"
  }
}
```

---

### 5.7 `.gitignore`

Add/verify these entries:
```gitignore
# Dependencies
node_modules/

# Build output
client/dist/

# Environment files (should already be here)
.env
server/.env

# OS files
.DS_Store
Thumbs.db
```

Remove any server-specific entries that are no longer relevant.

---

### 5.8 `README.md`

Major rewrite needed. The current README describes a full-stack application with Express
backend, security middleware, rate limiting, etc. After migration:

- Remove all references to Express, backend, server directory
- Remove `npm run install-all` (now just `npm install`)
- Update tech stack section (remove Express, Nodemon, CORS, Helmet)
- Update project structure diagram
- Remove security section (Helmet, rate limiting — that's the bot's concern now)
- Update deployment instructions (GitHub Pages, not Vercel)
- Keep: React, Vite, Tailwind, performance optimizations, accessibility notes

---

## 6. GitHub Pages Deployment

### Setup Steps

1. **Build the production bundle:**
   ```bash
   cd client
   npm run build
   ```
   This creates `client/dist/` with the static files.

2. **Configure Vite for GitHub Pages base path:**

   In `client/vite.config.js`, add the `base` option:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: "/IEEE-YorkU/",  // Must match your repo name
     server: {
       port: 3000
       // Remove the proxy config — no backend to proxy to
     }
   });
   ```

   > **Note:** If using a custom domain, set `base: "/"` instead.

3. **Remove the API proxy from `vite.config.js`:**
   ```diff
     server: {
       port: 3000,
   -   proxy: {
   -     "/api": {
   -       target: "http://localhost:5000",
   -       changeOrigin: true
   -     }
   -   }
     }
   ```

4. **Deploy options:**

   **Option A: Manual deploy with `gh-pages` package**
   ```bash
   npm install --save-dev gh-pages
   ```
   Add to `client/package.json`:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```
   Then: `npm run build && npm run deploy`

   **Option B: GitHub Actions (automated on push)**
   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4

         - uses: actions/setup-node@v4
           with:
             node-version: 18

         - name: Install dependencies
           run: npm install
           working-directory: ./client

         - name: Build
           run: npm run build
           working-directory: ./client

         - name: Setup Pages
           uses: actions/configure-pages@v4

         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: ./client/dist

         - name: Deploy to GitHub Pages
           uses: actions/deploy-pages@v4
   ```

5. **Enable GitHub Pages in repo settings:**
   - Go to repo → Settings → Pages
   - Source: GitHub Actions (if using Option B)
   - Or: Deploy from a branch → `gh-pages` branch (if using Option A)

6. **Custom domain (optional):**
   - In repo Settings → Pages → Custom domain → enter your domain
   - Add a CNAME file to `client/public/CNAME` containing your domain
   - Configure DNS at your registrar (Name.com free domain from Student Dev Pack)

### SPA Routing on GitHub Pages

Since this is a single-page app with scroll-based navigation (not React Router), there are
no routing issues. All navigation is handled via `scrollIntoView()` — the URL never changes.
No `404.html` workaround needed.

---

## 7. Components That Can Be Removed Post-Migration

| Component | Status | Reason |
|---|---|---|
| `HardwareInviteModal.jsx` | **DELETE** | Replaced by Discord bot verification |
| `LoadingSpinner.jsx` | **EVALUATE** | Only used for API loading states. If no other use exists, delete. |
| `MessageModal.jsx` | **EVALUATE** | Used for network error messages. May still be useful for other alerts. Keep if used elsewhere. |
| `ErrorBoundary.jsx` | **KEEP** | React error boundary — still valuable for catching render errors |

---

## 8. Image & Asset Considerations

All event images, team member photos, and sponsor logos are served from `client/public/images/`.
This does NOT change — these files deploy to GitHub Pages along with the built JS/CSS.

**No changes needed** for the `public/` directory structure.

However, check total asset size. GitHub Pages has a soft limit of 1GB per repository.
If the `images/` directory is large, consider:
- Compressing images (WebP format)
- Using a CDN for large event photo galleries
- Lazy loading (already implemented via `loading="lazy"` attributes)

---

## 9. Migration Checklist

Execute in this order:

### Phase 1: Create Data Module
- [ ] Copy data from `server/data.js` → `client/src/data/siteData.js`
- [ ] Verify all exports match what `App.jsx` expects

### Phase 2: Rewire App.jsx
- [ ] Remove `api/client.js` import
- [ ] Import data from `data/siteData.js`
- [ ] Remove all `useState` for fetched data
- [ ] Remove `fetchSponsors`, `fetchData`, and the `useEffect`
- [ ] Remove `handleRetrySponsors`
- [ ] Simplify `HomePage` props (remove loading/error/retry props)

### Phase 3: Rewire Home.jsx
- [ ] Remove `HardwareInviteModal` import
- [ ] Remove `isHardwareInviteModalOpen` state
- [ ] Replace "Join Hardware Team" button with `<a>` to Discord
- [ ] Remove `<HardwareInviteModal>` from render tree
- [ ] Remove loading/error conditional wrappers around content
- [ ] Remove sponsor loading/error/retry UI
- [ ] Update PropTypes and defaultProps
- [ ] Update footer social links with real URLs

### Phase 4: Clean Up Dependencies
- [ ] Remove `axios` from `client/package.json`
- [ ] Run `npm install` in `client/` to update lock file
- [ ] Delete `client/src/api/client.js`
- [ ] Delete `client/src/components/HardwareInviteModal.jsx`

### Phase 5: Vite Config
- [ ] Remove API proxy from `vite.config.js`
- [ ] Add `base: "/IEEE-YorkU/"` (or `"/"` if custom domain)

### Phase 6: Analytics
- [ ] Sign up for SimpleAnalytics via GitHub Student Dev Pack
- [ ] Add script tag to `client/index.html`

### Phase 7: Delete Server
- [ ] Verify `server/.env` is in `.gitignore` and was NEVER committed
- [ ] Delete `server/` directory entirely
- [ ] Simplify root `package.json`
- [ ] Remove `concurrently` from root devDependencies

### Phase 8: Deploy
- [ ] Build production bundle: `cd client && npm run build`
- [ ] Test locally: `npm run preview`
- [ ] Set up GitHub Pages (Actions or gh-pages package)
- [ ] Verify live site works

### Phase 9: Documentation
- [ ] Rewrite `README.md` for static site architecture
- [ ] Archive or delete `todo.md` (outdated Discord invite plans)
- [ ] Update `CLAUDE.md` if needed

---

## 10. What Stays the Same

These parts of the website are **not changing**:

- **All visual design** — sections, layout, animations, typography, colors
- **All components** (except HardwareInviteModal): Header, HeroSection, PastEventsCarousel, SponsorRibbon, TeamCard, ErrorBoundary
- **Tailwind configuration** — `tailwind.config.js` unchanged
- **CSS animations** — `index.css` unchanged
- **Images and assets** — `public/` directory unchanged
- **Scroll-spy navigation** — IntersectionObserver logic unchanged
- **Section gradient backgrounds** — `SECTION_GRADIENTS` in App.jsx unchanged
- **Mobile responsiveness** — all responsive classes unchanged
- **Accessibility** — ARIA labels, semantic HTML, focus management unchanged
- **SEO meta tags** — `index.html` head content unchanged
- **Google Fonts** — Sora + Manrope imports unchanged

The website looks and behaves **identically** to the user. The only visible change is
the "Join Hardware Team" button now opens Discord directly instead of showing a modal.

---

## 11. Relationship to the Discord Bot

The website and bot are **fully decoupled**:

| Concern | Website | Bot |
|---|---|---|
| Repository | `IEEE-YorkU` (this repo) | New separate repo (`ieee-hardware-bot` or similar) |
| Runtime | Static files (no server) | Long-running Node.js process |
| Hosting | GitHub Pages (free) | DigitalOcean VPS ($200 credit) |
| Shared code | None | None |
| Connection | Website has a `<a href>` to Discord invite | Bot runs inside that Discord server |

The only touchpoint: the permanent Discord invite URL in the website's "Join Hardware Team"
link. If the Discord invite URL changes, update one `href` in `Home.jsx`.

For the bot's full specification, see: `ieeebot/BOT_SPECIFICATION.md`
For the bot's decision rationale, see: `ieeebot/DECISION_LOG.md`
