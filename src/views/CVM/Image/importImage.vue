<template>
  <div class="import-image">
    <div class="title">
      <i class="el-icon-back" @click="back()"></i>
      <h2>导入镜像</h2>
    </div>
    <div class="content">
      <div class="step">
        <el-steps :active="active" simple>
          <el-step title="导入镜像前准备" icon="el-icon-circle-check"></el-step>
          <el-step title="导入镜像" icon="el-icon-circle-check"></el-step>
        </el-steps>
      </div>
      <!-- 导入镜像前准备 -->
      <div v-if="intend">
        <div class="system-select-wrap">
          <div class="system-select">
            <span>您准备导入的镜像操作系统</span>
            <el-select v-model="value" @change="Select()">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="importImage-inf">
            <ul>
              <li>
                <div class="order-title">
                  <i>1</i>
                  <span>准备镜像文件</span>
                </div>
                <div class="order-content">
                  <p>您制作的镜像必须符合镜像导入限制：</p>
                  <ul>
                    <li>
                      <div class="left">操作系统</div>
                      <div class="right">
                        <p v-for="item in systemData" :key="item">{{ item }}</p>
                      </div>
                    </li>
                    <li>
                      <div class="left">镜像格式</div>
                      <div class="right">
                        <p v-for="item in MirrorFormat" :key="item">{{ item }}</p>
                      </div>
                    </li>
                    <li>
                      <div class="left">文件系统</div>
                      <div class="right">
                        <p v-if="value==='Linux'">MBR分区的ext3或ext4文件系统，不支持GPT分区</p>
                        <p v-if="value==='Windows'">MBR分区的ntfs 文件系统，不支持GPT分区</p>
                      </div>
                    </li>
                    <li>
                      <div class="left">限制</div>
                      <div class="right">
                        <p>镜像大小不超过50G</p>
                        <p v-if="value==='Linux'">最好是原生内核，如果有修改可能会导致虚拟机无法导入</p>
                        <p>
                          支持镜像强制导入，需要预先对镜像进行配置，详细请见
                          <a href="javascript:;">
                            强制导入镜像
                            <i class="iconfont">&#xe614;</i>
                          </a>
                        </p>
                        <p>
                          若镜像大于50G，可通过过离线迁移的方式导入。详细请见
                          <a href="javascript:;">
                            离线迁移
                            <i class="iconfont">&#xe614;</i>
                          </a>
                        </p>
                        <p>
                          更多限制，详细请见
                          <a href="javascript:;">
                            导入镜像
                            <i class="iconfont">&#xe614;</i>
                          </a>
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div class="order-title">
                  <i>2</i>
                  <span>
                    开通
                    <a href="javascript:;">
                      对象存储服务
                      <i class="iconfont">&#xe614;</i>
                    </a>
                  </span>
                </div>
                <div class="dashed"></div>
              </li>
              <li>
                <div class="order-title">
                  <i>3</i>
                  <span>
                    创建
                    <a href="javascript:;">
                      bucket
                      <i class="iconfont">&#xe614;</i>
                    </a>
                  </span>
                </div>
                <div class="dashed"></div>
              </li>
              <li>
                <div class="order-title">
                  <i>4</i>
                  <span>
                    上传镜像文件到bucket，并获取
                    <a href="javascript:;">
                      镜像文件URL
                      <i class="iconfont">&#xe614;</i>
                    </a>
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div class="checkbox-box">
            <el-checkbox v-model="checked">我已做好以上准备</el-checkbox>
          </div>
        </div>
        <div class="next">
          <el-button disabled v-if="checked === false">下一步</el-button>
          <el-button @click="next()" v-if="checked === true" type="primary">下一步</el-button>
        </div>
      </div>
      <!-- 导入镜像 -->
      <div v-if="!intend">
        <div class="import-mirror">
          <el-form :model="formLabelAlign">
            <el-form-item>
              <span>
                镜像文件URL
                <i>*</i>
              </span>
              <input
                placeholder="镜像所在COS的对象地址URL"
                :style="{'border-color':borderColor}"
                v-model="formLabelAlign.inputUrl"
                @blur="Detection()"
                @focus="inputUrlFocus()"
              />
              <p v-show="tipsShow">
                <i class="el-icon-warning"></i>
                {{tips}}
              </p>
            </el-form-item>
            <el-form-item>
              <span>
                镜像名称
                <i>*</i>
              </span>
              <input
                placeholder="导入镜像后显示的名称"
                :style="{'border-color':borderColor1}"
                v-model="formLabelAlign.inputName"
              />
            </el-form-item>
            <el-form-item>
              <span>
                地域
                <i>*</i>
              </span>
              <el-select v-model="formLabelAlign.regionVal" placeholder="请选择地域">
                <el-option
                  v-for="item in formLabelAlign.region"
                  :key="item.Region"
                  :label="item.zone"
                  :value="item.Region"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <span>
                操作系统
                <i>*</i>
              </span>
              <span class="spans">{{value}}</span>
            </el-form-item>
            <el-form-item>
              <span>
                系统架构
                <i>*</i>
              </span>
              <el-select v-model="formLabelAlign.frameworkVal" placeholder="请选择系统架构">
                <el-option
                  v-for="item in formLabelAlign.framework"
                  :key="item.frameworkVal"
                  :label="item.frameworkLabel"
                  :value="item.frameworkVal"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <span>
                系统平台
                <i>*</i>
              </span>
              <el-select
                v-model="formLabelAlign.platformVal"
                placeholder="请选择系统平台"
                @change="PlatformVersion()"
              >
                <el-option
                  v-for="item in formLabelAlign.platform"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <span>
                系统版本
                <i>*</i>
              </span>
              <el-select v-model="formLabelAlign.versionVal" placeholder="请选择系统版本">
                <el-option
                  v-for="item in formLabelAlign.version"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <span>镜像描述(选填)</span>
              <el-input
                type="textarea"
                v-model="formLabelAlign.describe"
                autosize
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <span>导入方式</span>
              <el-select v-model="formLabelAlign.importModeVal" placeholder="请选择">
                <el-option
                  v-for="item in formLabelAlign.importMode"
                  :key="item.importModeVal"
                  :label="item.importModeLabel"
                  :value="item.importModeVal"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="next">
          <el-button @click="Prev()">上一步</el-button>
          <el-button @click="StartImport()" type="primary" style="width:90px;">开始导入</el-button>
        </div>
      </div>
    </div>
    <leave-import :leaveShow="leaveImport" v-if="leaveImport" v-on:close="leaveClose()"></leave-import>
  </div>
</template>
<script>
import LeaveImport from "./modal/leaveImport";
export default {
  data() {
    return {
      active: 0, // 步骤
      intend: true, // 第一步
      options: [
        {
          value: "Linux",
          label: "Linux"
        },
        {
          value: "Windows",
          label: "Windows"
        }
      ],
      value: "Linux",
      systemData: [],
      MirrorFormat: ["RAW格式", "QCOW2格式", "VHD格式", "VMDK格式"],
      checked: false,
      colors: "",
      inputUrl: "", // 镜像所在COS的对象地址URL
      formLabelAlign: {
        inputUrl: "",
        inputName: "",
        region: [],
        regionVal: "", // 地域
        framework: [
          { frameworkLabel: "64位", frameworkVal: "x86_64" },
          { frameworkLabel: "32位", frameworkVal: "i386" }
        ],
        frameworkVal: "", // 系统架构
        platform: [],
        platformVal: "", // 系统平台
        version: [],
        versionVal: "", // 系统版本
        describe: "", // 镜像描述
        importMode: [
          { importModeLabel: "正常", importModeVal: "0" },
          { importModeLabel: "强制", importModeVal: "1" }
        ],
        importModeVal: "正常" // 导入方式
      },
      AllVersionSel: [],
      AllVersion: [], // 所有系统版本
      borderColor: "",
      borderColor1: "", // 输入框颜色
      tipsShow: false, // 输入框提示显示
      tips: "", // 输入框提示信息
      leaveImport: false
    };
  },
  components: { LeaveImport },
  created() {
    this.System();
    this.RegionSelect();
  },
  computed: {},
  methods: {
    // 返回
    back() {
      this.leaveImport = true;
    },
    leaveClose() {
      this.leaveImport = false;
    },
    Select() {
      this.System();
      this.checked = false;
      this.formLabelAlign.inputUrl = "";
      this.formLabelAlign.inputName = "";
      this.formLabelAlign.regionVal = "";
      this.formLabelAlign.frameworkVal = "";
      this.formLabelAlign.platformVal = "";
      this.formLabelAlign.versionVal = "";
      this.formLabelAlign.describe = "";
    },
    // 操作数据
    System() {
      let param = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2")
      };
      this.axios
        .post("cvm2/DescribeImportImageOs", param)
        .then(data => {
          if (this.value === "Linux") {
            this.systemData = data.Response.ImportImageOsListSupported.Linux;
            this.formLabelAlign.platform =
              data.Response.ImportImageOsListSupported.Linux;
          } else if (this.value === "Windows") {
            this.systemData = data.Response.ImportImageOsListSupported.Windows;
            this.formLabelAlign.platform =
              data.Response.ImportImageOsListSupported.Windows;
          }
          this.AllVersion = data.Response.ImportImageOsVersionSupported;
        })
        .catch(error => {
          this.$message({
            message: "数据加载错误",
            type: "error"
          });
        });
    },
    next() {
      this.active = 1;
      this.intend = false;
    },
    // 镜像所在COS的对象地址URL
    inputUrlFocus() {
      if (this.tips === "镜像文件URL错误") {
        this.tipsShow = false;
        this.borderColor = "#ddd";
      }
    },
    // 地域
    RegionSelect() {
      this.axios
        .post("pub/zoneAll?product=MIRROR")
        .then(data => {
          this.formLabelAlign.region = data.data;
        })
        .catch(error => {
          this.$message({
            message: "数据加载错误",
            type: "error"
          });
        });
    },
    // 由系统平台选择系统版本
    PlatformVersion() {
      this.formLabelAlign.version = [];
      let platformSelect = this.formLabelAlign.platformVal;
      for (var i in this.AllVersion) {
        if (i === platformSelect) {
          this.formLabelAlign.version = this.AllVersion[i];
        }
      }
    },
    // 上一步
    Prev() {
      this.intend = true;
    },
    // 开始导入
    StartImport() {
      if (this.formLabelAlign.inputUrl === "") {
        this.borderColor = "#F56C6C";
        this.tipsShow = true;
        this.tips = "输入的镜像文件URL不合法";
        return;
      } else if (this.formLabelAlign.inputName === "") {
        this.borderColor1 = "#F56C6C";
        return;
      } else if (
        this.formLabelAlign.inputName === "" ||
        this.formLabelAlign.frameworkVal === "" ||
        this.formLabelAlign.platformVal === "" ||
        this.formLabelAlign.versionVal === ""
      ) {
        return;
      }
      let param = {
        Version: "2017-03-12",
        Region: this.formLabelAlign.regionVal,
        ImageUrl: this.formLabelAlign.inputUrl, // 导入镜像存放的cos地址
        ImageName: this.formLabelAlign.inputName, // 镜像名称
        Architecture: this.formLabelAlign.frameworkVal, // 系统架构
        OsType: this.formLabelAlign.platformVal, // 系统平台
        OsVersion: this.formLabelAlign.versionVal // 系统版本
      };
      // 镜像描述
      if (this.formLabelAlign.describe !== "") {
        param["ImageDescription"] = this.formLabelAlign.describe;
      }
      console.log(param);
      this.axios
        .post("cvm2/ImportImage", param)
        .then(data => {
          console.log(data);
          if (data.Response.Error === undefined) {
            this.$message({
              message: "共享成功",
              type: "success"
            });
          }
        })
        .catch(error => {
          this.$message({
            message: "数据加载错误",
            type: "error"
          });
        });
    },
    // 检测镜像文件url
    Detection() {
      let param = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        ImageUrl: this.formLabelAlign.inputUrl, // 导入镜像存放的cos地址
        ImageName: "testImageUrl", // 镜像名称
        Architecture: "x86_64", // 系统架构
        OsType: "CentOS",
        OsVersion: "6",
        DryRun: true
      };
      this.axios.post("cvm2/ImportImage", param).then(data => {
        if (data.Response.Error !== undefined) {
          this.borderColor = "#F56C6C";
          this.tipsShow = true;
          this.tips = "镜像文件URL错误";
          return;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.import-image {
  .title {
    width: 100%;
    padding: 10px 20px;
    background: #fff;
    height: 50px;
    line-height: 30px;
    display: flex;
    border-bottom: 1px solid #ccc;
    & > i {
      display: inline-block;
      width: 26px;
      height: 26px;
      text-align: center;
      line-height: 26px;
      color: #006eff;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 2px;
      margin-right: 24px;
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
    & > h2 {
      color: #171d25;
      font-size: 16px;
      font-weight: 700;
    }
  }
  .content {
    margin: 20px;
    background: #fff;
    padding: 20px;
    .step {
      margin-top: 15px;
      margin-bottom: 40px;
      ::v-deep .el-steps--simple {
        background: #fff;
        border-radius: 0;
        padding: 0 0 20px;
        color: #888;
        border-bottom: 1px solid #ddd;
      }
      ::v-deep .el-step.is-simple {
        flex-basis: 0 !important;
      }
      ::v-deep .el-step.is-simple .el-step__title {
        display: inline-block;
        font-size: 14px;
        font-weight: 400;
        width: 200px;
      }
    }
    .system-select-wrap {
      padding: 0 30px 16px 30px;
      margin-bottom: 20px;
      border-bottom: 1px solid #ddd;
      .system-select {
        height: 30px;
        margin-bottom: 50px;
        & > span {
          margin-right: 4px;
          font-size: 12px;
          color: #000;
        }
        ::v-deep .el-input--suffix .el-input__inner {
          padding-right: 30px;
          height: 30px;
          border-radius: 0px;
          color: #000;
          border-color: #ddd;
        }
        ::v-deep .el-select .el-input {
          width: 180px;
        }
      }
      .importImage-inf {
        & > ul {
          & > li {
            .order-title {
              & > i {
                display: inline-block;
                width: 23px;
                height: 23px;
                border-radius: 50%;
                text-align: center;
                line-height: 23px;
                border: 1px solid #888;
                margin-right: 10px;
                font-style: normal;
              }
              & > span {
                font-size: 12px;
                font-weight: 700;
                color: #000;
                & > a {
                  color: #006eff;
                  &:hover {
                    text-decoration: underline;
                  }
                }
              }
              .iconfont {
                font-size: 12px;
                font-weight: 900;
              }
            }
            .order-content {
              margin-left: 10px;
              border-left: 1px dashed #dedfe6;
              padding: 15px 0px 40px 20px;
              & > p {
                color: #888;
                font-size: 12px;
              }
              & > ul {
                width: 520px;
                border: 1px solid #ddd;
                border-bottom: 0;
                margin-top: 15px;
                & > li {
                  border-bottom: 1px solid #ddd;
                  display: flex;
                  .left {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 81px;
                    padding: 16px;
                    background: #f2f2f2;
                    border-right: 1px solid #ddd;
                    font-size: 12px;
                    color: #000;
                    font-weight: 700;
                  }
                  .right {
                    padding: 16px;
                    & > p {
                      height: 24px;
                      color: #000;
                      line-height: 24px;
                      & > a {
                        color: #006eff;
                        &:hover {
                          text-decoration: underline;
                        }
                      }
                    }
                    .iconfont {
                      font-size: 12px;
                      font-weight: 900;
                    }
                  }
                }
              }
            }
            .dashed {
              height: 40px;
              border-left: 1px dashed #dedfe6;
              margin-left: 10px;
            }
          }
        }
      }
      .checkbox-box {
        margin-top: 40px;
        ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
          background: #006eff;
          border-color: #006eff;
        }
        ::v-deep .el-checkbox__label {
          margin-left: 5px;
          color: #404a58;
        }
      }
    }
    .next {
      ::v-deep .el-button {
        width: 78px;
        height: 30px;
        border-radius: 0px;
        padding: 0px;
        font-size: 12px;
      }
      ::v-deep .el-button--primary {
        background: #006eff;
        border-color: #006eff;
      }
    }
    .import-mirror {
      @extend .system-select-wrap;
      ::v-deep .el-form-item {
        margin-bottom: 16px;
      }
      ::v-deep .el-form-item__content {
        display: flex;
        justify-content: flex-start;
        min-height: 30px;
        line-height: 30px;
      }
      .el-form-item__content {
        & > span {
          display: inline-block;
          width: 100px;
          height: 30px;
          line-height: 30px;
          color: #888;
          font-size: 12px;
          & > i {
            color: #e44f71;
            font-style: normal;
          }
        }
        .spans {
          color: #000;
        }
        & > input {
          width: 180px;
          height: 30px;
          border-radius: 0px;
          border: 1px solid #ddd;
          color: #444;
          font-size: 12px;
          padding: 0 10px;
        }
        input:hover {
          border: 1px solid #bbb;
        }
        input::-webkit-input-placeholder {
          color: #c0c4cc;
        }
        input:-moz-placeholder {
          color: #c0c4cc;
        }
        input::-moz-placeholder {
          color: #c0c4cc;
        }
        input:-ms-input-placeholder {
          color: #c0c4cc;
        }
        & > p {
          margin-left: 10px;
          color: #c93d3d;
          font-size: 12px;
          & > i {
            font-size: 14px;
          }
        }
      }
      ::v-deep .el-input {
        width: 180px;
        height: 30px;
        border-radius: 0px;
      }
      ::v-deep .el-input__inner {
        height: 30px;
        border-radius: 0px;
        border: 1px solid #ddd;
        color: #444;
        font-size: 12px;
        padding: 0 10px;
      }
      ::v-deep .el-textarea {
        width: 368px;
      }
      ::v-deep .el-textarea__inner {
        width: 368px;
        min-height: 68px !important;
      }
    }
  }
}
</style>

