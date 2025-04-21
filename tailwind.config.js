/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'text-red-500',
    'bg-blue-500',
    'lg:col-span-2',
    'lg:col-span-4',
    'lg:col-span-6',
    'lg:col-span-8',
    'lg:flex',
    'hidden',
    'lg:block',
    'lg:grid',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // Add dark mode specific colors if needed
      // Example:
      // colors: {
      //   'brand-primary': {
      //     light: '#ff9f0d',
      //     dark: '#e58b0a', // A slightly different shade for dark mode
      //   },
      // }
    },
  },
  plugins: [],
};
