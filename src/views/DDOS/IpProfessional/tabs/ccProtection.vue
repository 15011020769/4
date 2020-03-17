<template>
<!-- 防护配置-CC防护 -->
  <div id="ccProtection">
    <div class="ccProtectPartOne">
      <el-select class="ccResourceId" v-model="ccResourceId" filterable :placeholder="$t('DDOS.Proteccon_figura.qxz')">
        <el-option
          v-for="item in resourceIPs"
          :key="item.Id"
          :label="item.Id"
          :value="item.Id"
        ></el-option>
      </el-select>
    </div>
    <template v-if="resourceIPs.length > 0">
    <div class="ccProtectPartTwo">
      <h2>{{$t('DDOS.Proteccon_figura.HTTP_protection')}}</h2>
      <div class="partTwoIpt">
        <div class="newClear">
          <p class="partTwoPO">{{$t('DDOS.Proteccon_figura.Protection_state')}}</p>
          <p class="partTwoPT">
            <el-switch
              class="switch"
              v-model="switchState"
              active-color="#006eff"
              inactive-color="#bbb"
            ></el-switch>
            <span class="switchTip">{{$t('DDOS.Proteccon_figura.Sensitive_services')}}</span>
          </p>
        </div>
        <div class="newClear" v-if="switchState==true?true:false">
          <p class="partTwoPO">{{$t('DDOS.Proteccon_figura.qqsyz')}}</p>
          <p class="partTwoPT">
            <el-select class="ccProtectSele" v-model="httpRequestNum" :placeholder="$t('DDOS.Proteccon_figura.qxz')">
              <el-option
                v-for="item in httpOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span class="marginLeftSpan">{{$t('DDOS.Proteccon_figura.numbe_HTTP')}}</span>
          </p>
        </div>
        <div class="newClear" v-if="switchState==true?true:false">
          <p class="partTwoPO">{{$t('DDOS.Proteccon_figura.gjgjyz')}}</p>
          <p class="partTwoPT">
            <el-input v-model="alarmThreshold" class="partTwoPTIpt" :onchange="changeAlarmThreshold()"></el-input>
            <span class="marginLeftSpan">QPS</span>
          </p>
          <span class="botTop">{{$t('DDOS.Proteccon_figura.CC_classified')}}</span>
        </div>
      </div>
    </div>
    <div>
      <addAccessControl :ccResourceId="ccResourceId" />
    </div>
    <div>
      <addIpList :ccResourceId="ccResourceId" :switchState="switchState" />
    </div>
    </template>
  </div>
</template>
<script>
import addAccessControl from "./addAccessControl";
import addIpList from "./addIpList";
import {
  GET_ID,
  RESOURCE_LIST,
  CCTHRESHOLD_MODIFY,
  CCALARMTHRESHOLD_MODIFY,
  CCALARMTHRESHOLD_GET
} from "@/constants";
export default {
  props: {
    // ccResourceId: String //第一部分下拉 资源ID
  },
  data() {
    return {
      ccResourceId: '',
      loading: true,
      resourceIPs: [], //资源ID选择列表内容
      resource: [], //资源对象
      switchState: true, //防护状态
      httpRequestNum: 350, //http请求阈值
      httpOptions: [
        {
          value: 50,
          label: "50QPS"
        },
        {
          value: 100,
          label: "100QPS"
        },
        {
          value: 150,
          label: "150QPS"
        },
        {
          value: 240,
          label: "240QPS"
        },
        {
          value: 350,
          label: "350QPS"
        },
        {
          value: 480,
          label: "480QPS"
        },
        {
          value: 550,
          label: "550QPS"
        },
        {
          value: 700,
          label: "700QPS"
        },
        {
          value: 850,
          label: "850QPS"
        },
        {
          value: 1000,
          label: "1000QPS"
        },
        {
          value: 1500,
          label: "1500QPS"
        },
        {
          value: 2000,
          label: "2000QPS"
        },
        {
          value: 3000,
          label: "3000QPS"
        },
        {
          value: 5000,
          label: "5000QPS"
        },
        {
          value: 10000,
          label: "10000QPS"
        },
        {
          value: 20000,
          label: "20000QPS"
        }
      ], //http请求阈值数据
      alarmThreshold: 1000, //HTTP CC攻击告警阈值
    };
  },
  components: {
    addAccessControl: addAccessControl, //访问策略控制表格
    addIpList: addIpList //添加url ip黑白名单
  },
  created() {
    this.getData();
  },
  watch: {
    ccResourceId: function(value) {
      this.describeResourceList();
      this.describeCCAlarmThreshold();
    },
    switchState: function(value) {
      this.modifyCCThreshold();
    },
    httpRequestNum: function(value) {
      this.modifyCCThreshold();
    }
  },
  methods: {
    getData() {
      this.describeResIpList();
    },
    // 1.0.初始化资源IP列表，获取resourceIds
    describeResIpList() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net"
      };
      this.axios.post(GET_ID, params).then(res => {
        this.resourceIPs = res.Response.Resource;
        if (this.resourceIPs.length > 0) {
          this.ccResourceId = res.Response.Resource[0].Id;
        }
      });
    },
    // 1.1.通过获取资源列表，获取资源对象
    describeResourceList() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        "IdList.0": this.ccResourceId
      };
      this.axios.post(RESOURCE_LIST, params).then(res => {
        // console.log(params, res);
        this.resource = res.Response.ServicePacks[0].Record;
        for(let i=0; i<this.resource.length; i++){
          if("CCEnabled"==this.resource[i].Key){
            this.switchState = this.resource[i].Value=="0"?false:true;
          } else if("CCThreshold"==this.resource[i].Key){
            this.httpRequestNum = this.resource[i].Value;
          }
        }
      });
    },
    // 1.2.修改CC的防护阈值
    modifyCCThreshold() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        Id: this.ccResourceId,
        Threshold: this.switchState ? this.httpRequestNum : 0
      };
      this.axios.post(CCTHRESHOLD_MODIFY, params).then(res => {
        // console.log(params, res);
      });
    },
    // 1.3.获取CC告警通知阈值
    describeCCAlarmThreshold() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        RsId: this.ccResourceId,
      };
      this.axios.post(CCALARMTHRESHOLD_GET, params).then(res => {
        // console.log(params, res);
        this.alarmThreshold = res.Response.CCAlarmThreshold.AlarmThreshold;
      });
    },
    // 1.4.设置CC告警通知阈值
    modifyCCAlarmThreshold() {
      let params = {
        Version: "2018-07-09",
        Region: localStorage.getItem("regionv2"),
        Business: "net",
        RsId: this.ccResourceId,
        AlarmThreshold: this.alarmThreshold,
      };
      //资源关联的IP列表:IpList.1=
      for(let i=0; i<this.resourceIPs.length; i++){
        if(this.ccResourceId == this.resourceIPs[i].Id){
          for(let j=0; j<this.resourceIPs[i].IpList.length; j++){
            params['IpList.'+j] = this.resourceIPs[i].IpList[j];
          }
          break;
        }
      }
      this.axios.post(CCALARMTHRESHOLD_MODIFY, params).then(res => {
        // console.log(params, res);
        if (res.Response.Success.Message === 'Success') {
          this.$message({
            message: '設置成功',
            type: 'success',
            showClose: true,
            duration: 1500
          })
        }
      });
    },
    // 修改CC告警通知阈值延遲兩秒
    changeAlarmThreshold() {
      setTimeout(this.changeAlarmTimeOut(), 2000)
    },
    // 修改CC告警通知阈值
    changeAlarmTimeOut () {
      let isReg = new RegExp(/^[1-9]\d*$/).test(this.alarmThreshold)
      if (isReg) {
        if (this.ccResourceId !== undefined && this.ccResourceId !== "") {
          this.modifyCCAlarmThreshold()
        }
      } else {
        this.$message({
          message: 'HTTP CC攻警閾值為正整數',
          type: 'error',
          showClose: true,
          duration: 1500
        }) 
      }
    }
  }
};
</script>
<style lang="scss">
#ccProtection {
  .newClear:after {
    display: block;
    clear: both;
    content: "";
  }
  .ccProtectPartOne {
    width: 100%;
    height: 80px;
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
    .ccProtectSele {
      width: 180px;
      height: 30px;
      div {
        width: 180px;
        height: 30px;
        input {
          width: 180px;
        }
      }
    }
  }
  .ccProtectPartTwo {
    width: 100%;
    padding: 20px;
    background-color: #fff;
    border: 1px solid #ddd;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
    h2 {
      font-size: 14px;
      font-weight: 600;
      color: #000;
      margin-bottom: 20px;
    }
    .partTwoIpt {
      div {
        margin-bottom: 16px;
        p:nth-child(1).partTwoPO {
          float: left;
          width: 140px;
          font-size: 12px;
          color: #999;
        }
        p:nth-child(2).partTwoPT {
          float: left;
          width: calc(100% - 140px);
          font-size: 12px;
          color: #999;
          .switch {
            float: left;
          }
          .switchTip {
            margin-left: 12px;
            float: left;
            margin-top: 3px;
          }
          .marginLeftSpan {
            margin-left: 20px;
          }
          .partTwoPTIpt {
            width: 180px;
            input {
              width: 180px;
            }
          }
        }
        .botTop {
          color: #bbb;
        }
      }
    }
  }
  .el-select {
    height: 30px !important;
  }
  .el-input {
    height: 30px !important;
  }
  .el-input__inner {
    border-radius: 0 !important;
    height: 30px !important;
  }
  .buttonGroupAll {
    float: left;
    button {
      height: 30px;
      line-height: 30px;
      padding: 0 16px;
      border-radius: 0;
    }
  }
  .newDataTime {
    float: left;
    height: 30px;
    line-height: 30px;
    border-radius: 0;
    .el-input__icon {
      line-height: 26px;
    }
    .el-range-separator {
      line-height: 26px;
      width: 7%;
    }
  }
}
</style>