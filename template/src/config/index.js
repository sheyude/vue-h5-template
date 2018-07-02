


let urlBase

// 线上生产环境
if(process.env.NODE_EVENT == 'prod'){
  if(process.env.NODE_LANG == 'en'){
    // 线上生产环境 国外
    urlBase = "https://merculet-mgnt.xxxxx.io"
  }else{
    // 线上生产环境 国内
    urlBase = "https://mb-mgnt.xxxx.cn"
  }
}else{
  // 测试版或者开发板
  if(process.env.NODE_LANG == 'en'){
    urlBase = "http://merculet-mgnt.xxxx.cn"
  }else{
    urlBase = "http://merculet-mgnt-cn.xxxx.cn"
  }
}



export {
    urlBase,
}

