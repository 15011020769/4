<template>
  <div class="Cam">
    <div class="top">
      <span class="title-left">用户列表</span>
      <span class="title-right">
        <span>CAM用户使用说明</span>
        <i class="el-icon-share"></i>
      </span>
    </div>
    <div class="explain">
      <p>
        <span>如何查看更多信息？</span>
      </p >
      <p>
        <span>&nbsp;&nbsp;访问管理对您的敏感信息进行安全升级保护，您可以点击列表中【详情】列下拉按钮【?】查看用户的身份安全状态、已加入组以及消息订阅等更多信息。您也可以点击用户名进入用户详细信息中</span>
      </p >
      <p>
        <span>&nbsp;&nbsp;&nbsp;查看或编辑。</span>
      </p >
    </div>

    <div class="cam_button">
      <el-row class="cam-lt">
        <el-button type="primary"  @click="NewUser" >新建用户</el-button>
        <template>
          <el-select class="el_select" v-model="value" placeholder="更多操作">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </template>
      </el-row>

      <!-- 自定义弹框 -->
      <el-dialog title="自定义列表字段" :visible.sync="dialogVisible" width="540px" :before-close="handleClose">
        <div class="tip_box">   请选择您想显示的列表详细信息，根据您的分辨率
        <span id="limitTip">，最多勾选6个字段，已勾选5个。</span></div>
        <div>
          <ul>
              <li><el-checkbox label="详情" disabled></el-checkbox></li>
              <li><el-checkbox label="用户名称" disabled></el-checkbox></li>
              <li><el-checkbox label="用户类型" disabled></el-checkbox></li>
              <li><el-checkbox v-model="checked">账户ID</el-checkbox></li>
              <li><el-checkbox label="关联信息" disabled></el-checkbox></li>
              <li><el-checkbox label="操作" disabled></el-checkbox></li>
          </ul>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false;checked02 = checked">确 定</el-button>
        </span>
      </el-dialog>

      <div class="head-container">
        <!-- 搜索 -->
        <el-input  v-model="value" clearable placeholder="支持多关键词(间隔为空格)搜索用户名/ID/SecretId/手机/邮箱/备注" style="width: 200px;"  @keyup.enter.native="toQuery"/>
        <el-button class="suo" icon="el-icon-search" circle></el-button>
        <el-button icon="el-icon-s-tools" @click="dialogVisible = true"></el-button>
      </div>
    </div>
        <!-- 用户操作授权自定义弹框 -->
      <el-dialog title="关联策略" :visible.sync="authorization" width="540px" :before-close="handleClose">
        <div class=""> 
       <template>
         <el-transfer filterable  :filter-method="filterMethod"  filter-placeholder="请输入城市拼音"  v-model="value" :data="data">
       </el-transfer>
      </template>
   </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="authorization = false">取 消</el-button>
          <el-button type="primary" @click="authorization = false">确 定</el-button>
        </span>
      </el-dialog>

    <!-- 表格 -->
    <el-table
      :data="tableData"
      style="width: 96%; margin: 0 auto;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="expand" label="详情" width="50">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户组">
              <span>{{ name }}</span>
            </el-form-item>
            <el-form-item label="登录保护  ">
              <span>{{"未开启保护"}}</span>
            </el-form-item>
                <el-form-item label="消息订阅">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="操作保护	">
              <span>{{"未开启保护"}}</span>
            </el-form-item>
             <el-form-item label="备注">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="MFA设备">
              <span>{{ "未绑定 MFA 设备" }}</span>
            </el-form-item>
            <!-- <el-form-item label="控制台访问">
              <span>{{ "启用"}}</span>
            </el-form-item> -->
          </el-form>
        </template>
      </el-table-column>

      <el-table-column
        label="用户名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="用户类型"
        prop="uin">
      </el-table-column>

      <el-table-column class="text-overflow" v-if="checked02"
        label="账号ID"
        prop="uid">
      </el-table-column>

      <el-table-column
        label="关联信息">
       <template>
          <el-button type="text" icon="el-icon-mobile" @click="NewUser"></el-button>
          <el-button type="text" icon="el-icon-message" @click="NewUser"></el-button>
        </template>
       </el-table-column>

      <el-table-column
        prop="oper"
        label="操作" width="140">
        <template scope="">
          <el-button type="text" @click="authorization = true">授权</el-button>
          <span>|</span>
          <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link" style="color: #3E8EF7">
          更多<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>添加到组</el-dropdown-item>
              <el-dropdown-item>订阅信息</el-dropdown-item>
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
        :total="40">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        dialogVisible: false,
         checked: true,
         checked02: false,
         authorization:false,
        tableData: [{}],
      options: [{
        value: '选项1',
        label: '添加到组',
        disabled: true
      }, {
        value: '选项2',
        label: '删除',
        disabled: true
      }],
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
          // Region: "ap-taipei"
        }
        this.$axios.post("cam/ListUsers", params).then(res => {
          console.log(res.data);
          console.log("OK!");
          this.tableData= res.data;
  //      this.total = res.Response.TotalCount;
        })
    },
      NewUser() {
        this.$router.push({name: 'NewUser'})
      },
      // handleClose(done) {
      //   this.$confirm('确认关闭？')
      //     .then(_ => {
      //       done();
      //     })
      //     .catch(_ => {});
      // },
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
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
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
  .tc-15-search .tc-15-btn.search {
    position: absolute;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: 28px !important;
    right: 1px;
    border: none;
    height: 28px;
    top: 1px;
    z-index: 99;
  }
  .explain{
    width: 96%;
   font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
  }
  .explain p{
    line-height: 1.5;
    margin-bottom: 8px;
  }
  .cam_button{
    width: 96%;
    margin: 10px auto;
  }
  .cam-lt{
    float: left;
  }
  .head-container{
    float: right;
    left: 10px auto;
    padding-bottom: 11px;
  }
  .cam_button{
    position: relative;
  }
  .suo{
    position: absolute;
    right: 67px;
  }
   .tip_box {
    background: #e5f0ff;
    padding: 8px 10px;
    margin-bottom: 15px;
    border-radius: 2px;
    border: 1px solid #97c7ff;
    line-height: 20px;
    color: #003b80;
    font-size: 12px;

}
.el_select{
    margin-left: 10px
}
//   .text-overflow {
//     display: inline-block;
//     max-width: 100%;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     vertical-align: middle;
//     white-space: nowrap;
// }

}

</style>
