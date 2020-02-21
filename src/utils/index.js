
import Vue from 'vue'

/**
 * 订单确认模板对象
 * @param {*} productName 产品名称
 * @param {*} configInfo 配置信息
 * @param {*} price 单价
 * @param {*} payment 付费方式
 * @param {*} expirydate 购买时长
 * @param {*} cost 费用
 * @param {*} number 数量
 * @param {*} discount 优惠
 */
export function orderCheckInfo(productName, configInfo, price, payment, expirydate, cost, number = 1, discount = '无') {
  return {
    productName,
    configInfo,
    price,
    payment,
    expirydate,
    cost,
    number,
    discount,
  }
}
// 函数截流
export const throttle = (fn, delay = 200) => {
  let timer
  let last
  return function (...args) {
    const now = +new Date()
    if (last && last - now < delay) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, delay);
    } else {
      last = now
      fn.apply(this, args)
    }
  }
}

/**
 * 字符串转字节数组
 * @param {*} str 
 */
export function toUTF8Array(str) {
  var utf8 = [];
  for (var i=0; i < str.length; i++) {
      var charcode = str.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6), 
                    0x80 | (charcode & 0x3f));
      }
      else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12), 
                    0x80 | ((charcode>>6) & 0x3f), 
                    0x80 | (charcode & 0x3f));
      }
      // surrogate pair
      else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                    | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18), 
                    0x80 | ((charcode>>12) & 0x3f), 
                    0x80 | ((charcode>>6) & 0x3f), 
                    0x80 | (charcode & 0x3f));
      }
  }
  return utf8;
}
/**
 * 清除登录信息
 */
export function clearLoginInfo() {
  Vue.cookie.delete('token')
  Vue.cookie.delete('userId')
  Vue.cookie.delete('uuid')
  Vue.cookie.delete('userType')
  Vue.cookie.delete('JSESSIONID')
  Vue.cookie.delete('uin')
  Vue.cookie.delete('proxyType')
  Vue.cookie.delete('lock_state')
  Vue.cookie.delete('username')
  Vue.cookie.delete('subAccountName')
}

// 跳转首页
export function toHomepage() {
  window.location.href = `${process.env.VUE_APP_PORTAL_URL}`
}
// 跳转登录页面
export function toLogin(url = '') {
  window.location.href = `${process.env.VUE_APP_LOGIN_URL}?url=${url}`
}
// 跳转用户中心
export function toUserinfo() {
  window.location.href = `${process.env.VUE_APP_OA_URL}`
}
// 跳转控制台
export function toConsole() {
  window.location.href = `${process.env.VUE_APP_CONSOLE_URL}`
}

// 扁平对象
export const flatObj = (obj, prefix = '', result = {}) => {
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      if (Object.prototype.toString.call(item) === '[object Object]') {
        return flatObj(item, `${prefix}.${index}`, result)
      } else if (Array.isArray(item)) {
        return flatObj(item, `${prefix}.${index}`, result)
      } else {
        result[`${prefix}.${index}`] = item
      }
    })
  } else {
    Object.keys(obj).forEach(k => {
      if (Object.prototype.toString.call(obj[k]) === '[object Object]') {
        return flatObj(obj[k], prefix ? `${prefix}.${k}` : k, result)
      } else if (Array.isArray(obj[k])) {
        return flatObj(obj[k], prefix ? `${prefix}.${k}` : k, result)
      } else {
        result[prefix ? `${prefix}.${k}` : k] = obj[k]
      }
    })
  }
  return result
}

/**
 * 把对象的每一个key转成对象数组
 * @param {Object} obj 要转换的对象
 * @param {String} key 对象数组key 默认name
 * @param {String} val 对象数组val 默认value
 * {
 *  a: 1,
 *  b: 2,
 * }
 * =>
 * [{a: 1}, {b: 2}]
 */
export const obj2Arr = (obj, key='name', val='value') => Object.keys(obj).map(k => ({ [key]: obj[k], [val]: k }))

/**
 * 把对象的 key value互换添加到新的key 不适应value为对象类型
 * @param {Object} obj 
 * {
 *  a: 1,
 *  b: 2,
 * }
 * =>
 * {
 *  a: 1, b: 2, 1: a, 2: 2
 * }
 */
export const addVal2Key = obj => {
  const result = {
    ...obj
  }
  Object.keys(result).forEach(k => result[result[k]] = k)
  return result
}