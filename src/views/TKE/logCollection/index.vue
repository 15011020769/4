<template>
  <div class="logCollection-wrap">
    <!-- 头部 -->
    <div class="back-hd flex">
      <h2 style="padding-top:3px;">{{$t('TKE.overview.rzcj')}}</h2>
      <div style="width:20px"></div>
      <div style="padding-top:6px;">地域</div>
      &nbsp;<el-button type="primary" class="init hd-button" style="margin-top:2px;">{{$t('TKE.overview.zgtb')}}</el-button>
      <div style="width:20px"></div>
      <div style="padding-top:6px;">集群</div>
      &nbsp;
      <el-select size="mini" v-model="value" :placeholder="$t('TKE.overview.qxz')" style="margin-bottom:5px;">
        <el-option v-for="item in options" :key="item.value" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="app-tke-fe-content__inner">
      <!-- 搜索框与新建，删除 -->
      <div class="flex">
        <div class="font" style="flex:1;padding-top:20px;">
          <!-- <router-link :to="{path:'/logCreate',query:{clusterId:value}}"> -->
          <button class="data-card-hd" v-if="!xjF"   @click="newCread">新建</button>
          <button class="data-card-hd" v-if="xjF" @click="dialogVisible = true">新建</button>
          <!-- </router-link> -->
        </div>
        <div style="position: relative;" class="flex">
          <div class="font" style="margin-top:29px;margin-right:10px;">{{$t('TKE.overview.mmkj')}}</div>
          <el-select size="small" v-model="Name.value" :placeholder="$t('TKE.overview.qxzmmkj')" style="margin-top:19px;">
            <el-option v-for="item in Name.options" :key="item" :value="item">
            </el-option>
          </el-select>
          <input type="search" :placeholder="$t('TKE.overview.qsrjqmc')" @keyup.enter='conSearch' :disabled="Name.value=='請選擇Namespace'"
            class="search" v-model='search'>
          <button class="el-icon-search ip-btn" @click="conSearch"></button>
        </div>
          <i class="el-icon-download" @click="exportExcel()"></i>
      </div>
      <!-- 内容 -->
      <el-table   id="exportTable" :data="tableData" style="width: 100%" v-loading="tableFlag"  :empty-text="$t('TKE.overview.zwsj')">
        <el-table-column :label="$t('TKE.overview.mc')" width="180">
           <template slot-scope="scope">
            <a @click='goLogDetail(scope.row)'>{{scope.row.metadata.name}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('TKE.overview.zt')" width="180">
          <span style="color:#0abf5b;">Running</span>
        </el-table-column>
        <el-table-column :label="$t('TKE.overview.lx')">
          <template slot-scope="scope">
            <span v-if="scope.row.spec.input.type=='host-log'">{{$t('TKE.overview.zdzjwj')}}</span>
            <span v-if="scope.row.spec.input.type=='container-log'">{{$t('TKE.overview.rqbzsc')}}</span>
            <span v-if="scope.row.spec.input.type=='pod-log'">指定容器文件</span>
          </template>
        </el-table-column>
        <el-table-column prop="metadata.namespace" :label="$t('TKE.overview.mmkj')" width="180">
        </el-table-column>
        <el-table-column :label="$t('TKE.overview.cjsj')" width="180">
          <template slot-scope="scope">
            <span>{{timeFormat(scope.row.metadata.creationTimestamp)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="editLogCollection(scope.row)" type="text" size="small">{{$t('TKE.overview.bjgz')}}</el-button>
            <el-button type="text" size="small" @click="delLog(scope.row)">{{$t('TKE.overview.sc')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 删除日志收集规则框 -->
    <div>
      <el-dialog :visible.sync="delLogFlag" width="550px" center>
        <div slot="title">
          {{$t('TKE.overview.scrz')}}
        </div>
        <p>{{$t('TKE.overview.qdscrz')}}"{{delLogName}}"嗎？</p>
        <p>{{$t('TKE.overview.schbyx')}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sureDel">{{$t('TKE.overview.qd')}}</el-button>
          <el-button @click="delLogFlag = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  <!-- 新建弹框 -->
    <el-dialog
  :title="$t('TKE.overview.jqrzcj')"
  :visible.sync="dialogVisible"
  width="40%"
  center
  :before-close="handleClose">
  <div>
    <p>{{$t('TKE.overview.xjrzsjgz')}}</p>
    <p>{{$t('TKE.overview.ktrzsj')}}</p>
    <p>{{$t('TKE.overview.cjrzcjfw')}}</p>
    <p>{{$t('TKE.overview.wjdyl')}} <span style="color:#ff9d00">0.3核 250M</span> {{$t('TKE.overview.yskyzy')}}</p>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="newCread2">{{$t('TKE.overview.qd')}}</el-button>
    <el-button @click="dialogVisible = false">取 消</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
  import {
    CreateListGroups,
    WARNING_GetCOLONY,
    TKE_COLONY_LIST,
    TKE_COLONY_QUERY
  } from "@/constants";
  import XLSX from "xlsx";
  import FileSaver from "file-saver";
  export default {
    name: 'logCollection',
    data() {
      return {
        tableData: [],
        xjF:false,
        funllscreenLoading: false,
        dialogVisible:false,
        tableFlag:true,
        delLogFlag: false,
        delLogName: '',
        delLogNameSpace: '',
        options: [],
        search: '',
        value: '',//集群名
        value2: '',
        Name: {
          value: '請選擇Namespace',
          options: ['請選擇Namespace']
        }
      }
    },
    created() {
      // 获取集群列表
      this.getWarningList();
      //获取命名空间列表
      this.nameSpaceList();
      //获取日志列表
      this.findList();


    },
    watch: {
      value(val) {
        this.funllscreenLoading = true;
        this.Name.value = '請選擇Namespace'
        let params = {
          ClusterInstanceId: (val.split('('))[0],
          Limit: this.pageSize,
          Offset: this.pageIndex,
          Version: "2018-05-25"
        }
        this.value2 = (val.split('('))[0];
        this.findList();
        this.Name.options = ['請選擇Namespace'];
        this.nameSpaceList();
        const res = this.axios.post(WARNING_GetCOLONY, params).then(res => {
          console.log(res)
          if(res){
            if (res.Response.AlarmPolicySet) {
              let resData = res.Response.AlarmPolicySet;
              this.length = resData.length;
              this.listData = resData;
              for (let i = 0; i < resData.length; i++) {
                let getData = {
                  AlarmPolicyName: '',
                  AlarmPolicyType: ''
                };
                getData.name = resData.AlarmPolicySettings
              }
              this.funllscreenLoading = false;
            } else {
              this.funllscreenLoading = false;
            }
          }
        });
      },
      Name: {
        handler(val) {
          if (this.value2 && val.value != '請選擇Namespace') {
            var params = {
              ClusterName: this.value2,
              Method: "GET",
              Path: "/apis/platform.tke/v1/clusters/" + this.value2 + "/logcollector?namespace=" + val.value,
              Version: "2018-05-25",
            };
            this.axios.post(TKE_COLONY_QUERY, params).then(res => {
              if (res.Response.Error === undefined) {
                var data = JSON.parse(res.Response.ResponseBody);
                if (data.items) {
                  this.tableData = data.items;
                }

              } else {
                this.tableData = [];
              }
            })


          }

        },
        deep: true
      }
    },
    methods: {
      // 获取集群列表
      async getWarningList() {
        let params = {
          Version: "2018-05-25",
          Region: this.$cookie.get('regionv2'),
        }
        const res = await this.axios.post(TKE_COLONY_LIST, params);
        if (res.Response.Error === undefined) {
          if (res.Response.Clusters.length > 0) {
            let ids = [],arr=[];
            res.Response.Clusters = res.Response.Clusters.map(item => {
              ids.push(item.ClusterId + '(' + item.ClusterName + ')');
              arr.push(item.ClusterId);
              return item;
            })
            if (sessionStorage.getItem('clusterId')){
              if(arr.indexOf(sessionStorage.getItem('clusterId').split('(')[0])==-1){
                sessionStorage.setItem('clusterId','')
              }
            }

            // 放到页面上
            for (let i = 0; i < ids.length; i++) {
              let option = {}
              option.value = ids[i]
              this.options.push(option)
              if (sessionStorage.getItem('clusterId')) {
                this.value = sessionStorage.getItem('clusterId');
              } else {
                this.value = this.options[0].value
              }
            }
            this.value2 = this.value.split('(')[0]
          }
        } else {
          let ErrTips = {
            "InternalError": '內部錯誤',
            "InternalError.CamNoAuth": '沒有權限',
            "InternalError.Db": 'db錯誤',
            "InternalError.DbAffectivedRows": 'DB錯誤',
            "InternalError.Param": 'Param',
            "InternalError.PublicClusterOpNotSupport": '集群不支持當前操作',
            "InternalError.QuotaMaxClsLimit": '超過配額限制',
            "InternalError.QuotaMaxNodLimit": '超過配額限制',
            "InvalidParameter": '參數錯誤',
            "InvalidParameter.Param": '參數錯誤',
            "LimitExceeded": '超過配額限制',
            "ResourceNotFound": '資源不存在',
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      },
      //详情页面
      goLogDetail(row){
         var stashName=row.metadata.name;
        var namespace=row.metadata.namespace;
         var type=row.spec.input.type
        this.$router.push({
          path: '/logDetail',
          query: {
            clusterId: this.value,
            stashName:stashName,
            namespace:namespace,
            type:type
          }
        })
      },
      //新建
      newCread() {
        this.$router.push({
          path: '/logCreate',
          query: {
            clusterId: this.value
          }
        })
        sessionStorage.setItem('clusterId', this.value)
      },
      //新建2
      newCread2() {
        this.dialogVisible=false;
        var params={
          ClusterName: this.value2,
          Method: "POST",
          Path: "/apis/platform.tke/v1/logcollectors",
          RequestBody:
              {"kind":"LogCollector","apiVersion":"platform.tke/v1",
              "metadata":{"name":this.value2},
              "spec":{"clusterName":this.value2}},
          Version: "2018-05-25",
        }
        console.log(params)
         this.axios.post(TKE_COLONY_QUERY, params).then(res=>{
           console.log(res)
            if (res.Response.Error === undefined){
                this.$router.push({
                path: '/logCreate',
                  query: {
                   clusterId: this.value2
                 }
                 })
             sessionStorage.setItem('clusterId', this.value2)
            }else{
               let ErrTips = { };
              let ErrOr = Object.assign(this.$ErrorTips, ErrTips);
              this.$message({
                message: ErrOr[res.Response.Error.Code],
                type: "error",
                showClose: true,
                duration: 0
              });
            }
         })
      },
       handleClose(done) {
        this.$confirm('確認關閉？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      //编辑
      editLogCollection(row){
        console.log(row)
        var stashName=row.metadata.name;
        var namespace=row.metadata.namespace;
        var type=row.spec.input.type
           this.$router.push({
          path: '/logCreate',
          query: {
            clusterId: this.value,
            stashName:stashName,
            namespace:namespace,
            type:type
          }
        })
      },
      //命名空间选项 
      nameSpaceList() {
        if (this.value2) {
          var params = {
            ClusterName: this.value2,
            Method: "GET",
            Path: "/api/v1/namespaces",
            Version: "2018-05-25",
          };
          this.axios.post(TKE_COLONY_QUERY, params).then(res => {
            console.log(res)
            if (res.Response.Error==undefined) {
              var data = JSON.parse(res.Response.ResponseBody);
              data.items.forEach(item => {
                this.Name.options.push(item.metadata.name)
              })
            }
          })
        }
      },
      //搜索框搜索
      conSearch() {
        if (this.value2) {
          var params = {
            ClusterName: this.value2,
            Method: "GET",
            Path: "/apis/platform.tke/v1/clusters/" + this.value2 + "/logcollector?namespace=" + this.Name.value +
              "&name=" + this.search,
            Version: "2018-05-25",
          };
          this.axios.post(TKE_COLONY_QUERY, params).then(res => {
            if (res.Response.Error === undefined) {
              var data = JSON.parse(res.Response.ResponseBody);
              if (data.items) {
                this.tableData = data.items;
              } else {
                this.tableData = [data];
              }
            } else {
              this.tableData = [];
            }
          })

        }
      },
      //删除日志
      delLog(item) {
        console.log(item)
        this.delLogFlag = true;
        this.delLogName = item.metadata.name;
        this.delLogNameSpace = item.metadata.namespace
      },
      //确认删除
      sureDel() {
        this.delLogFlag = false;

        var params = {
          ClusterName: this.value2,
          Method: "DELETE",
          Path: "/apis/platform.tke/v1/clusters/" + this.value2 + "/logcollector?namespace=" + this.delLogNameSpace +
            "&name=" + this.delLogName,
          Version: "2018-05-25",
        }
        this.axios.post(TKE_COLONY_QUERY, params).then(res => {

          console.log(res)
          if (res.Response.Error === undefined) {
            this.xjF=false;
            this.$message({
              message: '刪除成功',
              type: "success",
               duration: 0,
              showClose: true
            });
            this.findList()
          }
        })
      },
       //导出表格
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      console.log(wb)
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: "application/octet-stream"
          }),
          'ccs'+ ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
      timeFormat(times) {
        var d = new Date(times);
        var n = d.getFullYear();
        var y = d.getMonth() + 1;
        var r = d.getDate();
        var h = d.getHours(); //12
        var m = d.getMinutes(); //12
        var s = d.getSeconds();
        h < 10 ? h = "0" + h : h;
        m < 10 ? m = "0" + m : m

        return n + '-' + y + '-' + r + ' ' + h + ':' + m + ':' + s
      },
      //列表数据
      findList() {
        if (this.value2) {
          var params = {
            ClusterName: this.value2,
            Method: "GET",
            Path: "/apis/platform.tke/v1/clusters/" + this.value2 + "/logcollector?namespace=",
            Version: "2018-05-25",
          };
          this.axios.post(TKE_COLONY_QUERY, params).then(res => {
            if (res.Response.Error == undefined) {
              this.xjF=false;
              this.tableFlag=false;
              var data = JSON.parse(res.Response.ResponseBody);
              this.tableData = data.items;
            }else if(res.Response.Error.Code=='ResourceNotFound'){
              console.log(res.Response.Error)
              this.xjF=true;
              this.tableFlag=false;
              this.tableData=[]
              // this.$message({
              // message:res.Response.Error.Message,
              // type: "error",
              // });
            }else{
              this.tableFlag=true;
              this.xjF=false;
              this.tableData=[]
            }
          })

        }
      }

    }
  }

</script>

<style lang="scss" scoped>
  .pt20 {
    padding-top: 20px;
  }

  .pt12 {
    padding-top: 12px;
  }

  .pt6 {
    padding-top: 6px;
  }

  .app-tke-fe-checkbox {
    width: 16px;
    height: 16px;
    cursor: pointer;
    vertical-align: middle;
    outline: none;
    -webkit-appearance: none;
    border: 1px solid #bbb;
    background-color: #fff;
    margin: 0 10px 0 10px;
  }

  .ep-data-card-main {
    padding: 20px 0 20px 0;
    border-bottom: 1px solid #cccccc;
  }

  .data-card-hd {
    height: 30px;
    min-width: 24px;
    padding: 0 20px;
    background-color: #006eff;
    color: #fff;
    border: 1px solid #006eff;
    line-height: 30px;
    text-align: center;
    display: inline-block;
    cursor: pointer;
    outline: 0 none;
    box-sizing: border-box;
    text-decoration: none;
    font-size: 12px;
    vertical-align: middle;
    white-space: nowrap;
  }

  .data-card-hd-del {
    border-color: #ddd;
    background-color: #fff;
    color: #bbb;
    cursor: not-allowed;
  }

  .init {
    padding: 0;
    margin: 0;
  }

  .hd-button {
    width: 80px;
    height: 22px;
  }

  .back-hd {
    width: 100%;
    height: 51px;
    background: white;
    padding: 12px 15px 15px 15px;
    border-bottom: 1px solid #cccccc;
    font-size: 12px;
  }

  .flex {
    display: flex;
  }

  .event-persistence {
    padding: 20px 20px 20px 20px;
    background: white;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .1);
  }

  .app-tke-fe-content__inner {
    max-width: 1360px;
    margin: 0 auto;
    font-size: 0;
    margin-bottom: 50px;
    padding: 20px;
  }
  a{
    cursor:pointer;
  }
  .search {
    width: 200px;
    height: 30px;
    margin: 20px 0 10px 10px;
    font-size: 12px;
    padding-left: 5px;
    border: 1px solid #cccccc;
  }

  .ip-btn {
    font-size: 12px;
    width: 30px;
    height: 30px;
    background: none;
    border: none;
    position: absolute;
    z-index: 1;
    top: 20px;
    right: 0px;
  }

  .font {
    font-size: 12px;
  }
  .el-icon-download{
    font-size:20px;
    margin-left: 5px;
    margin-top: 22px;
    margin-right:10px;
    cursor:pointer;
  }

  .hide {
    display: none;
  }

  .show {
    display: block;
  }

</style>
