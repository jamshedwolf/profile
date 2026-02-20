import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Expose REACT_APP_ environment variables
      'import.meta.env.REACT_APP_SUPABASE_URL': JSON.stringify(env.REACT_APP_SUPABASE_URL || ''),
      'import.meta.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY': JSON.stringify(env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ''),
    },
     assetsInclude: ["**/*.jpg", "**/*.png", "**/*.jpeg"],
  };
});
