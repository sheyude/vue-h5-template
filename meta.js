const path = require('path')
const fs = require('fs')

const {
  sortDependencies,
  installDependencies,
  runLintFix,
  printMessage,
} = require('./utils')
const pkg = require('./package.json')

const templateVersion = pkg.version

const { addTestAnswers } = require('./scenarios')

module.exports = {
  metalsmith: {
    // When running tests for the template, this adds answers for the selected scenario
    before: addTestAnswers
  },
  helpers: {
    if_or(v1, v2, options) {

      if (v1 || v2) {
        return options.fn(this)
      }

      return options.inverse(this)
    },
    template_version() {
      return templateVersion
    },
  },
  
  prompts: {
    name: {
      when: 'isNotTest',
      type: 'string',
      required: true,
      message: '项目名称',
    },
    description: {
      when: 'isNotTest',
      type: 'string',
      required: false,
      message: '项目介绍',
      default: 'Merculet Project Vue',
    },
    author: {
      when: 'isNotTest',
      type: 'string',
      message: '作者',
    },
    build: {
      when: 'isNotTest',
      type: 'list',
      message: 'Vue 编译',
      choices: [
        {
          name: '运行时+编译器：建议大多数用户使用',
          value: 'standalone',
          short: 'standalone',
        },
        {
          name:
            '仅适用于运行时间：最小+ gzip约轻6KB，但模板（或任何特定于Vue的HTML）只能在.vue文件中使用 - 其他位置需要渲染功能',
          value: 'runtime',
          short: 'runtime',
        },
      ],
    },
    router: {
      when: 'isNotTest',
      type: 'confirm',
      message: '是否安装路由 vue-router?',
    },
    autoInstall: {
      when: 'isNotTest',
      type: 'list',
      message:
        '项目创建完成后，我们是否应该为你运行`npm install`？ （推荐的）',
      choices: [
        {
          name: '是的，使用 NPM',
          value: 'npm',
          short: 'npm',
        },
        {
          name: '是的，使用 Yarn',
          value: 'yarn',
          short: 'yarn',
        },
        {
          name: '不，我会自己处理',
          value: false,
          short: 'no',
        },
      ],
    },
  },
  filters: {
    '.eslintrc.js': 'lint',
    '.eslintignore': 'lint',
    'config/test.env.js': 'unit || e2e',
    'build/webpack.test.conf.js': "unit && runner === 'karma'",
    'test/unit/**/*': 'unit',
    'test/unit/index.js': "unit && runner === 'karma'",
    'test/unit/jest.conf.js': "unit && runner === 'jest'",
    'test/unit/karma.conf.js': "unit && runner === 'karma'",
    'test/unit/specs/index.js': "unit && runner === 'karma'",
    'test/unit/setup.js': "unit && runner === 'jest'",
    'test/e2e/**/*': 'e2e',
    'src/router/**/*': 'router',
  },
  complete: function(data, { chalk }) {
    const green = chalk.green

    sortDependencies(data, green)

    const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

    if (data.autoInstall) {
      installDependencies(cwd, data.autoInstall, green)
        .then(() => {
          return runLintFix(cwd, data, green)
        })
        .then(() => {
          printMessage(data, green)
        })
        .catch(e => {
          console.log(chalk.red('Error:'), e)
        })
    } else {
      printMessage(data, chalk)
    }
  },
}
