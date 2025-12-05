// .eslintrc.cjs
module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:vue/essential', // giữ theo bạn (dùng Vue2)
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    'vue',
    'import',
    'simple-import-sort'
  ],
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.json'],
      },
    },
  },
  rules: {
    // giữ rules hiện có từ file của bạn
    // 'no-console': 'error',
    // 'no-debugger': 'error',
    'no-unused-vars': 'error',
    'vue/no-unused-components': 'error',
    'vue/no-unused-vars': 'error',

    // import / path checks (thêm)
    // - lỗi nếu import không thể resolve (case sensitive)
    'import/no-unresolved': ['error', { caseSensitive: true }],
    // - disable 1 số cảnh báo không cần thiết với cách export trong project
    'import/no-named-as-default-member': 'off',

    // simple import sort - cảnh báo để bạn tidy imports
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error'
  },

  // các override cho test files giống file cũ
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: { jest: true },
    },
  ],
}
