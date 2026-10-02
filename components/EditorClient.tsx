'use client'

import { useState, useCallback } from 'react'
import MarkdownEditor from './MarkdownEditor'
import PreviewPanel from './PreviewPanel'
import HistoryDrawer from './HistoryDrawer'
import type { MetaField, HistoryEntry } from '@/lib/types'

/* ── Default values ─────────────────────────────────────────────────────── */
const todayFr = new Date().toLocaleDateString('fr-FR', {
  day: 'numeric', month: 'long', year: 'numeric',
})

const DEFAULT_META: Record<string, MetaField> = {
  date:        { enabled: true,  label: 'Date :',        value: todayFr },
  prestataire: { enabled: true,  label: 'Prestataire :', value: 'Nautila' },
  version:     { enabled: true,  label: 'Version :',     value: '1.0' },
}

const EXAMPLE_MARKDOWN = `# Project Proposal: Nautila Platform

## Executive Summary

This document outlines the strategic direction for the **Nautila Platform** initiative. Our goal is to align trust, revenue and technology in a single motion — and exceed client expectations.

## Objectives

- Establish a robust technical foundation
- Deliver measurable ROI within **Q3 2026**
- Ensure compliance with accessibility standards
- Scale to support 10,000+ concurrent users

## Technical Architecture

### Frontend

The platform will be built on **Next.js 14** with the App Router, leveraging React Server Components for optimal performance. Key technologies include:

- TypeScript for type safety
- Tailwind CSS for styling
- \`react-query\` for data fetching

### Backend

| Service       | Technology   | Notes                          |
|---------------|-------------|--------------------------------|
| API Gateway   | Node.js      | REST + GraphQL endpoints       |
| Database      | PostgreSQL   | Managed via Supabase           |
| File Storage  | AWS S3       | CDN-backed via CloudFront      |
| Auth          | NextAuth.js  | OAuth + email/password         |

## Code Example

\`\`\`typescript
async function generateReport(data: ReportData): Promise<Buffer> {
  const template = getPdfTemplate(data.html, data.title)
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setContent(template, { waitUntil: 'networkidle0' })
  const pdf = await page.pdf({ format: 'A4', printBackground: true })
  await browser.close()
  return pdf
}
\`\`\`

## Timeline

1. **Phase 1** — Discovery & Architecture (Weeks 1–2)
2. **Phase 2** — Core Development (Weeks 3–8)
3. **Phase 3** — QA & Hardening (Weeks 9–10)
4. **Phase 4** — Launch & Monitoring (Week 11+)

## Budget Overview

> All figures are indicative and subject to final scope confirmation.

The estimated project investment is **$85,000–$110,000** depending on feature scope and integration complexity.

---

*Prepared by Nautila — Confidential*
`

/* ── Toggle Switch ───────────────────────────────────────────────────────── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none
        ${checked ? 'bg-gold' : 'bg-gray-300'}`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200
          ${checked ? 'translate-x-4' : 'translate-x-0'}`}
      />
    </button>
  )
}

/* ── Main component ─────────────────────────────────────────────────────── */
export default function EditorClient() {
  const [markdown,      setMarkdown]      = useState(EXAMPLE_MARKDOWN)
  const [title,         setTitle]         = useState('Nautila Platform Proposal')
  const [subtitle,      setSubtitle]      = useState('')
  const [meta,          setMeta]          = useState(DEFAULT_META)
  const [settingsOpen,  setSettingsOpen]  = useState(false)
  const [historyOpen,   setHistoryOpen]   = useState(false)
  const [exporting,     setExporting]     = useState(false)
  const [toast,         setToast]         = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }, [])

  /* update a single meta field */
  function updateMeta(id: string, patch: Partial<MetaField>) {
    setMeta(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  /* load a history entry back into the editor */
  function loadEntry(entry: HistoryEntry) {
    setMarkdown(entry.markdown)
    setTitle(entry.title)
    setSubtitle(entry.subtitle)
    if (entry.meta && Object.keys(entry.meta).length > 0) {
      setMeta(entry.meta as Record<string, MetaField>)
    }
  }

  async function handleExport() {
    if (!markdown.trim()) {
      showToast('error', 'Please enter some markdown content first.')
      return
    }
    setExporting(true)
    try {
      const { exportPdfViaPrint, saveHistoryEntry } = await import('@/lib/client-pdf')
      await exportPdfViaPrint({ markdown, title, subtitle, meta })
      saveHistoryEntry({ markdown, title, subtitle, meta })
      showToast('success', 'Print dialog: Margins = None, enable Background graphics, then Save as PDF.')
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'Failed to export PDF.')
    } finally {
      setExporting(false)
    }
  }

  const metaEntries = Object.entries(meta) as [string, MetaField][]

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#f2f4f0' }}>

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-5 shadow-md z-20"
        style={{ backgroundColor: '#16281c', height: '52px' }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{ width: '28px', height: '28px', backgroundColor: 'rgba(161,204,165,0.2)', border: '1px solid rgba(161,204,165,0.35)' }}
          >
            <svg width="16" height="14" viewBox="-20 -2 80 60" fill="none" aria-hidden="true">
              <path d="M42 6 A36 36 0 0 1 6 42 A22.25 22.25 0 0 1 -16.25 19.75 A13.75 13.75 0 0 1 -2.5 6 A8.5 8.5 0 0 1 6 14.5 A5.25 5.25 0 0 1 0.75 19.75" stroke="#a1cca5" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-white tracking-wide select-none" style={{ fontSize: '14px' }}>
            MD to PDF
          </span>
          <span className="hidden sm:block text-xs" style={{ color: '#8fb996' }}>by Nautila</span>
        </div>

        {/* Right side: history + settings toggle + export */}
        <div className="flex items-center gap-2">
          {/* History */}
          <button
            onClick={() => setHistoryOpen(v => !v)}
            className="flex items-center gap-1.5 text-xs font-medium rounded px-3 py-1.5 transition-colors"
            style={{
              color: historyOpen ? '#16281c' : '#c5dcc8',
              backgroundColor: historyOpen ? '#a1cca5' : 'rgba(255,255,255,0.08)',
              border: '1px solid',
              borderColor: historyOpen ? '#a1cca5' : 'rgba(255,255,255,0.15)',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/>
            </svg>
            History
          </button>

          {/* Settings */}
          <button
            onClick={() => setSettingsOpen(v => !v)}
            className="flex items-center gap-1.5 text-xs font-medium rounded px-3 py-1.5 transition-colors"
            style={{
              color: settingsOpen ? '#16281c' : '#c5dcc8',
              backgroundColor: settingsOpen ? '#a1cca5' : 'rgba(255,255,255,0.08)',
              border: '1px solid',
              borderColor: settingsOpen ? '#a1cca5' : 'rgba(255,255,255,0.15)',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Settings
          </button>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 font-semibold text-sm rounded-lg px-4 py-1.5 transition-colors shadow disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: '#709775', color: '#fff' }}
          >
            {exporting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Generating…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                </svg>
                Export PDF
              </>
            )}
          </button>
        </div>
      </header>

      {/* ── Settings Panel (collapsible) ──────────────────────────────── */}
      {settingsOpen && (
        <div
          className="flex-shrink-0 border-b z-10 shadow-sm"
          style={{ backgroundColor: '#fff', borderColor: '#e0e5ef' }}
        >
          <div className="px-5 py-3 flex flex-wrap gap-x-6 gap-y-3 items-start">

            {/* Title */}
            <div className="flex flex-col gap-1 min-w-[200px] flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7a99' }}>
                Document Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title…"
                className="border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                style={{ borderColor: '#d0d8ea', color: '#415d43' }}
              />
            </div>

            {/* Subtitle */}
            <div className="flex flex-col gap-1 min-w-[200px] flex-1">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b7a99' }}>
                Subtitle <span className="normal-case font-normal" style={{ color: '#9aabc' }}>(shown in sage bar)</span>
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                placeholder="e.g. Fonctionnel et Technique…"
                className="border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
                style={{ borderColor: '#d0d8ea', color: '#415d43' }}
              />
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px self-stretch" style={{ backgroundColor: '#e0e5ef' }} />

            {/* Meta fields */}
            {metaEntries.map(([id, field]) => (
              <div key={id} className="flex flex-col gap-1 min-w-[160px]">
                <div className="flex items-center gap-2">
                  <Toggle
                    checked={field.enabled}
                    onChange={v => updateMeta(id, { enabled: v })}
                  />
                  <label
                    className="text-xs font-semibold uppercase tracking-wider cursor-pointer select-none"
                    style={{ color: field.enabled ? '#415d43' : '#9aabc' }}
                    onClick={() => updateMeta(id, { enabled: !field.enabled })}
                  >
                    {field.label.replace(':', '')}
                  </label>
                </div>
                <input
                  type="text"
                  value={field.value}
                  onChange={e => updateMeta(id, { value: e.target.value })}
                  disabled={!field.enabled}
                  className="border rounded px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                  style={{ borderColor: '#d0d8ea', color: '#415d43' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Editor / Preview ──────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left — editor */}
        <div className="w-1/2 flex flex-col border-r" style={{ borderColor: '#d5ddd6', backgroundColor: '#fff' }}>
          <div
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b"
            style={{ backgroundColor: '#fafaf7', borderColor: '#e9ede7' }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#709775' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5f7268' }}>
              Markdown
            </span>
          </div>
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
        </div>

        {/* Right — preview */}
        <div className="w-1/2 flex flex-col" style={{ backgroundColor: '#e9ede7' }}>
          <div
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b"
            style={{ backgroundColor: '#f2f4f0', borderColor: '#d5ddd6' }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#415d43' }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#5f7268' }}>
              PDF Preview
            </span>
          </div>
          <PreviewPanel
            markdown={markdown}
            title={title}
            subtitle={subtitle}
            meta={meta}
          />
        </div>
      </div>

      {/* ── History Drawer ─────────────────────────────────────────────── */}
      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onLoad={loadEntry}
      />

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm
            ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
          role="alert"
        >
          {toast.type === 'success'
            ? <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            : <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          }
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      )}
    </div>
  )
}
