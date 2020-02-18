<template>
  <div class="appidfirst"  v-loading='loading'>
    <div class="appidWrap">
      <div class="bntWrap">
        <!-- 操作按钮 -->
        <el-button type="primary" class="addUser" size="small" @click="addBuild">{{$t('CAP.xjyz')}}</el-button>
      </div>
      <div class="tableWrap">
        <div class="table">
          <!-- 表格 -->
          <template>
            <el-table :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" style="width: 100%;" height="450px">
              <el-table-column prop="AppName" :label="$t('CAP.mc')"></el-table-column>
              <el-table-column :label="$t('CAP.zreyzb')">-</el-table-column>
              <el-table-column :label="$t('CAP.zrqqsl')">-</el-table-column>
              <el-table-column :label="$t('CAP.zryzl')">-</el-table-column>
              <el-table-column :label="$t('CAP.zreyljl')">-</el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-link @click="detailsAppid(scope.row)" type="primary" class="cursor">{{$t('CAP.ckxq')}}</el-link>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <!-- 分页 -->
          <div class="Right-style pagstyle" style="height:70px;">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;条</span>
            <el-pagination :page-size="pagesize" :pager-count="7" layout="prev, pager, next"  @current-change="handleCurrentChange" :total="TotalCount"></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 新建验证 -->
    <el-dialog
      :title="$t('CAP.xjyz')"
      :visible.sync="dialogVisibleBuild"
      width="30%"
      :before-close="handleCloseBuild"
    >
      <span>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item :label="$t('CAP.yzmc')">
            <el-input v-model="form.name" style="width:50%;" :placeholder="$t('CAP.xcxyz')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('CAP.yzssym')" label-width="100px">
            <el-input v-model="form.domain" style="width:50%" placeholder="如(example.com)"></el-input>
          </el-form-item>
          <el-form-item :label="$t('CAP.yzcj')" label-width="100px">
            <el-select v-model="form.region" :placeholder="$t('CAP.qxzndyzcj')" style="width:50%">
              <el-option :label="$t('CAP.dlcj')" value="1"></el-option>
              <el-option :label="$t('CAP.dxcj')" value="2"></el-option>
              <el-option :label="$t('CAP.hdxj')" value="3"></el-option>
              <el-option :label="$t('CAP.qtcj')" value="4"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleBuild = false">取 消</el-button>
        <el-button type="primary" @click="createAppid">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import { ADD_LIST,CREATE_APPID } from "@/constants/CAP.js";
export default {
  data() {
    return {
      loading:true,
      //分页
      TotalCount: 0,
      pagesize: 10,
      currpage: 1,
      dialogVisibleBuild: false, //新建弹框
      tableData: [],//表格数据
      form: {
         name:'',
         domain:'',
         region:''
      }
    };
  },
  created() {
    this.addList();
  },
  methods: {
    //获取addip列表数据
    addList() {
      let params = {
        Version: "2019-07-22"
      };
      this.axios.post(ADD_LIST, params).then(res => {
        if(res.Response.Error === undefined){
          if(res != ""){
                this.loading = false
                this.tableData = res.Response.Data;
                this.TotalCount = res.Response.Data.length
          }else{
            this.loading = false
              this.$message({
                type: "info",
                message: "无响应数据！"
              });
          }
        }else{
           let ErrTips = {
             "InternalError":'内部错误',
             "MissingParameter":'缺少参数错误',
             "UnauthorizedOperation.ErrAuth":'鉴权失败',
             "UnauthorizedOperation.Unauthorized":'未开通权限'
          };
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
    //点击按钮添加验证码
    createAppid(){
       if(this.form.name == "" || this.form.domain == "" || this.form.region == ""){
           this.$message({
              type: "error",
              message: "數據請填寫完整!"
          });
       }else{
         let params = {
           Version:'2019-07-22',
           AppName:this.form.name,
           Domain:this.form.domain,
           SceneType:this.form.region
        }
        this.axios.post(CREATE_APPID,params).then(res=>{
          if(res.Response.Error === undefined){
            if (res.Response.CaptchaCode === -1) {
              // 超过上限  腾讯云静默失败
            } else {
              this.$message({
                  type: "success",
                  message: "添加成功!"
              });
              this.addList()
            }
          }else{
            let ErrTips = {
               "InternalError":'内部错误',
               "MissingParameter":'缺少参数错误',
               "UnauthorizedOperation.ErrAuth":'鉴权失败',
               "UnauthorizedOperation.Unauthorized":'未开通权限'
            };
            let ErrOr = Object.assign(ErrorTips, ErrTips);
            this.$message({
              message: ErrOr[res.Response.Error.Code],
              type: "error",
              showClose: true,
              duration: 0
            });
          }
      })
       this.dialogVisibleBuild = false;
     }
    },
    //跳转详情页
    detailsAppid(item){
      var Id = item.CaptchaAppId
      this.$router.push({
        path: "/appIdDetail",
        query:{
          Id:Id
        }
      });
    },
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
    },
    //点击新建验证
    addBuild() {
      this.dialogVisibleBuild = true;
    },
    //点击关闭新建验证弹框
    handleCloseBuild() {
      this.dialogVisibleBuild = false;
    },
  }
};
</script>
<style scoped lang="scss">
.appidWrap >>> .el-button {
  border-radius: 0;
  background-color: #006eff;
  color: #fff;
  border: 1px solid #006eff;
}
.cursor{
  cursor: pointer;
}
.appidWrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  .bntWrap {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    .bnt {
      height: 32px;
      padding: 0 20px;
      text-align: center;
      display: inline-block;
      cursor: pointer;
      outline: 0;
      box-sizing: border-box;
      text-decoration: none;
      margin-left: 33px;
      border-radius: 0;
    }
  }
  .tableWrap {
    // flex: 1;
    padding-left: 20px;
    padding-right: 20px;
    .table {
      width: 100%;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
         .Right-style {
      display: flex;
      justify-content: flex-end;
      background: white;
      align-items: center;
      .pagstyle {
        // display: flex;
        padding: 20px;
        .pagtotal {
          font-size: 13px;
          font-weight: 400;
          color: #565656;
          line-height: 32px;
        }
      }
    }
    }
 
  }
}
</style>
