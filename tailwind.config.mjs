/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        /*darkBlue: '#1F3A6D',
        lightBlue: '#4A90E2',
        orange: '#FF7043',
        coolGray: '#F5F5F5',
        charcoal: '#333333',
        white: '#FFFFFF',
        green: '#66BB6A',
        red: '#FF3D47',*/
      },
    },
  },
  plugins: [],
};
