import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  {
    ignores: ['dist', '.output', '.wrangler', 'node_modules', 'coverage', 'public'],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React Compiler diagnostics. The compiler rules merged into
  // eslint-plugin-react-hooks v6+, so the plugin already ships them.
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      // Promote the load-bearing diagnostics from warn to error so a silent
      // compiler bail fails the build instead of shipping a re-render bug.
      'react-hooks/unsupported-syntax': 'error',
      'react-hooks/immutability': 'error',
      'react-hooks/purity': 'error',
      'react-hooks/refs': 'error',
      'react-hooks/set-state-in-render': 'error',
      'react-hooks/set-state-in-effect': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },

  {
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        matchMedia: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        ResizeObserver: 'readonly',
        IntersectionObserver: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
      },
    },
  },
);
