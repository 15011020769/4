<template>
  <div class="detail-audit">
    <Header :title="title" :backShow="true" @_back="_back" />
    <!-- 弹出框 -->
    <el-dialog :visible.sync="dialogVisible" width="40%" :before-close="handleClose">
      <p class="dialog">确认删除当前所选跟踪集？</p>
      <p>删除后，该跟踪集下的所有配置将会被清空，且无法恢复。</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delFn">确 定</el-button>
      </span>
    </el-dialog>
    <el-form
      :model="detailData"
      status-icon
      :rules="rules"
      ref="detailData"
      label-width="100px"
      class="demo-ruleForm"
      v-loading="loading"
    >
      <div class="detil-audit-main">
        <div class="detil-audit-box">
          <h2>基础信息</h2>
          <el-form-item label="跟踪集名称" prop="AuditName" required>
            <p>{{detailData.AuditName}}</p>
          </el-form-item>
          <el-form-item label="跟踪所有区域">
            <p style="font-size:12px;">是</p>
          </el-form-item>
        </div>
      </div>
      <div class="detil-audit-main">
        <div class="detil-audit-box">
          <span class="edit" @click="_edit" v-show="!inpShow">编辑</span>
          <h2>管理事件</h2>
          <el-form-item label="管理事件" required>
            <el-radio-group v-model="detailData.ReadWriteAttribute" v-show="inpShow">
              <el-radio :label="3">全部</el-radio>
              <el-radio :label="1">只读</el-radio>
              <el-radio :label="2">只写</el-radio>
            </el-radio-group>
            <p v-show="!inpShow">{{ReadWrite[detailData.ReadWriteAttribute]}}</p>
          </el-form-item>
          <div class="btn-box" v-show="inpShow">
            <div class="line"></div>
            <el-form-item class="button">
              <el-button type="primary" icon="el-icon-loading" v-show="btnLoad1"></el-button>
              <el-button type="primary" @click="submitForm" v-show="!btnLoad1">保存</el-button>
              <el-button @click="_cancel">取消</el-button>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="detil-audit-main">
        <div class="detil-audit-box">
          <span class="edit" @click="_edit1" v-show="!inpShow1">编辑</span>
          <h2>存储位置</h2>
          <div class="info-box" v-show="!inpShow1">
            <el-form-item label="cos存储桶" class="cos">
              <p>
                <span class="spn">地域：</span>
                {{detailData.CosRegion}}
              </p>
              <p>
                <span class="spn">名称：</span>
                {{detailData.CosBucketName}}
              </p>
            </el-form-item>
            <el-form-item label="日志文件前缀">
              <p>{{detailData.LogFilePrefix}}</p>
            </el-form-item>
            <el-form-item label="发送CMQ通知">
              <p>{{CmqNotify[detailData.IsEnableCmqNotify]}}</p>
            </el-form-item>
            <el-form-item label="CMQ队列名称" class="cos" v-show="detailData.IsEnableCmqNotify">
              <p>
                <span class="spn">地域：</span>
                {{detailData.CmqRegion}}
              </p>
              <p>
                <span class="spn">名称：</span>
                {{detailData.CmqQueueName}}
              </p>
            </el-form-item>
          </div>
          <div class="inp-box" v-show="inpShow1">
            <el-form-item label="创建新的cos存储桶" class="store">
              <el-radio-group v-model="detailData.IsCreateNewBucket" @change="_radio">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="cos存储桶" required class="select">
              <el-select v-model="select.name" placeholder="请选择" @change="_select">
                <el-option
                  v-for="item in select.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-form-item label prop="CosBucketName" class="seletInp" v-show="!cosShow">
                <el-input v-model="detailData.CosBucketName" placeholder="请输入Bucket名称"></el-input>
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
              添加
              <span @click="_set">高级设置</span>
              <i class="el-icon-caret-right" v-show="!setShow"></i>
              <i class="el-icon-caret-bottom" v-show="setShow"></i>
            </p>
            <div class="set-box" v-show="setShow">
              <el-form-item label="日志文件前缀" prop="LogFilePrefix">
                <el-input v-model="detailData.LogFilePrefix" placeholder="请输入日志文件前缀"></el-input>
              </el-form-item>
              <el-form-item label="发送CMQ通知" class="CMQ" required>
                <el-radio-group v-model="detailData.IsEnableCmqNotify" @change="_cmqRadio">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <div class="set-child" v-show="setChild">
                <el-form-item label="创建CMQ队列" class="CMQ" required>
                  <el-radio-group v-model="cmqShow" @change="_cmqCretae">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="CMQ队列名称" required class="select cmqSelect">
                  <el-select v-model="cmqSelect.name" placeholder="请选择" @change="_cmqSelect">
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
                    v-if="detailData.IsEnableCmqNotify"
                  >
                    <el-input v-model="detailData.CmqQueueName" placeholder="请输入CMQ队列名称"></el-input>
                  </el-form-item>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="btn-box" v-show="inpShow1">
            <div class="line lineVal"></div>
            <el-form-item class="button">
              <el-button type="primary" icon="el-icon-loading" v-show="btnLoad"></el-button>
              <el-button type="primary" @click="submitForm1('detailData')" v-show="!btnLoad">保存</el-button>
              <el-button @click="_cancel1">取消</el-button>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <el-button type="primary" @click="del">删除跟踪集</el-button>
  </div>
</template>

<script>
import Header from "../Public/Head";
import { GZJ_DETAILIST, LIST_COSBUCKETS } from "../../../constants";
export default {
  name: "detail-audit",
  data() {
    var AuditName = (rule, value, callback) => {
      var reg = /^[a-zA-Z0-9_]{3,128}$/;
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(
            new Error("仅支持大小写字母、数字、以及_的组合，3-128个字符。")
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
          callback(new Error("仅支持字母和数字的组合，3-40个字符。"));
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
              '仅支持小写字母、数字以及中划线" - "的组合，不能超过40字符。'
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
              "不超过64个字符的字符串，必须以字母为首字符，剩余部分可以包含字母、数字和横划线(-)。"
            )
          );
        } else {
          callback();
        }
      }, 1000);
    };
    return {
      loading: true,
      title: "",
      detailData: {},
      rules: {
        LogFilePrefix: [{ validator: LogFilePrefix, trigger: "blur" }],
        AuditName: [{ validator: AuditName, trigger: "blur" }],
        CosBucketName: [{ validator: CosBucketName, trigger: "blur" }],
        CmqQueueName: [{ validator: CmqQueueName, trigger: "blur" }]
      },
      inpShow: false,
      inpShow1: false,
      dialogVisible: false,
      btnLoad: false,
      btnLoad1: false,
      ReadWrite: {
        3: "全部",
        2: "只写",
        1: "只读"
      },
      CmqNotify: {
        0: "否",
        1: "是"
      },
      BucketSelect: {
        name: ""
      },
      select: {
        index: 0
      },
      cosShow: false,
      setShow: true,
      setChild: false,
      cmqShow: false,
      cmqSelect: {},
      IsCreateNewQueue: 0,
      CmqQueueName1: "123",
      cmqSelect: {
        index: 0
      }
    };
  },
  methods: {
    _back() {
      this.$router.push("/Audit");
    },
    delFn() {
      let params = {
        AuditName: this.title,
        Version: "2019-03-19",
        Region: "ap-guangzhou"
      };
      this.axios.post("cloudaudit2/DeleteAudit", params).then(data => {
        if (data.Response.IsSuccess == 1) {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.$router.push("/Audit");
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    del() {
      this.dialogVisible = true;
    },
    _cmqCretae() {
      if (this.cmqShow) {
        this.IsCreateNewQueue == 1;
      } else {
        this.IsCreateNewQueue == 0;
      }
    },
    handleClose(done) {
      this.dialogVisible = false;
    },
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
          this.axios.post("cloudaudit2/UpdateAudit", params).then(res => {
            if (res.Response.IsSuccess == 1) {
              this.$message({
                message: "更新成功",
                type: "success"
              });
              this.inpShow1 = false;
              this.detailList();
            } else {
              if(res.Response.Error.Code){
                this.$message.error(res.Response.Error.Code);
              }
              else{
                this.$message.error("更新失败");
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
    _cmqSelect() {
      this.cmqSelect.index = this.cmqSelect.options[this.cmqSelect.name].value;
    },
    _select() {
      this.select.index = this.select.options[this.select.name].value;
    },
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
      this.axios.post("cloudaudit2/ListCmqEnableRegion", params).then(res => {
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
      //BucketSelect
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
      this.axios.post("cloudaudit2/ListCosEnableRegion", params).then(res => {
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
        this.detailData = res.Response;
        this.detailData.IsCreateNewBucket = 0;
        this.setChild = this.detailData.IsEnableCmqNotify;
        this.loading = false;
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
      this.inpShow = false;
    },
    _cancel1() {
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
    submitForm() {
      this.btnLoad1 = true;
      const params = {
        Version: "2019-03-19",
        Region: "ap-guangzhou",
        AuditName: this.title,
        ReadWriteAttribute: this.detailData.ReadWriteAttribute
      };
      this.axios.post("cloudaudit2/UpdateAudit", params).then(res => {
        if (res.Response.IsSuccess == 1) {
          this.$message({
            message: "更新成功",
            type: "success"
          });
          this.inpShow = false;
        } else {
          this.$message.error("更新失败");
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
.detail-audit >>> button {
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
  .dialog {
    font-size: 18px;
    font-weight: bold;
    color: black;
    margin-bottom: 10px;
  }
  .detil-audit-box >>> .el-form-item__label {
    font-size: 12px;
    text-align: left;
  }
  .detil-audit-box >>> .el-input {
    width: 200px;
  }
  .detil-audit-box >>> .el-input__inner {
    border-radius: 0;
    height: 30px;
    padding-left: 5px;
  }
  .detil-audit-box >>> .el-radio__label {
    font-size: 12px;
  }
  .detil-audit-box >>> .el-form-item {
    margin-bottom: 12px;
  }
  .detil-audit-box >>> input {
    font-size: 12px;
  }
  .detil-audit-box >>> button {
    font-size: 12px;
    height: 30px;
    border-radius: 0;
    line-height: 30px;
    padding: 0 15px;
    box-sizing: border-box;
    margin: 10px 10px 20px 0;
  }
  .store >>> .el-form-item__label:nth-child(1) {
    line-height: 16px;
    margin-top: 5px;
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
  .cmqSelect >>> .el-form-item__error {
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
  .button >>> .el-form-item__content {
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

      .BucketSelect >>> .el-input {
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