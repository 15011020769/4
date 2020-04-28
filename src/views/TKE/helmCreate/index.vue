<template>
  <div class="myMirror-wrap">
    <div class="datails-nav">
      <ul>
        <router-link :to="{name: 'helm', query: {clusterId: this.$route.query.clusterId }}">
          <li>
            <i class="el-icon-back"></i>
            <span>{{$t('TKE.overview.xjyy')}}</span>
          </li>
        </router-link>
      </ul>
    </div>
    <div class="room-center">
      <div class="explain" style="margin-bottom:20px;">
        <p v-show="data.flag">{{$t('TKE.overview.cjyyts')}}</p>
      </div>
      <el-card class="box-card">
        <el-form
          class="tke-form m0"
          :model="ruleForm"
          :rules="rules"
          label-position="left"
          label-width="100px"
          size="mini"
          ref="ruleForm"
        >
          <el-form-item :label="$t('TKE.overview.yym')" prop="name">
            <el-input class="w200" v-model="ruleForm.name" :placeholder="$t('TKE.overview.qsrmc')"></el-input>
            <p>{{$t('TKE.overview.xz')}}</p>
          </el-form-item>
          <el-form-item label="所在地域">
            <div>{{$t('TKE.overview.zgtb')}}</div>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.yxjq')">
            <div>{{ruleForm.colony}}</div>
          </el-form-item>
          <hr class="hr-mod" />
          <el-form-item :label="$t('TKE.overview.ly')">
            <div class="li-box">{{$t('TKE.overview.dsfck')}}</div>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.xzdz')" prop="address">
            <el-input
              class="w200"
              v-model="ruleForm.address"
              :placeholder="$t('TKE.overview.qsrxzdz')"
            ></el-input>
            <p>{{$t('TKE.overview.qsrgs')}}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.lx')">
            <el-radio-group v-model="isCollapse" size="mini" @change="setPrivate('rulePass')">
              <el-radio-button :label="true">公有</el-radio-button>
              <el-radio-button :label="false">私有</el-radio-button>
            </el-radio-group>
            <div v-show="!isCollapse" class="user-room">
              <div class="demo-ruleForm">
                <el-form
                  :model="rulePass"
                  :rules="rules"
                  ref="rulePass"
                  label-width="100px"
                  size="mini"
                  label-position="left"
                  class="tke-form"
                >
                  <el-form-item
                    :label="$t('TKE.overview.yhm')"
                    prop="nameTwo"
                    class="margin-length"
                  >
                    <el-input
                      type="text"
                      v-model="rulePass.nameTwo"
                      size="mini"
                      style="width:150px;"
                    ></el-input>
                  </el-form-item>
                  <el-form-item :label="$t('TKE.overview.mm')" prop="pass" class="margin-length">
                    <el-input
                      type="password"
                      v-model="rulePass.pass"
                      size="mini"
                      style="width:150px;"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <!-- </el-form> -->
            </div>
          </el-form-item>
          <el-form-item label="Key-Value">
            <div style="width:450px;">
              <div
                class="form-input"
                v-for="(domain, index) in domains"
                :key="domain.key"
                :prop="'domains.' + index + '.value'"
              >
                <el-input v-model="domain.value" size="mini" :placeholder="$t('TKE.overview.blm')"></el-input>
                <span>=</span>
                <el-input
                  v-model="domain.valueKey"
                  size="mini"
                  :placeholder="$t('TKE.overview.blz')"
                ></el-input>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('TKE.overview.sc')"
                  placement="right"
                >
                  <i class="el-icon-close" @click.prevent="removeDomain(domain)"></i>
                </el-tooltip>
              </div>
            </div>
            <p
              v-show="domains.length?true:false"
              class="form-p"
            >{{$t('TKE.overview.zdycsth')}}：image.repository = nginx</p>
            <el-link
              type="primary"
              style="cursor: pointer;"
              @click="addDomain"
              :disabled="flag"
            >{{$t('TKE.overview.xzbl')}}</el-link>
          </el-form-item>
          <hr class="hr-mod" />
          <el-button type="primary" size="mini" @click="submitForm('ruleForm','rulePass')">完成</el-button>
          <el-button size="mini" @click="jump()">取消</el-button>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
import AddValue from "@/views/TKE/helmCreate/components/addValue.vue";
import { TKE_COLONY_LIST, POINT_REQUEST } from "@/constants";
import { ErrorTips } from "@/components/ErrorTips";
export default {
  name: "helm",
  components: {
    AddValue
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("請輸入密碼"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("請輸入用戶名"));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      const version = /^(?!-)(?!.*-$)[a-z0-9-]+$/;
      if (value === "") {
        callback(new Error("請輸入應用戶名"));
      } else if (!version.test(value)) {
        callback(new Error("格式不正確"));
      } else if (value.length > 63) {
        callback(new Error("長度不能超過63個字元"));
      } else {
        callback();
      }
    };
    var validatePass4 = (rule, value, callback) => {
      const version2 = /^http[\d\D]*tgz$/;
      if (value === "") {
        callback(new Error("請輸入Chart_url"));
      } else if (!version2.test(value)) {
        callback(new Error("格式不正確"));
      } else {
        callback();
      }
    };
    return {
      data: {
        flag: true
      },
      isCollapse: true,
      input: "",
      ruleForm: {
        colony: "",
        local: "",
        name: "", // 应用名
        address: ""
      },
      rulePass: {
        pass: "",
        nameTwo: ""
      },
      domains: [],
      getFlag: true,
      flag: false,
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        nameTwo: [{ validator: validatePass2, trigger: "blur" }],
        name: [{ validator: validatePass3, trigger: "blur" }],
        address: [{ validator: validatePass4, trigger: "blur" }]
      }
    };
  },
  watch: {
    domains: {
      handler(news, old) {
        for (var i in news) {
          if (
            news[i].value == "" ||
            (news[i].valueKey == "" && news.length != 0)
          ) {
            this.flag = true;
          } else if (news.length == 0) {
            this.flag = false;
          } else {
            this.flag = false;
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getColonyList();
  },
  methods: {
    removeDomain(item) {
      var index = this.domains.indexOf(item);
      if (index !== -1) {
        this.domains.splice(index, 1);
      }
      if (this.domains.length == 0) {
        this.flag = false;
      }
    },
    addDomain() {
      this.domains.push({
        value: "",
        valueKey: ""
      });
    },
    setPrivate(formName) {
      if (this.isCollapse) {
        this.rulePass.nameTwo = "";
        this.rulePass.pass = "";
        this.$refs[formName].clearValidate();
      }
    },
    // 确定
    submitForm(formName, formPass) {
      this.$refs[formName].validate(valid => {
        if (valid && this.isCollapse) {
          this.setHelm();
          this.$router.push({
            name: "helm",
            query: {
              clusterId: this.$route.query.clusterId
            }
          });
          this.$store.commit("getFlag", true);
        } else if (valid && !this.isCollapse) {
          this.$refs[formPass].validate(validTwo => {
            if (validTwo) {
              this.setHelm();
              this.$router.push({
                name: "helm",
                query: {
                  clusterId: this.$route.query.clusterId
                }
              });
              this.$store.commit("getFlag", true);
            } else {
              return false;
            }
          });
        } else {
          return false;
        }
      });
    },
    jump() {
      this.$router.push({
        name: "helm",
        query: {
          clusterId: this.$route.query.clusterId
        }
      });
    },
    // 获取集群列表
    getColonyList() {
      const param = {
        Version: "2018-05-25"
      };
      this.axios.post(TKE_COLONY_LIST, param).then(res => {
        if (res.Response.Error == undefined) {
          // this.Data=JSON.parse(res.Response.ResponseBody).release
          // this.raw =JSON.parse(res.Response.ResponseBody).release.config.raw
          // let rawDetail = JSON.parse(this.raw)
          // 筛选集群
          for (let i in res.Response.Clusters) {
            if (
              res.Response.Clusters[i].ClusterId == this.$route.query.clusterId
            ) {
              this.ruleForm.colony = res.Response.Clusters[i].ClusterName;
            }
          }
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
    //新建Helm
    setHelm() {
      let nmAll = this.domains.map(item => {
        return item.value + "=" + item.valueKey;
      });
      if (
        this.domains.length > 0 &&
        this.rulePass.nameTwo == "" &&
        this.rulePass.pass == ""
      ) {
        var RequestBodyAll = {
          chart_url: this.ruleForm.address,
          repo: "Other",
          values: { raw_original: nmAll.join(","), values_type: "kv" }
        };
      } else if (
        this.domains.length == 0 &&
        this.rulePass.nameTwo != "" &&
        this.rulePass.pass != ""
      ) {
        var RequestBodyAll = {
          chart_url: this.ruleForm.address,
          repo: "Other",
          username: this.rulePass.nameTwo,
          password: this.rulePass.pass
        };
      } else if (
        this.domains.length > 0 &&
        this.rulePass.nameTwo != "" &&
        this.rulePass.pass != ""
      ) {
        var RequestBodyAll = {
          chart_url: this.ruleForm.address,
          repo: "Other",
          username: this.rulePass.nameTwo,
          password: this.rulePass.pass,
          values: { raw_original: nmAll.join(","), values_type: "kv" }
        };
      } else {
        var RequestBodyAll = {
          chart_url: this.ruleForm.address,
          repo: "Other"
        };
      }
      const param = {
        ClusterName: this.$route.query.clusterId,
        Method: "POST",
        Path:
          "/apis/platform.tke/v1/clusters/" +
          this.$route.query.clusterId +
          "/helm/tiller/v2/releases/" +
          this.ruleForm.name +
          "/json",
        RequestBody: RequestBodyAll,
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error == undefined) {
          // this.Data=JSON.parse(res.Response.ResponseBody).release
          // this.raw =JSON.parse(res.Response.ResponseBody).release.config.raw
          // let rawDetail = JSON.parse(this.raw)
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
    }
  }
};
</script>
<style lang="scss" scoped>
.myMirror-wrap {
  position: relative;
}
.datails-nav {
  height: 68px;
  background: #fff;
  span {
    color: #000;
    font-size: 16px;
    padding: 0 20px;
    box-sizing: border-box;
  }
  ul {
    display: flex;
    height: 40px;
    line-height: 68px;
    margin-left: 20px;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        font-size: 16px;
        font-weight: bold;
      }
    }
    li:nth-child(1) {
      color: blue;
    }
  }
}
.room-center {
  position: absolute;
  top: 90px;
  left: 20px;
  width: 95%;
  height: auto;
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
.li-left {
  width: 80px;
}
.box-ul-one {
  li {
    display: flex;
    align-items: center;
    margin: 30px 0;
  }
}
.p-text {
  font-size: 12px;
  color: #888;
  vertical-align: middle;
  margin-top: 8px;
}
.hr-mod {
  font-size: 5px;
  border: none;
  border-bottom: 1px solid #ccc;
  margin-bottom: 18px;
}
.li-box {
  padding: 5px;
  border: 1px solid #006eff;
  width: 90px;
  text-align: center;
  color: #006eff;
  cursor: pointer;
}
.li-right {
  ul {
    li {
      width: 70px;
      border: 1px solid #ddd;
      float: left;
      color: #000;
      padding: 7px;
      text-align: center;
    }
  }
}
.user-room {
  margin-top: 20px;
  // padding:10px;
  height: 140px;
  width: 280px;
  background: #f2f2f2;
}
.margin-length {
  padding: 10px 0;
}
.form-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
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
</style>
