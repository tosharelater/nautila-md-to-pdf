/**
 * Lightweight file-based JSON store for conversion history.
 * Runs on the server only (uses Node.js fs).
 *
 * NOTE: fs/path are require()'d inside each function — NOT at the top level.
 * Top-level ESM imports of Node.js built-ins can bleed into webpack shared
 * chunks and cause "Cannot read properties of undefined (reading 'call')"
 * runtime errors in Next.js 15.
 */
import type { HistoryEntry } from './types'

const DB_FILE  = 'history.json'
const DATA_DIR = 'data'
const MAX_ENTRIES = 100

/* ── lazy node helpers ────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const getFs   = () => require('fs')   as typeof import('fs')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const getPath = () => require('path') as typeof import('path')

function dbPath(): string {
  const path = getPath()
  return path.join(process.cwd(), DATA_DIR, DB_FILE)
}

function ensureDir(): void {
  const fs   = getFs()
  const path = getPath()
  const dir  = path.join(process.cwd(), DATA_DIR)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

/* ── public API ───────────────────────────────────────────────────────────── */
export function readAll(): HistoryEntry[] {
  const fs  = getFs()
  const p   = dbPath()
  ensureDir()
  if (!fs.existsSync(p)) return []
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8')) as HistoryEntry[]
  } catch {
    return []
  }
}

export function saveEntry(
  data: Pick<HistoryEntry, 'title' | 'subtitle' | 'markdown' | 'meta'>
): HistoryEntry {
  const fs = getFs()
  const all = readAll()
  const entry: HistoryEntry = {
    id:        genId(),
    createdAt: new Date().toISOString(),
    ...data,
  }
  const trimmed = [entry, ...all].slice(0, MAX_ENTRIES)
  ensureDir()
  fs.writeFileSync(dbPath(), JSON.stringify(trimmed, null, 2), 'utf-8')
  return entry
}

export function deleteEntry(id: string): boolean {
  const fs      = getFs()
  const all     = readAll()
  const filtered = all.filter(e => e.id !== id)
  if (filtered.length === all.length) return false
  fs.writeFileSync(dbPath(), JSON.stringify(filtered, null, 2), 'utf-8')
  return true
}
