import { Config } from "tailwindcss";

export default {
  content: ["src/**/*.ts", "!src/api/**"],
  theme: {
    extend: {}
  },
  plugins: []
} satisfies Config;
