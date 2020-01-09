<!--
 * @Author: your name
 * @Date: 2020-01-07 16:47:16
 * @LastEditTime: 2020-01-08 14:21:02
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/CSS/logManagement/tab/download.vue
 -->
<template>
   <div class="explain">
    <p>
      访问日志字段包括：请求时间,客户端IP,被访问的域名,URL,本次访问字节数大小,country_id,省份,运营商,HTTP状态码,Referer信息,播放时长,User-Agent 信息,Range 参数,HTTP Method,流ID,缓存 HIT/MISS,节点IP,服务器地区,服务器国家,connect_fd。
    </p>
    <p>
      日志数据打包存在一定延迟，正常情况下 2-3 小时后数据包趋于完整。日志中记录的带宽或流量数据为应用层（HTTP 协议）回包数据，由于TCP包头消耗，失败重传等机制，比通过 TCP 层统计得出的消耗带宽或消耗流量要小
    </p>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.explain {
  color: #003b80;
  border: 1px solid #97c7ff;
  background: #e5f0ff;
  padding: 10px 30px 10px 20px;
  margin-bottom: 20px;
  border-radius: 2px;

  p {
    line-height: 18px;

    a {
      color: #006eff;
    }
    a:hover {
      border-bottom: 1px #006eff solid;
    }
  }
}
</style>