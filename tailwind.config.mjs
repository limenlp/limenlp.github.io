import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lime: {
          50:  '#f5f9ec',
          100: '#e6f0cd',
          200: '#c9df9a',
          300: '#a4cc66',
          400: '#80b539',
          500: '#669920',
          600: '#527c19',
          700: '#3f5d1b',
          800: '#34491c',
          900: '#2d3e1c',
          950: '#15220a',
        },
        ink: {
          50: '#f6f7f9',
          100: '#ebedf2',
          200: '#d4d8e2',
          300: '#aeb6c7',
          400: '#828ea7',
          500: '#62708d',
          600: '#4d5a74',
          700: '#3f4a5e',
          800: '#363f4f',
          900: '#303744',
          950: '#1f242e',
        },
        // Persimmon (柿红) — warm accent for hover, shared with jyzhao.net
        persimmon: {
          DEFAULT: '#E44821',
          50:  '#fdeee9',
          100: '#fbd5c8',
          200: '#f6a78d',
          300: '#f17a52',
          400: '#ec5e33',
          500: '#E44821',
          600: '#bf3818',
          700: '#962a12',
          800: '#6d1e0d',
          900: '#491408',
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        display: ['"Recursive Variable"', 'Recursive', '"Inter Variable"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        prose: '70ch',
      },
      typography: ({ theme }) => ({
        ink: {
          css: {
            '--tw-prose-body': theme('colors.ink.800'),
            '--tw-prose-headings': theme('colors.ink.950'),
            '--tw-prose-lead': theme('colors.ink.700'),
            '--tw-prose-links': theme('colors.lime.700'),
            '--tw-prose-bold': theme('colors.ink.950'),
            '--tw-prose-counters': theme('colors.ink.500'),
            '--tw-prose-bullets': theme('colors.ink.300'),
            '--tw-prose-hr': theme('colors.ink.100'),
            '--tw-prose-quotes': theme('colors.ink.900'),
            '--tw-prose-quote-borders': theme('colors.lime.300'),
            '--tw-prose-captions': theme('colors.ink.500'),
            '--tw-prose-code': theme('colors.ink.900'),
            '--tw-prose-pre-code': theme('colors.ink.100'),
            '--tw-prose-pre-bg': theme('colors.ink.950'),
            '--tw-prose-th-borders': theme('colors.ink.200'),
            '--tw-prose-td-borders': theme('colors.ink.100'),
            maxWidth: '70ch',
            a: {
              fontWeight: '500',
              textDecorationColor: theme('colors.lime.400'),
              textUnderlineOffset: '4px',
              '&:hover': {
                color: theme('colors.persimmon.500'),
                textDecorationColor: theme('colors.persimmon.300'),
              },
            },
            code: {
              fontWeight: '500',
              backgroundColor: theme('colors.ink.100'),
              padding: '0.15rem 0.35rem',
              borderRadius: '0.25rem',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            blockquote: {
              fontStyle: 'normal',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
