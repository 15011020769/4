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
          <el-form-item :label="$t('TKE.overview.mc')" prop="name">
            <el-input class="w200" v-model="se.name" :placeholder="$t('TKE.myMirror.qsrmc')"></el-input>
            <p :class="{ activeColor: fontColor }">{{$t('TKE.overview.xz')}}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.subList.slx')">
            <el-radio-group v-model="se.tabPosition" style="margin-bottom: 30px;">
              <el-radio-button label="jt">Opaque</el-radio-button>
              <el-radio-button label="dt">Dockercfg</el-radio-button>
            </el-radio-group>
            <!-- <div>适用于保存秘钥证书和配置文件，Value将以base64格式编码</div> -->
          </el-form-item>
          <el-form-item :label="$t('TKE.subList.sxfw')">
            <div>
              <el-radio-group v-model="se.radio" style="margin-bottom: 30px;">
                <el-radio label="1">{{$t('TKE.subList.clsymmkj')}}</el-radio>
                <br />
                <br />
                <el-radio label="2">{{$t('TKE.subList.zdmmkj')}}</el-radio>
              </el-radio-group>
              <div class="bg">
                <p>
                  <b>{{$t('TKE.subList.dqjqy')}}</b>
                </p>
                <div v-if="se.radio=='2'">
                  <el-transfer
                    filterable
                    :filter-method="filterMethod"
                    :filter-placeholder="$t('TKE.subList.qsru')"
                    v-model="se.value"
                    :data="data"
                    @change="getSpaceNameData()"
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
                  <div class="pl5">{{$t('TKE.overview.blm')}}</div>
                  <div class="pl5">{{$t('TKE.overview.blz')}}</div>
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
                        <el-input v-model="domain.value" size="mini" :placeholder="$t('TKE.overview.blm')"></el-input>
                        <span>=</span>
                        <textarea class="text" v-model="domain.valueKey"></textarea>
                        <el-tooltip
                          v-if="dynamicValidateForm.domains.length=='1'"
                          class="item"
                          effect="dark"
                          :content="$t('TKE.subList.zsszyx')"
                          placement="right"
                        >
                          <i class="el-icon-close"></i>
                        </el-tooltip>
                        <el-tooltip
                          v-else
                          class="item"
                          effect="dark"
                          :content="$t('TKE.overview.sc')"
                          placement="right"
                        >
                          <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                        </el-tooltip>
                      </div>
                    </el-form-item>
                  </el-form>
                  <div>
                    <el-link type="primary" style="cursor: pointer;" @click="addDomain">{{$t('TKE.overview.xzbl')}}</el-link>
                  </div>
                </div>
                <p
                  v-show="errorShow"
                  style="color:red"
                >{{$t('TKE.subList.xzblmgs')}}</p>
              </div>
            </el-form-item>
          </div>
          <div v-if="se.tabPosition=='dt'">
            <el-form-item :label="$t('TKE.subList.ckym')">
              <el-input class="w200" v-model="se.ips" :placeholder="$t('TKE.subList.qsrymip')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('TKE.overview.yhm')">
              <el-input class="w200" v-model="se.names" :placeholder="$t('TKE.subList.srdsfyhm')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('TKE.overview.mm')">
              <el-input class="w200" v-model="se.pwds" :placeholder="$t('TKE.subList.srdsfmm')"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="creatSecret()">{{$t('TKE.subList.cj')}}Secret</el-button>
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
      loadShow: false,
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
          message: "名稱不能為空",
          type: "warning",
          showClose: true,
          duration: 0
        });
        return false;
      }

//       var arr = this.dynamicValidateForm.domains;
//       var obj = {};
//       arr.forEach(v => {
//         obj[v.value] = btoa(v.valueKey);
//       });

//       var params = {
//         ClusterName: this.clusterId,
//         Method: "POST",
//         Path:
//           "/apis/platform.tke/v1/clusters/" +
//           this.clusterId +
//           "/apply?notUpdate=true",
//         Version: "2018-05-25"
//       };
//       if (this.se.tabPosition == "jt") {
//         if (arr[0].value == "") {
//           this.$message({
//             message: "变量名不能為空，至少设置一项",
//             type: "error"
//           });
//           return false;
//         }
//         params.RequestBody = {
//           kind: "Secret",
//           apiVersion: "v1",
//           metadata: {
//             name: this.se.name,
//             namespace: this.se.radio,
//             labels: { "qcloud-app": this.se.name }
//           },
//           type: "Opaque",
//           data: JSON.stringify(obj)
//         };
//       } else {
//         params.RequestBody = {
//           kind: "Secret",
//           apiVersion: "v1",
//           metadata: {
//             name: this.se.name,
//             namespace: this.se.radio, //
//             labels: { "qcloud-app": this.se.name }
//           },
//           type: "kubernetes.io/dockercfg",
//           data: {
//             ".dockercfg": btoa(
//               "{" +
//                 this.se.ips +
//                 ":{username:" +
//                 this.se.names +
//                 ',"password":' +
//                 this.se.pwds +
//                 ',"auth":' +
//                 btoa(this.se.names + ":" + this.se.pwds) +
//                 "}}"
//             )
//           } //用户密码转码成一堆 转义：btoa();
//         };

//         // "data":{".dockercfg":"eyJodHRwOi8vMTIzLjEuMS4xOjkwOTAiOnsidXNlcm5hbWUiOiJ1c2VyIiwicGFzc3dvcmQiOiJhc2Rhc2QiLCJhdXRoIjoiZFhObGNqcGhjMlJoYzJRPSJ9fQ=="}}"

//         // {"http://123.1.1.1:9090":{"username":"user","password":"asdasd","auth":"dXNlcjphc2Rhc2Q="}}  baot("dXNlcjphc2Rhc2Q=") //解码   user:asdasd

//         // btoa(v.valueKey);
//         //         ips: "",
//         //         pwds: "",
//         //         names: "1"
//         var data = btoa(
//           "{" +
//             this.se.ips +
//             ":{username:" +
//             this.se.names +
//             ',"password":' +
//             this.se.pwds +
//             ',"auth":' +
//             btoa(this.se.names + ":" + this.se.pwds) +
//             "}}"
//         );
//          params.RequestBody.data[".dockercfg"] = data;
//       }

// //指定命名空间
//       if (this.se.radio == "1") {
//         params.RequestBody =
//           '{"kind":"Secret","apiVersion":"v1","metadata":{"name":"' +
//           this.se.name +
//           '","namespace":"default","labels":{"qcloud-app":"' +
//           this.se.name +
//           '"}},"type":"Opaque","data":' +
//           JSON.stringify(obj) +
//           '}{"kind":"Secret","apiVersion":"v1","metadata":{"name":"' +
//           this.se.name +
//           '","namespace":"kube-node-lease","labels":{"qcloud-app":"' +
//           this.se.name +
//           '"}},"type":"Opaque","data":' +
//           JSON.stringify(obj) +
//           "}";
//       } else {
//         if (this.se.value.length > 1) {
//           params.RequestBody =
//             '{"kind":"Secret","apiVersion":"v1","metadata":{"name":"' +
//             this.se.name +
//             '","namespace":"default","labels":{"qcloud-app":"' +
//             this.se.name +
//             '"}},"type":"Opaque","data":' +
//             JSON.stringify(obj) +
//             '}{"kind":"Secret","apiVersion":"v1","metadata":{"name":"' +
//             this.se.name +
//             '","namespace":"kube-node-lease","labels":{"qcloud-app":"' +
//             this.se.name +
//             '"}},"type":"Opaque","data":' +
//             JSON.stringify(obj) +
//             "}";
//         } else if (this.se.value.length == 1) {
//           params.RequestBody =
//             '{"kind":"Secret","apiVersion":"v1","metadata":{"name":"' +
//             this.se.name +
//             '","namespace":"' +
//             this.se.value[0] +
//             '","labels":{"qcloud-app":"' +
//             this.se.name +
//             '"}},"type":"Opaque","data":' +
//             JSON.stringify(obj) +
//             "}}";
//         } else {
//           this.$message({
//             message: "至少值定一项命名空间",
//             type: "error",
//             showClose: true,
//             duration: 0
//           });
//         }
//       }
      //dockercfg 时域名 用户名等
      // var data = btoa(
      //   "{" +
      //     this.se.ips +
      //     ":{username:" +
      //     this.se.names +
      //     ",password:" +
      //     this.se.pwds +
      //     ",auth:" +
      //     btoa(this.se.names + ":" + this.se.pwds) +
      //   "}}"
      // );

      //选择opqua label
      var arr = this.dynamicValidateForm.domains;
      var obj = {};
      arr.forEach(v => {
        obj[v.value] = btoa(v.valueKey);
      });
      let ips = this.se.ips;//http://192/168.1.1:9090
      let name = this.se.name;//name
      let pwd = this.se.pwds;//pwd
      let secretData = {};
      secretData[ips] = {username: name, password: pwd, auth: btoa(JSON.stringify({name: pwd}))}
      let user = {".dockercfg" : btoa(JSON.stringify(secretData))}
      let spaceList = this.data;
      let selectList = this.se.value;
      if(this.se.radio == "2" && selectList.length === 0) {
        this.$message({
          message: '請先至少選擇一條命名空間',
          type: "warning",
          showClose: true,
          duration: 0
        });
        return
      }
      if(this.se.radio == "1" && arr.length === 0) {
        this.$message({
          message: '請先填寫選擇一條內容',
          type: "warning",
          showClose: true,
          duration: 0
        });
        return
      }
      let request = '';
      if(this.se.radio == "1") {
        spaceList.forEach(space => {
          if(space.label === 'kube-system' || space.label === 'kube-public') {

          } else {
            if(this.se.tabPosition === 'jt') {
              request += JSON.stringify({
                kind: 'Secret',
                apiVersion: 'v1',
                metadata:{
                  name: this.se.name,
                  namespace: space.label,
                  labels: {'qcloud-app': this.se.name}
                },
                type: 'Opaque',
                data: obj
              })
            } else if(this.se.tabPosition === 'dt') {
              request += JSON.stringify({
                kind: "Secret",
                apiVersion: "v1",
                metadata:{
                  name: this.se.name,
                  namespace: space.label,
                  labels: {"qcloud-app": this.se.name}
                },
                type: 'kubernetes.io/dockercfg',
                data: user
              })
            }
          }
        });
      } else {
        selectList.forEach(select => {
          let ss = spaceList[select].label;
          if(this.se.tabPosition === 'jt') {
              request += JSON.stringify({
                kind: 'Secret',
                apiVersion: 'v1',
                metadata:{
                  name: this.se.name,
                  namespace: spaceList[select].label,
                  labels: {'qcloud-app': this.se.name}
                },
                type: 'Opaque',
                data: obj
              })
            } else if(this.se.tabPosition === 'dt') {
              request += JSON.stringify({
                kind: "Secret",
                apiVersion: "v1",
                metadata:{
                  name: this.se.name,
                  namespace: spaceList[select].label,
                  labels: {"qcloud-app": this.se.name}
                },
                type: 'kubernetes.io/dockercfg',
                data: user
              })
            }
        });
      }

      var params = {
        ClusterName: this.clusterId,
        Method: "POST",
        Path:
          "/apis/platform.tke/v1/clusters/" +
          this.clusterId +
          "/apply?notUpdate=true",
        Version: "2018-05-25",
        RequestBody: request
      };
      this.loadShow = true;
      if (!this.errorShow) {
        this.axios.post(TKE_COLONY_QUERY, params).then(res => {
          console.log(res.Response);
          if (res.Response.Error == undefined) {
            this.goBack();
            this.$message({
              message: '新增成功',
              type: "success",
              showClose: true,
              duration: 0
            });
            this.loadShow = false;
          } else {
            this.loadShow = false;
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
      }
    },

    getSpaceNameData() {
      let ss = this.se.value
      let aa = this.data
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

