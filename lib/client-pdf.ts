/**
 * Client-side PDF export for GitHub Pages.
 * Recreates the original Puppeteer 3-PDF merge as closely as the browser allows:
 *   cover (margin 0) → content (24mm header + 30px footer) → end (margin 0)
 */
import { marked } from 'marked'
import {
  getCoverTemplate,
  getContentTemplate,
  getEndTemplate,
  getPrintContentHeader,
  getPrintContentFooter,
} from './pdf-template'
import type { MetaField } from './types'

export interface ExportInput {
  markdown: string
  title: string
  subtitle: string
  meta: Record<string, MetaField>
}

function basePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH || ''
}

function bodyOf(html: string): string {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  return m ? m[1] : html
}

function styleOf(html: string): string {
  const m = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
  return m ? m[1] : ''
}

/** Embed logo as data-URL so print never depends on network (same as old getLogoDataUrl). */
async function logoDataUrl(): Promise<string | null> {
  try {
    const url = `${window.location.origin}${basePath()}/logo.svg`
    const res = await fetch(url)
    if (!res.ok) return null
    const text = await res.text()
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(text)))}`
  } catch {
    return null
  }
}

/** Build one printable HTML document matching the original pulled layout. */
export async function buildPrintableHtml(input: ExportInput): Promise<string> {
  const rawHtml = await marked.parse(input.markdown, { gfm: true, breaks: false })
  const documentTitle = input.title?.trim() || 'Document'
  const logoSrc = await logoDataUrl()

  const opts = {
    title: documentTitle,
    subtitle: input.subtitle?.trim() || '',
    logoSrc,
    meta: input.meta,
  }

  const cover = getCoverTemplate(opts)
  const content = getContentTemplate(rawHtml, opts)
  const end = getEndTemplate(opts)

  /* Pull only the markdown body (strip the outer padding wrapper — we control pad here). */
  let contentInner = bodyOf(content)
  const padWrap = contentInner.match(/^<div style="padding:0 60px;">([\s\S]*)<\/div>$/)
  if (padWrap) contentInner = padWrap[1]

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>${documentTitle.replace(/</g, '')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    /* ---- from original templates (cover / content / end) ---- */
    ${styleOf(cover)}
    ${styleOf(content)}
    ${styleOf(end)}

    /* ---- print shell: recreate Puppeteer page.pdf options ---- */
    @page { size: A4; margin: 0; }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 210mm;
      background: #fff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .page-cover,
    .page-end {
      width: 210mm;
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .page-cover .cover,
    .page-end .end {
      width: 210mm !important;
      height: 297mm !important;
      max-height: 297mm !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /*
     * Content pages — table thead/tfoot = Puppeteer displayHeaderFooter
     * Puppeteer margins were: top 25mm, bottom 10mm, left/right 0
     * Content HTML itself used padding: 0 60px
     */
    .content-table {
      width: 210mm;
      border-collapse: collapse;
      table-layout: fixed;
      page-break-after: always;
      break-after: page;
      background: #fafaf7;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .content-table thead { display: table-header-group; }
    .content-table tfoot { display: table-footer-group; }
    .content-table thead td,
    .content-table tfoot td,
    .content-table tbody td {
      padding: 0 !important;
      margin: 0 !important;
      border: 0 !important;
      vertical-align: top;
    }
    .content-table tbody td {
      background: #fafaf7;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .content-table .md-body {
      padding: 8px 60px 12px;
      box-sizing: border-box;
      background: #fafaf7;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    /* first content heading shouldn't leave a huge gap under the header */
    .content-table .md-body > h1:first-child,
    .content-table .md-body > h2:first-child {
      margin-top: 8px;
    }

    @media print {
      html, body { width: 210mm; }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <section class="page-cover">${bodyOf(cover)}</section>

  <table class="content-table">
    <thead>
      <tr><td>${getPrintContentHeader(documentTitle)}</td></tr>
    </thead>
    <tfoot>
      <tr><td>${getPrintContentFooter()}</td></tr>
    </tfoot>
    <tbody>
      <tr><td><div class="md-body">${contentInner}</div></td></tr>
    </tbody>
  </table>

  <section class="page-end">${bodyOf(end)}</section>
</body>
</html>`
}

/**
 * Prints via a same-origin iframe (no popup). Closest static stand-in for Puppeteer.
 * In the print dialog: Margins = None, and enable Background graphics.
 */
export async function exportPdfViaPrint(input: ExportInput): Promise<void> {
  const html = await buildPrintableHtml(input)

  const iframe = document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.setAttribute('title', 'PDF print')
  Object.assign(iframe.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '210mm',
    height: '297mm',
    border: '0',
    opacity: '0',
    pointerEvents: 'none',
    zIndex: '-1',
  })
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument
  const win = iframe.contentWindow
  if (!doc || !win) {
    iframe.remove()
    throw new Error('Could not prepare the print view. Try again.')
  }

  doc.open()
  doc.write(html)
  doc.close()

  /* Wait for fonts + images (logo data-URL + Google Fonts) like Puppeteer networkidle */
  await new Promise<void>((resolve) => {
    const finish = () => resolve()
    const waitFonts = doc.fonts?.ready?.then(() => undefined).catch(() => undefined) ?? Promise.resolve()
    const imgs = Array.from(doc.images || [])
    const waitImgs = Promise.all(
      imgs.map(
        (img) =>
          new Promise<void>((r) => {
            if (img.complete) r()
            else {
              img.addEventListener('load', () => r())
              img.addEventListener('error', () => r())
            }
          })
      )
    )
    Promise.all([waitFonts, waitImgs]).then(() => setTimeout(finish, 300))
    setTimeout(finish, 3000)
  })

  const cleanup = () => {
    try {
      iframe.remove()
    } catch {
      /* ignore */
    }
  }
  win.addEventListener('afterprint', cleanup)
  setTimeout(cleanup, 120_000)

  win.focus()
  win.print()
}

const HISTORY_KEY = 'nautila-md-to-pdf-history'
const MAX_HISTORY = 40

export function loadHistory(): import('./types').HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveHistoryEntry(entry: Omit<import('./types').HistoryEntry, 'id' | 'createdAt'> & Partial<Pick<import('./types').HistoryEntry, 'id' | 'createdAt'>>) {
  const list = loadHistory()
  const full: import('./types').HistoryEntry = {
    id: entry.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: entry.createdAt || new Date().toISOString(),
    title: entry.title,
    subtitle: entry.subtitle,
    markdown: entry.markdown,
    meta: entry.meta,
  }
  const next = [full, ...list.filter((e) => e.id !== full.id)].slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  return full
}

export function deleteHistoryEntry(id: string) {
  const next = loadHistory().filter((e) => e.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
}
