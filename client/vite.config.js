import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { analyzer } from "vite-bundle-analyzer";
import compression from "compression";

// TODO: check this out later
// import { bundleStats } from "rollup-plugin-bundle-stats";

export default defineConfig(() => {
  const plugins = [
    react({}),
    // Custom compression plugin for dev mode
    {
      name: "dev-compression",
      configureServer(server) {
        console.log("🔧 Configuring compression middleware...");

        server.middlewares.use(
          compression({
            level: 1, // Fast gzip compression (1-9, where 1 is fastest)

            // Enable brotli with optimized settings for dev
            brotli: {
              enabled: true,
              zlib: {
                level: 1, // Fast brotli compression (0-11, where 1 is fast)
                chunkSize: 1024, // Smaller chunks for faster processing
              },
            },

            filter: (req) => {
              // Skip HMR and dev-specific requests
              if (req.url?.includes("/__vite_ping")) {
                return false;
              }

              return true;
            },

            threshold: 512, // Compress files larger than 512 bytes
          })
        );

        console.log(
          "✅ Compression middleware (gzip + brotli) enabled for dev server"
        );
      },
    },
  ];

  // Only add analyzer in analyze mode
  if (process.env.ANALYZE === "true") {
    plugins.push(analyzer());
  }

  return {
    plugins,
    root: "src",
    publicDir: "../public",
    build: {
      outDir: path.resolve(__dirname, "..", "server", "public"),
      emptyOutDir: true,
      // Disable source maps in production to avoid size issues
      sourcemap: false,
    },
    resolve: {
      alias: {
        "highlight.js": path.resolve(__dirname, "node_modules/highlight.js"),
      },
    },
    server: {
      port: 80,
    },
  };
});
