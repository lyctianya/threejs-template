module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [2, 'always', ['build', 'chore', 'ci', 'feat', 'fix', 'perf', 'docs', 'style', 'refactor', 'test', 'revert', 'config']],
        'subject-empty': [2, 'never'],
        'type-case': [0],
        'type-empty': [2, 'never'],
        'scope-empty': [0],
        'scope-case': [0],
        'subject-full-stop': [0],
        'subject-case': [0, 'never'],
        'header-max-length': [0, 'always', 72]
    }
}
