/**
 * Inlined from @sanity/prettier-config to avoid requiring the package on
 * downstream installs (e.g. Vercel builds rooted at `frontend/`, where the
 * repo-root devDependencies are not hoisted). Keep the values in sync if you
 * bump the shared Sanity config.
 */
export default {
  endOfLine: 'lf',
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  semi: false,
  singleQuote: true,
  quoteProps: 'consistent',
  bracketSpacing: false,
  overrides: [
    {
      files: ['*.json5'],
      options: {
        quoteProps: 'preserve',
        singleQuote: false,
      },
    },
    {
      files: ['*.yml'],
      options: {
        singleQuote: false,
      },
    },
  ],
}
