import { clearLoginInfo } from '@/utils'

let lastTime = new Date().getTime();
let currentTime = new Date().getTime();
let timeOut = 60 * 60 * 1000; //设置超时时间： 60分钟
  
window.onload = function () {
  window.document.onmousedown = function () {
    lastTime = new Date().getTime()
  }
};
function checkTimeout() {
  currentTime = new Date().getTime(); //更新当前时间
  if (currentTime - lastTime > timeOut) { //判断是否超时
    clearLoginInfo()
    window.location.href = 'http://60.199.168.20/WEB_TFC2/SitePages/UserLogin.aspx'
  }
}
  
/* 定时器 间隔30秒检测是否长时间未操作页面 */
window.setInterval(checkTimeout, 5 * 60 * 1000);   // 5分钟检查一次