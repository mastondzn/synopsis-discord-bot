/** @type {import('cspell').CSpellUserSettings} */
const config = {
    version: '0.2',
    language: 'en',
    ignorePaths: [
        '**/coverage/**',
        '**/node_modules/**',
        '**/build/**',
        '**/*.{json,snap}',
        '.cspell.json',
        'schema.json',
        'yarn.lock',
        '.github/workflows/**',
        '.vscode/*.json',
        '.eslintrc.js',
        '.env*',
        '**/__generated__/**',
    ],
    dictionaries: [
        'typescript',
        'softwareTerms',
        'filetypes',
        'companies',
        'node',
        'en_US',
        'npm',
        'misc',
    ],
    ignoreRegExpList: [
        '/```[\\w\\W]*?```/',
        '/~~~[\\w\\W]*?~~~/',
        '/``[\\w\\W]*?``/',
        '/`[^`]*`/',
        '/\\.\\/docs\\/rules\\/[^.]*.md/',
        '\\(#.+?\\)',
        '/\\S+\\.(?:com|net|org)/',
    ],
    overrides: [
        {
            filename: '**/*.{ts,js}',
            ignoreRegExpList: ['/@[a-z]+/', '/#(end)?region/'],
            includeRegExpList: [
                '/\\/\\*[\\s\\S]*?\\*\\/|([^\\\\:]|^)\\/\\/.*$/',
                '/(\\/\\/[^\\n\\r]*[\\n\\r]+)/',
            ],
        },
    ],
    words: ['builtins'],
};

module.exports = config;
