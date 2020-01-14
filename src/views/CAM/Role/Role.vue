<template>
  <div class="Cam wrap">
    <HeadCom title="角色" />
    <div class="container">
      <div class="container-text">
        <h4 style="margin-bottom:10px;">{{$t('CAM.Role.roleTitle1')}}</h4>
        <p>{{$t('CAM.Role.roleTitle2')}}</p>
      </div>
      <div class="opration">
          <el-button type="primary" size="small" @click="created_user">{{$t('CAM.Role.addBtn')}}</el-button>  </p>
      </div>
      <div class="container_table">
        <div class="table">
          <el-table
            :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
            v-loading="loading"
            height="450"
            style="width: 100%"
            :row-style="{height:0}"
            :cell-style="{padding:'10px'}"
            :header-cell-style="{height:'20px',padding:'10px',fontSize:'12px'}"
          >
            <el-table-column prop="RoleName" :label="$t('CAM.Role.roleName')" width="180">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  type="text"
                  size="small"
                >{{scope.row.RoleName}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="PolicyDocument"
              :label="$t('CAM.Role.roleCarrier')"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-show="scope.row.PolicyDocument.len != undefined">
                  <p>{{$t('CAM.Role.service')}}-{{scope.row.PolicyDocument.val}}</p>
                  <p v-show="scope.row.PolicyDocument.len > 1">
                    以及
                    <el-button
                      @click.native.prevent="handleClick(scope.row)"
                      type="text"
                      size="small"
                    >其他{{scope.row.PolicyDocument.len}}{{$t('CAM.Role.item')}}</el-button>
                  </p>
                </span>
                <span v-show="scope.row.PolicyDocument.len === undefined">
                  <p>{{$t('CAM.Role.account')}}-{{scope.row.PolicyDocument.val}}</p>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="Description"
              :label="$t('CAM.Role.roleDesc')"
              show-overflow-tooltip
            >
            <template slot-scope="scope">
               <span v-show="!scope.row.Description">-</span>
               <span v-show="scope.row.Description">{{scope.row.Description}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="oper" :label="$t('CAM.Role.colHandle')" width="100">
              <template slot-scope="scope">
                <el-button
                  @click="delete_Role(scope.row.RoleId)"
                  type="text"
                  size="small"
                >{{$t('CAM.Role.delBtn')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="Right-style pagstyle" style="height:70px;display:flex;align-items:center;">
        <span class='pagtotal'>共&nbsp;{{TotalCount}}&nbsp;{{$t("CAM.strip")}}</span>
        <el-pagination :page-size="pagesize" :pager-count="7" layout="prev, pager, next"
          @current-change="handleCurrentChange" :total="TotalCount">
        </el-pagination>
      </div>
        </div>
      </div>
      <el-dialog :visible.sync="create_dialogVisible" width="30%" :before-close="handleClose">
        <h3 slot="title">{{$t('CAM.Role.selectCarrier')}}</h3>
        <div class="createItem" @click="toServe">
          <i class="strategy-icon ps"></i>
          <h3 style="color:#333;font-weight:400">台富云产品服务</h3>
          <p>{{$t('CAM.Role.tencentProductServiceTitle')}}</p>
        </div>
        <div class="createItem" @click="toAccount">
          <i class="strategy-icon ca"></i>
          <h3 style="color:#333;font-weight:400">台富云账户</h3>
          <p>{{$t('CAM.Role.tencentCardTitle')}}</p>
        </div>
        <div class="createItem" @click="toProvider">
          <i class="strategy-icon sf"></i>
          <h3 style="color:#333;font-weight:400">{{$t('CAM.Role.identityProvider')}}</h3>
          <p>授权台富云外部用户身份(如企业用户目录)使用您的资源</p>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import HeadCom from "../UserListNew/components/Head";
import {DESCRIB_ROLE,DELETE_ROLE} from '@/constants'
import { ErrorTips } from "@/components/ErrorTips";
export default {
  data() {
    return {
      loading: true,
      tableData: [],
      // 分页
      Page: 1,
      size: 10,
      total: 0,
      TotalCount:0,
      pagesize:10,
      currpage:1,
      create_dialogVisible: false,
      value:'',
    };
  },
  components: {
    HeadCom
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let params = {
        Version: "2019-01-16",
        Page: this.Page,
        Rp: this.size
      };
      if (this.searchValue != null && this.searchValue != "") {
        params["keyword"] = this.searchValue;
      }
      this.axios
        .post(DESCRIB_ROLE, params)
        .then(data => {
          if(data.Response.Error === undefined){
          if (
            data === "" ||
            data.Response.error == "undefined" ||
            data.Response.List.length == 0
          ) {
            this.loading = false;
          } else {
            let resData = data.Response.List;
            this.TotalCount = data.Response.TotalNum
            console.log(data)
            this.loading = false;
            resData.forEach(item => {
              let obj = {
                val: String,
                len: String
              };
              let policyObj = JSON.parse(item.PolicyDocument);
              if (policyObj.statement[0].principal.service != undefined) {
                if (
                  typeof policyObj.statement[0].principal.service === "object"
                ) {
                  policyObj.val = policyObj.statement[0].principal.service[0];
                  policyObj.len =
                    policyObj.statement[0].principal.service.length - 1;
                }
                if (
                  typeof policyObj.statement[0].principal.service === "string"
                ) {
                  policyObj.val = policyObj.statement[0].principal.service;
                  policyObj.len = 0;
                }
              }
              if (policyObj.statement[0].principal.qcs != undefined) {
                policyObj.val = policyObj.statement[0].principal.qcs[0];
              }
              item.PolicyDocument = policyObj;
            });
            this.tableData = resData;
            this.total = data.Response.TotalNum;
            // var dataRole = JSON.parse(data.Response.List);
          }
          }else{
            let ErrTips = {
               "InternalError.SystemError":'内部错误',
               "InvalidParameter.ParamError":'非法入参'
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
        .catch(error => {
          console.log(error);
        });
    },
    // 删除角色
    delete_Role(RoleId) {
      this.$confirm(this.$t("CAM.Role.delHint"), this.$t("CAM.Role.delTitle"), {
        confirmButtonText: this.$t("CAM.Role.delConfirmBtn"),
        cancelButtonText: this.$t("CAM.Role.delCancelBtn"),
        type: "warning"
      })
        .then(() => {
          let params = {
            Version: "2019-01-16",
            RoleId: RoleId
          };
          this.axios
            .post(DELETE_ROLE, params)
            .then(data => {
              if(data.Response.Error === undefined){
                if (data != null && data.Response.RequestId != "") {
                this.$message({
                  type: "success",
                  message: this.$t("CAM.Role.delInfo") + "!"
                });
                this.init();
                this.loading = false;
              }
              }else{
                   let ErrTips = {
                     "InternalError.SystemError":'内部错误',
                     "InvalidParameter.ParamError":'非法入参',
                     "InvalidParameter.RoleNotExist":'角色不存在'
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
            .catch(error => {
              this.$message({
                type: "success",
                message: error
              });
              console.log(error);
            });
        })
        .catch(() => {
          // this.$message({ type: 'info', message: '已取消删除' })
        });
    },
    // 打开新增角色页面
    created_user() {
      console.log(1111);
      this.create_dialogVisible = true;
    },
    handleClose() {
      (this.dialogVisible = false), (this.create_dialogVisible = false);
    },
    handleCommand(command) {},
    handleClick(scope) {
      console.log(scope);
      this.$router.push({
        path: "/RoleDetail",
        query: {
          RoleId: scope.RoleId
        }
      });
    },
    pageChange(e) {
      this.page = e;
      this.init();
    },
    sizeChange(e) {
      this.size = e;
      this.init();
    },
    handleClick_user() {
      this.dialogVisible = true;
    },
    toServe() {
      this.$router.push("/createServe");
    },
    handleCurrentChange(val) {
      this.Page = val;
      this. init();
    },
    toAccount() {
      // this.$router.push("/createAccount");
      this.$message({
        type: "info",
        message: "内测中..."
      });
    },
    toProvider() {
      // this.$router.push("/createProvider");
       this.$message({
        type: "info",
        message: "内测中..."
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrap >>> .el-button,
.wrap >>> .el-input__inner {
  border-radius: 0;
  height: 30px !important;
  line-height: 30px;
  padding-top: 0;
  font-size: 12px;
}
.Right-style{
  display: flex;
  justify-content: flex-end;
}
.pagstyle {
  padding: 5px;
  .pagtotal {
      font-size: 13px;
      font-weight: 400;
      color: #565656;
      line-height: 32px;
    }
}
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
    width: 100%;
    display: flex;
    margin: 0 auto;
    padding: 20px ;
    flex-direction: column;
    .container-text {
      width: 100%;
      margin: 0 auto;
      font-size: 12px;
      padding: 10px 30px 10px 20px;
      vertical-align: middle;
      color: #003b80;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      position: relative;
      box-sizing: border-box;
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
.opration{
  width: 100%;
}
.container_table{
  width: 100%;
}
</style>
