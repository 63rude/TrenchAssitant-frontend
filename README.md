# TrenchAssistant website

This is the frontend I built for TrenchAssistant, my first software project. I kept it as a portfolio snapshot of the original site and wallet analysis flow. The hosted service is no longer active. To try the interactive parts, run the companion Python backend locally with your own API credentials.

The site is plain HTML, CSS, and JavaScript, built with Vite. It loads page sections from `components/`, starts a wallet analysis through the backend, polls the session, and displays logs and results. `litepaper.html` preserves the original proposal as an archive; its roadmap and token plans are historical.

## Run locally

Install Node.js 20.19–20.x or 22.12+, then from this repository's root:

```powershell
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/`. The page itself works without the backend, but the analysis buttons need it. Follow the setup in the companion `TrenchAssistant---python` repository and start its FastAPI server on `http://127.0.0.1:8000`. Vite proxies the four analysis endpoints to that address during local development.

To check the distributable site:

```powershell
npm run build
npm run preview
```

The build includes both `index.html` and `litepaper.html`, plus the HTML components and images they load at runtime. The preview server uses the same local API proxy.

For a separately hosted backend, set `VITE_API_BASE_URL` to its public origin before building. Copy `.env.example` to `.env.local` and set the value there, or set the environment variable in your shell. That address becomes part of the browser bundle, so it must be a public URL, never a secret. The backend must also permit the website's origin in its CORS configuration. Leave the value blank for local use through Vite's proxy.

## Repository layout

- `index.html` and `litepaper.html`: the two pages.
- `components/`: page sections loaded by the browser.
- `scripts/`: session requests, polling, results, and component loading.
- `styles/` and `assets/`: the original visual design and images.
- `vite.config.js`: local API proxy and build setup.

This was an early prototype. Its wallet figures depend on the companion backend and third-party data, and the original plans shown in the litepaper were not implemented as part of this site.
