import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import path from "path";
import fs from "fs";
import archiver from "archiver";

const zipDistFolder = () => {
  return {
    name: "zip-dist-folder",
    closeBundle: () => {
      const output = fs.createWriteStream(
        path.resolve(__dirname, "extension.zip")
      );
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => {
        console.log(`✅ Zipped extension.zip [${archive.pointer()} bytes]`);
      });

      archive.on("error", (err) => {
        throw err;
      });

      archive.pipe(output);
      archive.directory(path.resolve(__dirname, "dist"), false);

      archive.finalize();
    },
  };
};

const injectTwitchHelper = () => {
  return {
    name: "inject-twitch-helper",
    transformIndexHtml(html) {
      // Insert Twitch helper before the first Vite module script
      return html.replace(
        /(<script type="module".*?src=".*?panel\.js".*?><\/script>)/,
        `<script src="https://extension-files.twitch.tv/helper/v1/twitch-ext.min.js"></script>\n$1`
      );
    },
  };
};

export default defineConfig({
  base: "./",
  plugins: [react(), injectTwitchHelper(), zipDistFolder()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        config: resolve(__dirname, "config.html"),
        video_overlay: resolve(__dirname, "video_overlay.html"),
        panel: resolve(__dirname, "panel.html"),
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
