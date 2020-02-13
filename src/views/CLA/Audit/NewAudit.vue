<template>
  <div class="newAudit-wrap">
    <Header :backShow="true" :title="$t('CLA.total.cjgzj')" @_back="_back" />
    <div class="newAudit-main" v-if="loadingdata" v-loading='!loadingdata'>
      <div class="newAudit-box">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <div class="main-box">
            <h2>{{ $t('CLA.total.jcxx') }}</h2>
            <el-form-item :label="$t('CLA.total.gzjmc')" prop="AuditName" required class="AuditName">
              <el-input v-model="ruleForm.AuditName"></el-input>
              <span>僅支持大小寫字母、數字、以及_的組合，3-128個字元。</span>
            </el-form-item>
            <el-form-item :label="$t('CLA.total.gzqy')">
              <p style="font-size:12px;">{{ $t('CLA.total.s') }}</p>
            </el-form-item>
          </div>
          <div class="main-box">
            <h2>{{ $t('CLA.total.glsj') }}</h2>
            <el-form-item :label="$t('CLA.total.glsj')" required>
              <el-radio-group v-model="ruleForm.ReadWriteAttribute">
                <el-radio :label="$t('CLA.total.qb')"></el-radio>
                <el-radio :label="$t('CLA.total.zd')"></el-radio>
                <el-radio :label="$t('CLA.total.zx')"></el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="main-box">
            <h2>{{ $t('CLA.total.ccwz') }}</h2>
            <el-form-item :label="$t('CLA.total.cjcct')" class="store">
              <el-radio-group v-model="ruleForm.IsCreateNewBucket" @change="_radio">
                <el-radio :label="$t('CLA.total.s')"></el-radio>
                <el-radio :label="$t('CLA.total.f')"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('CLA.total.coscct')" required class="select">
              <el-select v-model="select.name" :placeholder="$t('CLA.total.qxz')" @change="_select">
                <el-option v-for="(item,index) in select.options" :key="index" :label="item.label" :value="item.name">
                </el-option>
              </el-select>
              <el-form-item label prop="CosBucketName" class="seletInp CosBucketName" v-show="!cosShow">
                <el-input v-model="ruleForm.CosBucketName" :placeholder="$t('CLA.total.qsrmc')"></el-input>
                <span>僅支持小寫字母、數字以及中劃線" - "的組合，不能超過40字元。</span>
              </el-form-item>
              <el-select v-model="BucketSelect.name" v-show="cosShow" class="BucketSelect" @change="_BucketSelect">
                <el-option v-for="item in BucketSelect.options" :key="item.Name" :label="item.Name" :value="item.Name">
                </el-option>
              </el-select>
            </el-form-item>
            <p class="addTxt">
              {{ $t('CLA.total.tj') }}
              <span @click="_set">{{ $t('CLA.total.gjsz') }}</span>
              <i class="el-icon-caret-right" v-show="!setShow"></i>
              <i class="el-icon-caret-bottom" v-show="setShow"></i>
            </p>
            <div class="set-box" v-show="setShow">
              <el-form-item :label="$t('CLA.total.rzwjqz')" prop="LogFilePrefix" class="LogFilePrefix">
                <el-input v-model="ruleForm.LogFilePrefix" :placeholder="$t('CLA.total.qsrrzwjqz')"></el-input>
                <span>僅支持字母和數字的組合，3-40個字元。</span>
              </el-form-item>
              <el-form-item :label="$t('CLA.total.fstz')" class="CMQ" required>
                <el-radio-group v-model="ruleForm.IsEnableCmqNotify" @change="_cmqRadio">
                  <el-radio :label="$t('CLA.total.s')"></el-radio>
                  <el-radio :label="$t('CLA.total.f')"></el-radio>
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
                    <el-option v-for="(item,index) in cmqSelect.options" :key="index" :label="item.CmqRegionName"
                      :value="item.CmqRegion"></el-option>
                  </el-select>
                  <el-form-item label prop="CmqQueueName" class="seletInp CosBucketName"
                    v-if="ruleForm.IsEnableCmqNotify">
                    <el-input v-model="ruleForm.CmqQueueName" :placeholder="$t('CLA.total.qsrdlmc')"></el-input>
                    <span>不超過64個字元的字元串，必須以字母為首字元，剩餘部分可以包含字母、數字和橫劃線(-)。</span>
                  </el-form-item>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="main-box" style="border:0;">
            <el-form-item>
              <el-button @click="_cancel">{{ $t('CLA.total.qx') }}</el-button>
              <el-button type="primary" @click="_onSubmit('ruleForm')" v-show="!btnLoad">{{ $t('CLA.total.ljcj') }}
              </el-button>
              <el-button type="primary" icon="el-icon-loading" v-show="btnLoad"></el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    ErrorTips
  } from "@/components/ErrorTips";
  import Header from "../Public/Head";
  import {
    LIST_COSBUCKETS,
    GZJ_LIST,
    GZJ_REGION,
    GZJ_CREATE,
    GZJ_COS
  } from "../../../constants";
  export default {
    name: "new-audit",
    data() {
      //正则验证
      var AuditName = (rule, value, callback) => {
        var reg = /^[a-zA-Z0-9_]{3,128}$/;
        var _this = this;
        setTimeout(() => {
          if (!reg.test(value)) {
            callback(
              new Error("僅支持大小寫字母、數字、以及_的組合，3-128個字元。")
            );
            _this.btnLoad = false;
          } else {
            callback();
          }
        }, 1000);
      };
      var LogFilePrefix = (rule, value, callback) => {
        var reg = /^[a-zA-Z0-9]{3,40}$/;
        var _this = this;
        if (!value) {
          callback();
        }
        setTimeout(() => {
          if (!reg.test(value)) {
            callback(new Error("僅支持字母和數字的組合，3-40個字元。"));
            _this.btnLoad = false;
          } else {
            callback();
          }
        }, 1000);
      };
      var CosBucketName = (rule, value, callback) => {
        var reg = /^[a-z0-9-]{1,40}$/;
        var _this = this;
        setTimeout(() => {
          if (!reg.test(value)) {
            callback(
              new Error(
                '僅支持小寫字母、數字以及中劃線" - "的組合，不能超過40字元。'
              )
            );
            _this.btnLoad = false;
          } else {
            callback();
          }
        }, 1000);
      };
      var CmqQueueName = (rule, value, callback) => {
        var reg = /^[a-zA-Z]([-a-zA-Z0-9]{0,64})$/;

        if (this.ruleForm.IsEnableCmqNotify) {
          if (!value) {
            callback();
          }
        }
        var _this = this;
        setTimeout(() => {
          if (!reg.test(value)) {
            callback(
              new Error(
                "不超過64個字元的字元串，必須以字母為首字元，剩餘部分可以包含字母、數字和橫劃線(-)。"
              )
            );
            _this.btnLoad = false;
          } else {
            callback();
          }
        }, 1000);
      };
      return {
        loadingdata: false,
        //是否创建新的桶
        IsCreateNewQueue: 0,
        //是否创建cmq
        cmqShow: false,
        //cmq下拉框
        cmqSelect: {
          index: 0,
          name: ""
        },
        //高级设置是否显示
        setShow: false,
        //选择框
        select: {
          name: localStorage.getItem("regionv2")
        },
        name: "111",
        //btn加载状态
        btnLoad: false,
        //Bucket下拉框
        BucketSelect: {
          name: ""
        },
        //表单数据
        ruleForm: {
          AuditName: "",
          ReadWriteAttribute: "全部",
          IsCreateNewBucket: "是",
          CosBucketName: "",
          IsEnableCmqNotify: "否",
          CosRegion: "",
          CmqQueueName: ""
        },
        //表单验证
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
        //高级设置是否显示
        setChild: false,
        //cos是否显示
        cosShow: false
      };
    },
    components: {
      Header
    },
    methods: {
      cmq() {
        //	cmq地域
        const params = {
          Version: "2019-03-19",
          Region: localStorage.getItem("regionv2")
        };
        this.axios.post(GZJ_REGION, params).then(res => {
          if (res.Response.Error === undefined) {
            var data = res.Response.EnableRegions;
            var arr = [];
            this.cmqSelect.options = res.Response.EnableRegions;
            this.cmqSelect.name = this.cmqSelect.options[0].CmqRegion;
          } else {
            let ErrTips = {
              "InternalError.ListCmqEnableRegionError": "內部錯誤，請聯繫開發人員"
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
      //cmq单选变化
      _cmqRadio() {
        if (
          this.ruleForm.IsEnableCmqNotify == "是" ||
          this.ruleForm.IsEnableCmqNotify == 1
        ) {
          this.setChild = true;
        } else {
          this.setChild = false;
        }
      },
      //创建cmq
      _cmqCretae() {
        if (this.cmqShow) {
          this.IsCreateNewQueue == 1;
        } else {
          this.IsCreateNewQueue == 0;
        }
      },
      //下拉框
      _cmqSelect() {

      },
      _select() {
        this.bucket();
      },
      _BucketSelect() {
        this.ruleForm.CosBucketName = this.BucketSelect.name
      },
      //返回上一级
      _back() {
        this.$router.push("/Audit");
      },
      _set() {
        this.setShow = !this.setShow;
      },
      //确认
      _onSubmit(formName) {
        this.btnLoad = true;
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.ruleForm.IsEnableCmqNotify == "是" ?
              (this.ruleForm.IsEnableCmqNotify = 1) :
              (this.ruleForm.IsEnableCmqNotify = 0);
            this.ruleForm.IsCreateNewBucket == "是" ?
              (this.ruleForm.IsCreateNewBucket = 1) :
              (this.ruleForm.IsCreateNewBucket = 0);
            this.ruleForm.ReadWriteAttribute == "只讀" ?
              (this.ruleForm.ReadWriteAttribute = 1) :
              this.ruleForm.ReadWriteAttribute == "只寫" ?
              (this.ruleForm.ReadWriteAttribute = 2) :
              (this.ruleForm.ReadWriteAttribute = 3);
            this.ruleForm.Version = "2019-03-19";
            this.ruleForm.Region = localStorage.getItem("regionv2");
            this.ruleForm.CosRegion = this.select.name;
            if (this.ruleForm.IsEnableCmqNotify == 1) {
              this.ruleForm["IsCreateNewQueue"] = this.IsCreateNewQueue;
              this.ruleForm["CmqRegion"] = this.cmqSelect.name;
            } else {
              delete this.ruleForm.CmqQueueName;
            }
            this.axios.post(GZJ_CREATE, this.ruleForm).then(res => {
              if (res.Response.Error === undefined) {
                this.$message({
                  message: "創建成功",
                  type: "success"
                });
                this.btnLoad = false;
                this.$router.push("/Audit");
              } else {
                let ErrTips = {
                  "InternalError.CmqError": "創建cmq時發生異常，可能您準備創建的cmq隊列已經存在，也有可能您沒有許可權或者欠費",
                  "InternalError.CreateAuditError": "創建跟蹤集錯誤，請聯繫開發人員",
                  "InvalidParameterValue.AuditNameError": "跟蹤集名稱不符合規則",
                  "InvalidParameterValue.CmqRegionError": "雲審計目前不支持輸入的cmq地域",
                  "InvalidParameterValue.CosNameError": "輸入的cos儲存桶名稱不符合規範",
                  "InvalidParameterValue.CosRegionError": "雲審計目前不支持輸入的cos地域",
                  "InvalidParameterValue.IsCreateNewBucketError": "IsCreateNewBucket的有效取值範圍是0和1，0代表不創建新的儲存桶，1代表創建新的儲存桶",
                  "InvalidParameterValue.IsCreateNewQueueError": "IsCreateNewQueue的有效取值範圍是0和1，0代表不新創建，1代表新創建",
                  "InvalidParameterValue.IsEnableCmqNotifyError": "IsEnableCmqNotify的有效取值範圍是0和1，0代表不開啟投遞cmq,1代表開啟cmq投遞",
                  "InvalidParameterValue.LogFilePrefixError": "日誌前綴格式錯誤",
                  "InvalidParameterValue.QueueNameError": "輸入的隊列名稱不符合規範",
                  "InvalidParameterValue.ReadWriteAttributeError": "讀寫屬性值僅支持：1,2,3。1代表只讀，2代表只寫，3代表全部。",
                  "LimitExceeded.OverAmount": "超過跟蹤集的最大值",
                  "MissingParameter.MissAuditName": "缺少跟蹤集名稱",
                  "MissingParameter.MissCosBucketName": "缺少cos儲存桶參數",
                  "MissingParameter.MissCosRegion": "缺少cos地域參數",
                  "MissingParameter.cmq": "IsEnableCmqNotify輸入1的話，IsCreateNewQueue、CmqQueueName和CmqRegion都是必須參數。",
                  "ResourceInUse.AlreadyExistsSameAudit": "已經存在相同名稱的跟蹤集",
                  "ResourceInUse.AlreadyExistsSameAuditCmqConfig": "已經存在相同cmq投遞配置的跟蹤集",
                  "ResourceInUse.AlreadyExistsSameAuditCosConfig": "已經存在相同cos投遞配置的跟蹤集",
                  "ResourceInUse.CosBucketExists": "cos儲存桶已經存在"
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
          }
        });
      },
      //取消
      _cancel() {
        this.$router.push("/Audit");
      },
      //单选框发送变化
      _radio() {
        var val = this.ruleForm.IsCreateNewBucket;
        if (val == "是") {
          this.cosShow = false;
          this.ruleForm.CosBucketName = "";
          this.BucketSelect.name = "";
        } else {
          this.cosShow = true;
        }
      },
      bucket() {
        this.axios.post(LIST_COSBUCKETS).then(res => {
          var data = res.Buckets.Bucket;
          var arr = [];
          data.forEach((item, index) => {
            if (item.Location == this.select.name) {
              arr.push(item);
            }
          });
          this.BucketSelect.options = arr;
        });
      },
      gzj_cos() {
        const params = {
          Version: "2019-03-19",
          Region: localStorage.getItem("regionv2")
        };
        this.axios.post(GZJ_COS, params).then(res => {
          if (res.Response.Error === undefined) {
            var data = res.Response.EnableRegions;
            var arr = [];
            data.forEach((item, index) => {
              if (item.CosRegion === localStorage.getItem("regionv2")) {
                const obj = {
                  label: item.CosRegionName,
                  value: index,
                  name: item.CosRegion
                };
                arr.push(obj);
              }
            });
            this.select.options = arr;
            this.loadingdata = true
            this.bucket();
          } else {
            let ErrTips = {
              "InternalError.ListCosEnableRegionError": "內部錯誤，請聯繫開發人員"
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
      }
    },
    created() {
      this.cmq();
      //	cos地域
      this.gzj_cos();
    }
  };

</script>

<style scoped lang='scss'>
  .newAudit-wrap {
    .newAudit-main {
      padding: 20px;
      padding-bottom: 0;
      box-sizing: border-box;

      .AuditName {
        position: relative;

        span {
          font-size: 12px;
          position: absolute;
          bottom: -30px;
          left: 0;
        }
      }

      .LogFilePrefix {
        position: relative;

        span {
          font-size: 12px;
          position: absolute;
          bottom: -30px;
          left: 0;
        }
      }

      .CosBucketName {
        position: relative;

        span {
          font-size: 12px;
          position: absolute;
          width: 500px;
          bottom: -30px;
          left: 0;
        }
      }

      .newAudit-box {
        background-color: #fff;
        box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
        box-sizing: border-box;
        max-width: 1360px;
        margin: 0 auto;
        padding: 0 20px;

        .main-box {
          border-bottom: 1px #f2f2f2 solid;

          .BucketSelect>>>.el-input {
            width: 200px;
            margin-bottom: 22px;
            margin-left: 10px;
          }

          .select .el-form-item__content {
            display: flex;
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
        }

        h2 {
          font-size: 14px;
          padding-bottom: 10px;
          padding-top: 25px;
          box-sizing: border-box;
        }

        .main-box>>>.el-form-item__label {
          font-size: 12px;
          text-align: left;
        }

        .main-box>>>.el-input {
          width: 200px;
        }

        .main-box>>>.el-input__inner {
          border-radius: 0;
          height: 30px;
          padding-left: 5px;
          line-height: 30px;
          padding-top: 0;
        }

        .main-box>>>.el-radio__label {
          font-size: 12px;
        }

        .store>>>.el-form-item__label:nth-child(1) {
          line-height: 16px;
          margin-top: 5px;
        }

        .main-box>>>.el-form-item {
          margin-bottom: 12px;
        }

        .select>>>.el-select {
          width: 70px;
          float: left;
        }

        .select>>>.el-input--suffix {
          width: 70px;
        }

        .select>>>.el-form-item__error {
          width: 500px;
        }

        .seletInp {
          margin-left: 10px;
          float: left;
        }

        .main-box>>>input {
          font-size: 12px;
        }

        .main-box>>>button {
          font-size: 12px;
          height: 30px;
          border-radius: 0;
          line-height: 30px;
          padding: 0 15px;
          box-sizing: border-box;
          margin: 10px 10px 20px 0;
        }
      }
    }
  }

</style>
