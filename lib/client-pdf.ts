/**
 * Client-side PDF export for GitHub Pages (no Puppeteer / no server).
 * Layout mirrors the original 3-PDF merge:
 *   cover (full bleed) → content (repeating header/footer) → end (full bleed)
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

function logoUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${basePath()}/logo.svg`
  }
  return `${basePath()}/logo.svg`
}

function bodyOf(html: string): string {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  return m ? m[1] : html
}

function styleOf(html: string): string {
  const m = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
  return m ? m[1] : ''
}

/** Build one printable HTML document matching the original Puppeteer layout. */
export async function buildPrintableHtml(input: ExportInput): Promise<string> {
  const rawHtml = await marked.parse(input.markdown, { gfm: true, breaks: false })
  const documentTitle = input.title?.trim() || 'Document'
  const opts = {
    title: documentTitle,
    subtitle: input.subtitle?.trim() || '',
    logoSrc: logoUrl(),
    meta: input.meta,
  }

  const cover = getCoverTemplate(opts)
  const content = getContentTemplate(rawHtml, opts)
  const end = getEndTemplate(opts)

  /*
   * Content chrome uses a table thead/tfoot so the header & footer repeat on
   * content pages only (Chrome-friendly). Cover/end stay outside that table —
   * same structure as the old cover PDF + content PDF + end PDF merge.
   */
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>${documentTitle.replace(/</g, '')}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>
    ${styleOf(cover)}
    ${styleOf(content)}
    ${styleOf(end)}

    @page { size: A4; margin: 0; }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page-cover,
    .page-end {
      page-break-after: always;
      break-after: page;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .page-cover .cover,
    .page-end .end {
      width: 210mm;
      height: 297mm;
      max-height: 297mm;
      overflow: hidden;
      box-sizing: border-box;
    }

    /* Content block — header/footer via table groups (Puppeteer displayHeaderFooter equivalent) */
    .content-table {
      width: 100%;
      border-collapse: collapse;
      page-break-after: always;
      break-after: page;
    }
    .content-table thead { display: table-header-group; }
    .content-table tfoot { display: table-footer-group; }
    .content-table thead td,
    .content-table tfoot td,
    .content-table tbody td {
      padding: 0;
      margin: 0;
      border: 0;
      vertical-align: top;
    }
    /* Match Puppeteer content margins: top ~25mm (header), bottom ~10mm (footer), sides via inner pad */
    .content-table tbody td {
      background: #F2EFE6;
    }
    .content-table .md-pad {
      /* Horizontal pad already on content template (60px); vertical clears header/footer */
      padding: 4mm 0 2mm;
      box-sizing: border-box;
    }

    @media print {
      .no-print { display: none !important; }
      .page-cover .cover,
      .page-end .end {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
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
      <tr><td><div class="md-pad">${bodyOf(content)}</div></td></tr>
    </tbody>
  </table>

  <section class="page-end">${bodyOf(end)}</section>
</body>
</html>`
}

/**
 * Prints via a hidden same-origin iframe (no window.open → no popup blocker).
 * User picks “Save as PDF” in the browser print dialog.
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

  await new Promise<void>((resolve) => {
    const finish = () => resolve()
    const imgs = Array.from(doc.images || [])
    if (!imgs.length) {
      setTimeout(finish, 450)
      return
    }
    let pending = imgs.length
    const tick = () => {
      pending -= 1
      if (pending <= 0) setTimeout(finish, 200)
    }
    imgs.forEach((img) => {
      if (img.complete) tick()
      else {
        img.addEventListener('load', tick)
        img.addEventListener('error', tick)
      }
    })
    setTimeout(finish, 2500)
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
