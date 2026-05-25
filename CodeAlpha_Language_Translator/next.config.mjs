import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicitly set the project root to fix workspace detection
  experimental: {
    outputFileTracingRoot: __dirname,
  },
};

export default nextConfig;
