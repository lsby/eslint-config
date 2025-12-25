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
    // ==================== 避免安全漏洞 ====================
    // 拒绝any
    '@typescript-eslint/no-unsafe-assignment': 'error',
    // 禁止类属性使用确定赋值断言语法
    '@lsby/no-definite-assignment-assertion': 'error',
    // 禁止非空断言运算符
    '@typescript-eslint/no-non-null-assertion': 'error',

    // ==================== 检查无意义的写法 ====================
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
    // 检查无意义的比较
    '@typescript-eslint/no-unnecessary-condition': ['error', { allowConstantLoopConditions: true }],

    // ==================== 异步安全 ====================
    // 拒绝浮动promise
    '@typescript-eslint/no-floating-promises': 'error',
    // await必须要等待thenable
    '@typescript-eslint/await-thenable': 'error',

    // ==================== 避免陷阱 ====================
    // 禁止使用Object.assign, 它的行为是浅拷贝, 会污染第一个参数
    'es/no-object-assign': 'error',

    // ==================== 信息需要写完整 ====================
    // 必须标注函数返回类型
    '@typescript-eslint/explicit-function-return-type': ['error', {}],
    // 必须为类的属性和方法显式写访问修饰符
    '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],

    // ==================== 不依赖非布尔条件 ====================
    // 永远使用 === 而不是 ==, 在一些情况下能自动修复
    eqeqeq: ['error', 'always'],
    // 条件里必须明确写布尔值, 以避免if('')被理解为假的情况
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      {
        allowString: false,
        allowNumber: false,
        allowNullableObject: false,
      },
    ],
    // 在除了条件表达式的地方, 使用??而不是||
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    // 禁止对非布尔值使用取反
    // 对于 number | null 的值x, if(!x)在x等于null和0时都会触发, 这可能是非预期的
    '@lsby/no-negation': 'error',

    // ==================== 优化心智 ====================
    // 禁止使用undefined
    // 因为我们不需要两个空值, 总是使用null会更明确
    // 但js的原生方法返回的都是undefined, 这时候用void 0代替
    'no-undefined': 'error',

    // ==================== 反虚假安全 ====================
    // 永远使用let, 拒绝var和const, 并自动修复
    //
    // # 原因:
    // ## 抽象泄漏
    // 使用const时, 通常我们**实际**想表达的意图是"该值不可变", 但const没有完全兑现这个意图
    // 设计上, const只约束原语值和指针不变, 不约束引用值本身不变
    // 使用者要搞懂什么可变什么不可变, 必须理解原语值和引用值的区别, 以及变量在内存上的机制
    // 这种"必须搞懂背后的原理才能正常使用"的情况是显然的抽象泄漏
    // ## 误导
    // 对于新人, 很容易被误解, 导致引用值被意外修改
    // ## 心智成本
    // 实际使用时, 即使是const声明值, 也必须确认其是否为引用类型, 若是则还是需要确认所有可能的修改
    // 这与let无异, 反而增加了心智成本
    // ## 滑坡
    // **错误的信息比没有信息更糟糕, 不完全的限制比没有限制更糟糕**
    // 没有信息时人会自己去查, 而错误的信息会带来误导
    // 没有限制时人会考虑边界, 不完全的限制则导致要么完全不考虑边界(因为认为有兜底), 要么更小心的考虑边界(区分哪些是兜底, 哪些是没有兜底的)
    // 这不是加强培训能解决的, 人是不可信任和漏洞百出的, 必须通过形式约束才能让我们建立对代码的信心
    // 让我们想想墨菲定律: 任何可能出错的事情最终一定会出错
    // 如果我们放任使用这种很容易被误解的特性, 在大型项目中, 在足够长的时间后, 一定会出现我们不想看到的那种写法
    //
    // # 替代:
    // 如果真的需要表达不变, 应该使用类型等级的递归只读, 建模隐藏等方法
    // 这虽然复杂度更高, 但可以真正保证安全
    // 这也迫使程序员思考是否真的有必要这样设计, 而不是"随手一用", 提供一个"虚假的安全感"
    '@lsby/prefer-let': 'error',

    // ==================== 反兜底 ====================
    // 这几条规则的意图是, 避免当状态扩展后, 新状态被默默归类到兜底分支中
    // 例如, else 表示"除当前条件外的所有可能"
    // 但当状态在未来被扩展时, 扩展的状态依然会被包含在else分支里, 导致状态遗漏却无任何报错
    // 此时, 应该考虑使用提前返回或switch穷尽所有可能, 而不是提供一个默默吃掉所有新状态的兜底逻辑
    // 这几条规则包括:
    // - switch的case必须穷尽
    // - 不允许switch的default分支
    // - 对字面量枚举的if-else判断应该用switch穷尽
    '@typescript-eslint/switch-exhaustiveness-check': 'error',
    '@lsby/no-switch-default': 'error',
    '@lsby/prefer-switch-for-literal-enum': 'error',
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
