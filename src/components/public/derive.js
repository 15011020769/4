import echarts from 'echarts'

// ----------------------- 导出csv start -------------------
/**
*
* @param {String} aim 界面指定元素ID
* @param {JSONObject} title 导出数据结构
* @param {JSONArray} downloadData 导出数据内容
* @returns {File}
*/
export const initDownload = (aim, title, downloadData) => {
  //暂时不做值判断
  if (downloadData instanceof Array) {
    var str = "\ufeff" + (_download_pack_data(title, downloadData));
    var blob = new Blob([str], { type: 'text/csv,charset=UTF-8' });
    var target = document.getElementById(aim);
    if (target === undefined) {
      target = document.createElement('a');
      target.href = window.URL.createObjectURL(blob);
      target.download = "fileName.csv";
    }
    if (window.navigator.msSaveOrOpenBlob) {
      target.onclick = function () {
        navigator.msSaveBlob(blob, target.getAttribute("download"));
      };
    } else {
      document.getElementById(aim).href = URL.createObjectURL(blob);
    }
  }
}

/**
 *
 * @param {type} title 格式为"{字段名1:中文标题1,字段名2:中文标题2}"
 * @param {type} obj 处理后的数据集，[{字段名1:字段值11,字段名2:字段值12},{字段名1:字段值21,字段名2:字段值22}]
 * @returns {String} 可以下载的CSV格式数据集
 */
function _download_pack_data(title, obj) {
  var str = "";
  if (title instanceof Object) {
    var cols = [],
      cvn = {};
    //pack column title
    var idx;
    for (var col in title) {
      if ((idx = col.indexOf("@")) === -1) {
        cols.push(col);
      } else {
        cols.push(col.substring(0, idx));
        cvn[col.substring(0, idx)] = col.substr(idx + 1);
      }
      str += ("\"" + title[col] + "\"" + ",");
    }
    str += "\r\n";
    //pack row stat
    if (obj instanceof Array) {
      var _tmp_key, skp;
      for (var _i = 0, _j = obj.length; _i < _j; _i++) {
        for (var i = 0, j = cols.length; i < j; i++) {
          _tmp_key = cols[i];
          if (cvn.hasOwnProperty(_tmp_key)) {
            var mk = cvn[_tmp_key];
            if ((skp = _tmp_key.indexOf(".")) !== -1) {
              _tmp_key = _tmp_key.substring(0, skp);
              str += _download_parse_Val(dict[mk][_download_parse_Val(obj[_i][_tmp_key], cols[i].substr(skp + 1)).toUpperCase()]) + ",";
            } else {
              str += _download_parse_Val(dict[mk][_download_parse_Val(obj[_i][_tmp_key]).toUpperCase()]) + ",";
            }
          } else {
            if ((skp = _tmp_key.indexOf(".")) !== -1) {
              _tmp_key = _tmp_key.substring(0, skp);
              str += _download_parse_Val(obj[_i][_tmp_key], cols[i].substr(skp + 1)) + ",";
            } else {
              str += ("\"" + _download_parse_Val(obj[_i][_tmp_key]) + "\"" + ",");
            }
          }
        }
        str += "\r\n";
      }
    }
  }
  return str;
}

function _download_parse_Val(data, key) {
  if (data === undefined) {
    return "";
  } else if (typeof (data) === "string" || data instanceof Date) {
    return data;
  } else if (typeof (data) === "number") {
    return "" + data;
  } else if (data instanceof Object) {
    var skp;
    if (key === undefined) {
      return JSON.stringify(data);
    }
    if ((skp = key.indexOf(".")) !== -1) {
      var _tmp_key = key.substring(0, skp);
      return _download_parse_Val(data[_tmp_key], key.substr(skp + 1));
    } else {
      return _download_parse_Val(data[key]);
    }
  } else if (data instanceof Array) {
    return _download_parse_Val(data[0], key);
  } else {
    console.log("not found type by value >" + data + "::" + typeof (data));
    return data;
  }
}
// ----------------------- 导出csv end -------------------


// ----------------------- 导出图片 start -------------------
/**
*echart图片下载函数
* @ divID, divID
* @ name, 图片名称
* @ width, 宽度 暂未使用
*@ height, 高度 暂未使用
*/
export const downloadEchartPic = (divID, name, width, height) => {
  var myChart = echarts.init(document.getElementById(divID))
  var picbase = myChart.getDataURL()

  var img = new Image()
  img.crossOrigin = 'anonymous'

  /*  setTimeout(function() { */
  img.src = myChart.getDataURL({
    type: 'png',
    pixelRatio: 2, // 放大2倍
    backgroundColor: '#fff'
  })

  img.onload = function () {
    var canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    var dataURL = canvas.toDataURL('image/png')

    var a = document.createElement('a')
    // 创建一个单击事件
    var event = new MouseEvent('click')
    // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
    a.download = name || '下载图片名称'
    // 将生成的URL设置为a.href属性
    a.href = dataURL
    // 触发a的单击事件
    a.dispatchEvent(event)
  }
  /* }, 2000) */
}
// ----------------------- 导出图片 end -------------------
