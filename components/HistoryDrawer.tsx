'use client'

import { useEffect, useState, useCallback } from 'react'
import type { HistoryEntry, MetaField } from '@/lib/types'

interface Props {
  open: boolean
  onClose: () => void
  onLoad: (entry: HistoryEntry) => void
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1)  return 'Just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function excerpt(markdown: string, len = 80): string {
  const plain = markdown.replace(/[#*`_>\-\[\]]/g, '').replace(/\s+/g, ' ').trim()
  return plain.length > len ? plain.slice(0, len) + '…' : plain
}

export default function HistoryDrawer({ open, onClose, onLoad }: Props) {
  const [entries,  setEntries]  = useState<HistoryEntry[]>([])
  const [loading,  setLoading]  = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      const { loadHistory } = await import('@/lib/client-pdf')
      setEntries(loadHistory())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (open) fetchHistory()
  }, [open, fetchHistory])

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      const { deleteHistoryEntry, loadHistory } = await import('@/lib/client-pdf')
      deleteHistoryEntry(id)
      setEntries(loadHistory())
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30"
          style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 left-0 h-full z-40 flex flex-col shadow-2xl transition-transform duration-300"
        style={{
          width: '340px',
          backgroundColor: '#fff',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          borderRight: '1px solid #d4cfc0',
        }}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-5 py-4 border-b"
          style={{ backgroundColor: '#14333B', borderColor: '#1a4048' }}
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#63A6A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/>
            </svg>
            <span className="font-semibold text-white text-sm tracking-wide">Conversion History</span>
          </div>
          <button
            onClick={onClose}
            className="text-mint/80 hover:text-white transition-colors p-1 rounded"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#F2EFE6' }}>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#2E7D8C" strokeWidth="4"/>
                <path className="opacity-75" fill="#2E7D8C" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2" style={{ color: '#7d9296' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span className="text-sm">No conversions yet</span>
            </div>
          ) : (
            <ul className="divide-y" style={{ borderColor: '#d4cfc0' }}>
              {entries.map(entry => (
                <li
                  key={entry.id}
                  className="group flex flex-col gap-1.5 px-4 py-3 hover:bg-white transition-colors cursor-default"
                >
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className="font-semibold text-sm leading-tight flex-1 truncate"
                      style={{ color: '#2E7D8C' }}
                      title={entry.title}
                    >
                      {entry.title || 'Untitled'}
                    </span>
                    <span className="flex-shrink-0 text-xs" style={{ color: '#7d9296' }}>
                      {relativeTime(entry.createdAt)}
                    </span>
                  </div>

                  {/* Subtitle badge */}
                  {entry.subtitle && (
                    <span
                      className="self-start text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ backgroundColor: '#E8E4D6', color: '#2E7D8C' }}
                    >
                      {entry.subtitle}
                    </span>
                  )}

                  {/* Excerpt */}
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#556f75' }}>
                    {excerpt(entry.markdown)}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-0.5">
                    <button
                      onClick={() => { onLoad(entry); onClose() }}
                      className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded transition-colors"
                      style={{ backgroundColor: '#2E7D8C', color: '#fff' }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                      </svg>
                      Load
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deleting === entry.id}
                      className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded border transition-colors disabled:opacity-50"
                      style={{ borderColor: '#d4cfc0', color: '#e05252' }}
                    >
                      {deleting === entry.id ? (
                        <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
                        </svg>
                      )}
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {entries.length > 0 && (
          <div
            className="flex-shrink-0 px-4 py-2 border-t text-xs"
            style={{ borderColor: '#d4cfc0', color: '#7d9296', backgroundColor: '#fff' }}
          >
            {entries.length} conversion{entries.length !== 1 ? 's' : ''} saved
          </div>
        )}
      </div>
    </>
  )
}
