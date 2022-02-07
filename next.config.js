/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    API_ENDPOINT_STAGING: process.env.API_ENDPOINT_STAGING,
  },
}

module.exports = nextConfig
