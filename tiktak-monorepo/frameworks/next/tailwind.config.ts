import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // In Tailwind v4, theme colors are defined in CSS using @theme directive
  // See src/app/globals.css for custom color definitions
  plugins: [
    require('tailwind-scrollbar'),
    // require('tailwindcss-animated'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
