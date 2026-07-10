import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // React Compiler (pengganti babel-plugin-react-compiler di setup Vite lama)
  experimental: {
    reactCompiler: true,
  },
  // Ada lockfile di parent (project Vite lama); kunci root ke folder ini
  outputFileTracingRoot: path.resolve("."),
  // Samakan dengan setup Vite lama: lint tidak memblokir build produksi.
  // (Banyak file memakai `// @ts-nocheck` bawaan project. Jalankan `npm run lint` manual bila perlu.)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
