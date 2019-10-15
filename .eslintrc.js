module.exports = {
  extends: 'airbnb-base',
  plugins: ['svelte3'],
  rules: {
    'comma-dangle': ['error', 'never'],
    semi: ['error', 'never']
  },
  overrides: [{
    files: ['**/*.svelte'],
    processor: 'svelte3/svelte3',
    rules: {
      'import/no-mutable-exports': 'off',
      'import/prefer-default-export': 'off'
    }
  }],
  settings: {
    'svelte3/ignore-styles': () => true
  },
  env: {
    jest: true
  }
}
