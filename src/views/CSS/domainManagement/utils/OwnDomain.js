const ownDomain1 = "myqcloud.com";

// 判断是否是自有域名
// 参数：域名
let isOwnDomain = function(domain) {
  if (domain.endsWith(ownDomain1)) {
    return true;
  }
  return false;
};

export { isOwnDomain };
