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
          <h2 class="header-title">新建StorageClass</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form
          :model="pv"
          label-position="left"
          label-width="120px"
          size="mini"
          :rules="rules"
          ref="pv"
          class="tke-form m0"
        >
          <el-form-item :label="$t('TKE.overview.mc')" prop="name">
            <el-input class="w200" v-model="pv.name" :placeholder="$t('TKE.overview.qsrmc')"></el-input>
            <p>{{$t('TKE.overview.xz')}}</p>
          </el-form-item>
          <el-form-item label="Provisioner" class="m0">
            <el-radio-group v-model="pv.cloud" style="margin-bottom: 30px;">
              <el-radio-button label="cloud.tencent.com/qcloud-cbs">{{$t('TKE.storage.yyp')}}CBS</el-radio-button>
               <el-tooltip class="item" effect="light" placement="top">
                <div slot="content">
                  {{$t('TKE.storage.kzzjgncybmd')}}
                  <!-- 请
                  <a>工单咨询</a> -->
                </div>
                <el-radio-button label="cloud.tencent.com/qcloud-cfs" disabled>{{$t('TKE.storage.wjcc')}}CFS</el-radio-button>
               </el-tooltip>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="地域">
            <div>{{$t('TKE.storage.gatdqtwtb')}}</div>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.kyq')">
            <!-- <el-checkbox v-model="pv.city">随机可用区</el-checkbox> -->
            <el-checkbox-group v-model="pv.city">
              <el-checkbox
                v-for="(item,index) in pv.checkListT"
                :label="item"
                :key="index"
                disabled
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('TKE.colony.jfms')">
            <el-radio-group v-model="pv.money" @change="getChange($event)">
              <el-radio-button label="POSTPAID">{{$t('TKE.colony.aljf')}}</el-radio-button>
              <el-radio-button label="PREPAID">包年包月</el-radio-button>
            </el-radio-group>
            <div v-show="!flag">{{$t('TKE.storage.zcschbldhscl')}}</div>
            <div v-show="flag">
              <p>{{$t('TKE.storage.jzcbldhscl')}}</p>
              <p>
                {{$t('TKE.storage.rnxygmbnbyyyp')}}
                <!-- <a>点击前往角色控制台进行授权</a> -->
              </p>
            </div>
          </el-form-item>
          <el-form-item :label="$t('TKE.storage.yplx')">
            <el-radio-group v-model="pv.ps">
              <el-radio-button label="CLOUD_PREMIUM">{{$t('TKE.colony.gxnyp')}}</el-radio-button>
              <el-radio-button label="CLOUD_SSD">{{$t('TKE.colony.yyp')}}</el-radio-button>
            </el-radio-group>
            <div>
              {{$t('TKE.storage.rlxzkckcbs')}}
              <!-- <a href>CBS类型说明</a> -->
            </div>
          </el-form-item>
          <el-form-item label="回收策略" class="m0">
            <el-radio-group v-model="pv.del" style="margin-bottom: 30px;">
              <el-radio-button label="Delete" :disabled="flag">{{$t('TKE.overview.sc')}}</el-radio-button>
              <el-radio-button label="Retain">保留</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('TKE.storage.dqbf')" class="m0">
            <el-checkbox v-model="pv.checked" @change="!pv.checked">{{$t('TKE.storage.szdqbf')}}</el-checkbox>
            <div v-show="pv.checked">
              <el-select
                v-model="pv.backup"
                filterable
                :placeholder="$t('TKE.overview.qxz')"
                :filter-method="dataFilter"
              >
                <el-option
                  v-for="item in info"
                  :key="item.AutoSnapshotPolicyId"
                  :label="item.AutoSnapshotPolicyName+'|'+getfilterWeek(item.Policy[0].DayOfWeek[0])+'|'+getfilterDay(item.Policy[0].Hour[0])+'|'+getfilterRetention(item.RetentionDays)"
                  :value="item.AutoSnapshotPolicyId"
                ></el-option>
              </el-select>
              <span style="margin-left:10px;">
                {{$t('TKE.storage.clxq')}}
                <el-tooltip class="item" effect="light" placement="top" v-if="toolData.length">
                  <div slot="content" style="fontWeight:700;">ID/{{$t('TKE.overview.mc')}}</div>
                  <div slot="content">{{pv.backup}}({{toolData[0].AutoSnapshotPolicyName}})</div>
                  <div slot="content" style="fontWeight:700;">日期</div>
                  <div slot="content">{{getfilterWeek(toolData[0].Policy[0].DayOfWeek[0])}}</div>
                  <div slot="content" style="fontWeight:700;">{{$t('TKE.storage.sj')}}</div>
                  <div slot="content">{{getfilterDay(toolData[0].Policy[0].Hour[0])}}</div>
                  <div slot="content" style="fontWeight:700;">保留{{$t('TKE.storage.sj')}}</div>
                  <div slot="content">{{getfilterRetention(toolData[0].RetentionDays)}}</div>
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </span>
              <p>
                {{$t('TKE.storage.szdqbfkyx')}}
                <!-- <a>价格总览</a> -->
                <i class="el-icon-edit-outline"></i>
              </p>
            </div>
          </el-form-item>
        </el-form>

        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary" @click="submitForm('pv')">新建StorageClass</el-button>
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
import FileSaver from "file-saver";
import { ErrorTips } from "@/components/ErrorTips";
import XLSX from "xlsx";
import { ALL_CITY, TKE_CBS_POLICIES, POINT_REQUEST } from "@/constants";
export default {
  name: "scCreate",
  data() {
    var validatePass = (rule, value, callback) => {
      const version = /^(?!-)(?!.*-$)[a-z0-9-]+$/;
      if (value === "") {
        callback(new Error("請輸入用戶名"));
      } else if (!version.test(value)) {
        callback(new Error("格式不正確"));
      } else if (value.length > 63) {
        callback(new Error("長度不能超過63個字元"));
      } else {
        callback();
      }
    };
    return {
      pv: {
        cloud: "cloud.tencent.com/qcloud-cbs",
        money: "POSTPAID",
        ps: "CLOUD_PREMIUM",
        del: "Delete",
        name: "",
        checked: false,
        checkListO: [],
        checkListT: ["台北一區"],
        city: ["台北一區"],
        backup: "" //备份数据
      },
      info: [],
      flag: false,
      see: false,
      rules: {
        name: [{ validator: validatePass, trigger: "blur" }]
      },
      toolData:[]
    };
  },
  watch:{
    'pv.backup':{
      handler(val){
         this.toolData = this.info.filter(item=>{
            return item.AutoSnapshotPolicyId == val
         })
      }
    }
  },
  created() {
    // 从路由获取类型
    this.GetPolicies();
  },
  methods: {
    //返回上一层
    goBack() {
      this.$router.go(-1);
    },
    dataFilter(val) {
    },
    getfilterWeek(val) {
      if (val == 1) {
        return "星期一";
      } else if (val == 2) {
        return "星期二";
      } else if (val == 3) {
        return "星期三";
      } else if (val == 4) {
        return "星期四";
      } else if (val == 5) {
        return "星期五";
      } else if (val == 6) {
        return "星期六";
      } else if (val == 7) {
        return "星期日";
      }
    },
    getfilterDay(val) {
      return val + ":00";
    },
    getfilterRetention(val) {
      if (val) {
        return "保留" + val + this.$t('TKE.storage.hzdsc');
      } else {
        return "永久保留";
      }
    },
    getChange(val) {
      if (val == "PREPAID") {
        this.flag = true;
        this.pv.del = "Retain";
      } else {
        this.flag = false;
      }
    },
    // 取消跳转
    jump() {
      this.$router.push({
        name: "colonyStorageSc",
        query: {
          clusterId: this.$route.query.clusterId
        }
      });
    },
    // 提交按钮
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // alert('submit!');
          this.setValue();
        } else {
          return false;
        }
      });
    },
    GetPolicies() {
      const param = {
        "Filters.0.Name": "auto-snapshot-policy-state",
        "Filters.0.Values.0": "NORMAL",
        TryCreateDefaultAutoSnapshotPolicy: true,
        Version: "2017-03-12"
      };
      this.axios.post(TKE_CBS_POLICIES, param).then(res => {
        if (res.Response.Error == undefined) {
          this.info = res.Response.AutoSnapshotPolicySet;
          this.pv.backup =
            res.Response.AutoSnapshotPolicySet[0].AutoSnapshotPolicyId;
          // this.loadShow = false
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
    // 新建
    setValue() {
      if (this.pv.checked) {
        var RequestValue = {
          kind: "StorageClass",
          apiVersion: "storage.k8s.io/v1",
          metadata: { name: this.pv.name },
          provisioner: this.pv.cloud,
          parameters: {
            type: this.pv.ps,
            paymode: this.pv.money,
            aspid: this.pv.backup
          },
          reclaimPolicy: this.pv.del
        };
      } else {
        var RequestValue = {
          kind: "StorageClass",
          apiVersion: "storage.k8s.io/v1",
          metadata: { name: this.pv.name },
          provisioner: this.pv.cloud,
          parameters: { type: this.pv.ps, paymode: this.pv.money },
          reclaimPolicy: this.pv.del
        };
      }
      const param = {
        ClusterName: this.$route.query.clusterId,
        Method: "POST",
        Path: "/apis/storage.k8s.io/v1/storageclasses",
        RequestBody: JSON.stringify(RequestValue),
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, param).then(res => {
        if (res.Response.Error == undefined) {
          this.$message({
            message: "新建成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.$router.push({
            name: "scDetailEvent",
            query: {
              clusterId: this.$route.query.clusterId,
              resourceIns: this.pv.name
            }
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
    }
  },
}

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

