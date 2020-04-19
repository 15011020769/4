 <!-- 新建PersistentVolume -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建PersistentVolumeClaim</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form
          class="tke-form m0"
          :model="pv"
          label-position="left"
          label-width="120px"
          size="mini"
          :rules="rules"
          ref="pv"
        >
          <el-form-item :label="$t('TKE.overview.mc')" class="m0" prop="name">
            <el-input class="w200" v-model="pv.name" :placeholder="$t('TKE.myMirror.qsrmc')"></el-input>
            <p>{{$t('TKE.overview.xz')}}</p>
          </el-form-item>
          <el-form-item :label="$t('TKE.overview.mmkj')" style="margin-top:20px;">
            <el-select v-model="pv.nameValue" :placeholder="$t('TKE.overview.qxz')">
              <el-option
                v-for="(item,index) in Namespace"
                :key="index"
                :label="item.metadata.name"
                :value="item.metadata.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Provisioner" class="m0">
            <el-radio-group v-model="pv.ps" style="margin-bottom: 30px;">
              <el-radio-button label="CBS">{{$t('TKE.storage.yyp')}}CBS</el-radio-button>
              <!-- <el-tooltip class="item" effect="light" placement="top">
                <div slot="content">
                  扩展组件功能处于白名单体验阶段，如需使用，请
                  <a>工单咨询</a>
                </div>
                <el-radio-button label="CFS" disabled>文件存储CFS</el-radio-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" placement="top">
                <div slot="content">
                  扩展组件功能处于白名单体验阶段，如需使用，请
                  <a>工单咨询</a>
                </div>
                <el-radio-button label="COS" disabled>对象存储COS</el-radio-button>
              </el-tooltip>-->
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('TKE.storage.dxql')" class="m0">
            <el-radio-group v-model="pv.rw" style="margin-bottom: 30px;">
              <el-radio-button label="ReadWriteOnce">{{$t('TKE.storage.djdx')}}</el-radio-button>
              <el-tooltip class="item" effect="light" placement="top">
                <div slot="content">{{$t('TKE.storage.yypjzcdjdx')}}</div>
                <el-radio-button label="tor" :disabled="pv.ps=='CBS'">{{$t('TKE.storage.djzd')}}</el-radio-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" placement="top">
                <div slot="content">{{$t('TKE.storage.yypjzcdjdx')}}</div>
                <el-radio-button label="trw" :disabled="pv.ps=='CBS'">{{$t('TKE.storage.duojdx')}}</el-radio-button>
              </el-tooltip>
            </el-radio-group>
          </el-form-item>
          <div v-if="pv.ps=='CBS'">
            <el-form-item label="StorageClass" class="m0">
              <el-select
                v-model="pv.storageValue"
                :placeholder="$t('TKE.overview.qxz')"
                @change="getType"
              >
                <el-option
                  v-for="(item,index) in StorageClass"
                  :key="index"
                  :label="item.metadata.name"
                  :value="item.metadata.name"
                ></el-option>
              </el-select>
              <el-button
                size="mini"
                style="height:28px;padding-bottom:2px;border:none;"
                icon="el-icon-refresh"
              ></el-button>
              <div>{{$t('TKE.storage.pvcjzdbd')}}</div>
            </el-form-item>
            <el-form-item :label="$t('TKE.storage.yplx')">
              <div v-if="type == 'CLOUD_BASIC'">{{$t('TKE.storage.ptyyp')}}</div>
              <div v-if="type == 'CLOUD_BASIC'">
                {{$t('TKE.storage.scwcbs')}}
                <span class="red" >{{$t('TKE.storage.rptypsqs')}}</span>
              </div>
              <div v-if="type == 'CLOUD_PREMIUM'">高性能雲硬碟</div>
              <div v-if="type == 'CLOUD_SSD'">SSD雲硬碟</div>
            </el-form-item>
            <el-form-item label="容量" prop="input">
              <el-tooltip placement="top" effect="light">
                <div slot="content"  v-if="type == 'CLOUD_BASIC'">{{$t('TKE.storage.ptyypypdx')}}</div>
                <div slot="content"  v-if="type == 'CLOUD_PREMIUM'">高性能雲硬碟最小為10GB，最大為16000GB</div>
                <div slot="content"  v-if="type == 'CLOUD_SSD'">SSD雲硬碟最小為200GB，最大為16000GB</div>
                <el-input style="width:150px" v-model.number="pv.input" @change="getMoney()">
                  <template slot="append">GiB</template>
                </el-input>
              </el-tooltip>
            </el-form-item>
            <el-form-item :label="$t('TKE.storage.fy')">
              <div v-if="!monney&&!(type == 'CLOUD_BASIC')">{{$t('TKE.storage.qxsrhfdyprl')}}</div>
              <div v-if="type == 'CLOUD_BASIC'" style="color:red;">普通雲硬碟無法計算</div>
              <div v-if="monney">NT$<span style="color:#ff9d00">{{monney}}</span>每小時</div>
            </el-form-item>
          </div>
          <div v-if="pv.ps=='CFS'">
            <el-form-item label="StorageClass" class="m0">
              <el-select
                class="err"
                v-model="pv.storageValue"
                :placeholder="$t('TKE.overview.zwsj')"
                disabled
              >
                <el-option
                  v-for="(item,index) in pv.StorageClass"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
              <el-button
                size="mini"
                style="height:28px;padding-bottom:2px;border:none;"
                icon="el-icon-refresh"
                @click="GetStorageValue()"
              ></el-button>
              <i class="el-icon-warning red"></i>
              <div>
                {{$t('TKE.storage.dqlxwky')}}
                <a href>StorageClass</a>
                <i class="el-icon-edit-outline"></i>新建
              </div>
            </el-form-item>
          </div>
        </el-form>

        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="submitForm('pv')">新建PersistentVolumeClaim</el-button>
          <el-button size="small" @click="jump()">取消</el-button>
          <div class="explain" v-show="see">
            <p>persistentvolumes "{{pv.name}}" already exists</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ErrorTips } from "@/components/ErrorTips";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { ALL_CITY, POINT_REQUEST, TKE_PAY_MONEY } from "@/constants";
export default {
  name: "pvCreate",
  data() {
    var validatePass = (rule, value, callback) => {
      const version = /^(?!-)(?![0-9])(?!.*-$)[a-z0-9-]+$/;
      if (!version.test(this.pv.name)) {
        callback(new Error("格式不正確"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      //  const version = /^(?!_)(?!.*-$)[a-z0-9_]+$/
      if (this.pv.input % 10 !== 0) {
        callback(new Error("硬碟大小需為10的倍數"));
      } else if (this.pv.input >= 16000) {
        callback(new Error("最大為16000GB"));
      } else if (this.type == "CLOUD_SSD"&&this.pv.input<200) {
        callback(new Error("最小為200GB"));
      } else {
        callback();
      }
    };
    return {
      pv: {
        name: "",
        tabPosition: "jt",
        ps: "CBS",
        rw: "ReadWriteOnce",
        storageValue: "",
        nameValue: this.$route.query.np,
        radio: "1",
        input: ""
      },
      StorageClass: [],
      Namespace: [],
      see: false,
      type: "", // 类型
      monney:"", // 金额
      rules: {
        name: [
          { required: true, message: "名稱不能為空", trigger: "blur,change" },
          { max: 63, message: "名稱不能超過63個字元", trigger: "blur,change" },
          { validator: validatePass, trigger: "blur,change" }
        ],
        input: [
          { required: true, message: "容量不能為空", trigger: "blur,change" },
          { validator: validatePass2, trigger: "blur,change" }
        ]
      }
    };
  },
  watch:{
    'pv.input':function(val){
      if(!val){
          this.monney = ""
      }
    }
    
  },
  created() {
    // 从路由获取类型
    this.GetStorageValue();
    this.GetSpaceValue();
  },
  methods: {
    //返回上一层
    goBack() {
      this.$router.go(-1);
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.pv.input) {
            let row = this.pv.input + "Gi";
            this.SetNewValue(row);
          }
          // alert('submit!');
        } else {
          return false;
        }
      });
    },
    filterType(val) {
      if (val.parameters.type === "CLOUD_PREMIUM") {
        this.type = "CLOUD_PREMIUM";
      } else if (val.parameters.type === "CLOUD_PREMIUM") {
      }
    },
    getType(val) {
      // let type = []
      this.StorageClass.filter(item => {
        if (item.metadata.name == val) {
          if (
            item.parameters.type == "CLOUD_PREMIUM" ||
            item.parameters.type == "CLOUD_SSD"
          ) {
            this.type = item.parameters.type;
          } else {
            this.type = "CLOUD_BASIC";
          }
        }
      });
    },
    // 取消跳转
    jump() {
      this.$router.push({
        name: "colonyStoragePvc",
        query: {
          clusterId: this.$route.query.clusterId
        }
      });
    },
    // 获取storageValue
    GetStorageValue() {
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: "GET",
        Path: "/apis/storage.k8s.io/v1/storageclasses",
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.pv.storageValue = mes.items[0].metadata.name;
          this.StorageClass = mes.items;
          this.getType(mes.items[0].metadata.name);
          // this.filterType(this.StorageClass)
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 2000
          });
        }
      });
    },
    // 获取命名空间
    GetSpaceValue() {
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: "GET",
        Path: "/api/v1/namespaces",
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          // this.pv.nameValue = mes.items[0].metadata.name
          this.Namespace = mes.items;
          // this.loadShow = false
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 2000
          });
        }
      });
    },
    // 新建
    SetNewValue(row) {
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: "POST",
        RequestBody: JSON.stringify({
          kind: "PersistentVolumeClaim",
          apiVersion: "v1",
          metadata: { name: this.pv.name, namespace: this.pv.nameValue },
          spec: {
            accessModes: [this.pv.rw],
            storageClassName: this.pv.storageValue,
            resources: { requests: { storage: row } }
          }
        }),
        Path:
          "/api/v1/namespaces/" + this.pv.nameValue + "/persistentvolumeclaims",
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.$router.push({
            name: "pvcDetailEvent",
            query: {
              clusterId: this.$route.query.clusterId,
              np: this.$route.query.np,
              resourceIns: this.pv.name
            }
          });
          this.$message({
            message: "新建成功",
            type: "success",
            showClose: true,
            duration: 0
          });
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);

          if (
            res.Response.Error.Code == "InternalError" &&
            JSON.parse(res.Response.Error.Message).reason == "AlreadyExists"
          ) {
            this.see = true;
          } else {
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
        }
      });
    },
    // 获取金额
    getMoney() {
      if (this.type == "CLOUD_PREMIUM" || (this.type == "CLOUD_SSD" && this.pv.input>=200)) {
        if (this.pv.input) {
          var params = {
            DiskChargeType: "POSTPAID_BY_HOUR",
            DiskSize: this.pv.input,
            DiskType: this.type,
            Version: "2017-03-12"
          };
          this.axios.post(TKE_PAY_MONEY, params).then(res => {
            if (res.Response.Error === undefined) {
              this.monney = res.Response.DiskPrice.UnitPriceDiscount
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
        } else {
          return;
        }
      } else {
        return;
      }
    }
  }
};
// ClusterName: "cls-n1xokuh6"
// Method: "POST"
// Path: "/api/v1/namespaces/qwe/persistentvolumeclaims"
// RequestBody: "{"kind":"PersistentVolumeClaim","apiVersion":"v1","metadata":{"name":"weq232","namespace":"qwe"},"spec":{"accessModes":["ReadWriteOnce"],"storageClassName":"asqw4","resources":{"requests":{"storage":"20Gi"}}}}"
// Version: "2018-05-25"
</script>

<style lang="scss" scoped>
.m0 {
  margin: 0;
}
.red {
  color: #e54545;
}
.err {
  border: 1px solid #e54544;
}
.explain {
  // padding: 10px 30px 10px 20px;
  float: right;
  margin-right: 35%;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #ffd18b;
  background: #fff4e3;
  width: 300px;
  p {
    padding: 10px;
    width: 100%;
    font-size: 11px;
    line-height: 18px;
  }
}
</style>

