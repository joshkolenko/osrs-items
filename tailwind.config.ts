import type { Config } from 'tailwindcss';

import typography from '@tailwindcss/typography';
import daisy from 'daisyui';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [typography, daisy],
  daisyui: {
    themes: ['dracula'],
  },
};
export default config;
