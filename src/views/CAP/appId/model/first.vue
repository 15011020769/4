<template>
  <div class="appidfirst">
    <div class="appidWrap">
      <div class="bntWrap">
        <!-- 操作按钮 -->
        <el-button type="primary" class="addUser" size="small" @click="addBuild">新建验证</el-button>
        <el-button size="small" @click="addUp">导入原有验证</el-button>
      </div>
      <div class="tableWrap">
        <div class="table">
          <!-- 表格 -->
          <template>
            <el-table :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" style="width: 100%;" height="450px">
              <el-table-column prop="AppName" label="名称"></el-table-column>
              <el-table-column label="昨日恶意占比">-</el-table-column>
              <el-table-column label="昨日请求数量">-</el-table-column>
              <el-table-column label="昨日验证量">-</el-table-column>
              <el-table-column label="昨日恶意拦截量">-</el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                    <span style="color: #006eff; cursor: pointer;">查看详情</span>
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
      title="新建验证"
      :visible.sync="dialogVisibleBuild"
      width="30%"
      :before-close="handleCloseBuild"
    >
      <span>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="验证名称">
            <el-input v-model="form.name" style="width:50%;" placeholder="如(小程序短信验证)"></el-input>
          </el-form-item>
          <el-form-item label="验证所属域名" label-width="100px">
            <el-input v-model="form.name" style="width:50%" placeholder="如(example.com)"></el-input>
          </el-form-item>
          <el-form-item label="验证场景" label-width="100px">
            <el-select v-model="form.region" placeholder="请选择您的验证场景" style="width:50%">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleBuild = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleBuild = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 导入原有验证弹框 -->
    <el-dialog
      title="导入原有的验证场景"
      :visible.sync="dialogVisibleAdd"
      width="30%"
      :before-close="handleCloseAdd"
    >
      <span>
        <el-form ref="form" :model="form" label-width="180px">
          <el-form-item label="验证场景APPID (必填)">
            <el-input v-model="form.name" style="width:70%;" placeholder="原有验证场景的APPID"></el-input>
          </el-form-item>
          <el-form-item label="验证场景SecretKey (必填)" label-width="180px">
            <el-input v-model="form.name" style="width:70%" placeholder="原有验证场景SecretKey"></el-input>
          </el-form-item>
          <el-form-item label="007账号关联UIN (选填)" label-width="180px">
            <el-input v-model="form.name" style="width:70%" placeholder="007账号关联UIN"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisibleAdd = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { ADD_LIST } from "@/constants/CAP.js";
export default {
  data() {
    return {
      //分页
      TotalCount: 0,
      pagesize: 10,
      currpage: 1,
      dialogVisibleBuild: false, //新建弹框
      dialogVisibleAdd: false, //导入原有验证弹框
      tableData: [],//表格数据
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
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
        this.tableData = res.Response.Data;
        this.TotalCount = res.Response.Data.length
        console.log(res)
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
    //导入原有验证弹框
    addUp() {
      this.dialogVisibleAdd = true;
    },
    //点击关闭导入原有验证弹框
    handleCloseAdd() {
      this.dialogVisibleAdd = false;
    }
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
    flex: 1;
    padding-left: 20px;
    padding-right: 20px;
    .table {
      width: 100%;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    }
    .Right-style {
      display: flex;
      justify-content: flex-end;
      background: white;
      align-items: center;
      .pagstyle {
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
</style>
