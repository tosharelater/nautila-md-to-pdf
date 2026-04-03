/**
 * Shared types — imported by both client and server code.
 * No Node.js dependencies here.
 */

export interface MetaField {
  enabled: boolean
  label: string
  value: string
}

export interface TemplateOptions {
  title?: string
  subtitle?: string         // shown in the gold bar on the cover
  logoSrc?: string | null   // base64 data-URL; null → CSS fallback
  meta?: {
    date?:        MetaField
    prestataire?: MetaField
    version?:     MetaField
  }
}

export interface HistoryEntry {
  id: string
  title: string
  subtitle: string
  markdown: string
  meta: Record<string, MetaField>
  createdAt: string   // ISO string
}
