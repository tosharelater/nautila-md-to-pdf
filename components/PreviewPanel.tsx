'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { MetaField } from '@/lib/types'

const INK = '#14333B'
const GREEN = '#2E7D8C'
const SAGE = '#2E7D8C'
const MINT = '#63A6A0'
const PAPER = '#F2EFE6'
const SHELL =
  'M42 6 A36 36 0 0 1 6 42 A22.25 22.25 0 0 1 -16.25 19.75 A13.75 13.75 0 0 1 -2.5 6 A8.5 8.5 0 0 1 6 14.5 A5.25 5.25 0 0 1 0.75 19.75'

interface PreviewPanelProps {
  markdown: string
  title: string
  subtitle: string
  meta: Record<string, MetaField>
}

function ShellMark({ color, size = 36 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.75)} viewBox="-20 -2 80 60" fill="none" aria-hidden="true">
      <path d={SHELL} stroke={color} strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LogoWhite() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <ShellMark color={MINT} size={42} />
      <span style={{ fontWeight: 700, fontSize: '18pt', color: '#F2EFE6', letterSpacing: '-0.02em', lineHeight: 1 }}>
        Nautila<span style={{ color: MINT }}>.</span>
      </span>
    </div>
  )
}

function LogoDark() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <ShellMark color={GREEN} size={36} />
      <span style={{ fontWeight: 700, fontSize: '15pt', color: '#14333B', letterSpacing: '-0.02em', lineHeight: 1 }}>
        Nautila<span style={{ color: SAGE }}>.</span>
      </span>
    </div>
  )
}

function ContactItems() {
  const items = [
    { icon: '✆', text: '+33 1 84 80 00 00' },
    { icon: '⊕', text: 'www.nautila.com' },
    { icon: '✉', text: 'hello@nautila.com' },
    { icon: '◎', text: 'Paris · Europe' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {items.map((item) => (
        <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '8.5pt', color: '#556f75' }}>
          <span style={{ color: SAGE, width: '14px', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  )
}

function PageHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        backgroundColor: GREEN,
        height: '18mm',
        padding: '0 16mm 3.5mm',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}
    >
      <span
        style={{
          color: '#F2EFE6',
          fontSize: '9pt',
          fontWeight: 600,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}
      >
        {title || 'Document'}
      </span>
    </div>
  )
}

function PageFooter() {
  return (
    <div
      style={{
        flexShrink: 0,
        height: '9mm',
        backgroundColor: SAGE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ color: '#fff', fontSize: '10px', letterSpacing: '0.5px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
        Nautila — Document confidentiel
      </span>
    </div>
  )
}

function CoverPage({
  title,
  subtitle,
  meta,
}: {
  title: string
  subtitle: string
  meta: Record<string, MetaField>
}) {
  const activeFields = Object.values(meta).filter((f) => f.enabled)

  return (
    <div
      className="mx-auto shadow-xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: `linear-gradient(165deg, #0f2a30 0%, ${INK} 50%, #1a4048 100%)`,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', Arial, sans-serif",
      }}
    >
      <div style={{ padding: '13mm 16mm 0' }}>
        <LogoWhite />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 16mm' }}>
        <div
          style={{
            fontSize: '34pt',
            fontWeight: 800,
            color: '#F2EFE6',
            lineHeight: 1.05,
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            marginBottom: '10px',
            wordBreak: 'break-word',
          }}
        >
          {title || 'Document'}
        </div>

        {subtitle.trim() ? (
          <div style={{ backgroundColor: SAGE, padding: '7px 0', marginBottom: '22px', display: 'block' }}>
            <span
              style={{
                fontSize: '18pt',
                fontWeight: 800,
                color: '#F2EFE6',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
              }}
            >
              {subtitle}
            </span>
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              height: '7px',
              background: `linear-gradient(90deg, ${GREEN}, ${MINT})`,
              marginBottom: '24px',
            }}
          />
        )}

        {activeFields.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activeFields.map((f) => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '7px' }}>
                <span style={{ fontWeight: 700, color: MINT, fontSize: '10.5pt', minWidth: '110px', flexShrink: 0 }}>
                  {f.label}
                </span>
                <span style={{ color: '#F2EFE6', fontSize: '10.5pt' }}>{f.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ backgroundColor: PAPER, padding: '9mm 16mm 7mm' }}>
        <div style={{ fontSize: '14pt', fontWeight: 700, color: GREEN, fontStyle: 'italic', marginBottom: '10px' }}>
          Contactez-nous :
        </div>
        <ContactItems />
      </div>

      <div style={{ height: '8px', background: `linear-gradient(90deg, ${GREEN}, ${MINT})` }} />
    </div>
  )
}

function ContentPages({ markdown, title }: { markdown: string; title: string }) {
  return (
    <div
      className="mx-auto shadow-xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', Arial, sans-serif",
      }}
    >
      <PageHeader title={title} />
      <div className="flex-1 pdf-preview" style={{ padding: '32px 60px' }}>
        {markdown.trim() ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        ) : (
          <p style={{ color: '#ccc', fontStyle: 'italic', fontSize: '13px', marginTop: '16px' }}>
            Your preview will appear here as you type…
          </p>
        )}
      </div>
      <PageFooter />
    </div>
  )
}

function EndPage() {
  return (
    <div
      className="mx-auto shadow-xl"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: `linear-gradient(165deg, #0f2a30 0%, ${INK} 50%, #1a4048 100%)`,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', Arial, sans-serif",
      }}
    >
      <div style={{ padding: '10mm 16mm 0' }}>
        <LogoWhite />
      </div>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end',
          padding: '0 16mm 8mm',
        }}
      >
        <div style={{ fontSize: '50pt', fontWeight: 300, color: '#F2EFE6', lineHeight: 1, textAlign: 'right' }}>
          Merci
        </div>
        <div style={{ backgroundColor: SAGE, display: 'block', width: '100%', textAlign: 'right', padding: '5px 0' }}>
          <span style={{ fontSize: '34pt', fontWeight: 800, color: '#F2EFE6', lineHeight: 1.15 }}>Pour Votre</span>
        </div>
        <div style={{ fontSize: '44pt', fontWeight: 800, color: '#F2EFE6', lineHeight: 1.1, textAlign: 'right' }}>
          Attention
        </div>
        <div
          style={{
            width: '80px',
            height: '6px',
            background: `linear-gradient(90deg, ${GREEN}, ${MINT})`,
            marginTop: '14px',
            alignSelf: 'flex-end',
            borderRadius: '2px',
          }}
        />
      </div>
      <div
        style={{
          backgroundColor: PAPER,
          padding: '9mm 16mm 7mm',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '14pt', fontWeight: 700, color: GREEN, fontStyle: 'italic', marginBottom: '10px' }}>
            Contactez-nous :
          </div>
          <ContactItems />
        </div>
        <div style={{ paddingLeft: '24px' }}>
          <LogoDark />
        </div>
      </div>
      <div style={{ height: '8px', background: `linear-gradient(90deg, ${GREEN}, ${MINT})` }} />
    </div>
  )
}

function PageLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
      <div style={{ height: '1px', width: '20px', backgroundColor: '#b5c4b8' }} />
      <span
        style={{
          fontSize: '8.5pt',
          color: '#556f75',
          letterSpacing: '0.08em',
          fontWeight: 500,
          textTransform: 'uppercase',
        }}
      >
        {children}
      </span>
      <div style={{ height: '1px', flex: 1, backgroundColor: '#b5c4b8' }} />
    </div>
  )
}

export default function PreviewPanel({ markdown, title, subtitle, meta }: PreviewPanelProps) {
  const [debouncedMarkdown, setDebouncedMarkdown] = useState(markdown)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedMarkdown(markdown), 300)
    return () => clearTimeout(t)
  }, [markdown])

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 12px', backgroundColor: '#E8E4D6' }}>
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
