import md5 from "js-md5";
/**
 * 
 * @param {*} a 域名
 * @param {*} b appname
 * @param {*} c 流名称
 * @param {*} d 过期时间
 * @param {*} e key对象
 */
export const generatePlayAddress = (a, b, c, d, e) => {
  if (e.Enable == 1) {
    return calculatePlayUrlWithAuth(a, b, c, e, d)
  } else {
    return calculatePlayUrlWithAuth(a, b, c, null, d)
  }
}
const calculatePlayUrlWithAuth = (a, b, c, d, e) => {
  var g = ''
  if (d) {
    var h = (e.getTime() - 1e3 * d.AuthDelta) / 1e3
    var i = parseInt(h).toString(16).toUpperCase()
    var j = {
      txSecret: md5(d.AuthKey + c + i),
      txTime: i
    }
    g = `?txSecret=${j.txSecret}&txTime=${j.txTime}`
  }
  var k = [{
    name: '播放地址 (RTMP)',
    value: 'rtmp://' + a + '/' + b + '/' + c + g,
    qrcode: !0
    // txTime: n.format(new Date(e.getTime()), "yyyy-MM-dd hh:ii:ss")
  }, {
    name: '播放地址 (FLV)',
    value: 'http://' + a + '/' + b + '/' + c + '.flv' + g,
    qrcode: !0
  }, {
    name: '播放地址 (HLS)',
    value: 'http://' + a + '/' + b + '/' + c + '.m3u8' + g,
    qrcode: !0
  }]
  k.push({
    name: '播放地址 (UDP)',
    tip: '快直播(UDP)流量/带宽费用与标准直播不同',
    value: 'webrtc://' + a + '/' + b + '/' + c + '.m3u8' + g,
    qrcode: !0
  })
  return k
}