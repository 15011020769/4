<template>
  <div class="operation-wrap">
    <Header title="运营数据" />
    <div class="seek">
      <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
    </div>
    <div class="seek seek-box">
      <p style="margin-left:20px;">
        <span>选择域名</span>
        <el-dropdown
          :hide-on-click="false"
          trigger="click"
          ref="doaminRef"
          style="margin-left: 20px"
        >
          <el-button type="primary" size="small">
            {{domainCheckedListCopy.length === domainsData.length ? '全部域名' : domainCheckedListCopy.join()}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <label class="domain-label"><el-checkbox :value="domainCheckedList.length === domainsData.length" @change="checkDomainAll" /> 全部域名</label>
            </el-dropdown-item>
            <el-dropdown-item
              v-for="item in domainsData"
              :key="item"
            >
              <label class="domain-label"><el-checkbox @change="checked => doaminChange(checked, item)" :value="domainCheckedList.includes(item)" /> {{item}}</label>
            </el-dropdown-item>
            <el-row class="doamin-btn-container">
              <el-button size="small" type="primary" @click="comfirmDomain">{{$t('CSS.overview.12')}}</el-button>
              <el-button size="small" @click="cancelDomain">取消</el-button>
            </el-row>
          </el-dropdown-menu>
        </el-dropdown>
      </p>
      <p style="margin-left:20px;">
        <span>选择运营商</span>
        <el-select v-model="operator" placeholder="请选择" style="margin-left:10px;">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </p>
      <el-button type="primary" style="margin-left:20px;">{{region}}</el-button>
      <el-button style="margin-left:20px;" type="primary" @click="search">查询</el-button>
    </div>
    <div class="operation-main">
      <div class="tab-box">
        <dl
          v-for="(item,index) in tab"
          :key="index"
          :class="tabIndex == index ? 'active' : ''"
          @click="tabClick(index)"
        >
          <dt>{{item.name}}</dt>
          <dd>
            {{item.value}}
            <span style="font-size:16px;color:black;">{{item.code}}</span>
          </dd>
        </dl>
      </div>
      <div class="main">
        <Tab1
          :StartTIme="StartTIme"
          :EndTIme="EndTIme"
          :operator="operator"
          v-if="tabIndex == 0"
          :domainsData="domainsData"
          :domainCheckedListCopy="domainCheckedListCopy"
          ref="tab1"
        />
        <Tab2
          :StartTIme="StartTIme"
          :EndTIme="EndTIme"
          v-if="tabIndex == 1"
          :domainsData="domainsData"
          :domainCheckedListCopy="domainCheckedListCopy"
          ref="tab2"
        />
        <Tab3
          :StartTIme="StartTIme"
          :EndTIme="EndTIme"
          :operator="operator"
          v-if="tabIndex == 2"
          :domain="domain"
          ref="tab3"
        />
        <Tab4
          :StartTIme="StartTIme"
          :EndTIme="EndTIme"
          v-if="tabIndex == 3"
          :domain="domain"
          ref="tab4"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Header from "@/components/public/Head";
import XTimeX from "@/components/public/TimeN";
import { ALL_CITY, DOMAIN_LIST, CSS_MBPS } from "@/constants";
import Tab1 from "./tab/tab1";
import Tab2 from "./tab/tab2";
import Tab3 from "./tab/tab3";
import Tab4 from "./tab/tab4";
export default {
  name: "operation",
  data() {
    return {
      operator: "",
      domainsData: [],
      domainCheckedList: [],
      domainCheckedListCopy: [],
      options: [
        {
          value: "",
          label: "全部运营商"
        },
        {
          value: "China Telecom",
          label: "中国电信"
        },
        {
          value: "China Unicom",
          label: "中国联通"
        },
        {
          value: "China Mobile",
          label: "中国移动"
        },
      ],
      domain: [],
      value: 1, //时间组件默认选中值
      region: "台灣台北", //地域
      tabIndex: 0, //tab默认选中值
      //tab内容
      tab: [
        {
          name: "带宽峰值",
          code: "Mbps",
          value: 0
        },
        {
          name: "总流量",
          code: "MB",
          value: 0
        },
        {
          name: "总请求数",
          code: "次",
          value: 0
        },
        {
          name: "并发连接数峰值",
          code: "次",
          value: 0
        }
      ],
      StartTIme: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
      EndTIme: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    };
  },
  components: {
    Header,
    XTimeX,
    Tab1,
    Tab2,
    Tab3,
    Tab4
  },
  created() {
    this.getCity();
    this.getDomains();
    this.getTotal()
  },
  methods: {
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length == 1) {
        m = "0" + month;
      }
      return m;
    },
    //域名列表
    getDomains() {
      const params = {
        Version: "2018-08-01"
      };
      this.axios.post(DOMAIN_LIST, params).then(res => {
        var arr = [];
        res.Response.DomainList.forEach((domain, index) => {
          arr.push(domain.Name);
        });
        this.domainsData = arr;
        this.domainCheckedList = arr
        this.domainCheckedListCopy = arr
      });
    },
    //查询
    search() {
      this.StartTIme = this.timeData[0].StartTIme;
      this.EndTIme = this.timeData[0].EndTIme;
      if (this.tabIndex == 0) {
        this.getTotal()
        this.$nextTick(() => {
          this.$refs.tab1.init();
        })
      } else if (this.tabIndex == 1) {
        this.getTotal()
        this.$nextTick(() => {
          this.$refs.tab2.init();
        })
      } else if (this.tabIndex == 2) {
        this.$nextTick(() => {
          this.$refs.tab3.init();
        })
      } else if (this.tabIndex == 3) {
        this.$nextTick(() => {
          this.$refs.tab4.init();
        })
      }
    },
    //时间组件返回的数据
    GetDat(val) {
      val[0].StartTIme = moment(val[0].StartTIme).format("YYYY-MM-DD HH:mm:ss");
      this.value = val[1];
      this.timeData = val;
    },
    //获取城市
    getCity() {
      this.axios.post(ALL_CITY).then(res => {
        this.region = res.data[0].zone;
      });
    },
    //tab切换
    tabClick(index) {
      this.tabIndex = index;
    },
    getTotal() {
      const params = {
        Version: "2018-08-01",
        StartTime: moment(this.StartTIme).format("YYYY-MM-DD HH:mm:ss"),
        EndTime: moment(this.EndTIme).format("YYYY-MM-DD HH:mm:ss"),
        Granularity: 5,
      };
      if (this.domainCheckedListCopy.length !== this.domainsData.length) {
        this.domainCheckedListCopy.forEach((item, index) => {
          params["PlayDomains." + index] = item;
        });
      }
      this.axios.post(CSS_MBPS, params).then(res => {
        if (res.Response.Error) {
          this.$message.error(res.Response.Error.Message);
        } else {
          this.tab[0].value = res.Response.PeakBandwidth
          this.tab[1].value = res.Response.SumFlux
        }
      });
    },
    checkDomainAll(checked) {
      if (checked) {
        this.domainCheckedList = [...this.domainsData]
      } else {
        this.domainCheckedList = []
      }
    },
    doaminChange(checked, domain) {
      if (checked) {
        this.domainCheckedList.push(domain);
      } else {
        this.domainCheckedList = this.domainCheckedList.filter(item => item !== domain)
      }
    },
    comfirmDomain() {
      if (this.domainCheckedList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择域名'
        })
      } else {
        this.$refs.doaminRef.visible = false
        this.domainCheckedListCopy = [...this.domainCheckedList]
      }
    },
    cancelDomain() {
      this.domainCheckedList = [...this.domainCheckedListCopy]
      this.$refs.doaminRef.visible = false
    },
  }
};
</script>

<style lang="scss" scoped>
.operation-wrap >>> .el-button,
.operation-wrap >>> .el-input__inner,
.operation-wrap >>> .el-range-input {
  height: 30px;
  border-radius: 0;
  line-height: 30px;
  padding-top: 0;
  overflow: hidden;
}
.operation-wrap >>> .el-select__tags span:nth-child(1) {
  display: flex;
}
.operation-wrap >>> .el-select__tags-text {
  max-width: 50px;
  overflow: hidden;
  display: inline-block;
}
.operation-wrap >>> .el-tag {
  display: flex;
  align-items: center;
}
.operation-wrap >>> .el-range-input {
  margin-top: 5px;
}
.operation-wrap {
  .seek-box {
    padding: 10px 20px;
    padding-bottom: 0;
    box-sizing: border-box;
    p {
      span {
        font-size: 13px;
        color: #888;
      }
    }
  }
  .seek {
    display: flex;
    align-items: center;
  }
  .operation-main {
    margin: 20px;
    padding: 10px 0;
    box-sizing: border-box;
    background: white;

    .main {
      padding: 20px;
      padding-bottom: 0;
      box-sizing: border-box;
    }

    .tab-box {
      display: flex;
      dl {
        flex: 1;
        padding: 0 20px;
        box-sizing: border-box;
        border-right: 1px #ccc solid;

        cursor: pointer;
        dt {
          font-size: 14px;
          font-weight: bold;
          border-top: 2px white solid;
          padding-top: 20px;
          box-sizing: border-box;
        }

        dd {
          font-size: 34px;
          margin-top: 15px;
          padding-bottom: 20px;
          box-sizing: border-box;
        }
      }
      dl:nth-last-child(1) {
        border-right: 0;
      }
      .active {
        color: #006eff;
        dt {
          border-top: 2px #006eff solid;
        }
      }
    }
  }
}
.domain-label {
  display: block;
  cursor: pointer;
}
.doamin-btn-container {
  margin-left: 20px;
}
</style>