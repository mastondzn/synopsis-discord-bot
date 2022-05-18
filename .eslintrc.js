/** @type {import('@types/eslint').Linter.Config} */
const config = {
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
        // sorting imports
        'simple-import-sort/exports': 'warn',
        'simple-import-sort/imports': 'warn',

        // enforce import type
        '@typescript-eslint/consistent-type-imports': 'warn',

        // NOIDONTHINKSO
        'unicorn/no-null': 'off',

        // do not replace env with 'environment' and 'args' with 'arguments'
        'unicorn/prevent-abbreviations': [
            'error',
            {
                extendDefaultReplacements: true,
                replacements: {
                    args: false,
                    env: false,
                },
            },
        ],
    },
    settings: {},
};

module.exports = config;
