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
          <h2 class="header-title">新建PersistentVolume</h2>
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
          <el-form-item :label="$t('TKE.storage.lysz')" class="m0">
            <el-radio-group
              v-model="pv.tabPosition"
              style="margin-bottom: 30px;"
              @change="getNull()"
            >
              <el-radio-button label="jt">{{$t('TKE.storage.jtcj')}}</el-radio-button>
              <el-radio-button label="dt">{{$t('TKE.storage.dtcj')}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <div v-if="pv.tabPosition=='jt'">
            <el-form-item :label="$t('TKE.overview.mc')" class="m0" prop="name">
              <el-input class="w200" v-model="pv.name" :placeholder="$t('TKE.myMirror.qsrmc')"></el-input>
              <p>{{$t('TKE.overview.xz')}}</p>
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
                  <el-radio-button label="CFS" disabled>对象存储COS</el-radio-button>
                </el-tooltip> -->
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('TKE.storage.dxql')" class="m0">
              <el-radio-group v-model="pv.rw" style="margin-bottom: 30px;">
                <el-radio-button label="orw">{{$t('TKE.storage.djdx')}}</el-radio-button>
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
              <el-form-item label="StorageClass">
                <el-select v-model="pv.storageValue" :placeholder="$t('TKE.overview.zwsj')">
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
                  @click="GetStorageValue()"
                ></el-button>
              </el-form-item>
              <el-form-item :label="$t('TKE.storage.xzyp')" class="m0">
                <div v-show="radioName ==''?true:false">
                  {{$t('TKE.storage.wxzsjp')}}
                  <a @click="dialogFormVisible=true" style="cursor:pointer;">{{$t('TKE.storage.xzyyp')}}</a>
                </div>
                <div v-show="radioName !=''?true:false">
                  {{radioName}}
                  <a @click="dialogFormVisible=true" style="cursor:pointer;">{{$t('TKE.storage.cxxz')}}</a>
                </div>
              </el-form-item>
              <el-form-item :label="$t('TKE.storage.wjxt')" class="m0">
                <el-radio v-model="pv.radio" label="ext4">ext4</el-radio>
              </el-form-item>
            </div>
            <!-- <div v-if="pv.ps=='CFS'">
              <el-form-item label="StorageClass" class="m0">
                <el-select class="err" v-model="storageValue" placeholder="暂无数据" disabled>
                  <el-option
                    v-for="(item,index) in StorageClass"
                    :key="index"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
                <el-button size="mini" style="height:28px;padding-bottom:2px;border:none;" icon="el-icon-refresh"></el-button>
                <i class="el-icon-warning red"></i>
                <div>当前类型无可用StorageClass，请前往<a href="">StorageClass</a><i class="el-icon-edit-outline"></i>进行新建</div>
              </el-form-item>
              <el-form-item label="选择CFS" class="m0">
                <el-select v-model="pv.value" placeholder="暂无数据" disabled>
                  <el-option
                    v-for="(item,index) in pv.options"
                    :key="index"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
                <el-button size="mini" style="height:28px;padding-bottom:2px;border:none;" icon="el-icon-refresh"></el-button>
                <div>如当前CFS不适合，请前往<a href="">文件存储控制台</a><i class="el-icon-edit-outline"></i>进行新建</div>
              </el-form-item>
              <el-form-item label="CFS子目录" class="m0">
              <el-input class="w200" v-model="pv.name" placeholder="子目录默认为/"></el-input>
              <p class="red">请确保CFS中存在该子目录，否则会挂载失败</p>
            </el-form-item>
            </div>-->
          </div>
          <div v-if="pv.tabPosition=='dt'">
            <el-form-item :label="$t('TKE.storage.sm')">
              <div>{{$t('TKE.storage.dtcjwxnsdcj')}}</div>
            </el-form-item>
          </div>
        </el-form>
        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button
            size="small"
            type="primary"
            @click="submitForm('pv')"
            :disabled="pv.tabPosition == 'dt'"
          >{{$t('TKE.subList.cj')}}PersistentVolume</el-button>
          <el-button size="small" @click="jump()">取消</el-button>
          <div class="explain" v-show="see">
            <p>persistentvolumes "{{pv.name}}" already exists</p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="$t('TKE.storage.xzyyp')" :visible.sync="dialogFormVisible" width="50%">
      <div class="post-room">
        <el-select v-model="form.login" :placeholder="$t('TKE.overview.qxz')" size="mini" style="width:200px;">
          <el-option
            v-for="item in LoginOptions"
            :key="item.ZoneId"
            :label="item.ZoneName"
            :value="item.Zone"
          ></el-option>
        </el-select>
        <el-input
          v-model="form.input"
          :placeholder="$t('TKE.colony.qsrnr')"
          size="mini"
          style="width:200px;margin-left:10px;"
        ></el-input>
        <el-button
          icon="el-icon-search"
          size="mini"
          style="margin-left:-1px;height:28px;"
          :plain="true"
          @click="getSearch()"
        ></el-button>
        <div class="room-bottom">
          <el-table
            :data="tableData"
            style="width: 100%;margin:20px 0;"
            height="300"
            v-loading="loadShow"
          >
            <el-table-column label max-width="10%">
              <template slot-scope="scope">
                <el-radio v-model="form.radio" :label="scope.row">{{$t('TKE.storage.xzyyp')}}</el-radio>
              </template>
            </el-table-column>
            <el-table-column label="ID" width="180" prop="DiskId" max-width="30%"></el-table-column>
            <el-table-column prop="DiskName" :label="$t('TKE.storage.xzyyp')" max-width="40%"></el-table-column>
            <el-table-column prop="DiskSize" label="大小" max-width="20%">
              <template slot-scope="scope">{{scope.row.DiskSize}}G</template>
            </el-table-column>
          </el-table>
          <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t('TKE.overview.tiao')}}</span>
            <el-pagination
              :page-size="pagesize"
              layout="prev, pager, next"
              :current-page.sync="currpage"
              @current-change="handleCurrentChange"
              :total="TotalCount"
            ></el-pagination>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="getAllData()">{{$t('TKE.overview.qd')}}</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ErrorTips } from "@/components/ErrorTips";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import {
  ALL_CITY,
  TKE_DESCRIBEDISKS,
  TKE_DESCRIBEZONES,
  POINT_REQUEST
} from "@/constants";
export default {
  name: "pvCreate",
  data() {
    var validatePass = (rule, value, callback) => {
      const version = /^(?!_)(?!.*-$)[a-z0-9_]+$/;
      if (value === "") {
        // console.log(222)
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
        name: "",
        tabPosition: "jt",
        ps: "CBS",
        rw: "orw",
        value: "cbs",
        radio: "ext4",
        storageValue: ""
      },
      LoginOptions: [], // 云硬盘地区
      form: {
        login: "",
        input: "",
        radio: ""
      },
      tableData: [],
      StorageClass: [],
      TotalCount: 0, //总页数
      pagesize: 20, // 一页多少条数据
      currpage: 1, // 第几页
      dialogFormVisible: false,
      radioName: "",
      empty: "",
      loadShow: true,
      DiskId: "",
      DiskSize: "",
      see: false,
      rules: {
        name: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  // watch:{
  //   radio(value){
  //     console.log(value)
  //   }
  // },
  created() {
    this.GetDescribeDisks();
    this.GetLocation();
    this.GetStorageValue();
  },
  watch:{
      'form.input':{
        handler(val){
          if(val == ""){
            this.loadShow = true
            this.GetDescribeDisks();
          }
        },
      }
  },
  methods: {
    handleCurrentChange() {
      this.loadShow = true;
      this.GetDescribeDisks();
    },
    getSearch() {
      if (this.form.input) {
        this.loadShow = true
        this.GetSearchDisks();
      } else {
        this.loadShow = true
        this.GetDescribeDisks();
      }
    },
    getNull() {
      this.$refs["pv"].resetFields([name]);
    },
    getAllData() {
      let allData = this.form.radio;
      this.radioName =
        "[" +
        allData.DiskSize +
        "GB" +
        "]" +
        allData.DiskId +
        "(" +
        allData.DiskName +
        ")";
      this.DiskSize = allData.DiskSize + "Gi";
      this.DiskId = allData.DiskId;
      this.dialogFormVisible = false;
      console.log(this.radioName);
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (this.radioName && valid) {
          // alert('submit!');
          this.setValue();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消跳转
    jump() {
      this.$router.push({
        name: "colonyStoragePv",
        query: {
          clusterId: this.$route.query.clusterId
        }
      });
    },
    // 获取云硬盘
    GetDescribeDisks() {
      const param = {
        "Filters.0.Name": "disk-usage",
        "Filters.0.Values.0": "DATA_DISK",
        "Filters.1.Name": "portable",
        "Filters.1.Values.0": "TRUE",
        "Filters.2.Name": "disk-state",
        "Filters.2.Values.0": "UNATTACHED",
        "Filters.3.Name": "zone",
        "Filters.3.Values.0": "ap-taipei-1",
        Limit: this.pagesize,
        Offset: this.currpage - 1,
        Version: "2017-03-12"
      };
      this.axios.post(TKE_DESCRIBEDISKS, param).then(res => {
        console.log(res);
        if (res.Response.Error == undefined) {
          console.log(res.Response.DiskSet);
          this.tableData = res.Response.DiskSet;
          this.TotalCount = res.Response.TotalCount;
          this.loadShow = false;
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
    // 查询数据
    GetSearchDisks() {
      const param = {
        "Filters.0.Name": "disk-usage",
        "Filters.0.Values.0": "DATA_DISK",
        "Filters.1.Name": "portable",
        "Filters.1.Values.0": "TRUE",
        "Filters.2.Name": "disk-state",
        "Filters.2.Values.0": "UNATTACHED",
        "Filters.3.Name": "zone",
        "Filters.3.Values.0": "ap-taipei-1",
        "Filters.4.Name": "disk-id",
        "Filters.4.Values.0": this.form.input,
        Limit: 20,
        Offset: 0,
        Version: "2017-03-12"
      };
      this.axios.post(TKE_DESCRIBEDISKS, param).then(res => {
        console.log(res);
        if (res.Response.Error == undefined) {
          console.log(res.Response.DiskSet);
          this.tableData = res.Response.DiskSet;
          this.TotalCount = res.Response.TotalCount;
          this.loadShow = false
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
    // 地区
    GetLocation() {
      const param = {
        Version: "2017-03-12"
      };
      this.axios.post(TKE_DESCRIBEZONES, param).then(res => {
        console.log(res);
        if (res.Response.Error == undefined) {
          // console.log(res.Response.DiskSet)
          this.LoginOptions = res.Response.ZoneSet;
          this.form.login = res.Response.ZoneSet[0].Zone;
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
          console.log(mes);
          this.pv.storageValue = mes.items[0].metadata.name;
          this.StorageClass = mes.items;
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
    setValue() {
      var params = {
        ClusterName: this.$route.query.clusterId,
        Method: "POST",
        Path: "/api/v1/persistentvolumes",
        RequestBody: JSON.stringify({
          kind: "PersistentVolume",
          apiVersion: "v1",
          metadata: { name: this.pv.name },
          spec: {
            accessModes: ["ReadWriteOnce"],
            storageClassName: this.pv.storageValue,
            capacity: { storage: this.DiskSize },
            qcloudCbs: { cbsDiskId: this.DiskId, fsType: this.pv.radio }
          }
        }),
        Version: "2018-05-25"
      };
      this.axios.post(POINT_REQUEST, params).then(res => {
        if (res.Response.Error === undefined) {
          var mes = JSON.parse(res.Response.ResponseBody);
          this.$message({
            message: "新建成功",
            type: "success",
            showClose: true,
            duration: 0
          });
          this.$router.push({
            name: "pvDetailEvent",
            query: {
              clusterId: this.$route.query.clusterId,
              resourceIns: this.pv.name
            }
          });
          // this.pv.storageValue = mes.items[0].metadata.name
          // this.StorageClass = mes.items
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          // console.log(res.Response,res.message)
          if (
            res.Response.Error.Code == "InternalError" &&
            JSON.parse(res.Response.Error.Message).reason == "AlreadyExists"
          ) {
            this.see = true;
          }
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 2000
          });
        }
      });
    },
    //返回上一层
    goBack() {
      this.$router.go(-1);
    }
  }
};
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
.post-room {
  width: 100%;
  padding: 20px;
}
.Right-style {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  padding: 20px;
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.room-bottom {
  background: white;
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

