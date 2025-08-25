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
      archive.directory(path.resolve(__dirname, "dist"), false); // false = flatten dist/

      archive.finalize();
    },
  };
};

export default defineConfig({
  base: "./",
  plugins: [react(), zipDistFolder()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        config: resolve(__dirname, "config.html"),
        video_overlay: resolve(__dirname, "video_overlay.html"),
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
