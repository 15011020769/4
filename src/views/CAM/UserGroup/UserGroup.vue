<template>
  <div class="Cam">
    <div class="top">
      <span class="title-left">用户列表</span>
      <span class="title-right">
        <span>CAM用户组使用说明</span>
        <i class="el-icon-share"></i>
      </span>
    </div>
    <div class="cam_button">
      <!-- <template>
        <el-button type="text" @click="open" class="btn-fr"><i class="el-icon-setting"></i></el-button> 
      </template> -->
      <el-row class="cam-lt">
        <el-button type="primary"  @click="NewUsergroup" >新建用户组</el-button>
        <el-button disabled>添加用户</el-button>
      </el-row>

     <!-- 自定义弹框 -->
      <el-dialog title="自定义列表字段" :visible.sync="dialogVisible" width="540px" :before-close="handleClose">
        <div class="tip_box">
        <span id="limitTip">请选择您想显示的列表详细信息</span></div>
        <div>
          <ul>
              <li><el-checkbox label="用户组名称" disabled></el-checkbox></li>
              <li><el-checkbox v-model="checked">备注</el-checkbox></li>
              <li><el-checkbox v-model="checkedtime">创建时间</el-checkbox></li>
              <li><el-checkbox label="操作" disabled></el-checkbox></li>
          </ul>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = falsechecked01;checked01=checked;checkedtime01=checkedtime">确 定</el-button>
        </span>
      </el-dialog>

      <div class="head-container">
        <!-- 搜索 -->
        <el-input v-model="value" clearable placeholder="支持搜索用户组名称/备注" style="width: 200px;"  @keyup.enter.native="toQuery"/>
        <el-button class="suo" icon="el-icon-search" circle></el-button>
        <el-button icon="el-icon-s-tools" @click="dialogVisible = true"></el-button>
        <el-button icon="el-icon-download" @click="download = true"></el-button>
      </div>
      
    </div>
    <!-- 表格 -->
    <div class="cam-box">
        <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%; border:1px solid #ddd;padding-top: 8px;" 
    @selection-change="handleSelectionChange">
    <el-table-column  v-model="checkeds"
      type="selection">
    </el-table-column>
    <el-table-column
     prop="groupName"
      label="用户组名称">
      <template></template>
    </el-table-column>
    <el-table-column
      prop="remark"  v-if="checked01"
      label="备注">
    </el-table-column>
    <el-table-column
      prop="createTime" v-if="checkedtime01"
      label="日期"
      show-overflow-tooltip>
    </el-table-column>
    <el-table-column
        prop="oper"
        label="操作">
        <template scope="scope">
          <el-button type="text">添加用户</el-button>
          <el-button @click="open" type="text">删除</el-button>
        </template>
      </el-table-column>

  </el-table>
  <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNum">
      </el-pagination>
    </div>
    </div>
    
    
  </div>
</template>
<script>
  export default {
    data() {
      return {
        dialogVisible: false,
        checked: true,
        checkedtime:true,
        checked01:false,
        checkedtime01:false,
        download:false,
        checkeds:false,
        tableData: [{}],
        totalNum:"0"
      }
  },
    created () {
    this.getData()
//     this.formArr.push(this.formInfoObj)
  },
  methods: {
    getData () {
        var params = {
          Version: "2019-01-16"
        }
        this.$axios.post("cam/ListGroups", params).then(res => {
          console.log(res.data.groupInfo);
          console.log(res);
          console.log("OK!");
          this.tableData= res.data.groupInfo;
          this.totalNum=res.data.totalNum;
        })
    },
      open() {
        this.$confirm('删除该组将不会删除组内的用户，但组内用户将无法接收到该组的短信、邮件通知', '删除分组', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    }
  }
</script>
<style lang="scss" scoped>
  .Cam {
    .top {
      height: 45px;
      line-height: 45px;
      margin-bottom: 20px;
      padding: 0 20px;
      background: #fff;
      .title-left {
        font-size: 14px;
        font-weight: bolder;
      }
      .title-right {
        float: right;
        span:hover {
          color: #006eff;
          border-bottom: 1px solid #006eff;
        }
      }
    }
    .content {
      padding: 20px;
      .operation {
        margin-bottom: 10px;
      }
      .search {
        overflow: hidden;
        padding: 10px 0;
        .search-left {
          float: left;
          .searchBox {
            display: inline-block;
          }
        }
        .search-right {
          float: right;
          margin-top: 10px;
          :hover {
            cursor: pointer;
          }
          i {
            padding: 0 3px;
          }
        }
      }
      .cam-pag {
        padding: 10px 0;
        display: flex;
        justify-content: flex-end;
      }
    }

    .cam_button{
      width: 96%;
      height: 40px;
      margin: 10px auto;
    }
    .cam-lt{
      float: left;
    }
    .head-container{
      float: right;
    }
    .cam_button{
      position: relative;
    }
    .suo{
      position: absolute;
      right: 133px;
    }
    .cam-box{
      width: 96%;
      padding: 20px;
      background-color: #fff;
      margin: 0 auto;
    }
    .block{
      text-align: right;
      padding-top: 10px;
    }
    .btn-fr{
      float: right;
    }
  }
</style>
