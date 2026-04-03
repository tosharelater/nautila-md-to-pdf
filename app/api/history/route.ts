import { NextRequest, NextResponse } from 'next/server'
import { readAll, deleteEntry } from '@/lib/db'

/* GET /api/history — return all entries, newest first */
export async function GET() {
  const entries = readAll()
  return NextResponse.json(entries)
}

/* DELETE /api/history  body: { id: string } */
export async function DELETE(request: NextRequest) {
  const body = await request.json().catch(() => ({})) as { id?: string }
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const ok = deleteEntry(body.id)
  return NextResponse.json({ ok })
}
