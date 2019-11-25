<template>
  <div class="Cam">
    <div class="top">
      <p>角色</p>
    </div>
    <div class="container">
      <div class="container-text">
        <h4 style="margin-bottom:10px;">为什么我的账户出现了新角色？</h4>
        <p>在服务中完成特定操作 (如授权创建服务角色) 时，服务可能为您创建服务相关角色。或者，如果您在某项服务开始支持服务相关角色之前已在使用该服务，则该服务可能自动在您的账户中创建角色。</p>
      </div>
      <div class="container_table">
        <p>
          <el-button type="primary" size="small" @click="created_user">新建角色</el-button>
        </p>
        <div class="table">
          <el-table
            :data="tableData"
            height="450"
            border
            style="width: 100%"
            :row-style="{height:0}"
            :cell-style="{padding:'10px'}"
            :header-cell-style="{height:'20px',padding:'10px',fontSize:'12px'}"
          >
            <el-table-column prop="RoleName" label="角色名称" width="150"></el-table-column>
            <el-table-column prop="PolicyDocument.statement[0].principal.service[0]" label="角色载体">
            </el-table-column>
            <el-table-column prop="Description" label="描述"></el-table-column>
            <el-table-column prop="address" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick_user(scope)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div
            style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px"
          >
            <div>
              <span style="font-size:12px;color:#888">已选 0 项，共 309 项</span>
            </div>
            <div>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage2"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="sizes, prev, pager, next"
                :total="1000"
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
      <el-dialog :visible.sync="create_dialogVisible" width="30%" :before-close="handleClose">
        <h3 slot="title">选择角色载体</h3>
        <div class="createItem" @click="toServe">
          <i class="strategy-icon ps"></i>
          <h3 style="color:#333;font-weight:400">腾讯云产品服务</h3>
          <p>授权云服务通过角色使用您的云资源</p>
        </div>
        <div class="createItem" @click="toAccount">
          <i class="strategy-icon ca"></i>
          <h3 style="color:#333;font-weight:400">腾讯云账户</h3>
          <p>授权主账号或者其他主账号通过角色使用您的云资源</p>
        </div>
        <div class="createItem" @click="toProvider">
          <i class="strategy-icon sf"></i>
          <h3 style="color:#333;font-weight:400">身份提供商</h3>
          <p>授权腾讯云外部用户身份（如企业用户目录）使用您的云资源</p>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <h3 slot="title">删除角色</h3>
        <p>此操作将删除该角色，同时解除该服务角色已关联的策略以及授权关系。您确定要删除该角色吗？</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      table_value: "",
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      dialogVisible: false,
      create_dialogVisible: false
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let params = {
        Action: "DescribeRoleList",
        Version: "2019-01-16",
        Page: "1",
        Rp: "5"
      };
      if (this.searchValue != null && this.searchValue != "") {
        params["keyword"] = this.searchValue;
      }
      let url = "cam2/DescribeRoleList";
      this.axios
        .post(url, params)
        .then(data => {
          
          data.Response.List.forEach(item => {
            item.PolicyDocument = JSON.parse(item.PolicyDocument)
            debugger;
            console.log(item.PolicyDocument);
          });
          this.tableData = data.Response.List;
          var dataRole = JSON.parse(data.Response.List);
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
     // 删除用户组
    handleClick_user(RoleId) {
      this.$confirm( this.$t('CAM.CAM.userGroup.delHint'), this.$t('CAM.CAM.userGroup.delTitle'), {
      confirmButtonText: this.$t('CAM.CAM.userGroup.delConfirmBtn'),
      cancelButtonText: this.$t('CAM.CAM.userGroup.delCancelBtn'),
      type: 'warning'
      }).then(() => {
      let url = "cam2/DeleteRole"
        let params = {
          Action: 'DeleteRole',
          Version: '2019-01-16',
          RoleId: RoleId
        }
        this.axios.post(url, params).then(data => {
          if(data != null && data.codeDesc === 'Success') {
            this.$message({ type: 'success', message: this.$t('CAM.CAM.userGroup.delInfo')+'!' })
            this.init()
          }
        }).catch(error => {
          this.$message({ type: 'success', message: error })
          console.log(error)
        })
      }).catch(() => {
        // this.$message({ type: 'info', message: '已取消删除' })          
      })
    },
    created_user() {
      this.create_dialogVisible = true;
    },
    handleClose() {
      (this.dialogVisible = false), (this.create_dialogVisible = false);
    },
    handleCommand(command) {},
    handleClick(scope) {
      this.$router.push("/RoleDetail");
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    handleClick_user() {
      this.dialogVisible = true;
    },
    toServe() {
      this.$router.push("/createServe");
    },
    toAccount() {
      this.$router.push("/createAccount");
    },
    toProvider() {
      this.$router.push("/createProvider");
    }
  }
};
</script>
<style lang="scss" scoped>
.Cam {
  .top {
    color: #000;
    padding: 20px;
    background: #fff;
    font-size: 16px;
    font-weight: 700;
    border-bottom: 1px solid #ddd;
  }
  .container {
    max-width: 96%;
    margin: 0 auto;
    padding-top: 20px;
    .container-text {
      font-size: 12px;
      line-height: inherit;
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      position: relative;
      box-sizing: border-box;
      max-width: 1360px;
      margin-bottom: 20px;
    }
    .table {
      background-color: #fff;
      margin-top: 20px;
    }
    .strategy-icon {
      position: absolute;
      left: 20px;
      top: 50%;
      margin-top: -16px;
      width: 32px;
      height: 32px;
    }
    .createItem {
      display: block;
      position: relative;
      margin-bottom: 20px;
      box-sizing: border-box;
      min-height: 90px;
      padding: 22px 50px 20px 70px;
      background-color: #f0f4f7;
      font-size: 14px;
      line-height: 1.6;
      color: #999;
      transition: background-color 0.2s;
      cursor: pointer;
    }
    .createItem:hover {
      background-color: #e8f4ff;
      text-decoration: none;
    }
    .createItem:after {
      content: "";
      position: absolute;
      right: 20px;
      top: 50%;
      margin-top: -8px;
      width: 10px;
      height: 17px;
      background-repeat: no-repeat;
      background-image: url(../../../assets/CAM/images/cam.png);
      background-position: -114px -62px;
    }
    .ps {
      background-image: url(../../../assets/CAM/images/cam.svg);
      background-position: 0.36% 53.7%;
      background-size: 956.25% 943.75%;
      background-repeat: no-repeat;
    }
    .ca {
      background-image: url(../../../assets/CAM/images/cam.svg);
      background-position: 12.770000000000001% 53.7%;
      background-size: 956.25% 943.75%;
      background-repeat: no-repeat;
    }
    .sf {
      background-image: url(../../../assets/CAM/images/cam.svg);
      background-position: 57.50999999999999% 23.330000000000002%;
      background-size: 927.2727272727274% 943.75%;
      background-repeat: no-repeat;
    }
  }
}
</style>
