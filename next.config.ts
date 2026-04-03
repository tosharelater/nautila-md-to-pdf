import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Produces a self-contained build for Docker (server.js + minimal node_modules)
  output: 'standalone',

  experimental: {
    // Work around a Next.js 15 dev-mode manifest bug on Windows.
    devtoolSegmentExplorer: false,
  },
  // Puppeteer needs to run only on the server; exclude it from the client bundle
  serverExternalPackages: ['puppeteer'],
}

export default nextConfig
