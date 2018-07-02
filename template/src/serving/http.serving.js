/**
 * author 文全
 */

import axios from 'axios';
// import router from '../router/index'

import {
  urlBase
} from '../config'
import { Message } from 'element-ui'

import storage from './storage.serving'
import LangServing from './lang.serving'
/**
 * 封装的全局ajax请求
 */
// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    //debugger;
    const token = storage.get('token')
    if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `${token}`;
    }
    config.headers.locale  = LangServing.getLang()
    return config;
  },
  err => {
    return Promise.reject(err);
  });


axios.interceptors.response.use(
  (res) => {
    try {
      if (res.data.code == 401) {
        console.log('接口异常')
        location.href = '/login'
      }
    } catch (err) {
    }
    return res;
  },
  err => {
    if(process.env.NODE_LANG == 'en'){
      Message.error('The server opened a little difference!')
    }else{
      Message.error('服务器开了点小差！')
    }

    return Promise.reject(err);
  });
class Http {
  constructor(url = urlBase) {

    axios.defaults.baseURL = url

    axios.defaults.timeout = 100000

  }


  /**
   * GET 请求 {es6解构赋值}
   * @param type 包含url信息
   * @param data 需要发送的参数
   * @returns {Promise}
   * @constructor
   */
  async httpGet(url, resData = {}) {
    // 创建一个promise对象
    // resData = Object.assign(resData, this.locale)
    try {
      let {
        data
      } = await axios.get(url, {
        params: resData
      });
      return data;
    } catch (error) {

    }

  }

  /**
     下载
  */
  async exportGet(url, resData = {}) {
    // 创建一个promise对象
    // resData = Object.assign(resData, this.locale)
    try {
      let {
        data
      } = await axios({
        url,
        method: 'get',
        params: resData,
        responseType: 'blob'
      });
      return data;
    } catch (error) {

    }

  }

  /**
   * POST 请求
   * @param type Object 包含url信息
   * @param data Object 需要发送的参数
   * @returns {Promise}
   * @constructor
   */
  async httpPost(url, resData = {}) {
    // 创建一个promise对象

    try {
      // resData = Object.assign(resData, this.locale)
      let {
        data
      } = await axios.post(url, resData);
      if (data.code == 500) {
        Message.error('接口异常')
        console.error(500);
        //router.push('/')
      }
      return data;
    } catch (error) {
      console.log(error)
    }

  }






  /**
   * formDate
   */

  async formPost(url, resData = {}) {
    // 创建一个promise对象
    let formDate = new FormData();
    for (let i in resData) {
      formDate.append(i, resData[i])
    }
    try {
      // resData = Object.assign(resData, this.locale)
      let {
        data
      } = await axios.post(
        url,

        formDate,

        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }
      );
      if (data.code == 500) {
        console.error(500);
        //router.push('/')
      }
      return data;
    } catch (error) {
      console.log(error)
    }

  }

  get locale() {
    return {
      locale: "zh"
    }
  }

}
export default new Http();
