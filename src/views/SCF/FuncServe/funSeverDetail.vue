<template>
  <div class="wrap">

    <div class="title">
      <p>
        <span>
          <i class="el-icon-back icon" @click="returnBack" style="cursor: pointer;"></i>
          {{functionName}}
        </span>
      </p>
      <p>
        <el-select v-model="FunctionVersion" placeholder="$t('SCF.total.qsz')" @change="_Version">
          <el-option v-for="item in VersionList" :key="item.Version" :label="item.Version" :value="item.Version">
          </el-option>
        </el-select>
        <el-button @click="dialogVisible = true" size="small">{{$t('SCF.total.fbxbb')}}</el-button>
      </p>
    </div>
    <div class="wrapTab" v-if="detailsshow">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
        <!-- 函数配置 -->
        <el-tab-pane :label="$t('SCF.total.hspz')" name="first">
          <funConfig :FunctionVersion='FunctionVersion' />
        </el-tab-pane>
        <!-- 函数代码 -->
        <el-tab-pane :label="$t('SCF.total.hsdm')" name="second">
          <funCode :FunctionVersion='FunctionVersion' />
        </el-tab-pane>
        <!-- 触发方式 -->
        <el-tab-pane :label="$t('SCF.total.cffs')" name="third">
          <triggerMode ref="mychild" :FunctionVersion='FunctionVersion' />
        </el-tab-pane>
        <!-- 通行日志 -->
        <el-tab-pane :label="$t('SCF.total.yxrz')" name="fouth">
          <runningLog :FunctionVersion='FunctionVersion' />
        </el-tab-pane>
        <!-- 监控信息 -->
        <el-tab-pane :label="$t('SCF.total.jkxx')" name="fifth">
          <monitInfo v-if="montshow" :FunctionVersion='FunctionVersion' />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="!detailsshow" class="loadwrap">
      <p>{{$t('SCF.total.jzz')}}......</p>
    </div>
    <div>
      <el-dialog title="$t('SCF.total.fbxbb')" :visible.sync="dialogVisible" width="550px">
        <div class="dialog">
          <p class="p1">{{$t('SCF.total.hsmc')}}</p>
          <p class="p2">{{functionName}}</p>
        </div>
        <div class="dialog">
          <p class="p1">{{$t('SCF.total.ms')}}</p>
          <p class="p2">
            <el-input type="textarea" :rows="4" placeholder="$t('SCF.total.qsrbbms')" v-model="textarea" @blur='_check'>
            </el-input>
          </p>
        </div>
        <div class="dialog">
          <p class="p1"></p>
          <p class="p3" v-if="check">{{$t('SCF.total.znbh')}}</p>
          <p class="p4" v-if="!check">{{$t('SCF.total.qsrbbfbms')}}</p>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="_PublishVersion">{{$t('SCF.total.qd')}}</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {
    SCF_DETAILS,
    LIST_VERSION,
    PUBLISH_VERSION
  } from "@/constants";
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import triggerMode from "./Xmodel/triggerMode";
  import funCode from "./Xmodel/funCode";
  import runningLog from "./Xmodel/runningLog";
  import monitInfo from "./Xmodel/monitInfo";
  import funConfig from './Xmodel/funConfig'
  export default {
    data() {
      return {
        detailsshow: false, //控制详情加载
        check: true,
        dialogVisible: false,
        functionName: this.$route.query.functionName,
        montshow: false,
        activeName: 'first',
        FunctionVersion: '',
        VersionList: [],
        textarea: '' //描述
      }
    },
    watch: {
      activeName(val) {
        if (val === 'fifth') {
          this.montshow = true
        } else {
          this.montshow = false
        }
      },
    },
    components: {
      funConfig,
      triggerMode,
      funCode,
      runningLog,
      monitInfo
    },
    created() {
      this.GetVersion()
    },
    methods: {
      returnBack() {
        this.$router.push({
          path: "/FuncServe"
        });
      },
      handleClick(tab, event) {},
      childFn(val) {
        this.childData = val;
        this.centerDialogVisible = true;
      },
      //切换版本
      _Version() {
        this.detailsshow = false
        setTimeout(() => {
          this.detailsshow = true
        }, 1000);
      },
      //获取函数版本
      GetVersion() {
        this.Congigload = true
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
          FunctionName: this.functionName,
        };
        this.axios.post(LIST_VERSION, param).then(res => {
          if (res.Response.Error === undefined) {
            this.VersionList = res.Response.Versions
            this.FunctionVersion = this.VersionList[0].Version
            this.detailsshow = true
          } else {
            let ErrTips = {
              'InternalError': '內部錯誤',
              'InvalidParameterValue': '參數取值錯誤',
              'ResourceNotFound.Function': '函數不存在',
              'ResourceNotFound.FunctionName': '函數不存在',
              'UnauthorizedOperation.CAM': 'CAM鑒權失敗'
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        })
      },
      //发布新版本
      _PublishVersion() {
        if (this.textarea === '') {
          return
        } else {
          let param = {
            Region: localStorage.getItem('regionv2'),
            Version: "2018-04-16",
            FunctionName: this.functionName,
            Description: this.textarea
          };
          this.axios.post(PUBLISH_VERSION, param).then(res => {
            if (res.Response.Error === undefined) {
              this.$message({
                message: '發布成功',
                type: "success",
                showClose: true,
                duration: 0
              });
              this.GetVersion()
              this.dialogVisible = false
            } else {
              let ErrTips = {
                'InternalError': '內部錯誤',
                'InvalidParameterValue': '參數取值錯誤',
                'ResourceNotFound.Function': '函數不存在',
                'ResourceNotFound.FunctionName': '函數不存在',
                'UnauthorizedOperation.CAM': 'CAM鑒權失敗'
              };
              let ErrOr = Object.assign(ErrorTips, ErrTips);
              this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
          })
        }
      },
      //校验
      _check() {
        if (this.textarea === '') {
          this.check = false
        }
      }
    }
  };

</script>
<style lang="scss" scoped>
  .wrap {
    ::v-deep .el-dialog__footer {
      text-align: center;
    }

    ::v-deep .el-textarea__inner {
      width: 400px;
    }

    ::v-deep .el-input__inner {
      height: 32px;
    }

    .loadwrap {
      height: 500px;
      display: flex;
      align-items: center;
      justify-content: center;

    }

    .title {
      display: flex;
      justify-content: space-between;
      padding-right: 20px;
      background: #fff;
      height: 40px;
      line-height: 40px;

      span {
        font-weight: bold;
        font-size: 14px;
        margin-left: 20px;

        .icon {
          margin-right: 20px;
          color: #006eff;
        }
      }
    }

    .wrapTab {

      ::v-deep .el-tabs__nav-scroll {
        background-color: #fff;
        padding: 0 20px;
      }

      ::v-deep .el-tabs__content {
        margin: 0 20px;
      }
    }

    .dialog {
      display: flex;
      padding-bottom: 20px;

      .p1 {
        width: 100px;
        color: #888888;
      }

      .p2 {
        color: black;
      }

      .p3 {
        color: #888888;
        font-size: 10px;
      }

      .p4 {
        font-size: 10px;
        color: #e1504a
      }
    }

  }

</style>
