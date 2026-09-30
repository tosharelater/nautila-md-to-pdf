'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const SHELL =
  'M42 6 A36 36 0 0 1 6 42 A22.25 22.25 0 0 1 -16.25 19.75 A13.75 13.75 0 0 1 -2.5 6 A8.5 8.5 0 0 1 6 14.5 A5.25 5.25 0 0 1 0.75 19.75'

const GATE_KEY = 'nautila-md-access'

export default function LoginPage() {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  /* Public Pages: no server auth. Optional soft gate via NEXT_PUBLIC_ACCESS_KEY. */
  const required = process.env.NEXT_PUBLIC_ACCESS_KEY || ''

  useEffect(() => {
    if (!required || sessionStorage.getItem(GATE_KEY) === '1') {
      router.replace('/editor/')
    }
  }, [required, router])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (required && key !== required) {
        setError('Invalid key. Please try again.')
        return
      }
      sessionStorage.setItem(GATE_KEY, '1')
      router.push('/editor/')
    } finally {
      setLoading(false)
    }
  }

  if (!required) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center text-sage text-sm">
        Opening editor…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-black/5">
          <div className="bg-ink px-8 py-7">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-green/30 flex items-center justify-center flex-shrink-0 ring-1 ring-mint/40">
                <svg width="22" height="18" viewBox="-20 -2 80 60" fill="none" aria-hidden="true">
                  <path
                    d={SHELL}
                    stroke="#a1cca5"
                    strokeWidth="5.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-white font-semibold text-lg tracking-wide">
                Nautila<span className="text-mint">.</span>
              </span>
            </div>
            <p className="text-mint/80 text-sm mt-2 ml-12">MD → PDF Converter</p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8">
            <h1 className="text-dark-text font-semibold text-xl mb-1">Welcome</h1>
            <p className="text-gray-500 text-sm mb-6">Enter your access key to continue.</p>

            <div className="mb-5">
              <label htmlFor="access-key" className="block text-sm font-medium text-gray-700 mb-1.5">
                Access Key
              </label>
              <input
                id="access-key"
                type="password"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value)
                  setError('')
                }}
                placeholder="Enter access key"
                autoComplete="current-password"
                required
                className={`w-full px-4 py-2.5 border rounded-lg text-sm outline-none transition-colors
                  focus:ring-2 focus:ring-sage/30 focus:border-sage
                  ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}
                `}
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !key.trim()}
              className="w-full bg-green text-white font-semibold py-2.5 px-4 rounded-lg
                hover:bg-ink disabled:opacity-60 disabled:cursor-not-allowed
                transition-colors duration-150"
            >
              {loading ? 'Verifying…' : 'Access Editor'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
