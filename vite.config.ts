import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { applyPageMetadataToHtml, pageMetadata } from "./src/lib/metadata";

export function routeMetadataPlugin(): Plugin {
  return {
    name: "route-metadata",
    apply: "build",
    enforce: "post",
    transformIndexHtml: {
      order: "post",
      handler(html, context) {
        return context.path === "/index.html"
          ? applyPageMetadataToHtml(html, pageMetadata.home)
          : html;
      },
    },
    generateBundle(_options, bundle) {
      const index = bundle["index.html"];
      if (!index || index.type !== "asset") {
        this.error("The homepage HTML must be emitted before route metadata is applied.");
      }
      const html =
        typeof index.source === "string" ? index.source : new TextDecoder().decode(index.source);
      for (const metadata of [pageMetadata.imprint, pageMetadata.privacy]) {
        this.emitFile({
          type: "asset",
          fileName: `${metadata.path.slice(1)}/index.html`,
          source: applyPageMetadataToHtml(html, metadata),
        });
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), routeMetadataPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
