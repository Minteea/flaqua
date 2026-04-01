import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import solid from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      include: ["**/react/*", "**/*.react.tsx"],
    }),
    solid({
      include: ["**/solid/*", "**/*.solid.tsx"],
    }),
  ],
  devToolbar: { enabled: false },
  server: {
    port: 31015,
  },
});
