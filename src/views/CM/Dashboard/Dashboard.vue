<template>
  <div class="Dashboard-wrap">
    <Header title="Dashboard">
      <el-select v-model="panelValue" :placeholder="$t('CVM.Dashboard.qxz')" style="margin:0 20px 0 40px;width:260px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <a
        class="addPanel"
        style="font-size:12px;font-weight:20"
        @click="buyMessgae"
      >{{$t('CVM.Dashboard.tjjkmb')}}</a>
      <AddPanel :dialogVisible="panelFlag" @cancel="cancel" @save="save" />
    </Header>
    <div class="Dashboard-main">
      <div class="explain">
        <p>{{$t('CVM.Dashboard.jhtjsj')}}</p>
        <p>{{$t('CVM.Dashboard.zcbbdc')}}</p>
      </div>
      <div class="headBtn">
        <el-button type="primary">{{$t('CVM.Dashboard.tjjktb')}}</el-button>
        <div style="display:flex;align-items:center;">
          <TimeX v-on:switchData="GetData" :classsvalue="value"></TimeX>
          <i class="el-icon-refresh"></i>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <p style="color:#888;">{{$t('CVM.Dashboard.zdcxzl')}}</p>
              <el-dropdown-item>{{$t('CVM.Dashboard.zting')}}</el-dropdown-item>
              <el-dropdown-item>30秒</el-dropdown-item>
              <el-dropdown-item>1{{$t('CVM.Dashboard.fzhong')}}</el-dropdown-item>
              <el-dropdown-item>2{{$t('CVM.Dashboard.fzhong')}}</el-dropdown-item>
              <el-dropdown-item>5{{$t('CVM.Dashboard.fzhong')}}</el-dropdown-item>
              <el-dropdown-item>10{{$t('CVM.Dashboard.fzhong')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="chart">
        <div class="chartList">
          <div class="chartItem">
            <p>
              <b>
                {{$t('CVM.Dashboard.mx')}}-CPU利用率
                <span style="color:#888">（%）</span>
              </b>
              <el-row>
                <i class="el-icon-zoom-in"></i>
                <el-dropdown trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>{{$t('CVM.Dashboard.fztb')}}</el-dropdown-item>
                    <el-dropdown-item>{{$t('CVM.Dashboard.bj')}}</el-dropdown-item>
                    <el-dropdown-item>{{$t('CVM.clBload.dcsj')}}</el-dropdown-item>
                    <el-dropdown-item>{{$t('CVM.Dashboard.dctp')}}</el-dropdown-item>
                    <el-dropdown-item @click="deleteChart">{{$t('CVM.Casegrouping.sc')}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-row>
            </p>
            <div class="line">
              <p>--------------------------------------------------------------------------</p>
              <p>--------------------------------------------------------------------------</p>
              <p>--------------------------------------------------------------------------</p>
            </div>
          </div>
          <div class="open">
            <p>
              <span>{{$t('CVM.Dashboard.ygsl')}}</span>
              <!-- <span v-show="retractChartFlag">,监控明细（2020-01-10 21:47:40）</span> -->
            </p>
            <p>
              <span v-show="retractChartFlag">
                <a @click="exportChart">{{$t('CVM.Dashboard.dc')}}</a>
                <i class="el-icon-info" style="color:#888"></i>
              </span>
              <a v-show="openChartFlag" @click="openChart" style="margin-left:30px;">{{$t('CVM.Dashboard.zk')}}</a>
              <a v-show="retractChartFlag" @click="retractChart" style="margin-left:30px;">收起</a>
            </p>
          </div>
          <div class="chartContent" v-show="retractChartFlag">content</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import TimeX from "./components/Time";
import AddPanel from "./components/AddPaneldialog";
export default {
  name: "Dashboard",
  data() {
    return {
      panelFlag: false, //面板开关
      panelValue: "監控面板01", //监控面板默认值
      options: [
        {
          value: "選項1",
          label: "監控面板01"
        },
        {
          value: "選項2",
          label: "監控面板02"
        }
      ],
      openName: "展開", //展开收起名字显示
      openChartFlag: true, //展开图表开关
      retractChartFlag: false,
      value: 13, //时间
      timeBtnRadio: "上海", //事件选择单选
      dialogVisible: false, //购买短信弹出框
      region: "",
      tableData: [], //表格数据
      //下拉框
      options1: [
        {
          value: 0,
          label: "所有專案"
        }
      ],
      options2: [
        {
          value: 0,
          label: "所有專案"
        }
      ],
      options3: [],
      //下拉框选中的值
      value1: "所有專案",
      value2: "所有專案",
      value3: ""
    };
  },
  components: {
    Header,
    TimeX,
    AddPanel
  },
  created() {},
  methods: {
     //设置弹框//新建实例分组
    buyMessgae() {
      // alert("11")
      this.dialogVisible = true;
    },
    //取消设置弹框
    cancel() {
      this.dialogVisible = false;
    },
    //确定设置弹框
    save() {
      this.dialogVisible = false;
    },
    // panelStatus(flag) {
    //   //父组件事件
    //   this.panelFlag = flag;
    // },
    // addPanel() {
    //   //添加dialog面板
    //   this.panelFlag = true;
    // },
    openChart() {
      //展开图表
      this.openChartFlag = false;
      this.retractChartFlag = true;
    },
    retractChart() {
      this.openChartFlag = true;
      this.retractChartFlag = false;
    }, //收起
    exportChart() {
      //导出图表
      alert("導出");
    },
    deleteChart() {
      //删除图表
    },
    //获取数据
    GetData(data) {
      // console.log(data);
    },
    // //取消
    // cancel() {
    //   this.dialogVisible = false;
    // },
    // //确定
    // save() {
    //   this.dialogVisible = false;
    // }
  }
};
</script>

<style lang="scss" scoped>
.chartContent {
  width: 100%;
  height: 200px;
  padding: 20px;
  background: #ffffff;
}
.Dashboard-wrap >>> .el-progress-bar__outer,
.Dashboard-wrap >>> .el-progress-bar__inner {
  border-radius: 0;
}
.Dashboard-wrap >>> .el-dialog__body {
  padding: 20px;
  box-sizing: border-box;
}
.Dashboard-wrap >>> .el-button,
.Dashboard-wrap >>> .el-input__inner,
.Dashboard-wrap >>> .el-input-number__increase,
.Dashboard-wrap >>> .el-input-number__decrease {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.Dashboard-wrap >>> .el-input-number__increase,
.Dashboard-wrap >>> .el-input-number__decrease {
  top: 5px;
  border-top: 1px #dcdfe6 solid;
  border-bottom: 1px #dcdfe6 solid;
}
.Dashboard-wrap >>> .explain {
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  background: #e5f0ff;

  p {
    font-size: 11px;
    line-height: 18px;
  }
}
.Dashboard-wrap >>> .headBtn {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  > div {
    i {
      margin: 0 10px;
    }
  }
}
.Dashboard-wrap >>> .chart {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  > div.chartList {
    width: 32%;
    .chartItem {
      padding: 20px;
      background: #ffffff;
      border: 1px solid #e2e1e1;
      p {
        display: flex;
        justify-content: space-between;
        i {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 800;
          color: #888888;
          margin-left: 10px;
        }
        i:hover {
          background: #f3f0f0;
        }
      }
    }

    .open {
      background: #f2f2f2;
      display: flex;
      justify-content: space-between;
      padding: 10px 20px;
      border: 1px solid #e2e1e1;
      border-top: 0;
    }
  }
}
.Dashboard-wrap >>> .el-button {
  line-height: 28px;
}
.Dashboard-wrap {
  a {
    color: #006eff;
    cursor: pointer;
  }
  .cursor {
    cursor: pointer;
  }
  .Dashboard-main {
    padding: 20px;
    box-sizing: border-box;

    .progress {
      padding: 10px 0;
      box-sizing: border-box;

      p {
        margin-bottom: 10px;
        font-weight: bold;

        span {
          float: right;
        }
      }
    }
  }
}
</style>