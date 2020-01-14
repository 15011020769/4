<!--
 * @Author: your name
 * @Date: 2020-01-07 16:47:16
 * @LastEditTime : 2020-01-11 14:19:55
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/CSS/logManagement/tab/download.vue
 -->
<template>
  <div class="main">
    <div class="explain">
      <p>
        访问日志字段包括：请求时间,客户端IP,被访问的域名,URL,本次访问字节数大小,country_id,省份,运营商,HTTP状态码,Referer信息,播放时长,User-Agent 信息,Range 参数,HTTP Method,流ID,缓存 HIT/MISS,节点IP,服务器地区,服务器国家,connect_fd。
      </p>
      <p>
        日志数据打包存在一定延迟，正常情况下 2-3 小时后数据包趋于完整。日志中记录的带宽或流量数据为应用层（HTTP 协议）回包数据，由于TCP包头消耗，失败重传等机制，比通过 TCP 层统计得出的消耗带宽或消耗流量要小
      </p>
    </div>
    <div class="search-bar">
      <TimePicker class="time-picker-box" @switchData="GetDat" :classsvalue="value" />
      <Select 
        v-if="dataList.length" 
        :dataList="dataList" 
        class="select-box"
        :PlayDomainsParams.sync="PlayDomainsParams"
        />
      <el-button 
        @click="handleSearch" 
        type="primary"
        >
          搜索
        </el-button>
    </div>
    <div class="chart-wrap">
    </div>
  </div>
</template>

<script>

import TimePicker from "@/components/public/TimeT";
import Select from '../Select'
import moment from "moment";
import { DOMAIN_LIST, GET_LOG_DOWNLOAD_LIST } from '@/constants'

export default {
  
  data() {
    return {
      value: 1,
      dataList: [],
      PlayDomainsParams: []
    }
  },


  components: {
    TimePicker,
    Select
  },

  mounted() {
    this.fentchData()
  },

  methods: {
    GetDat(val) {
      val[0].StartTIme = moment(val[0].StartTIme).format("YYYY-MM-DD HH:mm:ss");
      this.value = val[1];
      this.timeData = val;
    },

    fentchData() {
      this.axios.post(DOMAIN_LIST, {
        Version: '2018-08-01'
      }).then(data => {
        if (data.Response.Error == undefined) {
          this.dataList = data.Response.DomainList
          return
        }
        this.$message.error(data.Response.Error.Message)
      })
    },

    handleSearch(arr) {
      const PlayDomainsString = this.PlayDomainsParams.reduce((prev, next, index) => {
        return {
          ...prev,
          [`PlayDomains.${index}`]: next.TargetDomain
        }
      }, {})
      const params = {
        ...PlayDomainsString,
        EndTime: this.timeData[0].EndTIme,
        StartTime: this.timeData[0].StartTIme,
        Version: '2018-08-01'
      }
    
      this.axios.post(GET_LOG_DOWNLOAD_LIST, params).then(data => {
        console.log(data, 'data')
      })
    }
    }
}
</script>

<style lang="scss" scoped>
.main {
  & >>> .el-button {
    padding: 0;
    border-radius: 0;
    & > span {
      display: inline-block;
      font-size: 12px;
      padding: 9px 20px;
    }
  }
  .explain {
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    padding: 10px 30px 10px 20px;
    border-radius: 2px;
    margin-bottom: 20px;
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
  .search-bar {
    display: flex;
    align-items: center;
    .time-picker-box {
      margin: 0;
    }
    .select-box {
      margin: 0 10px;
    }
  }
  .chart-wrap {
    background: #fff;
    height: 500px;
  }
}
</style>