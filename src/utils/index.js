
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
