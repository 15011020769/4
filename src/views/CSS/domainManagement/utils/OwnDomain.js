const ownDomain1 = "livepush.myqcloud.com";
const ownDomain2 = "liveplay.myqcloud.com";

// 判断是否是自有域名
// 参数：域名
let isOwnDomain = function(domain) {
  if (domain.endsWith(ownDomain1) || domain.endsWith(ownDomain2)) {
    return true;
  } else {
    return false;
  }
};

export { isOwnDomain };
