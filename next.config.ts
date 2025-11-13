import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow cross-origin requests from network IPs during development
  // This prevents warnings when accessing the dev server from other devices on the network
  allowedDevOrigins: process.env.NODE_ENV === 'development' 
    ? [
        'localhost',
        '127.0.0.1',
        '192.168.1.6', // Current network IP - update if your IP changes
        // Add more IPs as needed: '192.168.1.x'
      ]
    : undefined,
};

export default nextConfig;
