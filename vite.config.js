import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  return {
    // Build configuration for Shopify theme
    build: {
      // Output compiled files to Shopify's assets directory
      outDir: 'assets',
      
      // Don't empty the assets folder (preserve other Shopify assets)
      emptyOutDir: false,
      
      // Configure entry points for your JS and CSS
      rollupOptions: {
        input: {
          // Add your entry points here
          main: path.resolve(__dirname, 'src/main.js'),
          // Example: product: path.resolve(__dirname, 'src/product.js'),
        },
        output: {
          // Output JS files with simple names (no hash)
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          
          // Output CSS files with simple names
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return '[name].css';
            }
            return '[name].[ext]';
          },
        },
        // Watch options - only apply during watch mode (npm run dev)
        watch: {
          exclude: ['assets/**', 'node_modules/**'],
        },
      },
      
      // Minify in production mode
      minify: mode === 'production' ? 'esbuild' : false,
      
      // Generate source maps in development
      sourcemap: mode === 'development' ? 'inline' : false,
      
      // Don't inline small assets as base64
      assetsInlineLimit: 0,
    },
    
    // Configure CSS
    css: {
      // PostCSS will use your tailwind config automatically
      postcss: './postcss.config.js',
    },
  };
});
