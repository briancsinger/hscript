module.exports = {
    tabWidth: 4,
    arrowParens: 'always',
    trailingComma: 'all',
    proseWrap: 'always',
    singleQuote: true,
    overrides: [
        {
            files: '**/package.json',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '**/*.yaml',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '**/Dockerfile',
            options: {
                tabWidth: 2,
            },
        },
    ],
};
