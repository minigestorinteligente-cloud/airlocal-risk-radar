const withPWA = require("next-pwa")({
  dest: "public",
})

module.exports = withPWA({
  reactStrictMode: true,
  turbopack: {},
  images: {
    unoptimized: true
  },
  output: 'standalone'
})