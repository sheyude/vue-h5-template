/**
 * 保存和获取sessionStorage
 */

 /**
 * author 文全
 */
class StorageServing {
  constructor() {}

  /**
   * 设置 sessionStorage
   * @param value 需要存的值
   * @param key 需要存key名字
   */
  set(value, key, store = window.sessionStorage) {
    try {
      // 把里面的值转换成json对象
      value = JSON.stringify(value);
    } catch (e) {
      value = value;
    }
    if (!key && !value) {
      console.error("key和value必传");
      return;
    }
    store.setItem(key, value);
  }

  /**
   * 获取 sessionStorage
   * @param key 需要获取的key
   *  return 返回value
   */
  get(key, store = window.sessionStorage) {
    let value = store.getItem(key) || "";
    if (value) {
      try {
        value = JSON.parse(value);
      } catch (e) {
        value = value;
      }
    }
    return value;
  }

  /**
   *  删除 sessionStorage
   * @param key 需要删除是key
   */
  remove(key, store = window.sessionStorage) {
    if (!key) return;
    store.removeItem(key);
  }
  clear(store = window.sessionStorage) {
    store.clear();
  }
}
export default new StorageServing();
