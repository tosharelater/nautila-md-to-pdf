import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key } = body as { key?: string }

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'Key is required.' }, { status: 400 })
    }

    const accessKey = process.env.ACCESS_KEY
    if (!accessKey) {
      console.error('[auth] ACCESS_KEY env var is not set.')
      return NextResponse.json({ error: 'Server misconfiguration.' }, { status: 500 })
    }

    if (key !== accessKey) {
      return NextResponse.json({ error: 'Invalid key.' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true }, { status: 200 })
    response.cookies.set('access_granted', '1', {
      httpOnly: true,
      path: '/',
      maxAge: 86400, // 24 hours
      sameSite: 'lax',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Bad request.' }, { status: 400 })
  }
}
