module.exports = {
  content: ['./src/**/*.{html,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        minecraft: {
          primary: '#5e7c16',
          secondary: '#d6a34b',
          accent: '#3c44aa',
          neutral: '#3d4451',
          'base-100': '#ffffff',
          info: '#2094f3',
          success: '#2cca45',
          warning: '#ff9900',
          error: '#f87272',
        },
      },
      {
        'minecraft-dark': {
          primary: '#3b5111',
          secondary: '#b3841c',
          accent: '#2c356d',
          neutral: '#292524',
          'base-100': '#1d232a',
          info: '#66c6ff',
          success: '#5af78e',
          warning: '#ffb86c',
          error: '#ff6656',
        },
      },
    ],
  },
};
