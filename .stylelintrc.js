module.exports = {
    rules: {
        'block-no-empty': null,
        'color-no-invalid-hex': true,
        'comment-empty-line-before': [
            'always',
            {
                ignore: ['stylelint-commands', 'after-comment']
            }
        ],
        'declaration-colon-space-after': 'always',
        indentation: null,
        'rule-empty-line-before': [
            'always',
            {
                except: ['first-nested'],
                ignore: ['after-comment']
            }
        ]
    }
};
