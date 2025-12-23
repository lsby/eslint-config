import lsbyEslint from '@lsby/eslint-plugin'
import type { Linter } from 'eslint'
import eslintPluginEs from 'eslint-plugin-es'
import jsdoc from 'eslint-plugin-jsdoc'
import sortClassMembers from 'eslint-plugin-sort-class-members'
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
    es: eslintPluginEs,
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

    // 必须为类的属性和方法显式写访问修饰符
    '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],

    // 禁止类属性使用确定赋值断言语法
    '@lsby/no-definite-assignment-assertion': 'error',

    // 禁止无意义的类型断言
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',

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
    // 禁止const是因为它有抽象泄漏
    // 它只对原语值和指针不变, 不对引用值本身不变
    // 要搞懂什么可变什么不可变, 必须理解原语值和引用值的区别, 以及变量在内存上的机制
    // 如果真的需要表达不变, 应该在类型等级写递归只读
    '@lsby/prefer-let': 'error',

    // 永远使用 === 而不是 ==, 在一些情况下能自动修复
    eqeqeq: ['error', 'always'],

    // 禁止 else
    // else 表示"除当前条件外的所有可能"
    // 当状态集合未来扩展时, 依然会被包含在else分支里, 导致状态遗漏却无任何报错
    // 应当使用提早返回 或 switch + 穷尽检查
    'no-else-return': 'error',
    '@lsby/no-else': 'error',
    '@typescript-eslint/switch-exhaustiveness-check': 'error',

    // 在除了条件表达式的地方, 使用??而不是||
    '@typescript-eslint/prefer-nullish-coalescing': 'error',

    // 禁止对非布尔值使用取反
    // 对于 number | null 的值x, if(!x)在x等于null和0时都会触发, 这可能是非预期的
    '@lsby/no-negation': 'error',

    // 禁止使用undefined
    // 因为我们不需要两个空值, 总是使用null会更明确
    // 但js的原生方法返回的都是undefined, 这时候用void 0代替
    'no-undefined': 'error',

    // 条件里必须明确写布尔值, 以避免if('')被理解为假的情况
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      {
        allowString: false,
        allowNumber: false,
        allowNullableObject: false,
      },
    ],

    // 禁止使用Object.assign, 它的行为是浅拷贝, 会污染第一个参数
    'es/no-object-assign': 'error',

    // 检查await的thenable
    '@typescript-eslint/await-thenable': 'error',
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
