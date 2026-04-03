import { NextRequest, NextResponse } from 'next/server'
import { marked } from 'marked'
import { PDFDocument } from 'pdf-lib'
import {
  getCoverTemplate,
  getContentTemplate,
  getEndTemplate,
  getHeaderTemplate,
  getFooterTemplate,
} from '@/lib/pdf-template'
import type { MetaField } from '@/lib/types'
import { getLogoDataUrl } from '@/lib/logo'
import { saveEntry } from '@/lib/db'

export const maxDuration = 60

interface RequestBody {
  markdown?: string
  title?: string
  subtitle?: string
  meta?: {
    date?:        MetaField
    prestataire?: MetaField
    version?:     MetaField
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function renderPdf(page: any, html: string, pdfOptions: Record<string, unknown>): Promise<Uint8Array> {
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 })
  await page.emulateMediaType('print')
  return page.pdf(pdfOptions)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestBody
    const { markdown, title, subtitle, meta } = body

    if (!markdown || typeof markdown !== 'string') {
      return NextResponse.json({ error: 'markdown field is required.' }, { status: 400 })
    }

    const rawHtml       = await marked.parse(markdown, { gfm: true, breaks: false })
    const documentTitle = title?.trim() || 'Document'
    const logoSrc       = getLogoDataUrl()

    const opts = {
      title:    documentTitle,
      subtitle: subtitle?.trim() || '',
      logoSrc,
      meta,
    }

    const coverHtml   = getCoverTemplate(opts)
    const contentHtml = getContentTemplate(rawHtml, opts)
    const endHtml     = getEndTemplate(opts)

    const puppeteer = await import('puppeteer')
    const browser   = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    })

    let coverBytes:   Uint8Array
    let contentBytes: Uint8Array
    let endBytes:     Uint8Array

    try {
      // ── 1. Cover page — no header/footer, zero margins ─────────────────────
      const coverPage = await browser.newPage()
      coverBytes = await renderPdf(coverPage, coverHtml, {
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      })
      await coverPage.close()

      // ── 2. Content pages — header + footer on every page ───────────────────
      const contentPage = await browser.newPage()
      contentBytes = await renderPdf(contentPage, contentHtml, {
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: getHeaderTemplate(documentTitle),
        footerTemplate: getFooterTemplate(),
        margin: { top: '25mm', right: '0mm', bottom: '10mm', left: '0mm' },
      })
      await contentPage.close()
      
      // ── 3. End page — no header/footer, zero margins ───────────────────────
      const endPage = await browser.newPage()
      endBytes = await renderPdf(endPage, endHtml, {
        format: 'A4',
        printBackground: true,
        margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
      })
      await endPage.close()
    } finally {
      await browser.close()
    }
    // ── 4. Merge all three PDFs ─────────────────────────────────────────────
    const merged = await PDFDocument.create()

    const [coverDoc, contentDoc, endDoc] = await Promise.all([
      PDFDocument.load(coverBytes!),
      PDFDocument.load(contentBytes!),
      PDFDocument.load(endBytes!),
    ])

    const coverPages   = await merged.copyPages(coverDoc,   coverDoc.getPageIndices())
    const contentPages = await merged.copyPages(contentDoc, contentDoc.getPageIndices())
    const endPages     = await merged.copyPages(endDoc,     endDoc.getPageIndices())

    coverPages.forEach(p   => merged.addPage(p))
    contentPages.forEach(p => merged.addPage(p))
    endPages.forEach(p     => merged.addPage(p))

    const pdfBytes = await merged.save()
    const buf      = Buffer.from(pdfBytes)

    // persist to history (fire-and-forget — never block the response)
    try {
      saveEntry({
        title:    documentTitle,
        subtitle: subtitle?.trim() || '',
        markdown: markdown.slice(0, 50_000), // guard against huge payloads
        meta:     (meta ?? {}) as Record<string, MetaField>,
      })
    } catch { /* non-fatal */ }

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(documentTitle)}.pdf"`,
        'Content-Length':      buf.byteLength.toString(),
      },
    })
  } catch (err) {
    console.error('[convert] PDF generation error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'PDF generation failed.' },
      { status: 500 }
    )
  }
}
