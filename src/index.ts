import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin'
import typescriptEslintParser from '@typescript-eslint/parser'
import type { Linter } from 'eslint'
import jsdoc from 'eslint-plugin-jsdoc'
import sortClassMembers from 'eslint-plugin-sort-class-members'

export var 忽略常见文件夹: Linter.Config = {
  ignores: ['node_modules', 'dist', 'coverage', 'out'],
}

export var 基础ts规则: Linter.Config = {
  files: ['src/**/*.ts', 'src/**/*.tsx', 'test/**/*.ts', 'test/**/*.tsx'],
  languageOptions: {
    parser: typescriptEslintParser,
    parserOptions: { project: true },
  },
  plugins: {
    jsdoc: jsdoc,
    '@typescript-eslint': typescriptEslintPlugin.configs,
    'sort-class-members': sortClassMembers,
  },
  rules: {
    // jsdoc的link必须存在
    'jsdoc/no-undefined-types': 'error',

    // 拒绝any
    '@typescript-eslint/no-unsafe-assignment': 'error',

    // 检查无意义的比较
    '@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }],

    // 拒绝浮动promise
    '@typescript-eslint/no-floating-promises': 'error',

    // 必须标注函数返回类型
    '@typescript-eslint/explicit-function-return-type': ['error', {}],

    // 检查没有使用的变量
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      },
    ],

    // 排序类属性
    'sort-class-members/sort-class-members': [
      2,
      {
        order: [
          '[static-properties]',
          '[static-methods]',
          '[properties]',
          '[conventional-private-properties]',
          'constructor',
          '[methods]',
          '[conventional-private-methods]',
        ],
        accessorPairPositioning: 'getThenSet',
      },
    ],
  },
}
