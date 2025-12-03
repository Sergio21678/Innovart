/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Permite sobreescribir en Render/Vercel; fallback local para desarrollo
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  }
};

module.exports = nextConfig;
