<template>
  <div id="basicDetail">
    <div class="topTitBasic">
      <i class="el-icon-back" @click="Back()"></i>
      <span>{{this.instance.Name}}</span>
    </div>
    <div class="basicContent">
      <div class="basicCenter">
        <div class="basicCenterOne">
          <p>
            <span class="pOne">黑洞触发阈值</span>
            <span>2 Gbps(当触发黑洞会使云主机服务中断2小时)</span>
          </p>
          <!-- <p>
            <span class="pOne">CC防护</span>
            <span>
              <el-switch
                v-model="basicSwitch"
                active-color="#006eff"
                inactive-color="#bbb">
              </el-switch>
            </span>
          </p>
          <p v-if="basicSwitch">
            <span  class="pOne">http请求数阈值</span>
            <span>
              <el-select class="numberSelect" v-model="httpNumber" placeholder="请选择活动区域">
                <el-option v-for="(item,index) in httpRequestNum" :label="item.label" :value="item.value" :key="index"></el-option>
              </el-select>
            </span>
            <span>当http请求数超过设定值时，触发CC防护。</span>
          </p>-->
        </div>
        <div class="basicCenterTwo">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="DDoS攻击" name="first">
              <ddosAttack :ddosAttack="instance" />
            </el-tab-pane>
            <!-- <el-tab-pane label="CC攻击" name="second">
              <ccAttack/>
            </el-tab-pane>-->
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ddosAttack from "./ddosAttack";
import ccAttack from "./ccAttack";
export default {
  data() {
    return {
      instance: {}, // 实例对象
      basicSwitch: true, //开关
      httpNumber: "150QPS",
      httpRequestNum: [
        {
          label: "50 QPS",
          value: "50"
        },
        {
          label: "100 QPS",
          value: "100"
        },
        {
          label: "150 QPS",
          value: "150"
        },
        {
          label: "240 QPS",
          value: "240"
        },
        {
          label: "350 QPS",
          value: "350"
        },
        {
          label: "480 QPS",
          value: "480"
        },
        {
          label: "550 QPS",
          value: "550"
        },
        {
          label: "700 QPS",
          value: "700"
        },
        {
          label: "850 QPS",
          value: "850"
        },
        {
          label: "1000 QPS",
          value: "1000"
        },
        {
          label: "1500 QPS",
          value: "1500"
        },
        {
          label: "2000 QPS",
          value: "2000"
        },
        {
          label: "3000 QPS",
          value: "3000"
        },
        {
          label: "5000 QPS",
          value: "5000"
        },
        {
          label: "10000 QPS",
          value: "10000"
        },
        {
          label: "20000 QPS",
          value: "20000"
        }
      ],
      activeName: "first",
      timeNodeQu1: [],
      timeNodeQu2: []
    };
  },
  components: {
    ddosAttack: ddosAttack,
    ccAttack: ccAttack
  },
  created() {
    localStorage.setItem("ddosAttack", this.$route.query.instance);
    this.instance = JSON.parse(this.$route.query.instance);
  },
  methods: {
    handleClick(tab, event) {
      
    },
    //从子组件获取时间
    thisTime1(data) {
      this.timeNodeQu1 = data;
    },
    thisTime2(data) {
      this.timeNodeQu2 = data;
    },
    // 返回
    Back() {
      this.$router.push({
        path: "/basicProtection"
      });
    }
  }
};
</script>
<style lang="scss">
.newClear:after {
  clear: both;
  display: block;
  content: "";
}
.topTitBasic {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
  line-height: 50px;
  font-size: 16px;
  font-weight: 600;
  padding: 0 20px;
  .el-icon-back {
    margin-right: 15px;
  }
}
.basicContent {
  width: 100%;
  padding: 20px;
  .basicCenter {
    background-color: #fff;
    padding: 20px;
    min-height: 200px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    .basicCenterOne {
      p {
        margin-bottom: 18px;
        span:nth-child(1).pOne {
          font-size: 12px;
          color: #999;
          display: inline-block;
          width: 100px;
        }
        span:nth-child(2) {
          color: #000;
          .numberSelect {
            width: 180px;
            height: 30px;
            border-radius: 0;
            margin-right: 20px;
            div {
              width: 180px;
              height: 30px;
              input {
                width: 180px;
                height: 30px;
                border-radius: 0;
              }
            }
          }
        }
      }
    }
  }
}
</style>