/**
 * author 文全
 */

import Vue from 'vue'
import storage from './storage.serving'

let Utils = {
  storage,
};

Vue.use({
    install(Vue){
        Object.keys(Utils).forEach( item => {
            Vue.prototype[`$${item}`] = Utils[item]
        } )
    }
})
