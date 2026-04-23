/* ─────────────────────────────────────────────────────────────────────────────
   PDF Template — Astral Digital brand
   Three separate HTML generators for 3-PDF merge approach.
   ───────────────────────────────────────────────────────────────────────────── */

   export type { MetaField, TemplateOptions } from './types'
   import type { MetaField, TemplateOptions } from './types'
   
   // ── CSS logo fallback (white, used on navy backgrounds) ─────────────────────
   function logoHtml(src: string | null | undefined, variant: 'white' | 'dark', sizePx = 46): string {
     const textColor = variant === 'white' ? '#ffffff' : '#0f355a'
     const subColor  = variant === 'white' ? 'rgba(255,255,255,0.6)' : 'rgba(27,47,94,0.55)'
     const lineColor = variant === 'white' ? 'rgba(255,255,255,0.28)' : 'rgba(27,47,94,0.28)'
     const triColor  = variant === 'white' ? 'rgba(255,255,255,0.9)' : '#0f355a'
   
     if (src) {
       const filter = variant === 'dark' ? 'filter:brightness(0) saturate(100%);' : ''
       return `<img src="${src}" alt="Astral Digital" style="height:${sizePx}px;max-width:400px;object-fit:contain;display:block;${filter}" />`
     }
   
     return `
       <div style="display:flex;align-items:center;gap:10px;">
         <div style="width:0;height:0;border-left:11px solid transparent;border-right:11px solid transparent;border-bottom:20px solid ${triColor};"></div>
         <span style="font-family:'Inter',Arial,sans-serif;font-weight:900;font-size:20pt;color:${textColor};letter-spacing:2.5px;line-height:1;">ASTRAL</span>
         <div style="width:1.5px;height:26px;background:${lineColor};"></div>
         <div style="display:flex;flex-direction:column;gap:2px;">
           <span style="font-family:'Inter',Arial,sans-serif;font-weight:700;font-size:7pt;color:${textColor};letter-spacing:2px;">DIGITAL</span>
           <span style="font-family:'Inter',Arial,sans-serif;font-weight:400;font-size:7pt;color:${subColor};letter-spacing:2px;">AGENCY</span>
         </div>
       </div>`
   }
   
   // ── Contact items (shared by cover + end page) ───────────────────────────────
   const CONTACT_ITEMS = `
     <div style="display:flex;flex-direction:column;gap:5px;">
       <div style="display:flex;align-items:center;gap:8px;font-size:9pt;color:#444444;">
         <span style="color:#B8972A;width:14px;text-align:center;flex-shrink:0;">✆</span><span>+212 661-558584</span>
       </div>
       <div style="display:flex;align-items:center;gap:8px;font-size:9pt;color:#444444;">
         <span style="color:#B8972A;width:14px;text-align:center;flex-shrink:0;">⊕</span><span>www.astraldigital.ma</span>
       </div>
       <div style="display:flex;align-items:center;gap:8px;font-size:9pt;color:#444444;">
         <span style="color:#B8972A;width:14px;text-align:center;flex-shrink:0;">✉</span><span>contact@astraldigital.ma</span>
       </div>
       <div style="display:flex;align-items:center;gap:8px;font-size:9pt;color:#444444;">
         <span style="color:#B8972A;width:14px;text-align:center;flex-shrink:0;">◎</span><span>Appt 3, 16 Rue Oued Sebou, Rabat 10100</span>
       </div>
     </div>`
   
   // ── Common CSS resets ────────────────────────────────────────────────────────
   const BASE_STYLE = `
     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
     html, body {
       font-family: 'Inter', Arial, sans-serif;
       font-size: 11pt;
       color: #333333;
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
   
     const safeTitleUp  = escapeHtml(title.toUpperCase())
     const safeSubtitle = escapeHtml(subtitle.toUpperCase())
   
     const metaRows = [meta.date, meta.prestataire, meta.version]
       .filter((f): f is MetaField => !!f && f.enabled)
       .map(f => `
         <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:7px;">
           <span style="font-weight:700;color:#B8972A;font-size:10.5pt;min-width:110px;flex-shrink:0;">${escapeHtml(f.label)}</span>
           <span style="color:#ffffff;font-size:10.5pt;">${escapeHtml(f.value)}</span>
         </div>`)
       .join('')
   
     const style = `
       ${BASE_STYLE}
       @page { size: A4; margin: 0; }
       body { background-color: #0f325a; }
       .cover {
         width: 210mm; height: 297mm;
         background-color: #0f325a;
         display: flex; flex-direction: column;
         overflow: hidden;
         -webkit-print-color-adjust: exact; print-color-adjust: exact;
       }
     `
   
     const body = `
     <div class="cover">
       <div style="padding:13mm 16mm 0;flex-shrink:0;">
         ${logoHtml(logoSrc, 'white', 150)}
       </div>
   
       <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding:0 16mm;">
         <div style="font-size:40pt;font-weight:900;color:#ffffff;line-height:1.0;text-transform:uppercase;letter-spacing:-0.01em;margin-bottom:10px;word-break:break-word;">
           ${safeTitleUp}
         </div>
   
         ${safeSubtitle
           ? `<div style="background-color:#B8972A;padding:7px 6mm;margin-bottom:22px;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
                <span style="font-size:20pt;font-weight:800;color:#0f355a;text-transform:uppercase;letter-spacing:-0.01em;">${safeSubtitle}</span>
              </div>`
           : `<div style="width:100%;height:7px;background-color:#B8972A;margin-bottom:24px;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>`
         }
   
         ${metaRows ? `<div style="display:flex;flex-direction:column;">${metaRows}</div>` : ''}
       </div>
   
       <div style="background-color:#f5f7fa;padding:9mm 16mm 7mm;flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
         <div style="font-size:14pt;font-weight:700;color:#0f355a;font-style:italic;margin-bottom:10px;">Contactez-nous :</div>
         ${CONTACT_ITEMS}
       </div>
       <div style="height:8px;background-color:#B8972A;flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>
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
       body { margin: 0; padding: 0; }
       h1 {
         font-size: 22pt; font-weight: 700; color: #0f355a;
         margin-bottom: 20px; margin-top: 24px;
         line-height: 1.25; page-break-after: avoid; break-after: avoid;
       }
       h2 {
         font-size: 15pt; font-weight: 700; color: #3B72B0;
         margin-top: 2em; margin-bottom: 10px; line-height: 1.3;
         page-break-after: avoid; break-after: avoid;
       }
       h3 {
         font-size: 12pt; font-weight: 600; color: #3B72B0;
         font-style: italic; margin-top: 1.5em; margin-bottom: 8px;
         line-height: 1.35; page-break-after: avoid; break-after: avoid;
       }
       h4 { font-size: 11pt; font-weight: 700; color: #0f355a; margin-top: 1.2em; margin-bottom: 6px; page-break-after: avoid; break-after: avoid; }
       h5, h6 { font-size: 10.5pt; font-weight: 600; color: #3B72B0; margin-top: 1em; margin-bottom: 4px; page-break-after: avoid; break-after: avoid; }
   
       p { line-height: 1.7; color: #333333; margin-bottom: 12px; orphans: 3; widows: 3; }
       strong, b { font-weight: 700; color: #0f355a; }
       em, i { font-style: italic; color: #444444; }
       a { color: #3B72B0; text-decoration: underline; }
   
       ul { list-style: none; padding-left: 20px; margin: 10px 0 12px; }
       ul li { position: relative; padding-left: 16px; margin-bottom: 6px; line-height: 1.65; color: #333333; orphans: 3; widows: 3; }
       ul li::before { content: '●'; position: absolute; left: 0; color: #B8972A; font-size: 9pt; top: 1px; }
       ul ul li::before { content: '○'; color: #3B72B0; }
       ol { list-style: decimal; padding-left: 24px; margin: 10px 0 12px; }
       ol li { margin-bottom: 6px; line-height: 1.65; color: #333333; padding-left: 4px; orphans: 3; widows: 3; }
       ol li::marker { color: #B8972A; font-weight: 700; }
   
       table { width: 100%; border-collapse: collapse; margin: 16px 0 20px; font-size: 10pt; }
       thead tr { background-color: #0f355a; color: #ffffff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
       thead th { padding: 9px 12px; text-align: left; font-weight: 600; letter-spacing: 0.02em; border: 1px solid #0f355a; }
       tbody tr:nth-child(odd) { background-color: #F0F4FF; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
       tbody tr:nth-child(even) { background-color: #ffffff; }
       tbody td { padding: 8px 12px; border: 1px solid #dddddd; line-height: 1.5; color: #333333; vertical-align: top; }
   
       pre { background-color: #F0F0F0; border-left: 4px solid #B8972A; padding: 14px 16px; margin: 14px 0 18px; border-radius: 0 4px 4px 0; overflow-x: auto; page-break-inside: avoid; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
       pre code { font-family: 'Courier New', Courier, monospace; font-size: 9.5pt; color: #222222; background: none; padding: 0; line-height: 1.55; }
       code { font-family: 'Courier New', Courier, monospace; font-size: 9.5pt; background-color: #F0F0F0; padding: 2px 5px; border-radius: 3px; color: #0f355a; }
   
       blockquote { border-left: 4px solid #3B72B0; margin: 14px 0; padding: 10px 16px; background-color: #f4f7fc; border-radius: 0 4px 4px 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
       blockquote p { color: #444444; font-style: italic; margin-bottom: 0; }
   
       hr { border: none; border-top: 2px solid #B8972A; margin: 24px 0; opacity: 0.5; }
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
       body { background-color: #0f325a; }
       .end {
         width: 210mm; height: 297mm;
         background-color: #0f325a;
         display: flex; flex-direction: column;
         overflow: hidden;
         -webkit-print-color-adjust: exact; print-color-adjust: exact;
       }
     `
   
     const body = `
     <div class="end">
       <div style="padding:10mm 16mm 0;flex-shrink:0;">
         ${logoHtml(logoSrc, 'white', 110)}
       </div>
   
       <div style="flex:1;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;padding:0 16mm 8mm;">
         <div style="font-size:54pt;font-weight:300;color:#ffffff;line-height:1;text-align:right;">Merci</div>
         <div style="background-color:#B8972A;display:block;width:100%;text-align:right;padding:5px 6mm;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
           <span style="font-size:36pt;font-weight:800;color:#0f355a;line-height:1.15;">Pour Votre</span>
         </div>
         <div style="font-size:46pt;font-weight:800;color:#ffffff;line-height:1.1;text-align:right;">Attention</div>
         <div style="width:80px;height:6px;background-color:#B8972A;margin-top:14px;align-self:flex-end;border-radius:2px;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>
       </div>
   
       <div style="background-color:#f5f7fa;padding:9mm 16mm 7mm;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;">
         <div style="flex:1;">
           <div style="font-size:14pt;font-weight:700;color:#0f355a;font-style:italic;margin-bottom:10px;">Contactez-nous :</div>
           ${CONTACT_ITEMS}
         </div>
       </div>
       <div style="height:8px;background-color:#B8972A;flex-shrink:0;-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>
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
    <div style="width:calc(100% + 10mm);margin-left:-5mm;margin-top:-10mm;height:24mm;box-sizing:border-box;background-color:#0f355a;display:flex;align-items:flex-end;justify-content:space-between;padding:0 21mm 4mm 21mm;font-family:'Inter',Arial,sans-serif;-webkit-print-color-adjust:exact;color:white;font-size:9pt;">
      <span style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:70%;">${safe}</span>
      <span style="font-weight:700;"><span class="pageNumber"></span> / <span class="totalPages"></span></span>
    </div>`
  }
   
   // ════════════════════════════════════════════════════════════════════════════
   //  FOOTER TEMPLATE — removed
   // ════════════════════════════════════════════════════════════════════════════
   export function getFooterTemplate(): string {
    return `<style>
      * { margin:0; padding:0; box-sizing:border-box; }
    html, body { margin:0 !important; padding:0 !important; width:100%; height:100%; display:flex; flex-direction:column; justify-content:flex-end; overflow:visible; }
    </style>
  <div style="width:100%;height:30px;background-color:#B8972A;display:flex;align-items:center;justify-content:center;transform:translateY(6mm);-webkit-print-color-adjust:exact;print-color-adjust:exact;">
    <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:10px;color:#fff;letter-spacing:0.5px;line-height:30px;">Astral Digital - document confidentiel</span>
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