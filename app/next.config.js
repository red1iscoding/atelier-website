module.exports = {
    output: 'export', // Enable static export
    basePath: '/your-repository-name',  // Replace with your GitHub repository name
    assetPrefix: '/your-repository-name',  // Replace with your GitHub repository name
    trailingSlash: true,  // Important for GitHub Pages to work with folder-based structure
  };
  

  module.exports = {
    webpack: (config) => {
      // Add WASM support
      config.experiments = { asyncWebAssembly: true };
      return config;
    },
    headers: async () => [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ],
  };

  // next.config.js
module.exports = {
  webpack: (config) => {
    config.experiments = { asyncWebAssembly: true };
    return config;
  }
};