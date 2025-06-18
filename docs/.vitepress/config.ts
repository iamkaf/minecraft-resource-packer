import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Minecraft Resource Packer',
  description: 'Documentation',
  themeConfig: {
    nav: [
      { text: 'User Guide', link: '/user-guide' },
      { text: 'Developer Handbook', link: '/developer-handbook' },
      { text: 'Custom Sounds', link: '/custom_sounds_tutorial' },
    ],
    sidebar: [
      {
        text: 'Guides',
        items: [
          { text: 'User Guide', link: '/user-guide' },
          { text: 'Developer Handbook', link: '/developer-handbook' },
          { text: 'Custom Sounds Tutorial', link: '/custom_sounds_tutorial' },
        ],
      },
    ],
  },
});
