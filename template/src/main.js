// The Vue build version to load with the `import` command

import Vue from 'vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import './serving'
import zhCN from './lang/zh-cn'
import EN from './lang/en'

Vue.use(VueI18n);

Vue.config.productionTip = true

/*---------使用语言包-----------*/


const i18n = new VueI18n({
  locale:'zh-cn', // 语言标识
  messages: {
    'zh-cn': Object.assign(zhCN), // 中文语言包
    'en': Object.assign(EN), // 英文语言包

  },
})


/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  i18n,
  router,
  components: {
    App
  },
  template: '<App/>'
})


