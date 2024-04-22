import { Config } from "tailwindcss";

export default {
  content: ["src/**/*.ts", "!src/api/**"],
  theme: {
    extend: {
      colors: {
        base: "#121212"
      }
    }
  },
  plugins: []
} satisfies Config;
