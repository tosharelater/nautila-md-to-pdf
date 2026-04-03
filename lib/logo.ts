/**
 * Reads logo.{png|jpg|jpeg|webp|svg} from /public and returns a base64
 * data-URL safe to embed in Puppeteer-rendered HTML.
 * Falls back to null → CSS logo approximation is used instead.
 */
import fs from 'fs'
import path from 'path'

const CANDIDATES = [
  { file: 'logo.png',  mime: 'image/png' },
  { file: 'logo.jpg',  mime: 'image/jpeg' },
  { file: 'logo.jpeg', mime: 'image/jpeg' },
  { file: 'logo.webp', mime: 'image/webp' },
  { file: 'logo.svg',  mime: 'image/svg+xml' },
]

export function getLogoDataUrl(): string | null {
  for (const { file, mime } of CANDIDATES) {
    try {
      const filePath = path.join(process.cwd(), 'public', file)
      if (fs.existsSync(filePath)) {
        const buf = fs.readFileSync(filePath)
        return `data:${mime};base64,${buf.toString('base64')}`
      }
    } catch {
      // try next
    }
  }
  return null
}
