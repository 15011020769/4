 <!-- 新建Secret -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建Secret</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form
          ref="form"
          class="tke-form"
          :model="se"
          :rules="rules"
          label-position="left"
          label-width="120px"
          size="mini"
        >
          <el-form-item label="名称" prop="name">
            <el-input class="w200" v-model="se.name" placeholder="请输入名称"></el-input>
            <p :class="{ activeColor: fontColor }">最长63个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾</p>
          </el-form-item>
          <el-form-item label="Secret类型">
            <el-radio-group v-model="se.tabPosition" style="margin-bottom: 30px;">
              <el-radio-button label="jt">Opaque</el-radio-button>
              <el-radio-button label="dt">Dockercfg</el-radio-button>
            </el-radio-group>
            <!-- <div>适用于保存秘钥证书和配置文件，Value将以base64格式编码</div> -->
          </el-form-item>
          <el-form-item label="生效范围">
            <div>
              <div class="bg">
                <el-radio v-model="se.radio" label="1">存量所有命名空间（不包括kube-system、kube-public和后续增量命名空间）</el-radio>
              </div>
              <div class="bg">
                <el-radio v-model="se.radio" label="2">指定命名空间</el-radio>
                <p>
                  <b>当前集群有以下可用命名空间</b>
                </p>
                <div v-if="se.radio=='2'">
                  <el-transfer
                    filterable
                    :filter-method="filterMethod"
                    filter-placeholder="请输入"
                    v-model="se.value"
                    :data="data"
                  ></el-transfer>
                </div>
              </div>
            </div>
          </el-form-item>
          <div v-if="se.tabPosition=='jt'">
            <el-form-item label="内容">
              <div class="border">
                <!-- 头部 -->
                <div class="flex f12 header">
                  <div class="pl5">变量名</div>
                  <div class="pl5">变量值</div>
                </div>
                <!-- 主体 -->
                <div class="flex1" style="padding:10px;border-top:1px solid #ddd;">
                  <!-- <addValue></addValue> -->
                  <el-form style="margin:5px 0;">
                    <el-form-item
                      v-for="(domain, index) in dynamicValidateForm.domains"
                      :key="index"
                      :prop="'domains.' + index + '.value'"
                    >
                      <div class="form-input">
                        <el-input v-model="domain.value" size="mini" placeholder="变量名"></el-input>
                        <span>=</span>
                        <textarea class="text" v-model="domain.valueKey"></textarea>
                        <el-tooltip
                          v-if="dynamicValidateForm.domains.length=='1'"
                          class="item"
                          effect="dark"
                          content="不可删除，至少设置一项"
                          placement="right"
                        >
                          <i class="el-icon-close"></i>
                        </el-tooltip>
                        <el-tooltip
                          v-else
                          class="item"
                          effect="dark"
                          content="删除"
                          placement="right"
                        >
                          <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                        </el-tooltip>
                      </div>
                    </el-form-item>
                  </el-form>
                  <div>
                    <el-link type="primary" style="cursor: pointer;" @click="addDomain">新增变量</el-link>
                  </div>
                </div>
                <p
                  v-show="errorShow"
                  style="color:red"
                >新增变量名格式不正确，只能包含字母、数字及分隔符("-"、"_"、".")，且必须以字母、数字开头和结尾</p>
              </div>
            </el-form-item>
          </div>
          <div v-if="se.tabPosition=='dt'">
            <el-form-item label="仓库域名">
              <el-input class="w200" v-model="se.ips" placeholder="请输入域名或IP"></el-input>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input class="w200" v-model="se.names" placeholder="请输入第三方仓库的用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input class="w200" v-model="se.pwds" placeholder="请输入第三方仓库的登录密码"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="creatSecret()">创建Secret</el-button>
          <el-button size="small" @click="$router.go(-1)">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import addSecret from "./components/addValue";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import { ALL_CITY, POINT_REQUEST, TKE_COLONY_QUERY } from "@/constants";
export default {
  name: "secretCreate",
  data() {
    var validateName = (rule, value, callback) => {
      console.log(value);
      if (value === "") {
        this.fontColor = true;
        callback();
      } else {
        let reg = /^[a-z]([a-z0-9]|-){0,61}([a-z0-9])$/;
        let flag = reg.test(this.se.name);
        if (!flag) {
          this.fontColor = true;
          callback();
        } else {
          this.fontColor = false;
          callback();
        }
      }
    };
    return {
      data: [],
      total: "",
      clusterId: "",
      cities: [],
      pinyin: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      se: {
        tabPosition: "jt",
        value: [],
        name: "",
        names: "",
        ips: "",
        pwds: "",
        radio: "1"
      },
      rules: {
        name: [
          {
            validator: validateName,
            trigger: "blur",
            required: false
          }
        ]
      },
      fontColor: "",
      errorShow: false,
      dynamicValidateForm: {
        domains: [
          {
            value: "",
            valueKey: ""
          }
        ]
      }
    };
  },
  components: {
    addSecret
  },
  watch: {
    dynamicValidateForm: {
      handler(val) {
        let reg = /^[a-z]([a-z0-9]|-|_|.)*([a-z0-9])$/;
        val.domains.forEach(v => {
          if (!reg.test(v.value)) {
            this.errorShow = true;
          } else {
            this.errorShow = false;
          }
        });
      },
      deep: true
    }
  },
  created() {
    // 从路由获取类型
    this.clusterId = this.$route.query.clusterId;
    this.nameSpaceList();
    // this.getData();//获取数据目前没用
  },
  methods: {
    //返回上一层
    goBack() {
      this.$router.go(-1);
    },
    creatSecret() {
      if (this.se.name == "") {
        this.$refs.form.validateField("name");
        this.$message({
            message: "名称不能为空",
            type: "error",
            showClose: true,
            duration: 0
          });
        return false;
      }
      var arr = this.dynamicValidateForm.domains;
      var obj = {};
      arr.forEach(v => {
        obj[v.value] = btoa(v.valueKey);
      });
      if (arr[0].value == "") {
        this.$message({
          message: "变量名不能為空，至少设置一项",
          type: "error"
        });
        return false;
      }
      var params = {
        ClusterName: this.clusterId,
        Method: "POST",
        Path:
          "/apis/platform.tke/v1/clusters/" +
          this.clusterId +
          "/apply?notUpdate=true",
        Version: "2018-05-25"
      };
      if (this.se.tabPosition == "jt") {
        console.log(obj, "obj");
        params.RequestBody = {
          kind: "Secret",
          apiVersion: "v1",
          metadata: {
            name: this.se.name,
            namespace: this.se.radio,
            labels: { "qcloud-app": this.se.name }
          },
          type: "Opaque",
          data: obj
        };
      } else {
        params.RequestBody = {
          kind: "Secret",
          apiVersion: "v1",
          metadata: {
            name: this.se.name,
            namespace: this.se.radio, //
            labels: { "qcloud-app": this.se.name }
          },
          type: "kubernetes.io/dockercfg",
          data: { ".dockercfg": "" } //用户密码转码成一堆 转义：btoa();
        };
      }
      if (this.se.radio == "1") {
        params.RequestBody =
          '{"kind":"Secret","apiVersion":"v1","metadata":{"name":"' +
          this.se.name +
          '","namespace":"default","labels":{"qcloud-app":"' +
          this.se.name +
          '"}},"type":"Opaque","data":' +
          obj +
          '}{"kind":"Secret","apiVersion":"v1","metadata":{"name":"' +
          this.se.name +
          '","namespace":"kube-node-lease","labels":{"qcloud-app":"' +
          this.se.name +
          '"}},"type":"Opaque","data":' +
          {asdasd: "YXNkYXNk"} + "}";
      } else {
        if (this.se.value.length > 1) {
          params.RequestBody =
            '{"kind":"Secret","apiVersion":"v1","metadata":{"name":"' +
            this.se.name +
            '","namespace":"default","labels":{"qcloud-app":"' +
            this.se.name +
            '"}},"type":"Opaque","data":' +
            obj +
            '}{"kind":"Secret","apiVersion":"v1","metadata":{"name":"' +
            this.se.name +
            '","namespace":"kube-node-lease","labels":{"qcloud-app":"' +
            this.se.name +
            '"}},"type":"Opaque","data":' +
            obj +
            "}";
        } else if (this.se.value.length == 1){
          params.RequestBody =
            '{"kind":"Secret","apiVersion":"v1","metadata":{"name":"' +
            this.se.name +
            '","namespace":"' +
            this.se.value[0] +
            '","labels":{"qcloud-app":"' +
            this.se.name +
            '"}},"type":"Opaque","data":' +
            obj +
            "}}";
        }else{
           this.$message({
            message: "至少值定一项命名空间",
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      }
      console.log(params)
      if (!this.errorShow) {
        this.axios.post(TKE_COLONY_QUERY, params).then(res => {
          console.log(res.Response);
          // this.$router.push({ name: "secret" });//预留跳转
          if (res.Response.Error == undefined) {
            this.$router.go(-1);
          }
        });
      }
    },
    //命名空间选项
    nameSpaceList() {
      var params = {
        Method: "GET",
        Path: "/api/v1/namespaces",
        Version: "2018-05-25",
        ClusterName: this.clusterId
      };
      this.axios.post(TKE_COLONY_QUERY, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.total = mes.items.length;
          mes.items.forEach(item => {
            this.cities.push(item.metadata.name);
            this.pinyin.push(item.metadata.name);
          });
          const datas = [];
          this.cities.forEach((city, index) => {
            datas.push({
              label: city,
              key: index,
              pinyin: this.pinyin[index]
            });
          });
          this.data = datas;
        } else {
          let ErrTips = {};
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
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({
        value: "",
        valueKey: ""
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.ipu {
  border: 1px solid #ddd;
}
textarea {
  width: 90%;
  max-width: 260px;
  height: 30px;
  line-height: normal;
  border: 1px solid #ddd;
}
.flex {
  display: flex;
  align-items: center;
}
.flex1 {
  display: flex;
  flex-direction: column;
}
.f12 {
  font-size: 12px;
  color: #888;
  font-weight: bold;
}
.pl5 {
  width: 50%;
  padding-left: 10px;
}
.header {
  height: 40px;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}
.flex {
  display: flex;
}
.bg {
  background-color: #f2f2f2;
  margin-bottom: 10px;
  padding: 10px;
  width: 590px;
}
.border {
  width: 550px;
  max-height: 400px;
  border: 1px solid #ddd;
}
.text {
  width: 90%;
  max-width: 260px;
  height: 30px;
  line-height: normal;
  border: 1px solid #ddd;
}
.form-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  span {
    margin: 0 10px;
  }
  i {
    margin: 0 10px;
    cursor: pointer;
  }
}
.form-p {
  margin-bottom: 10px;
  font-size: 12px;
  color: #888;
}
.box {
  width: 400px;

  .top {
    text-align: center;
  }

  .left {
    float: left;
    width: 60px;
  }

  .right {
    float: right;
    width: 60px;
  }

  .bottom {
    clear: both;
    text-align: center;
  }

  .item {
    margin: 4px;
  }

  .left .el-tooltip__popper,
  .right .el-tooltip__popper {
    padding: 8px 10px;
  }
}
.colony-wrap >>> .el-checkbox,
.el-checkbox__input {
  display: block !important;
}
.activeColor {
  color: #f56c6c !important;
}
</style>

