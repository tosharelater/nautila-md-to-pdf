/* ─────────────────────────────────────────────────────────────────────────────
   PDF Template — Nautila brand
   Palette Atlantique: ink #14333B · teal #2E7D8C · écume #63A6A0 · paper #F2EFE6
   ───────────────────────────────────────────────────────────────────────────── */

export type { MetaField, TemplateOptions } from './types'
import type { MetaField, TemplateOptions } from './types'

const INK = '#14333B'
const GREEN = '#2E7D8C'
const SAGE = '#2E7D8C'
const MINT = '#63A6A0'
const PAPER = '#F2EFE6'
const SURFACE = '#E8E4D6'
const TEXT = '#14333B'
const MUTED = '#556f75'
const CREAM = '#F2EFE6'

// ── CSS logo fallback (shell + wordmark) ─────────────────────────────────────
function logoHtml(src: string | null | undefined, variant: 'white' | 'dark', sizePx = 46): string {
  const textColor = variant === 'white' ? CREAM : TEXT
  const shell = variant === 'white' ? MINT : GREEN
  const dot = variant === 'white' ? MINT : SAGE

    if (src) {
    /* Prefer serving the SVG as-is on both variants */
    return `<img src="${src}" alt="Nautila" style="height:${sizePx}px;max-width:400px;object-fit:contain;display:block;" />`
  }

  const shellPath =
    'M42 6 A36 36 0 0 1 6 42 A22.25 22.25 0 0 1 -16.25 19.75 A13.75 13.75 0 0 1 -2.5 6 A8.5 8.5 0 0 1 6 14.5 A5.25 5.25 0 0 1 0.75 19.75'

  return `
    <div style="display:flex;align-items:center;gap:14px;">
      <svg width="${Math.round(sizePx * 0.85)}" height="${Math.round(sizePx * 0.85)}" viewBox="-20 -2 80 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="${shellPath}" stroke="${shell}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <div style="display:flex;align-items:baseline;gap:6px;">
        <span style="font-family:'Inter',Arial,sans-serif;font-weight:700;font-size:${Math.round(sizePx * 0.42)}pt;color:${textColor};letter-spacing:-0.02em;line-height:1;">Nautila</span>
        <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${dot};"></span>
      </div>
    </div>`
}

// ── Contact items (shared by cover + end page) ───────────────────────────────
const CONTACT_ITEMS = `
  <div style="display:flex;flex-direction:column;gap:5px;">
    <div style="display:flex;align-items:center;gap:8px;font-size:9pt;color:${MUTED};">
      <span style="color:${SAGE};width:14px;text-align:center;flex-shrink:0;">✆</span><span>+33 1 84 80 00 00</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;font-size:9pt;color:${MUTED};">
      <span style="color:${SAGE};width:14px;text-align:center;flex-shrink:0;">⊕</span><span>www.nautila.com</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;font-size:9pt;color:${MUTED};">
      <span style="color:${SAGE};width:14px;text-align:center;flex-shrink:0;">✉</span><span>hello@nautila.com</span>
    </div>
    <div style="display:flex;align-items:center;gap:8px;font-size:9pt;color:${MUTED};">
      <span style="color:${SAGE};width:14px;text-align:center;flex-shrink:0;">◎</span><span>Paris · Europe</span>
    </div>
  </div>`

// ── Common CSS resets ────────────────────────────────────────────────────────
const BASE_STYLE = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    font-family: 'Inter', Arial, sans-serif;
    font-size: 11pt;
    color: ${TEXT};
    background: transparent;
    width: 100%;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  @page { size: A4; }
`

function htmlShell(style: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <style>${style}</style>
</head>
<body>${body}</body>
</html>`
}

// ════════════════════════════════════════════════════════════════════════════
//  1. COVER PAGE TEMPLATE
// ════════════════════════════════════════════════════════════════════════════
export function getCoverTemplate(opts: TemplateOptions = {}): string {
  const { title = 'Document', subtitle = '', logoSrc = null, meta = {} } = opts

  const safeTitleUp = escapeHtml(title.toUpperCase())
  const safeSubtitle = escapeHtml(subtitle.toUpperCase())

  const metaRows = [meta.date, meta.prestataire, meta.version]
    .filter((f): f is MetaField => !!f && f.enabled)
    .map(
      (f) => `
        <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:7px;">
          <span style="font-weight:700;color:${MINT};font-size:10.5pt;min-width:110px;flex-shrink:0;">${escapeHtml(f.label)}</span>
          <span style="color:${CREAM};font-size:10.5pt;">${escapeHtml(f.value)}</span>
        </div>`
    )
    .join('')

  const style = `
    ${BASE_STYLE}
    @page { size: A4; margin: 0; }
    body { background-color: ${INK}; }
    .cover {
      width: 210mm; height: 297mm;
      background: linear-gradient(165deg, #0f2a30 0%, ${INK} 50%, #1a4048 100%);
      display: flex; flex-direction: column;
      overflow: hidden;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
  `

  const body = `
  <div class="cover">
    <div style="padding:13mm 16mm 0;flex-shrink:0;">
      ${logoHtml(logoSrc, 'white', 64)}
    </div>

    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 16mm;">
      <div style="font-size:36pt;font-weight:800;color:${CREAM};line-height:1.05;text-transform:uppercase;letter-spacing:-0.02em;margin-bottom:10px;word-break:break-word;">
        ${safeTitleUp}
      </div>

      ${
        safeSubtitle
          ? `<div style="background-color:${SAGE};padding:7px 6mm;margin-bottom:22px;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
               <span style="font-size:18pt;font-weight:800;color:${CREAM};text-transform:uppercase;letter-spacing:-0.01em;">${safeSubtitle}</span>
             </div>`
          : `<div style="width:100%;height:7px;background:linear-gradient(90deg,${GREEN},${MINT});margin-bottom:24px;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>`
      }

      ${metaRows ? `<div style="display:flex;flex-direction:column;">${metaRows}</div>` : ''}
    </div>

    <div style="background-color:${PAPER};padding:9mm 16mm 7mm;flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
      <div style="font-size:14pt;font-weight:700;color:${GREEN};font-style:italic;margin-bottom:10px;">Contactez-nous :</div>
      ${CONTACT_ITEMS}
    </div>
    <div style="height:8px;background:linear-gradient(90deg,${GREEN},${MINT});flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>
  </div>`

  return htmlShell(style, body)
}

// ════════════════════════════════════════════════════════════════════════════
//  2. CONTENT PAGES TEMPLATE
// ════════════════════════════════════════════════════════════════════════════
export function getContentTemplate(htmlContent: string, opts: TemplateOptions = {}): string {
  const { title = 'Document' } = opts
  void title

  const style = `
    ${BASE_STYLE}
    body { margin: 0; padding: 0; background: ${PAPER}; }
    h1 {
      font-size: 22pt; font-weight: 700; color: ${GREEN};
      margin-bottom: 20px; margin-top: 24px;
      line-height: 1.25; page-break-after: avoid; break-after: avoid;
    }
    h2 {
      font-size: 15pt; font-weight: 700; color: ${SAGE};
      margin-top: 2em; margin-bottom: 10px; line-height: 1.3;
      page-break-after: avoid; break-after: avoid;
    }
    h3 {
      font-size: 12pt; font-weight: 600; color: ${SAGE};
      font-style: italic; margin-top: 1.5em; margin-bottom: 8px;
      line-height: 1.35; page-break-after: avoid; break-after: avoid;
    }
    h4 { font-size: 11pt; font-weight: 700; color: ${GREEN}; margin-top: 1.2em; margin-bottom: 6px; page-break-after: avoid; break-after: avoid; }
    h5, h6 { font-size: 10.5pt; font-weight: 600; color: ${SAGE}; margin-top: 1em; margin-bottom: 4px; page-break-after: avoid; break-after: avoid; }

    p { line-height: 1.7; color: ${MUTED}; margin-bottom: 12px; orphans: 3; widows: 3; }
    strong, b { font-weight: 700; color: ${TEXT}; }
    em, i { font-style: italic; color: ${MUTED}; }
    a { color: ${GREEN}; text-decoration: underline; }

    ul { list-style: none; padding-left: 20px; margin: 10px 0 12px; }
    ul li { position: relative; padding-left: 16px; margin-bottom: 6px; line-height: 1.65; color: ${MUTED}; orphans: 3; widows: 3; }
    ul li::before { content: '●'; position: absolute; left: 0; color: ${SAGE}; font-size: 9pt; top: 1px; }
    ul ul li::before { content: '○'; color: ${MINT}; }
    ol { list-style: decimal; padding-left: 24px; margin: 10px 0 12px; }
    ol li { margin-bottom: 6px; line-height: 1.65; color: ${MUTED}; padding-left: 4px; orphans: 3; widows: 3; }
    ol li::marker { color: ${SAGE}; font-weight: 700; }

    table { width: 100%; border-collapse: collapse; margin: 16px 0 20px; font-size: 10pt; }
    thead tr { background-color: ${INK}; color: ${CREAM}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    thead th { padding: 9px 12px; text-align: left; font-weight: 600; letter-spacing: 0.02em; border: 1px solid ${GREEN}; }
    tbody tr:nth-child(odd) { background-color: ${SURFACE}; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    tbody tr:nth-child(even) { background-color: #ffffff; }
    tbody td { padding: 8px 12px; border: 1px solid #d4cfc0; line-height: 1.5; color: ${MUTED}; vertical-align: top; }

    pre { background-color: ${SURFACE}; border-left: 4px solid ${SAGE}; padding: 14px 16px; margin: 14px 0 18px; border-radius: 0 4px 4px 0; overflow-x: auto; page-break-inside: avoid; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    pre code { font-family: 'Courier New', Courier, monospace; font-size: 9.5pt; color: ${TEXT}; background: none; padding: 0; line-height: 1.55; }
    code { font-family: 'Courier New', Courier, monospace; font-size: 9.5pt; background-color: ${SURFACE}; padding: 2px 5px; border-radius: 3px; color: ${GREEN}; }

    blockquote { border-left: 4px solid ${MINT}; margin: 14px 0; padding: 10px 16px; background-color: ${SURFACE}; border-radius: 0 4px 4px 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    blockquote p { color: ${MUTED}; font-style: italic; margin-bottom: 0; }

    hr { border: none; border-top: 2px solid ${SAGE}; margin: 24px 0; opacity: 0.45; }
    img { max-width: 100%; height: auto; border-radius: 4px; margin: 10px 0; }
    li { orphans: 3; widows: 3; }
  `

  const body = `<div style="padding:0 60px;">${htmlContent}</div>`

  return htmlShell(style, body)
}

// ════════════════════════════════════════════════════════════════════════════
//  3. END PAGE TEMPLATE
// ════════════════════════════════════════════════════════════════════════════
export function getEndTemplate(opts: TemplateOptions = {}): string {
  const { logoSrc = null } = opts

  const style = `
    ${BASE_STYLE}
    body { background-color: ${INK}; }
    .end {
      width: 210mm; height: 297mm;
      background: linear-gradient(165deg, #0f2a30 0%, ${INK} 50%, #1a4048 100%);
      display: flex; flex-direction: column;
      overflow: hidden;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
  `

  const body = `
  <div class="end">
    <div style="padding:10mm 16mm 0;flex-shrink:0;">
      ${logoHtml(logoSrc, 'white', 56)}
    </div>

    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;padding:0 16mm 8mm;">
      <div style="font-size:54pt;font-weight:300;color:${CREAM};line-height:1;text-align:right;">Merci</div>
      <div style="background-color:${SAGE};display:block;width:100%;text-align:right;padding:5px 6mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
        <span style="font-size:36pt;font-weight:800;color:${CREAM};line-height:1.15;">Pour Votre</span>
      </div>
      <div style="font-size:46pt;font-weight:800;color:${CREAM};line-height:1.1;text-align:right;">Attention</div>
      <div style="width:80px;height:6px;background:linear-gradient(90deg,${GREEN},${MINT});margin-top:14px;align-self:flex-end;border-radius:2px;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>
    </div>

    <div style="background-color:${PAPER};padding:9mm 16mm 7mm;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
      <div style="flex:1;">
        <div style="font-size:14pt;font-weight:700;color:${GREEN};font-style:italic;margin-bottom:10px;">Contactez-nous :</div>
        ${CONTACT_ITEMS}
      </div>
    </div>
    <div style="height:8px;background:linear-gradient(90deg,${GREEN},${MINT});flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>
  </div>`

  return htmlShell(style, body)
}

// ════════════════════════════════════════════════════════════════════════════
//  HEADER TEMPLATE (Puppeteer displayHeaderFooter)
// ════════════════════════════════════════════════════════════════════════════
export function getHeaderTemplate(title: string): string {
  const safe = escapeHtml(title)

  return `<style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body { margin:0 !important; padding:0 !important; width:100%; height:100%; }
  </style>
  <div style="width:calc(100% + 10mm);margin-left:-5mm;margin-top:-10mm;height:24mm;box-sizing:border-box;background-color:${GREEN};display:flex;align-items:flex-end;justify-content:space-between;padding:0 21mm 4mm 21mm;font-family:'Inter',Arial,sans-serif;-webkit-print-color-adjust:exact;color:${CREAM};font-size:9pt;">
    <span style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:70%;">${safe}</span>
    <span style="font-weight:700;"><span class="pageNumber"></span> / <span class="totalPages"></span></span>
  </div>`
}

// ════════════════════════════════════════════════════════════════════════════
//  FOOTER TEMPLATE
// ════════════════════════════════════════════════════════════════════════════
export function getFooterTemplate(): string {
  return `<style>
    * { margin:0; padding:0; box-sizing:border-box; }
  html, body { margin:0 !important; padding:0 !important; width:100%; height:100%; display:flex; flex-direction:column; justify-content:flex-end; overflow:visible; }
  </style>
<div style="width:100%;height:30px;background-color:${SAGE};display:flex;align-items:center;justify-content:center;transform:translateY(6mm);-webkit-print-color-adjust:exact;print-color-adjust:exact;">
  <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:#fff;letter-spacing:0.5px;line-height:30px;">Nautila — Document confidentiel</span>
  </div>`
}

/** Browser-print header (table thead) — mirrors Puppeteer headerTemplate */
export function getPrintContentHeader(title: string): string {
  const safe = escapeHtml(title)
  return `<div style="width:100%;height:18mm;box-sizing:border-box;background-color:${GREEN};display:flex;align-items:flex-end;justify-content:space-between;padding:0 16mm 3.5mm 16mm;font-family:'Inter',Arial,sans-serif;color:${CREAM};font-size:9pt;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
    <span style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;">${safe}</span>
  </div>`
}

/** Browser-print footer (table tfoot) — mirrors Puppeteer footerTemplate */
export function getPrintContentFooter(): string {
  return `<div style="width:100%;height:9mm;box-sizing:border-box;background-color:${SAGE};display:flex;align-items:center;justify-content:center;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
    <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:#fff;letter-spacing:0.5px;">Nautila — Document confidentiel</span>
  </div>`
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
