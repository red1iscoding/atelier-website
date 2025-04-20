/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static export
  trailingSlash: true,  // Important for GitHub Pages to work with folder-based structure
  basePath: process.env.NODE_ENV === 'production' ? '/your-repository-name' : '',  // Only use basePath in production
  assetPrefix: process.env.NODE_ENV === 'production' ? '/your-repository-name' : '',  // Only use assetPrefix in production
};

export default nextConfig;
