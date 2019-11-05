/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 大小写字母、数字、以及_
 * @param {*} s
 */
export function isYan (s) {
  return /^[0-9a-zA-Z_]*$/g.test(s)
}


/**
 * 大小写字母、数字
 * @param {*} s
 */
export function isYan1 (s) {
  return /^[0-9a-zA-Z]*$/g.test(s)
}