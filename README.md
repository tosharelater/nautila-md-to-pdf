# Nautila — MD to PDF

Markdown → branded PDF converter for **Nautila** (cover, content, closing page).

## Why not GitHub Pages?

GitHub Pages is **free** for public repos, but it only hosts **static** files.  
This app needs a **Node.js server** and **Chromium/Puppeteer** to build PDFs, so Pages cannot run it.

| Host | Free? | Fits this app? |
|------|-------|----------------|
| GitHub Pages | Yes (public) | No — static only |
| This GitHub repo | Yes (public) | Yes — source + Docker |
| VPS / Docker | Depends on provider | Yes — recommended |

## Run locally

```bash
cp .env.example .env.local   # or create ACCESS_KEY=your-secret
npm install
npm run dev
```

Open http://localhost:3000 — login with `ACCESS_KEY`.

## Deploy (Docker)

```bash
docker compose up -d --build
```

Set `ACCESS_KEY` in the environment (never commit secrets).

## Stack

Next.js 15 · Puppeteer · Tailwind · Nautila brand (green / shell logo)
