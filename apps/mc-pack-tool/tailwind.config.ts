import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,tsx,ts,jsx,js}'],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Press Start 2P'", 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
} satisfies Config;
