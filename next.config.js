/** @type {import('next').NextConfig} */
require('./process.env.config.js').execute()
const nextConfig = {
  env: {
    BASE_DOMAIN: process.env.BASE_DOMAIN,
    ENCRYPTATION_KEY: process.env.ENCRYPTATION_KEY,
    ENCRYPTATION_IV: process.env.ENCRYPTATION_IV,
    IMAGES: process.env.IMAGES,
    COOKIE_AUTH: process.env.COOKIE_AUTH,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'www.eltiempo.com',
      'stg-premiospo.eltiempo.com.co',
      'img.youtube.com',
      'beta-premios.portafolio.co',
      'premios.portafolio.co',
    ],
  },
}

module.exports = nextConfig
