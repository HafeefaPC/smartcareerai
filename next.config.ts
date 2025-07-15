import type { NextConfig } from 'next'
import type { Configuration } from 'webpack'

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    if (!config.resolve) config.resolve = {}
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      path: false,
    }
    return config
  },
}

export default nextConfig
