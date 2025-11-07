/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://192.168.2.119:3000',
  ],
};

module.exports = nextConfig;
