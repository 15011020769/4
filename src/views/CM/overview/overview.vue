<template>
  <div class="overview-wrap">
    <Header title="监控概览" />
    <div class="overview-main">
      <div class="explain">
        <p>
          新版自定义监控已灰度上线，目前处于内测阶段，如需使用可
          <a>申请内测体验</a>
        </p>
        <p>
          站点监控全新升级，前往
          <a>流量监控</a> 配置了解更多
        </p>
        <p>
          [我关注的指标]模块已迁移至
          <a>dashboard</a>，欢迎前往体验更丰富的监控面板自定义功能
        </p>
        <p>
          公网流量监控数据请到
          <a>流量监控</a>页面查看
        </p>
      </div>
      <div class="main-box">
        <div class="left">
          <!-- 近24小时服务健康状态 -->
          <div class="box">
            <div class="head">
              <h3>近24小时服务健康状态</h3>
              <el-button v-show="region != ''">{{region}}</el-button>
              <el-button icon="el-icon-loading" v-show="region == ''"></el-button>
              <el-select
                v-model="value1"
                placeholder="请选择"
                style="width:140px;margin-left:-1px;"
                @change="getProjectList"
              >
                <el-option
                  v-for="item in options1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <el-table :data="tableData" style="width: 100%" height="450">
              <el-table-column prop="projectName" label="服务类型"></el-table-column>
              <el-table-column prop="name" label="当前状态"></el-table-column>
              <el-table-column prop="address" label="影响对象数"></el-table-column>
            </el-table>
          </div>
          <!-- 近7天监控时间轴 -->
          <div class="box">
            <div class="head">
              <h3>近7天监控时间轴</h3>
              <el-select v-model="value2" placeholder="请选择" style="width:140px;margin-left:-1px;">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="value3" placeholder="请选择" style="width:140px;margin-left:-1px;">
                <el-option
                  v-for="item in options3"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div style="margin-left:-1px;">
                <el-button v-show="region != ''">{{region}}</el-button>
                <el-button icon="el-icon-loading" v-show="region == ''" style="margin:0;"></el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <!-- 当月已使用短信统计 -->
          <div class="box">
            <div class="head">
              <h3 style="flex:1;">
                当月已使用短信统计
                <el-tooltip class="item" effect="light" placement="bottom">
                  <div slot="content">
                    告警短信发送优先扣除每月免费短信配额，免费配额
                    <br />用完后再扣除用户已购短信配额。
                    <br />免费配额每个月1号重置为1000条。
                  </div>
                  <i class="el-icon-info cursor"></i>
                </el-tooltip>
              </h3>
              <a @click="buyMessgae">购买短信</a>
            </div>
            <div class="box-main" style="margin-top:10px;">
              <div class="progress">
                <p>
                  基础告警
                  <span>剩余1000条/已使用0条</span>
                </p>
                <el-progress :percentage="100" :stroke-width="20" :show-text="false"></el-progress>
              </div>
              <div class="progress">
                <p>
                  云拨测告警
                  <span>剩余1000条/已使用0条</span>
                </p>
                <el-progress :percentage="100" :stroke-width="20" :show-text="false"></el-progress>
              </div>
              <div class="progress">
                <p>
                  自定义监控告警
                  <span>剩余1000条/已使用0条</span>
                </p>
                <el-progress :percentage="100" :stroke-width="20" :show-text="false"></el-progress>
              </div>
              <div class="progress">
                <p>
                  自定义消息
                  <span>剩余1000条/已使用0条</span>
                </p>
                <el-progress :percentage="100" :stroke-width="20" :show-text="false"></el-progress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 购买短信 -->
    <bugmsg :dialogVisible="dialogVisible" @cancel="cancel" @save="save" />
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import { ALL_CITY, ALL_PROJECT } from "@/constants";
import bugmsg from "../components/buymsg";
import { ErrorTips } from "@/components/ErrorTips.js";
export default {
  name: "overview",
  data() {
    return {
      dialogVisible: false, //购买短信弹出框
      region: "",
      tableData: [], //表格数据
      //下拉框
      options1: [
        {
          value: 0,
          label: "所有项目"
        }
      ],
      options2: [
        {
          value: 0,
          label: "所有项目"
        }
      ],
      options3: [],
      //下拉框选中的值
      value1: "所有项目",
      value2: "所有项目",
      value3: ""
    };
  },
  components: {
    Header,
    bugmsg
  },
  created() {
    this.GetCity();
    this.getProject();
    // this.getProjectList();
  },
  methods: {
    //购买短信
    buyMessgae() {
      this.dialogVisible = true;
    },
    //取消
    cancel() {
      this.dialogVisible = false;
    },
    //确定
    save() {
      this.dialogVisible = false;
    },
    //获取城市
    GetCity() {
      this.axios.get(ALL_CITY).then(res => {
        this.region = res.data[0].zone;
      });
    },
    //获取项目列表
    getProject() {
      this.axios.get(ALL_PROJECT).then(res => {
        if (res.codeDesc === "Success") {
          this.tableData=res.data;//lxx
          res.data.forEach((item, index) => {
            const obj = {
              value: index + 1,
              label: item.projectName
            };
            this.options1.push(obj);
            this.options2.push(obj);
          });
        } else {
          let ErrTips = {
            InternalError: "内部错误",
            UnauthorizedOperation: "未授权操作"
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    },
    getProjectList() {
      console.log(this.value1);
      //获取项目列表数据
      console.log();
      let params = {
        regionId: 39,
        projectIds:['1163520'],
        offset: 0,
        limit: 100,
        viewName: "cvm_device",
        startTime: "2020-02-11",
        lang: "zh"
      };
      this.axios
        .post("/monitor/DescribeProductHealthStatusList", params)
        .then(res => {
          console.info(res);
          // if (res.codeDesc === "Success") {
              // this.tableData=res.data;//lxx
          // } else {
          //   let ErrTips = {
          //     InternalError: "内部错误",
          //     UnauthorizedOperation: "未授权操作"
          //   };
          //   let ErrOr = Object.assign(ErrorTips, ErrTips);
          //   this.$message({
          //     message: ErrOr[res.Response.Error.Code],
          //     type: "error",
          //     showClose: true,
          //     duration: 0
          //   });
          // }
        });
    },
    MonitorList(){
       console.log(this.value3);
      //近7天监控时间轴项目列表数据
      console.log();
      let params = {
        regionId: 0,
        projectIds:['1163520'],
        // offset: 0,
        // limit: 100,
        // viewName: "cvm_device",
        // startTime: "2020-02-11",
        // lang: "zh"
      };
      this.axios
        .post("/monitor/DescribeAbnormalObjects", params)
        .then(res => {
          console.info(res);
          // if (res.codeDesc === "Success") {
              // this.tableData=res.data;//lxx
          // } else {
          //   let ErrTips = {
          //     InternalError: "内部错误",
          //     UnauthorizedOperation: "未授权操作"
          //   };
          //   let ErrOr = Object.assign(ErrorTips, ErrTips);
          //   this.$message({
          //     message: ErrOr[res.Response.Error.Code],
          //     type: "error",
          //     showClose: true,
          //     duration: 0
          //   });
          // }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.overview-wrap >>> .el-progress-bar__outer,
.overview-wrap >>> .el-progress-bar__inner {
  border-radius: 0;
}
.overview-wrap >>> .el-dialog__body {
  padding: 20px;
  box-sizing: border-box;
}
.overview-wrap >>> .el-button,
.overview-wrap >>> .el-input__inner,
.overview-wrap >>> .el-input-number__increase,
.overview-wrap >>> .el-input-number__decrease {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.overview-wrap >>> .el-input-number__increase,
.overview-wrap >>> .el-input-number__decrease {
  top: 5px;
  border-top: 1px #dcdfe6 solid;
  border-bottom: 1px #dcdfe6 solid;
}
.overview-wrap >>> .explain {
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
.overview-wrap >>> .el-button {
  line-height: 28px;
}
.overview-wrap {
  a {
    color: #006eff;
    cursor: pointer;
  }
  .cursor {
    cursor: pointer;
  }
  .overview-main {
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

    .main-box {
      display: flex;
    }

    .left {
      flex: 1;
      margin-right: 20px;
    }
    .right {
      width: 30%;
    }
    .head {
      display: flex;
      align-items: center;

      h3 {
        margin-right: 20px;
      }
    }
    .box {
      border: 1px solid #ddd;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      padding: 20px;
      box-sizing: border-box;
      margin-top: 20px;
    }

    .explain {
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
  }
}
</style>