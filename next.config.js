/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config, { isServer }) => {
    // Handle Firebase modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        util: false,
        buffer: false,
      }
    }

    // Fix for undici module
    config.module.rules.push({
      test: /node_modules\/undici/,
      use: 'null-loader',
    })

    return config
  },
  experimental: {
    esmExternals: 'loose',
  },
  transpilePackages: ['firebase', 'undici'],
}

module.exports = nextConfig 