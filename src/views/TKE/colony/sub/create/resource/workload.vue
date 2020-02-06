<!-- 新建Workload -->
<template>
  <div class="colony-wrap">
    <div class="tke-content-header">
      <div class="tke-grid ">
        <!-- 左侧 -->
        <div class="grid-left">
          <span class="goback" @click="goBack">
            <i class="el-icon-back"></i>
          </span>
          <h2 class="header-title">新建Workload</h2>
        </div>
        <!-- 右侧 -->
        <div class="grid-right"></div>
      </div>
    </div>
    <div class="colony-main">
      <div class="tke-card tke-formpanel-wrap mb60">
        <el-form class="tke-form" :model="wl" label-position="left" label-width="120px" size="mini">
          <el-form-item label="名称">
            <el-input class="w200" v-model="wl.name" placeholder="请输入Workload名称"></el-input>
            <p>
              最长40个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾
            </p>
          </el-form-item>
          <el-form-item label="描述">
            <el-input class="w420" type="textarea" :rows="6" placeholder="请输入描述信息，不超过1000个字符" v-model="wl.desc">
            </el-input>
          </el-form-item>

          <el-form-item label="标签">
            <el-input class="w200" v-model="wl.name" placeholder="请输入Workload名称"></el-input>
            <p>
              最长40个字符，只能包含小写字母、数字及分隔符("-")，且必须以小写字母开头，数字或小写字母结尾
            </p>
          </el-form-item>

          <el-form-item label="类型">
            <div class="form-controls" style="width:350px">
              <el-radio-group class="tke-radio-group" v-model="wl.type">
                <el-radio label="deployment">Deployment（可扩展的部署Pod）</el-radio>
                <el-radio label="daemonSet">DaemonSet（在每个主机上运行Pod）</el-radio>
                <el-radio label="statefulSet">StatefulSet（有状态集的运行Pod）</el-radio>
                <el-radio label="cronJob">CronJob（按照Cron的计划定时运行）</el-radio>
                <el-radio label="job">Job（单次任务）</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <div>
            <el-form-item label="数据卷（选填）">
              <div class="search-one" v-show="dataFlag" v-for="(item, index) in dataJuan" :key="index">
                <el-select v-model="item.name1" placeholder="请选择">
                  <el-option v-for="item in searchOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <el-input class="search-input" v-model="item.name2" placeholder="请输入内容"></el-input>
                <div class="search-hidden">
                  <p v-if="item.name1 == 'usePath'">
                    暂未设置主机路径设置主机路径
                    <span class="add-check" @click="dialogVisiblePath = true">设置主机路径</span>
                  </p>
                  <p v-if="item.name1 == 'useNFS'">
                    <el-input class="search-input" v-model="item.name3" placeholder="NFS路径 如：127.0.0.1:/dir"></el-input>
                  </p>
                  <p v-if="item.name1 == 'usePVC'">
                    <el-select v-model="item.name3" :disabled="usePvcOptions.length == 0" :placeholder="
                        usePvcOptions.length == 0 ? '暂无数据' : '请选择'
                      ">
                      <el-option v-for="item in usePvcOptions" :key="item.value" :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </p>
                  <p v-if="item.name1 == 'useYun'">
                    <span class="add-check" @click="selectYun">选择云硬盘</span>&nbsp;&nbsp;
                    <el-tooltip class="item" effect="dark" content="数据卷类型为腾讯云硬盘，实例数量最大为1" placement="top">
                      <i style="cursor:pointer" class="el-icon-warning"></i>
                    </el-tooltip>
                  </p>
                  <p v-if="item.name1 == 'useConfig'">
                    暂未选择ConfigMap <span class="add-check">选择配置项</span>
                  </p>
                  <p v-if="item.name1 == 'useSecret'">
                    暂未选择Secret <span class="add-check">选择Secret</span>
                  </p>
                </div>
                <i class="el-icon-close" @click="delDataJuan(index)"></i>
              </div>
              <p style="margin-top:8px">
                <el-button type="primary" :disabled="yesOrnoAddDataJuan" @click="addDataJuan">添加数据卷</el-button>
              </p>
              <p>
                为容器提供存储，目前支持临时路径、主机路径、云硬盘数据卷、文件存储NFS、配置文件、PVC，还需挂载到容器的指定路径中。<span
                  style="color:#409eff;cursor:pointer">使用指引</span>
              </p>
            </el-form-item>
          </div>
        </el-form>

        <!-- 设置主机路径 -->
        <el-dialog title="设置主机路径" :visible.sync="dialogVisiblePath" width="30%">
          <el-form :model="wl" label-position="left" label-width="120px" size="mini">
            <el-form-item label="主机路径">
              <el-input class="w192" v-model="wl.name" placeholder="如：/data/dev"></el-input>
            </el-form-item>
            <el-form-item label="检查类型">
              <el-select v-model="wl.name" :disabled="checkTypeOptions.length == 0" :placeholder="
                  checkTypeOptions.length == 0 ? '暂无数据' : '请选择'
                ">
                <el-option v-for="item in checkTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisiblePath = false">确 定</el-button>
            <el-button @click="dialogVisiblePath = false">取 消</el-button>
          </span>
        </el-dialog>

        <!-- 选择云硬盘 -->
        <el-dialog title="选择云硬盘" :visible.sync="dialogVisibleYun" width="30%">
          <div>
            <el-select v-model="usePvcOptions" :disabled="usePvcOptions.length == 0" :placeholder="
                        usePvcOptions.length == 0 ? '暂无数据' : '请选择'
                      ">
              <el-option v-for="item in usePvcOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <el-input placeholder="请输入内容" v-model="usePvcOptions" clearable>
            <i slot="suffix" class="el-icon-search"></i>
            </el-input>
          </div>

          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisibleYun = false">确 定</el-button>
            <el-button @click="dialogVisibleYun = false">取 消</el-button>
          </span>
        </el-dialog>

        <!-- 底部 -->
        <div class="tke-formpanel-footer">
          <el-button size="small" type="primary">创建Workload</el-button>
          <el-button size="small">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FileSaver from "file-saver";
  import XLSX from "xlsx";
  import {
    ALL_CITY
  } from "@/constants";
  export default {
    name: "workloadCreate",
    data() {
      return {
        wl: {
          name: "",
          desc: "",
          type: ""
        },
        dataFlag: false,
        yesOrnoAddDataJuan: false,
        input: "",
        setIndex: "",
        searchOptions: [{
            value: "useMenu",
            label: "使用临时目录"
          },
          {
            value: "usePath",
            label: "使用主机路径"
          },
          {
            value: "useNFS",
            label: "使用NFS盘"
          },
          {
            value: "usePVC",
            label: "使用已有PVC"
          },
          {
            value: "useYun",
            label: "使用腾讯云硬盘"
          },
          {
            value: "useConfig",
            label: "使用ConfigMap"
          },
          {
            value: "useSecret",
            label: "使用Secret"
          }
        ],
        value: "",
        dataJuan: [],
        usePvcOptions: [],
        checkTypeOptions: [],
        dialogVisiblePath: false,
        dialogVisibleYun: false,
      };
    },
    components: {},
    watch: {
      dataJuan: {
        handler(val) {
          val.forEach(item => {
            if (item.name1 == "useMenu" && item.name2) {
              this.yesOrnoAddDataJuan = false;
            } else if (item.name1 && item.name2 && item.name3) {
              this.yesOrnoAddDataJuan = false;
            } else {
              this.yesOrnoAddDataJuan = true;
            }
          });
        },
        deep: true
      }
    },
    created() {
      // 从路由获取类型
      this.wl.type = this.$route.query.type;
    },
    methods: {
      //返回上一层
      goBack() {
        this.$router.go(-1);
      },
      addDataJuan() {
        this.dataFlag = true;
        var obj = {
          name1: "",
          name2: "",
          name3: ""
        };
        this.dataJuan.push(obj);
      },
      delDataJuan(index) {
        this.dataJuan.splice(index, 1);
      },
      //选择云硬盘
      selectYun() {
        this.dialogVisibleYun = true;
      }
    }
  };

</script>

<style lang="scss" scoped>
  .tke-radio-group {
    .el-radio {
      display: block;
    }

    .el-radio+.el-radio {
      margin-left: 0;
      margin-top: 10px;
    }
  }

  .w192 {
    width: 192px;
  }

  .search-one {
    display: flex;
    align-items: center;
    width: 80%;
    background: #f2f2f2;
    height: 50px;
    box-sizing: border-box;
    padding: 0px 20px;

    .search-input {
      width: 210px;
      margin-left: 10px;
    }

    .search-hidden {
      flex: 1;
      margin-left: 10px;
    }

    .el-icon-close {
      font-size: 18px;
      cursor: pointer;
    }

    .add-check {
      color: #409eff;
      cursor: pointer;
      margin-left: 10px;
    }

    .cancle-addjuan {
      // cursor: not-allowed;
      cursor: no-drop;
      color: #888;
    }

    // .search-input>>>input{
    //   width: 200px;
    //   margin-left: 10px;
    // }
  }

</style>
