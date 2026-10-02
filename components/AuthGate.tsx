'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const GATE_KEY = 'nautila-md-access'

/** Blocks /editor until the access password is entered on /login. */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const required = process.env.NEXT_PUBLIC_ACCESS_KEY || ''
  const [ok, setOk] = useState(!required)

  useEffect(() => {
    if (!required) {
      setOk(true)
      return
    }
    if (sessionStorage.getItem(GATE_KEY) === '1') {
      setOk(true)
      return
    }
    router.replace('/login/')
  }, [required, router])

  if (!ok) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center text-sage text-sm">
        Checking access…
      </div>
    )
  }

  return <>{children}</>
}
