import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",  // Use "/" with a custom domain. Change to "/IEEE-YorkU/" ONLY if deploying to username.github.io/IEEE-YorkU without a custom domain (and prefix all image paths in siteData.js too).
  server: {
    port: 3000
  }
});
