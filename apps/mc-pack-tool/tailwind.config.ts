import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

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
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        minecraft: {
          primary: '#5B8731',
          'primary-content': '#ffffff',
          secondary: '#926C4D',
          accent: '#29D3E2',
          neutral: '#AD9F8E',
          'base-100': '#1d232a',
          'base-200': '#191e24',
          'base-300': '#15191e',
          info: '#42adff',
          success: '#16a34a',
          warning: '#facc15',
          error: '#ff4d4f',
        },
      },
    ],
  },
} satisfies Config;
