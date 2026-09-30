# Nautila — MD to PDF

Static Markdown → branded PDF tool for **Nautila**.  
Runs entirely in the browser and deploys on **GitHub Pages** (free).

**Live:** https://tosharelater.github.io/nautila-md-to-pdf/

## How PDF export works

GitHub Pages cannot run Puppeteer/servers. Export opens a print window — choose **Save as PDF** in the browser dialog. Cover, content, and closing pages use the Nautila brand template.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000/nautila-md-to-pdf/  
(base path matches GitHub Pages)

```bash
npm run build   # outputs static site to /out
```

## Deploy

Push to `main` — GitHub Actions builds and publishes Pages automatically.

Repo settings → Pages → Source: **GitHub Actions**.

## Optional access gate

Set `NEXT_PUBLIC_ACCESS_KEY` in the Actions build env if you want a soft client-side login.  
Leave unset for a fully public editor (default).

## Stack

Next.js 15 (static export) · marked · react-markdown · Nautila brand
