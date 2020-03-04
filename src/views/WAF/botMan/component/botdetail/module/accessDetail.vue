<template>
  <div>
    <div class="topHeader">
      2222
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import pako from 'pako'
import { DESCRIBE_BOT_RECORD_ITEMS } from '@/constants'
export default {
  data () {
    return {
      tableData: []
    }
  },
  components: {
  },
  created() {
    this.SrcIp = this.$route.query.SrcIp
    this.Id = this.$route.query.Id
    this.domain = this.$route.query.domain
  },
  mounted() {
     this.getbb()
  },
  methods: {
    // unzip(b64Data){
    //   var strData = atob(b64Data); 
    //   var charData= strData.split('').map(function(x){return x.charCodeAt(0);});
    //   var binData = new Uint8Array(charData)
    //   var data  = pako.inflate(binData);
    //   strData = String.fromCharCode.apply(null, new Uint16Array(data));
    //   return decodeURIComponent(strData);
    // },
    unzip(e) {
      var t = "";
      try {
        var a = atob(e);
        var n = a.split("").map(function (e) {
          return e.charCodeAt(0)
        });
        return pako.inflate(n, {
          to: "string"
        })
      } catch (i) {
        return t
      }
    },
    // BOT记录访问详情
    getbb() {
      const params = {
        Version: "2018-01-25",
        Domain: this.domain,
        Id: this.Id
      }
      this.axios.post(DESCRIBE_BOT_RECORD_ITEMS, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          const s = this.unzip(Response.Res[0].Items)
          let list = s.split("#-4789-#");
          let items = [];
          list.forEach((item, index) => {
              let array = item.split("#-9874-#");
              array = array.map((item) => {
                  return "txw4f-none" === item ? "空" : ("object" === typeof item && !item ? "null" : item || "空");
              });
              let queryStr = array[2];
              try {
                  queryStr = decodeURIComponent(array[2]);
              } catch (error) {
                  queryStr = array[2];
              }
              items.push({
                  id: (index + 1) + "",
                  uri: array[1],
                  http: array[3],
                  query:queryStr,
                  body: array[7],
                  status: array[16],
                  protocal: array[15],
                  ua: array[5],
                  http_referer: array[6],
                  timestamp: parseInt(array[4], 10),
                  cookie: array[13],
                  http_connection: array[8],
                  http_accept: array[9],
                  http_accept_encoding: array[10],
                  http_accept_language: array[11],
                  http_upgrade_insecure_requests: array[12]
              });
          });
          this.tableData = items
          console.log(this.tableData)
        })
      }).then(() => {
        
      })
    },
  }
}

</script>
<style lang='scss' scoped>
.topHeader {
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 20px 20px 0 20px;
  span {
    font-size: 16px;
    font-weight: 600;
    color: #000;
    margin-right: 20px;
  }
}
.wrapper {
  width: 100%;
  padding: 20px;
   button {
    height: 30px;
    line-height: 6px;
    border-radius: 0;
  }
  ::v-deep .el-input__inner {
    height: 30px;
    line-height: 30px;
    border-radius: 0;
  }
  .topTip {
    font-size: 12px;
    line-height: inherit;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    margin-bottom: 20px;
    position: relative;
    p {
      line-height: 20px;
    }
    .el-icon-close {
      position: absolute;
      font-size: 18px;
      top: 10px;
      margin-left: 10px;
      right: 20px;
    }
  }
  .topSelect {
    ::v-deep .el-range__icon {
        line-height: 22px;
    }
    ::v-deep .el-range-separator {
      line-height: 22px;
      width: 7%;
    }
    ::v-deep .el-select {
      margin-right: 10px;
    }
    button {
      padding: 0 20px;
    }
    .addStyleBtn {
      background-color: #006eff !important;
      color: #fff;
    }
  }
}
</style>
