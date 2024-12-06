import lsbyEslint from '@lsby/eslint-plugin'
import type { Linter } from 'eslint'
import jsdoc from 'eslint-plugin-jsdoc'
import reacteslint from 'eslint-plugin-react'
import reacteslinthooks from 'eslint-plugin-react-hooks'
import sortClassMembers from 'eslint-plugin-sort-class-members'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import tseslint from 'typescript-eslint'

export var 常用作用域 = ['src/**/*.ts', 'src/**/*.tsx', 'test/**/*.ts', 'test/**/*.tsx']
export var 常用忽略域 = ['node_modules', 'dist', 'coverage', 'out']

export var 忽略常见文件夹: Linter.Config = {
  ignores: 常用忽略域,
}

export var ts安全性: Linter.Config = {
  files: 常用作用域,
  languageOptions: {
    parser: tseslint.parser as any,
    parserOptions: {
      projectService: true,
    },
  },
  plugins: {
    '@typescript-eslint': tseslint.plugin as any,
    '@lsby': lsbyEslint,
    unicorn: eslintPluginUnicorn,
  },
  rules: {
    // 拒绝any
    '@typescript-eslint/no-unsafe-assignment': 'error',

    // 检查无意义的比较
    '@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }],

    // 拒绝浮动promise
    '@typescript-eslint/no-floating-promises': 'error',

    // 必须标注函数返回类型
    '@typescript-eslint/explicit-function-return-type': ['error', {}],

    // 检查没有使用的变量
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    // 禁止非空断言运算符
    '@typescript-eslint/no-non-null-assertion': 'error',

    // 永远使用let, 拒绝var和const, 并自动修复
    '@lsby/prefer-let': 'error',

    // 永远使用 === 而不是 ==, 在一些情况下能自动修复
    eqeqeq: ['error', 'always'],

    // 在除了条件表达式的地方, 使用??而不是||
    '@typescript-eslint/prefer-nullish-coalescing': 'error',

    // 禁止使用取反
    // 对于 number | null 的值x, if(!x)在x等于null和0时都会触发, 这可能是非预期的
    '@lsby/no-negation': 'error',

    // 禁止使用null
    // 因为null和undefined有区别, 我们不需要两个空值
    // 而js的方法返回的都是undefined
    // 只要我们注意JSON上的转换, 就没有问题
    'unicorn/no-null': 'error',
  },
}

export var jsDoc安全性: Linter.Config = {
  files: 常用作用域,
  plugins: {
    jsdoc: jsdoc,
  },
  rules: {
    // jsdoc的link必须存在
    'jsdoc/no-undefined-types': 'error',
  },
}

export var react安全性: Linter.Config = {
  files: 常用作用域,
  plugins: {
    react: reacteslint,
    'react-hooks': reacteslinthooks,
  },
  settings: {
    react: { version: 'detect' },
  },
  rules: {
    // 迭代元素必须有key
    'react/jsx-key': 'error',
    // 不可以出现重复的属性
    'react/jsx-no-duplicate-props': 'error',
    // 不可以用数组的索引做key, 因为react是依据位置决定是否重新渲染的
    'react/no-array-index-key': 'error',
    // 不可以在jsx中出现没有转换的html实体
    'react/no-unescaped-entities': 'error',
    // 不可以使用非预定的属性
    'react/no-unknown-property': 'error',
    // 不应该多传props
    'react/prefer-exact-props': 'error',
    // 只在顶层调用hook 和 仅从react函数调用hook
    'react-hooks/rules-of-hooks': 'error',
    // hook的依赖必须被正确声明
    'react-hooks/exhaustive-deps': 'error',
  },
}

export var 风格美化: Linter.Config = {
  files: 常用作用域,
  plugins: {
    'sort-class-members': sortClassMembers,
  },
  rules: {
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

export var 推荐配置: Linter.Config[] = [
  // ..
  忽略常见文件夹,
  ts安全性,
  jsDoc安全性,
  风格美化,
]
export var 前端推荐配置: Linter.Config[] = [
  // ..
  忽略常见文件夹,
  ts安全性,
  react安全性,
  jsDoc安全性,
  风格美化,
]
