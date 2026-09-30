'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

const SHELL =
  'M42 6 A36 36 0 0 1 6 42 A22.25 22.25 0 0 1 -16.25 19.75 A13.75 13.75 0 0 1 -2.5 6 A8.5 8.5 0 0 1 6 14.5 A5.25 5.25 0 0 1 0.75 19.75'

export default function LoginPage() {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })

      if (res.ok) {
        router.push('/editor')
      } else {
        setError('Invalid key. Please try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-dark-text font-semibold text-xl mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm mb-6">Enter your access key to continue.</p>

            <div className="mb-5">
              <label
                htmlFor="access-key"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
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
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !key.trim()}
              className="w-full bg-green text-white font-semibold py-2.5 px-4 rounded-lg
                hover:bg-ink active:bg-[#0e1a12]
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-colors duration-150 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {loading ? 'Verifying…' : 'Access Editor'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          &copy; {new Date().getFullYear()} Nautila. All rights reserved.
        </p>
      </div>
    </div>
  )
}
