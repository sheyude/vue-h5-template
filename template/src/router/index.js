/**
 * author 文全
 */


import Vue from 'vue'
import Router from 'vue-router'




const Index = (resolve) => {
  require.ensure([], () => {
    resolve(require('../views/index.vue'))
  })
}





Vue.use(Router)

const router = new Router({
  mode: 'history',  // 设置地址栏模式 默认是hash
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '',
      name: 'index',
      component: Index,
    },
    
  ]
})

export default router;
