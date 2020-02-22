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
        <el-select v-model="FunctionVersion" placeholder="请选择" @change="_FunctionVersion">
          <el-option v-for="item in VersionList" :key="item.Version" :label="item.Version" :value="item.Version">
          </el-option>
        </el-select>
        <el-button @click="dialogVisible = true" size="small">发布新版本</el-button>
      </p>
    </div>
    <div class="wrapTab">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
        <!-- 函数配置 -->
        <el-tab-pane :label="$t('SCF.total.hspz')" name="first">
          <funConfig />
        </el-tab-pane>
        <!-- 函数代码 -->
        <el-tab-pane :label="$t('SCF.total.hsdm')" name="second">
          <funCode />
        </el-tab-pane>
        <!-- 触发方式 -->
        <el-tab-pane :label="$t('SCF.total.cffs')" name="third">
          <triggerMode ref="mychild" />
        </el-tab-pane>
        <!-- 通行日志 -->
        <el-tab-pane :label="$t('SCF.total.yxrz')" name="fouth">
          <runningLog />
        </el-tab-pane>
        <!-- 监控信息 -->
        <el-tab-pane :label="$t('SCF.total.jkxx')" name="fifth">
          <monitInfo v-if="montshow" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <el-dialog title="发布新版本" :visible.sync="dialogVisible" width="550px">
        <div class="dialog">
          <p class="p1">函数名称</p>
          <p class="p2">{{functionName}}</p>
        </div>
        <div class="dialog">
          <p class="p1">描述</p>
          <p class="p2">
            <el-input type="textarea" :rows="4" placeholder="请输入版本描述" v-model="textarea" @blur='_check'>
            </el-input>
          </p>
        </div>
        <div class="dialog">
          <p class="p1"></p>
          <p class="p3" v-if="check">只能包含字母、数字、空格、逗号、句号、中文，长度最多1000个字符</p>
          <p class="p4" v-if="!check">请输入版本发布描述</p>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="_PublishVersion">确 定</el-button>
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
      }
    },
    components: {
      funConfig,
      triggerMode,
      funCode,
      runningLog,
      monitInfo
    },
    created() {
      localStorage.setItem('FunctionVersion', '$LATEST')
      this.GetDate()
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
      //获取详情数据
      GetDate() {
        this.Congigload = true
        let param = {
          Region: localStorage.getItem('regionv2'),
          Version: "2018-04-16",
          FunctionName: this.functionName,
          Qualifier: localStorage.getItem('FunctionVersion')
        };
        this.axios.post(SCF_DETAILS, param).then(res => {
          if (res.Response.Error === undefined) {
            this.FunctionVersion = res.Response.FunctionVersion
          } else {
            let ErrTips = {
              'InternalError': '内部错误',
              'InternalError.System': '内部系统错误',
              'InvalidParameter.Payload': '请求参数不合法',
              'InvalidParameterValue': '参数取值错误',
              'InvalidParameterValue.CodeSecret': 'CodeSecret传入错误',
              'ResourceNotFound.Function': '函数不存在',
              'ResourceNotFound.FunctionName': '函数不存在',
              'UnauthorizedOperation': '未授权操作',
              'UnauthorizedOperation.CAM': 'CAM鉴权失败',
              'UnauthorizedOperation.CodeSecret': '无访问代码权限'
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
          } else {
            let ErrTips = {
              'InternalError': '内部错误',
              'InvalidParameterValue': '参数取值错误',
              'ResourceNotFound.Function': '函数不存在',
              'ResourceNotFound.FunctionName': '函数不存在',
              'UnauthorizedOperation.CAM': 'CAM鉴权失败'
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
      //切换版本
      _FunctionVersion(val) {
        localStorage.setItem('FunctionVersion', val)
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
                message: '发布成功',
                type: "success",
                showClose: true,
                duration: 0
              });
              this.GetVersion()
              this.dialogVisible = false
            } else {
              let ErrTips = {
                'InternalError': '内部错误',
                'InvalidParameterValue': '参数取值错误',
                'ResourceNotFound.Function': '函数不存在',
                'ResourceNotFound.FunctionName': '函数不存在',
                'UnauthorizedOperation.CAM': 'CAM鉴权失败'
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
