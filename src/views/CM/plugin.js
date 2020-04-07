import moment from "moment"
export default {
  install(Vue, options) {
    function nowtime(dt) {
      return (
        dt.getFullYear() +
        "-" +
        (dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1) + "-" + (dt.getDate() < 10 ? "0" +
          dt.getDate() :
          dt.getDate()) + " " + (dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()) + ":" + (dt
            .getMinutes() < 10 ? "0" +
            dt.getMinutes() : dt.getMinutes()) + ":" + (dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt
              .getSeconds()));
    }
    function NewDate(str) {
      let timeIE = str.replace('-', '/').replace('-', '/')
      return timeIE
    }
    Vue.prototype.$GetX = function (startDate, endDate, space) {
      if (!endDate) {
        endDate = new Date();
      } else {
        endDate = NewDate(endDate)
      }
      if (!startDate) {
        startDate = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
      } else {
        startDate = NewDate(startDate)
      }
      if (!space) {
        space = 600 * 1000;
      } else {
        space = space * 1000;
      }
      var endTime = new Date(endDate).getTime();
      var startTime = new Date(startDate).getTime();
      var mod = endTime - startTime;
      var dateArray = [];
      // 加入结束时间
      var a = new Date();
      a.setTime(endTime);
      a = nowtime(a);
      dateArray.push(a);
      while (mod - space >= space) {
        var d = new Date();
        d.setTime(endTime - space);
        d = nowtime(d);
        dateArray.push(d);
        mod = mod - space;
        endTime = endTime - space;
      }
      // 加入开始时间
      var a = new Date();
      a.setTime(startTime);
      a = nowtime(a);
      dateArray.push(a);
      var xAxis = dateArray.reverse()
      return xAxis;
    }
  }
}