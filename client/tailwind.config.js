export default {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./features/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(214 32% 91%)",
        background: "hsl(210 40% 98%)",
        foreground: "hsl(222 47% 11%)",
        primary: "hsl(221 83% 53%)",
        muted: "hsl(215 16% 47%)"
      }
    }
  },
  plugins: []
};
