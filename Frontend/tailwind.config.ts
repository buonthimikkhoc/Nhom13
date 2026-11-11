import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Hệ màu chuẩn xác theo yêu cầu người dùng:
        // 1. #001C44 (Deep Midnight Navy)
        // 2. #0C5776 (Deep Ocean Teal)
        // 3. #2D99AE (Vibrant Teal / Cerulean)
        // 4. #BCFEFE (Ice Cyan Glow)
        // 5. #F8DAD0 (Soft Blossom Peach)
        palette: {
          navy: "#001C44",
          deepTeal: "#0C5776",
          teal: "#2D99AE",
          iceCyan: "#BCFEFE",
          peach: "#F8DAD0",
        },
        brand: {
          50: "#f0fbfb",
          100: "#e0f8f8",
          200: "#bcfefe", // Ice Cyan
          300: "#76e1e7",
          400: "#2d99ae", // Vibrant Teal
          500: "#0c5776", // Deep Ocean Teal
          600: "#08455e",
          700: "#053448",
          800: "#001c44", // Deep Midnight Navy
          900: "#001433",
        },
        // Ánh xạ dải màu blue của toàn trang web sang tông màu teal/cyan mới một cách tự nhiên
        blue: {
          50: "#f0fbfb",
          100: "#e0f8f8",
          200: "#bcfefe",
          300: "#76e1e7",
          400: "#2d99ae",
          500: "#147091",
          600: "#0c5776",
          700: "#08455e",
          800: "#001c44",
          900: "#001433",
          950: "#000f26",
        },
        tech: {
          red: "#e04f44",
          peach: "#f8dad0",
          dark: "#001c44",
          card: "#082e52",
        },
      },
    },
  },
  plugins: [],
};
export default config;
