<template>
  <div class="detail-audit">
    <div class="header">
      <i class="el-icon-back" @click="_back"></i>
      {{title}}
      <el-switch v-model="value" inactive-text="開啟日誌記錄" style="float:right;margin-top:5px;" @change="_switch">
      </el-switch>
    </div>
    <!-- 弹出框 -->
    <el-dialog :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <p class="dialog">{{ $t('CLA.total.qrsc') }}</p>
      <p>{{ $t('CLA.total.sch') }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('CLA.total.qx') }}</el-button>
        <el-button type="primary" @click="delFn">{{ $t('CLA.total.qd') }}</el-button>
      </span>
    </el-dialog>
    <el-form :model="detailData" status-icon :rules="rules" ref="detailData" label-width="100px" class="demo-ruleForm"
      v-loading="loading">
      <div class="detil-audit-main">
        <div class="detil-audit-box">
          <h2>{{ $t('CLA.total.jcxx') }}</h2>
          <el-form-item :label="$t('CLA.total.gzjmc')" prop="AuditName" required>
            <p>{{detailData.AuditName}}</p>
          </el-form-item>
          <el-form-item :label="$t('CLA.total.gzqy')">
            <p style="font-size:12px;">{{ $t('CLA.total.s') }}</p>
          </el-form-item>
        </div>
      </div>
      <div class="detil-audit-main">
        <div class="detil-audit-box" v-loading="boxloading">
          <span class="edit" @click="_edit" v-show="!inpShow">{{ $t('CLA.total.bj') }}</span>
          <h2>{{ $t('CLA.total.glsj') }}</h2>
          <el-form-item :label="$t('CLA.total.glsj')" required>
            <el-radio-group v-model="detailData.ReadWriteAttribute" v-show="inpShow">
              <el-radio :label="3">{{ $t('CLA.total.qb') }}</el-radio>
              <el-radio :label="1">{{ $t('CLA.total.zd') }}</el-radio>
              <el-radio :label="2">{{ $t('CLA.total.zx') }}</el-radio>
            </el-radio-group>
            <p v-show="!inpShow">{{ReadWrite[detailData.ReadWriteAttribute]}}</p>
          </el-form-item>
          <div class="btn-box" v-show="inpShow">
            <div class="line"></div>
            <el-form-item class="button">
              <el-button type="primary" icon="el-icon-loading" v-show="btnLoad1"></el-button>
              <el-button type="primary" @click="submitForm" v-show="!btnLoad1">{{ $t('CLA.total.bc') }}</el-button>
              <el-button @click="_cancel">{{ $t('CLA.total.qx') }}</el-button>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="detil-audit-main">
        <div class="detil-audit-box" v-loading="boxloading1">
          <span class="edit" @click="_edit1" v-show="!inpShow1">{{ $t('CLA.total.bj') }}</span>
          <h2>{{ $t('CLA.total.ccwz') }}</h2>
          <div class="info-box" v-show="!inpShow1">
            <el-form-item :label="$t('CLA.total.coscct')" class="cos">
              <p>
                <span class="spn">{{ $t('CLA.total.dy') }}：</span>
                {{detailData.CosRegion}}
              </p>
              <p>
                <span class="spn">{{ $t('CLA.total.mc') }}：</span>
                {{detailData.CosBucketName}}
              </p>
            </el-form-item>
            <el-form-item :label="$t('CLA.total.rzwjqz')">
              <p>{{detailData.LogFilePrefix}}</p>
            </el-form-item>
            <el-form-item :label="$t('CLA.total.fstz')">
              <p>{{CmqNotify[detailData.IsEnableCmqNotify]}}</p>
            </el-form-item>
            <el-form-item :label="$t('CLA.total.dlmc')" class="cos" v-show="detailData.IsEnableCmqNotify">
              <p>
                <span class="spn">{{ $t('CLA.total.dy') }}：</span>
                {{detailData.CmqRegion}}
              </p>
              <p>
                <span class="spn">{{ $t('CLA.total.mc') }}：</span>
                {{detailData.CmqQueueName}}
              </p>
            </el-form-item>
          </div>
          <div class="inp-box" v-show="inpShow1">
            <el-form-item :label="$t('CLA.total.cjcct')" class="store">
              <el-radio-group v-model="detailData.IsCreateNewBucket" @change="_radio">
                <el-radio :label="1">{{ $t('CLA.total.s') }}</el-radio>
                <el-radio :label="0">{{ $t('CLA.total.f') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('CLA.total.coscct')" required class="select">
              <el-select v-model="select.name" :placeholder="$t('CLA.total.qxz')" @change="_select">
                <el-option v-for="item in select.options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-form-item label prop="CosBucketName" class="seletInp" v-show="!cosShow">
                <el-input v-model="detailData.CosBucketName" :placeholder="$t('CLA.total.qsrmc')"></el-input>
              </el-form-item>
              <el-select v-model="BucketSelect.name" v-show="cosShow" class="BucketSelect" @change="_BucketSelect">
                <el-option v-for="item in BucketSelect.options" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <p class="addTxt">
              {{ $t('CLA.total.tj') }}
              <span @click="_set">{{ $t('CLA.total.gjsz') }}</span>
              <i class="el-icon-caret-right" v-show="!setShow"></i>
              <i class="el-icon-caret-bottom" v-show="setShow"></i>
            </p>
            <div class="set-box" v-show="setShow">
              <el-form-item :label="$t('CLA.total.rzwjqz')" prop="LogFilePrefix">
                <el-input v-model="detailData.LogFilePrefix" :placeholder="$t('CLA.total.qsrrzwjqz')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('CLA.total.fstz')" class="CMQ" required>
                <el-radio-group v-model="detailData.IsEnableCmqNotify" @change="_cmqRadio">
                  <el-radio :label="1">{{ $t('CLA.total.s') }}</el-radio>
                  <el-radio :label="0">{{ $t('CLA.total.f') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="set-child" v-show="setChild">
                <el-form-item :label="$t('CLA.total.cjdl')" class="CMQ" required>
                  <el-radio-group v-model="cmqShow" @change="_cmqCretae">
                    <el-radio :label="true">{{ $t('CLA.total.s') }}</el-radio>
                    <el-radio :label="false">{{ $t('CLA.total.f') }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('CLA.total.dlmc')" required class="select cmqSelect">
                  <el-select v-model="cmqSelect.name" :placeholder="$t('CLA.total.qxz')" @change="_cmqSelect">
                    <el-option v-for="item in cmqSelect.options" :key="item.value" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                  <el-form-item label prop="CmqQueueName" class="seletInp" v-if="detailData.IsEnableCmqNotify">
                    <el-input v-model="detailData.CmqQueueName" :placeholder="$t('CLA.total.qsrdlmc')"></el-input>
                  </el-form-item>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="btn-box" v-show="inpShow1">
            <div class="line lineVal"></div>
            <el-form-item class="button">
              <el-button type="primary" icon="el-icon-loading" v-show="btnLoad"></el-button>
              <el-button type="primary" @click="submitForm1('detailData')" v-show="!btnLoad">{{ $t('CLA.total.bc') }}
              </el-button>
              <el-button @click="_cancel1">{{ $t('CLA.total.qx') }}</el-button>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <el-button type="primary" @click="del">{{ $t('CLA.total.scgzj') }}</el-button>
  </div>
</template>

<script>
  import Header from "../Public/Head";
  import {
    ErrorTips
  } from '@/components/ErrorTips'
  import {
    GZJ_DETAILIST,
    LIST_COSBUCKETS,
    GZJ_DELETE,
    GZJ_UPDATEAUDIT,
    GZJ_REGION,
    GZJ_STRATLOGGING,
    GZJ_STOPLOGGING,
    GZJ_COS
  } from "../../../constants";
  export default {
    name: "detail-audit",
    data() {
      //输入框正则验证
      var AuditName = (rule, value, callback) => {
        var reg = /^[a-zA-Z0-9_]{3,128}$/;
        setTimeout(() => {
          if (!reg.test(value)) {
            callback(
              new Error("僅支持大小寫字母、數字、以及_的組合，3-128個字元。")
            );
          } else {
            callback();
          }
        }, 1000);
      };
      var LogFilePrefix = (rule, value, callback) => {
        var reg = /^[a-zA-Z0-9]{3,40}$/;
        if (!value) {
          callback();
        }
        setTimeout(() => {
          if (!reg.test(value)) {
            callback(new Error("僅支持字母和數字的組合，3-40個字元。"));
          } else {
            callback();
          }
        }, 1000);
      };
      var CosBucketName = (rule, value, callback) => {
        var reg = /^[a-z0-9-]{1,40}$/;
        setTimeout(() => {
          if (!reg.test(value)) {
            callback(
              new Error(
                '僅支持小寫字母、數字以及中劃線" - "的組合，不能超過40字元。'
              )
            );
          } else {
            callback();
          }
        }, 1000);
      };
      var CmqQueueName = (rule, value, callback) => {
        var reg = /^[a-zA-Z]([-a-zA-Z0-9]{0,64})$/;
        setTimeout(() => {
          if (!reg.test(value)) {
            callback(
              new Error(
                "不超過64個字元的字元串，必須以字母為首字元，剩餘部分可以包含字母、數字和橫劃線(-)。"
              )
            );
          } else {
            callback();
          }
        }, 1000);
      };
      return {
        boxloading: false,
        boxloading1: false,
        loading: true, //是否为加载中状态
        title: "", //header的标题
        detailData: {}, //页面信息
        //输入框验证
        rules: {
          LogFilePrefix: [{
            validator: LogFilePrefix,
            trigger: "blur"
          }],
          AuditName: [{
            validator: AuditName,
            trigger: "blur"
          }],
          CosBucketName: [{
            validator: CosBucketName,
            trigger: "blur"
          }],
          CmqQueueName: [{
            validator: CmqQueueName,
            trigger: "blur"
          }]
        },
        //第一部分编辑inp是否显示
        inpShow: false,
        //第二部分编辑inp是否显示
        inpShow1: false,
        //弹出框
        dialogVisible: false,
        //按钮加载状态
        btnLoad: false,
        btnLoad1: false,
        //文字过滤
        ReadWrite: {
          3: "全部",
          2: "只寫",
          1: "只讀"
        },
        CmqNotify: {
          0: "否",
          1: "是"
        },
        //Bucket下拉框
        BucketSelect: {
          name: ""
        },
        //地域下拉框
        select: {
          name: "",
          index: 0
        },
        //cos是否显示
        cosShow: false,
        //高级设置是否显示
        setShow: true,
        //高级设置下一部分是否显示
        setChild: false,
        cmqShow: false,
        //是否新建
        IsCreateNewQueue: 0,
        CmqQueueName1: "123",
        //cmq地域选择框
        cmqSelect: {
          index: 0
        },
        value: true
      };
    },
    methods: {
      //日志采集
      _switch() {
        //开启
        if (this.value) {
          const params = {
            AuditName: this.title,
            Region: "ap-guangzhou",
            Version: "2019-03-19"
          };
          this.axios.post(GZJ_STRATLOGGING, params).then(res => {});
        }
        //关闭
        else {
          const params = {
            Name: this.title,
            Version: "2019-03-19"
          };
          this.axios.post(GZJ_STOPLOGGING, params).then(res => {});
        }
      },
      //返回上一级页面
      _back() {
        this.$router.push("/Audit");
      },
      //删除
      delFn() {
        let params = {
          AuditName: this.title,
          Version: "2019-03-19",
          Region: "ap-guangzhou"
        };
        this.axios.post(GZJ_DELETE, params).then(data => {
          if (data.Response.IsSuccess == 1) {
            this.$message({
              message: "刪除成功",
              type: "success"
            });
            this.$router.push("/Audit");
          } else {
            this.$message.error("刪除失敗");
          }
        });
      },
      //弹出框显示
      del() {
        this.dialogVisible = true;
      },
      //是否创建cmq
      _cmqCretae() {
        if (this.cmqShow) {
          this.IsCreateNewQueue == 1;
        } else {
          this.IsCreateNewQueue == 0;
        }
      },
      //点击取消按钮
      handleClose(done) {
        this.dialogVisible = false;
      },
      //保存
      submitForm1(formName) {
        this.btnLoad = true;
        this.$refs[formName].validate(valid => {
          if (valid) {
            const params = {
              Version: "2019-03-19",
              Region: "ap-guangzhou",
              AuditName: this.title,
              IsCreateNewBucket: this.detailData.IsCreateNewBucket,
              CosRegion: this.detailData.CosRegion,
              CosBucketName: this.detailData.CosBucketName,
              IsEnableCmqNotify: this.detailData.IsEnableCmqNotify
            };
            if (this.detailData.IsEnableCmqNotify == 1) {
              params["CmqQueueName"] = this.detailData.CmqQueueName;
              params["IsCreateNewQueue"] = this.IsCreateNewQueue;
              params["CmqRegion"] = this.cmqSelect.options[
                this.cmqSelect.index
              ].name;
            } else {
              delete params.CmqQueueName;
              delete params.CmqRegion;
              delete params.IsCreateNewQueue;
            }
            this.axios.post(GZJ_UPDATEAUDIT, params).then(res => {
              if (res.Response.IsSuccess == 1) {
                this.$message({
                  message: "更新成功",
                  type: "success"
                });
                this.inpShow1 = false;
                this.detailList();
              } else {
                if (res.Response.Error.Code) {
                  this.$message.error(res.Response.Error.Code);
                } else {
                  this.$message.error("更新失敗");
                }
              }
              this.btnLoad = false;
            });
          } else {
            return false;
            this.btnLoad = false;
          }
        });
      },
      //radio框发生变化
      _cmqRadio() {
        if (
          this.detailData.IsEnableCmqNotify == "是" ||
          this.detailData.IsEnableCmqNotify == 1
        ) {
          this.setChild = true;
        } else {
          this.setChild = false;
        }
      },
      //cmq选择框发生变化
      _cmqSelect() {
        this.cmqSelect.index = this.cmqSelect.options[this.cmqSelect.name].value;
      },
      //地域下拉框发生变化
      _select() {
        this.select.index = this.select.options[this.select.name].value;
      },
      //Bucket下拉框发生变化
      _BucketSelect() {
        this.detailData.CosBucketName = this.BucketSelect.options[
          this.BucketSelect.name
        ].label;
      },
      cmq() {
        //	cmq地域
        const params = {
          Version: "2019-03-19",
          Region: "ap-guangzhou"
        };
        this.axios.post(GZJ_REGION, params).then(res => {
          var data = res.Response.EnableRegions;
          var arr = [];
          data.forEach((item, index) => {
            const obj = {
              label: item.CmqRegionName,
              value: index,
              name: item.CmqRegion
            };
            arr.push(obj);
          });
          this.cmqSelect.options = arr;
          this.cmqSelect.name = arr[0].label;
        });
      },
      bucket() {
        this.axios.post(LIST_COSBUCKETS).then(res => {
          var data = res.data.cosBucketsList;
          var arr = [];
          data.forEach((item, index) => {
            const obj = {
              label: item.name,
              value: index,
              name: item.region,
              id: item.appId
            };
            arr.push(obj);
          });
          this.BucketSelect.options = arr;
        });
      },
      //cos信息
      cos() {
        //	cos地域
        const params = {
          Version: "2019-03-19",
          Region: "ap-guangzhou"
        };
        this.axios.post(GZJ_COS, params).then(res => {
          var data = res.Response.EnableRegions;
          var arr = [];
          data.forEach((item, index) => {
            const obj = {
              label: item.CosRegionName,
              value: index,
              name: item.CosRegion
            };
            arr.push(obj);
          });
          this.select.options = arr;
          this.select.name = arr[0].label;
        });
      },
      //获取跟踪集详情
      detailList() {
        const params = {
          Version: "2019-03-19",
          Region: "ap-guangzhou",
          AuditName: this.title
        };
        this.axios.post(GZJ_DETAILIST, params).then(res => {
          if (res.Response.Error === undefined) {
            this.detailData = res.Response;
            this.detailData.IsCreateNewBucket = 0;
            this.setChild = this.detailData.IsEnableCmqNotify;
            this.loading = false;
            this.boxloading1 = false;
            this.boxloading = false;
          } else {
            let
              ErrTips = {
                'InternalError.DescribeAuditError': '查看跟踪集详情错误，请联系开发人员',
                'ResourceNotFound.AuditNotExist': '跟踪集不存在'
              }
            let
              ErrOr = Object.assign(ErrorTips, ErrTips)
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        });
      },
      //编辑
      _edit() {
        this.inpShow = !this.inpShow;
      },
      _edit1() {
        this.inpShow1 = !this.inpShow1;
      },
      //取消
      _cancel() {
        this.boxloading = true;
        this.detailList();
        this.inpShow = false;
      },
      _cancel1() {
        this.boxloading1 = true;
        this.detailList();
        this.inpShow1 = false;
      },
      _radio() {
        var val = this.detailData.IsCreateNewBucket;
        if (val == "1") {
          this.cosShow = false;
          this.detailData.CosBucketName = "";
          this.BucketSelect.name = "";
        } else {
          this.cosShow = true;
        }
      },
      _set() {
        this.setShow = !this.setShow;
      },
      //更新事件
      submitForm() {
        this.btnLoad1 = true;
        const params = {
          Version: "2019-03-19",
          Region: "ap-guangzhou",
          AuditName: this.title,
          ReadWriteAttribute: this.detailData.ReadWriteAttribute
        };
        this.axios.post(GZJ_UPDATEAUDIT, params).then(res => {
          if (res.Response.IsSuccess == 1) {
            this.$message({
              message: "更新成功",
              type: "success"
            });
            this.inpShow = false;
          } else {
            this.$message.error(res.Response.Error.Code);
          }
          this.btnLoad1 = false;
          this.detailList();
        });
      }
    },
    created() {
      this.title = this.$route.query.AuditName;

      //跟踪集详情
      this.detailList();
      this.bucket();
      this.cos();
      this.cmq();
    },
    components: {
      Header
    }
  };

</script>

<style scoped lang='scss'>
  .detail-audit>>>.el-loading-mask {
    background: white !important;
  }

  .detail-audit>>>button {
    font-size: 12px;
    height: 30px;
    border-radius: 0;
    line-height: 30px;
    padding: 0 18px;
    box-sizing: border-box;
    margin: 10px 10px 20px 0;
    margin: 20px;
  }

  .detail-audit {
    .header {
      background: white;
      padding: 10px 15px;
      border-bottom: 1px solid #ddd;
      width: 100%;
      font-size: 16px;
      font-weight: 700;
      line-height: 30px;

      i {
        color: #006eff;
        font-size: 16px;
        margin-right: 12px;
        font-weight: bold;
        padding: 5px;
        box-sizing: border-box;
        cursor: pointer;
      }

      i:hover {
        background: #f2f2f2;
      }
    }

    .dialog {
      font-size: 18px;
      font-weight: bold;
      color: black;
      margin-bottom: 10px;
    }

    .detil-audit-box>>>.el-form-item__label {
      font-size: 12px;
      text-align: left;
    }

    .detil-audit-box>>>.el-input {
      width: 200px;
    }

    .detil-audit-box>>>.el-input__inner {
      border-radius: 0;
      height: 30px;
      padding-left: 5px;
      line-height: 30px;
      padding-top: 0;
    }

    .detil-audit-box>>>.el-radio__label {
      font-size: 12px;
    }

    .detil-audit-box>>>.el-form-item {
      margin-bottom: 12px;
    }

    .detil-audit-box>>>input {
      font-size: 12px;
    }

    .detil-audit-box>>>button {
      font-size: 12px;
      height: 30px;
      border-radius: 0;
      line-height: 30px;
      padding: 0 15px;
      box-sizing: border-box;
      margin: 10px 10px 20px 0;
    }

    .store>>>.el-form-item__label:nth-child(1) {
      line-height: 16px;
      margin-top: 5px;
    }

    .select>>>.el-select {
      width: 70px;
      float: left;
    }

    .select>>>.el-input--suffix {
      width: 70px;
    }

    .select>>>.el-form-item__error {
      width: 400px;
    }

    .cmqSelect>>>.el-form-item__error {
      margin-left: -80px;
      width: 600px;
    }

    .seletInp {
      margin-left: 10px;
      float: left;
    }

    .line {
      width: 100%;
      height: 1px;
      background: #f2f2f2;
      margin-bottom: 6px;
      margin-top: -6px;
    }

    .lineVal {
      margin-top: 12px;
    }

    .button>>>.el-form-item__content {
      margin-left: 0 !important;
    }

    .detil-audit-main {
      padding: 20px;
      padding-bottom: 0;
      box-sizing: border-box;

      .detil-audit-box {
        background-color: #fff;
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        max-width: 1360px;
        margin: 0 auto;
        padding: 0 20px;
        padding-bottom: 5px;
        position: relative;

        .BucketSelect>>>.el-input {
          width: 200px;
          margin-bottom: 22px;
          margin-left: 10px;
        }

        .spn {
          color: #888;
        }

        .edit {
          position: absolute;
          right: 20px;
          top: 22px;
          color: #006eff;
          cursor: pointer;
        }

        .cos {
          p {
            float: left;
            margin-right: 15px;
          }
        }

        .edit:hover {
          border-bottom: 1px solid #006eff;
        }

        .addTxt {
          font-size: 12px;
          padding-bottom: 20px;
          box-sizing: border-box;
          margin-left: 100px;

          span {
            color: #006eff;
            cursor: pointer;
          }

          span:hover {
            border-bottom: 1px #006eff solid;
            line-height: 12px;
          }
        }

        p {
          font-size: 12px;
        }

        h2 {
          font-size: 14px;
          padding-bottom: 10px;
          padding-top: 25px;
          box-sizing: border-box;
        }
      }
    }
  }

</style>
