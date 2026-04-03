'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { MetaField } from '@/lib/types'

interface PreviewPanelProps {
  markdown: string
  title: string
  subtitle: string
  meta: Record<string, MetaField>
}

/* ── Logo (tries /logo.png from Next.js public, falls back to CSS) ─────── */
function LogoWhite() {
  const [hasLogo, setHasLogo] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/logo.png', { method: 'HEAD' })
      .then(r => setHasLogo(r.ok))
      .catch(() => setHasLogo(false))
  }, [])

  if (hasLogo === null) return null // loading

  if (hasLogo) {
    return (
      <img
        src="/logo.png"
        alt="Astral Digital"
        style={{ height: '46px', maxWidth: '200px', objectFit: 'contain', display: 'block' }}
      />
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderBottom: '20px solid rgba(255,255,255,0.92)' }} />
      <span style={{ fontWeight: 900, fontSize: '19pt', color: '#fff', letterSpacing: '2.5px', lineHeight: 1 }}>ASTRAL</span>
      <div style={{ width: '1.5px', height: '26px', background: 'rgba(255,255,255,0.32)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontWeight: 700, fontSize: '6.5pt', color: '#fff', letterSpacing: '2px' }}>DIGITAL</span>
        <span style={{ fontWeight: 400, fontSize: '6.5pt', color: 'rgba(255,255,255,0.6)', letterSpacing: '2px' }}>AGENCY</span>
      </div>
    </div>
  )
}

function LogoDark() {
  const [hasLogo, setHasLogo] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/logo.png', { method: 'HEAD' })
      .then(r => setHasLogo(r.ok))
      .catch(() => setHasLogo(false))
  }, [])

  if (hasLogo === null) return null

  if (hasLogo) {
    return (
      <img
        src="/logo.png"
        alt="Astral Digital"
        style={{ height: '46px', maxWidth: '200px', objectFit: 'contain', display: 'block', filter: 'brightness(0) saturate(100%)' }}
      />
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderBottom: '20px solid #0f325a' }} />
      <span style={{ fontWeight: 900, fontSize: '19pt', color: '#0f325a', letterSpacing: '2.5px', lineHeight: 1 }}>ASTRAL</span>
      <div style={{ width: '1.5px', height: '26px', background: 'rgba(27,47,94,0.28)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontWeight: 700, fontSize: '6.5pt', color: '#0f325a', letterSpacing: '2px' }}>DIGITAL</span>
        <span style={{ fontWeight: 400, fontSize: '6.5pt', color: 'rgba(27,47,94,0.5)', letterSpacing: '2px' }}>AGENCY</span>
      </div>
    </div>
  )
}

/* ── Contact items ──────────────────────────────────────────────────────── */
function ContactItems() {
  const items = [
    { icon: '✆', text: '+212 661-558584' },
    { icon: '⊕', text: 'www.astraldigital.ma' },
    { icon: '✉', text: 'contact@astraldigital.ma' },
    { icon: '◎', text: 'Appt 3, 16 Rue Oued Sebou, Rabat 10100' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {items.map(item => (
        <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '8.5pt', color: '#555' }}>
          <span style={{ color: '#B8972A', width: '14px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  )
}

/* ── Page Header ────────────────────────────────────────────────────────── */
function PageHeader({ title }: { title: string }) {
  return (
    <div style={{ backgroundColor: '#0f325a', height: '14mm', padding: '0 16mm', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderBottom: '13px solid rgba(255,255,255,0.88)' }} />
        <span style={{ color: '#fff', fontSize: '7.5pt', fontWeight: 900, letterSpacing: '2px' }}>ASTRAL</span>
        <span style={{ display: 'inline-block', width: '1px', height: '13px', background: 'rgba(255,255,255,0.28)', margin: '0 3px' }} />
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '6pt', letterSpacing: '1.5px' }}>DIGITAL AGENCY</span>
      </div>
      <span style={{ color: '#9aabc', fontSize: '7.5pt', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '55%' }}>
        {title || 'Document'}
      </span>
    </div>
  )
}

/* ── Page Footer ────────────────────────────────────────────────────────── */
function PageFooter() {
  return (
    <div style={{ flexShrink: 0 }}>
      <div style={{ height: '5px', backgroundColor: '#B8972A' }} />
      <div style={{ height: '13mm', backgroundColor: '#0f325a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#fff', fontSize: '7.5pt', letterSpacing: '0.07em' }}>
          Astral Digital &nbsp;&nbsp;|&nbsp;&nbsp; Confidentiel
        </span>
      </div>
    </div>
  )
}

/* ── Cover Page ─────────────────────────────────────────────────────────── */
function CoverPage({ title, subtitle, meta }: { title: string; subtitle: string; meta: Record<string, MetaField> }) {
  const activeFields = Object.values(meta).filter(f => f.enabled)

  return (
    <div
      className="mx-auto shadow-xl"
      style={{ width: '210mm', minHeight: '297mm', backgroundColor: '#0f325a', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', Arial, sans-serif" }}
    >
      {/* Logo */}
      <div style={{ padding: '13mm 16mm 0' }}>
        <LogoWhite />
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 16mm' }}>
        {/* Title */}
        <div style={{ fontSize: '38pt', fontWeight: 900, color: '#fff', lineHeight: 1.0, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '10px', wordBreak: 'break-word' }}>
          {title || 'Document'}
        </div>

        {/* Subtitle gold bar OR thin accent */}
        {subtitle.trim() ? (
          <div style={{ backgroundColor: '#B8972A', padding: '7px 0', marginBottom: '22px', display: 'block' }}>
            <span style={{ fontSize: '20pt', fontWeight: 800, color: '#0f325a', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              {subtitle}
            </span>
          </div>
        ) : (
          <div style={{ width: '100%', height: '7px', backgroundColor: '#B8972A', marginBottom: '24px' }} />
        )}

        {/* Meta fields */}
        {activeFields.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activeFields.map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '7px' }}>
                <span style={{ fontWeight: 700, color: '#B8972A', fontSize: '10.5pt', minWidth: '110px', flexShrink: 0 }}>{f.label}</span>
                <span style={{ color: '#fff', fontSize: '10.5pt' }}>{f.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact */}
      <div style={{ backgroundColor: '#f5f7fa', padding: '9mm 16mm 7mm' }}>
        <div style={{ fontSize: '14pt', fontWeight: 700, color: '#0f325a', fontStyle: 'italic', marginBottom: '10px' }}>
          Contactez-nous :
        </div>
        <ContactItems />
      </div>

      {/* Gold bar */}
      <div style={{ height: '8px', backgroundColor: '#B8972A' }} />
    </div>
  )
}

/* ── Content Pages ──────────────────────────────────────────────────────── */
function ContentPages({ markdown, title }: { markdown: string; title: string }) {
  return (
    <div
      className="mx-auto shadow-xl"
      style={{ width: '210mm', minHeight: '297mm', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', Arial, sans-serif" }}
    >
      <PageHeader title={title} />
      <div className="flex-1 pdf-preview" style={{ padding: '32px 60px' }}>
        {markdown.trim()
          ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          : <p style={{ color: '#ccc', fontStyle: 'italic', fontSize: '13px', marginTop: '16px' }}>Your preview will appear here as you type…</p>
        }
      </div>
      <PageFooter />
    </div>
  )
}

/* ── End Page ───────────────────────────────────────────────────────────── */
function EndPage() {
  return (
    <div
      className="mx-auto shadow-xl"
      style={{ width: '210mm', minHeight: '297mm', backgroundColor: '#0f325a', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', Arial, sans-serif" }}
    >
      <div style={{ padding: '10mm 16mm 0' }}>
        <LogoWhite />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', padding: '0 16mm 8mm' }}>
        <div style={{ fontSize: '50pt', fontWeight: 300, color: '#fff', lineHeight: 1, textAlign: 'right' }}>Merci</div>
        <div style={{ backgroundColor: '#B8972A', display: 'block', width: '100%', textAlign: 'right', padding: '5px 0' }}>
          <span style={{ fontSize: '34pt', fontWeight: 800, color: '#0f325a', lineHeight: 1.15 }}>Pour Votre</span>
        </div>
        <div style={{ fontSize: '44pt', fontWeight: 800, color: '#fff', lineHeight: 1.1, textAlign: 'right' }}>Attention</div>
        <div style={{ width: '80px', height: '6px', backgroundColor: '#B8972A', marginTop: '14px', alignSelf: 'flex-end', borderRadius: '2px' }} />
      </div>
      <div style={{ backgroundColor: '#f5f7fa', padding: '9mm 16mm 7mm', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '14pt', fontWeight: 700, color: '#0f325a', fontStyle: 'italic', marginBottom: '10px' }}>Contactez-nous :</div>
          <ContactItems />
        </div>
        <div style={{ paddingLeft: '24px' }}>
          <LogoDark />
        </div>
      </div>
      <div style={{ height: '8px', backgroundColor: '#B8972A' }} />
    </div>
  )
}

/* ── Page Label ─────────────────────────────────────────────────────────── */
function PageLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
      <div style={{ height: '1px', width: '20px', backgroundColor: '#aab5cc' }} />
      <span style={{ fontSize: '8.5pt', color: '#8896aa', letterSpacing: '0.08em', fontWeight: 500, textTransform: 'uppercase' }}>
        {children}
      </span>
      <div style={{ height: '1px', flex: 1, backgroundColor: '#aab5cc' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN PANEL
═══════════════════════════════════════════════════════════════════════════ */
export default function PreviewPanel({ markdown, title, subtitle, meta }: PreviewPanelProps) {
  const [debouncedMarkdown, setDebouncedMarkdown] = useState(markdown)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedMarkdown(markdown), 300)
    return () => clearTimeout(t)
  }, [markdown])

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 12px', backgroundColor: '#dde2ec' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <PageLabel>Couverture</PageLabel>
        <CoverPage title={title} subtitle={subtitle} meta={meta} />

        <PageLabel>Contenu</PageLabel>
        <ContentPages markdown={debouncedMarkdown} title={title} />

        <PageLabel>Page de clôture</PageLabel>
        <EndPage />

        <div style={{ height: '24px' }} />
      </div>
    </div>
  )
}
