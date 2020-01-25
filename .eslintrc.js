module.exports = {
    'env': {
        'es6': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
        'process': 'readonly',
        'describe': true,
        'it': true,
        'expect': true,
        'console': true,
    },
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'rules': {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],

        'function-paren-newline': ['error', 'consistent'],
        'max-len': 0,
        'no-param-reassign': [2, { 'props': false }],
        'global-require': 0,
        'comma-dangle': 0,

        'no-underscore-dangle': ['error', { 'allow': ['resp', '_fields', '_stats'] }],

        'no-restricted-syntax': 0,

        'import/prefer-default-export': ['off', { caseSensitive: false }],

        'object-curly-newline': ['error', { 'multiline': true, 'consistent': true }],

        'complexity': ['error', { 'max': 5 },]
    }
};
