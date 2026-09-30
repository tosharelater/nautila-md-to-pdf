/**
 * Client-side PDF export for GitHub Pages (no Puppeteer / no server).
 * Renders Nautila-branded HTML and prints it to a downloadable PDF via the browser.
 */
import { marked } from 'marked'
import {
  getCoverTemplate,
  getContentTemplate,
  getEndTemplate,
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

/** Build one printable HTML document (cover + content + end). */
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

  /* Strip outer html shells and compose a single print document */
  const bodyOf = (html: string) => {
    const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
    return m ? m[1] : html
  }
  const styleOf = (html: string) => {
    const m = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
    return m ? m[1] : ''
  }

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
    html, body { margin: 0; padding: 0; background: #fff; }
    .print-section { page-break-after: always; break-after: page; }
    .print-section:last-child { page-break-after: auto; break-after: auto; }
    @media print {
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="print-section">${bodyOf(cover)}</div>
  <div class="print-section" style="padding:18mm 0 20mm;">${bodyOf(content)}</div>
  <div class="print-section">${bodyOf(end)}</div>
</body>
</html>`
}

/**
 * Opens a print window so the user can "Save as PDF".
 * This is the reliable static-hosting approach (GitHub Pages compatible).
 */
export async function exportPdfViaPrint(input: ExportInput): Promise<void> {
  const html = await buildPrintableHtml(input)
  const w = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700')
  if (!w) {
    throw new Error('Pop-up blocked. Allow pop-ups for this site, then try again.')
  }
  w.document.open()
  w.document.write(html)
  w.document.close()
  /* Wait for fonts/images, then print */
  await new Promise<void>((resolve) => {
    const done = () => resolve()
    if (w.document.readyState === 'complete') setTimeout(done, 400)
    else w.addEventListener('load', () => setTimeout(done, 400))
  })
  w.focus()
  w.print()
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
