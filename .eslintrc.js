module.exports = {
    env: {
        browser: false,
        es6: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        project: 'tsconfig.json',
    },
    plugins: [
        '@typescript-eslint',
        'eslint-comments',
        'jest',
        'sort-keys-fix',
        'simple-import-sort',
        'promise',
        'unicorn',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:eslint-comments/recommended',
        'plugin:promise/recommended',
        'plugin:unicorn/recommended',
        'plugin:jest/recommended',
        'prettier',
    ],
    rules: {
        // sorting imports and object keys
        'simple-import-sort/exports': 'warn',
        'simple-import-sort/imports': 'warn',
        'sort-keys-fix/sort-keys-fix': 'warn',
    },
    settings: {},
};
