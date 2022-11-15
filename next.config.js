const withTM=require('next-transpile-modules')([
  '@stripe/firestore-stripe-payments',
])
/** @type {import('next').NextConfig} */
module.exports = withTM ({
  reactStrictMode: true,
  images: {
    domains: ['rb.gy', 'image.tmdb.org','upload.wikimedia.org'],
  }
})
