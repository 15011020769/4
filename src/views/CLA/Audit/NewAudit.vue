<template>
  <div class="newAudit-wrap">
    <Header :backShow="true" :title="$t('CLA.total.cjgzj')" @_back="_back" />
    <div class="newAudit-main">
      <div class="newAudit-box">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <div class="main-box">
            <h2>{{ $t('CLA.total.jcxx') }}</h2>
            <el-form-item :label="$t('CLA.total.gzjmc')" prop="AuditName" required>
              <el-input v-model="ruleForm.AuditName"></el-input>
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
                <el-option
                  v-for="item in select.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-form-item label prop="CosBucketName" class="seletInp" v-show="!cosShow">
                <el-input v-model="ruleForm.CosBucketName" :placeholder="$t('CLA.total.qsrmc')"></el-input>
              </el-form-item>
              <el-select
                v-model="BucketSelect.name"
                v-show="cosShow"
                class="BucketSelect"
                @change="_BucketSelect"
              >
                <el-option
                  v-for="item in BucketSelect.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
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
                <el-input v-model="ruleForm.LogFilePrefix" :placeholder="$t('CLA.total.qsrrzwjqz')"></el-input>
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
                  <el-select
                    v-model="cmqSelect.name"
                    :placeholder="$t('CLA.total.qxz')"
                    @change="_cmqSelect"
                  >
                    <el-option
                      v-for="item in cmqSelect.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-form-item
                    label
                    prop="CmqQueueName"
                    class="seletInp"
                    v-if="ruleForm.IsEnableCmqNotify"
                  >
                    <el-input
                      v-model="ruleForm.CmqQueueName"
                      :placeholder="$t('CLA.total.qsrdlmc')"
                    ></el-input>
                  </el-form-item>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="main-box" style="border:0;">
            <el-form-item>
              <el-button @click="_cancel">{{ $t('CLA.total.qx') }}</el-button>
              <el-button
                type="primary"
                @click="_onSubmit('ruleForm')"
                v-show="!btnLoad"
              >{{ $t('CLA.total.ljcj') }}</el-button>
              <el-button type="primary" icon="el-icon-loading" v-show="btnLoad"></el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
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
      if (this.ruleForm.IsEnableCmqNotify) {
        if (!value) {
          callback();
        }
      }
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
      //是否创建新的桶
      IsCreateNewQueue: 0,
      //是否创建cmq
      cmqShow: false,
      //cmq下拉框
      cmqSelect: { index: 0 },
      //高级设置是否显示
      setShow: false,
      //选择框
      select: {
        index: 0
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
        LogFilePrefix: [{ validator: LogFilePrefix, trigger: "blur" }],
        AuditName: [{ validator: AuditName, trigger: "blur" }],
        CosBucketName: [{ validator: CosBucketName, trigger: "blur" }],
        CmqQueueName: [{ validator: CmqQueueName, trigger: "blur" }]
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
      this.cmqSelect.index = this.cmqSelect.options[this.cmqSelect.name].value;
    },
    _select() {
      this.select.index = this.select.options[this.select.name].value;
    },
    _BucketSelect() {
      this.ruleForm.CosBucketName = this.BucketSelect.options[
        this.BucketSelect.name
      ].label;
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
          this.ruleForm.IsEnableCmqNotify == "是"
            ? (this.ruleForm.IsEnableCmqNotify = 1)
            : (this.ruleForm.IsEnableCmqNotify = 0);
          this.ruleForm.IsCreateNewBucket == "是"
            ? (this.ruleForm.IsCreateNewBucket = 1)
            : (this.ruleForm.IsCreateNewBucket = 0);
          this.ruleForm.ReadWriteAttribute == "只讀"
            ? (this.ruleForm.ReadWriteAttribute = 1)
            : this.ruleForm.ReadWriteAttribute == "只寫"
            ? (this.ruleForm.ReadWriteAttribute = 2)
            : (this.ruleForm.ReadWriteAttribute = 3);
          this.ruleForm.Version = "2019-03-19";
          this.ruleForm.Region = "ap-guangzhou";
          this.ruleForm.CosRegion = this.select.options[this.select.index].name;
          if (this.ruleForm.IsEnableCmqNotify == 1) {
            this.ruleForm["IsCreateNewQueue"] = this.IsCreateNewQueue;
            this.ruleForm["CmqRegion"] = this.cmqSelect.options[
              this.cmqSelect.index
            ].name;
          } else {
            delete this.ruleForm.CmqQueueName;
          }
          this.axios.post(GZJ_CREATE, this.ruleForm).then(res => {
            if (res.Response.IsSuccess == 1) {
              this.$message({
                message: "創建成功",
                type: "success"
              });
              this.btnLoad = false;
              this.$router.push("/Audit");
            } else {
              this.$message.error("創建失敗");
              this.btnLoad = false;
            }
          });
        } else {
          this.btnLoad = false;
          return false;
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
    }
  },
  created() {
    this.cmq();
    //BucketSelect
    this.axios.post(LIST_COSBUCKETS).then(res => {
      if (res.message) {
        this.$message(res.message);
      }
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
    const params = {
      Version: "2019-03-19",
      Region: "ap-guangzhou"
    };
    //	cos地域
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
  }
};
</script>

<style scoped lang='scss'>
.newAudit-wrap {
  .newAudit-main {
    padding: 20px;
    padding-bottom: 0;
    box-sizing: border-box;
    .newAudit-box {
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      max-width: 1360px;
      margin: 0 auto;
      padding: 0 20px;

      .main-box {
        border-bottom: 1px #f2f2f2 solid;
        .BucketSelect >>> .el-input {
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
      .main-box >>> .el-form-item__label {
        font-size: 12px;
        text-align: left;
      }
      .main-box >>> .el-input {
        width: 200px;
      }
      .main-box >>> .el-input__inner {
        border-radius: 0;
        height: 30px;
        padding-left: 5px;
        line-height: 30px;
        padding-top: 0;
      }
      .main-box >>> .el-radio__label {
        font-size: 12px;
      }
      .store >>> .el-form-item__label:nth-child(1) {
        line-height: 16px;
        margin-top: 5px;
      }
      .main-box >>> .el-form-item {
        margin-bottom: 12px;
      }
      .select >>> .el-select {
        width: 70px;
        float: left;
      }
      .select >>> .el-input--suffix {
        width: 70px;
      }
      .select >>> .el-form-item__error {
        width: 400px;
      }
      .seletInp {
        margin-left: 10px;
        float: left;
      }
      .main-box >>> input {
        font-size: 12px;
      }
      .main-box >>> button {
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