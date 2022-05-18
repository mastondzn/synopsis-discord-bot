/** @type {import('@types/prettier').Config} */
const config = {
    overrides: [
        {
            files: ['*.ts'],
            options: {
                parser: 'typescript',
            },
        },
    ],
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    useTabs: false,
};

module.exports = config;
