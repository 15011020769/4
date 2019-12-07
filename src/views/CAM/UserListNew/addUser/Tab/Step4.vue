<template>
  <div class="edit-wrap">
    <div class="explain">
      <p>请检查您设置的信息，访问管理将按照如下信息为您创建用户。</p>
    </div>
    <div class="edit-main" v-loading="loading">
      <div class="edit-box">
        <h3>用户信息</h3>
        <table width="100%" boder="1" cellspacing="0" cellpadding="1">
          <thead>
            <tr>
              <td width="280">
                用户名
                <span style="color:#e54545;">*</span>
              </td>
              <td width="170">备注</td>
              <td width="200">手机</td>
              <td width="200">邮箱</td>
              <td>操作</td>
            </tr>
          </thead>
          <tbody>
            <tr v-show="!userInp" class="userInp">
              <td>{{userData.Name}}</td>
              <td>{{userData.Remark ? userData.Remark : '-'}}</td>
              <td>{{userData.PhoneNum ? userData.PhoneNum : '-'}}</td>
              <td>{{userData.Email ? userData.Email : '-'}}</td>
              <td class="edit" @click="_edit">编辑</td>
            </tr>
            <tr v-show="userInp">
              <td>{{userData.Name}}</td>
              <td>
                <el-input v-model="form.Remark"></el-input>
              </td>
              <td>
                <el-input v-model="form.PhoneNum"></el-input>
              </td>
              <td>
                <el-input v-model="form.Email"></el-input>
              </td>
              <td class="edit">
                <span @click="_userConfirm">确定</span>
                <span style="margin-left:5px;" @click="_userCancel">取消</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="edit-box">
        <h3>访问信息</h3>
        <el-form ref="form" label-width="100px">
          <el-form-item label="访问方式" required>
            <p v-show="userData.ConsoleLogin == 1">编程访问，控制台访问</p>
            <p v-show="userData.ConsoleLogin == 0">无法登录控制台</p>
          </el-form-item>
          <el-form-item label="控制台密码类型">
            <p v-if="!pwdRadio">自动生成密码</p>
            <p v-if="pwdRadio">自定义密码</p>
          </el-form-item>
          <el-form-item label="需要重置密码">
            <p v-if="pwdType.length != 0">是</p>
            <p v-if="pwdType.length == 0">否</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="edit-box">
        <h3>权限信息</h3>
        <el-table
          :data="policyData"
          style="width: 100%"
          v-if="activeName == 'first' || activeName == 'second'"
          v-loading="tableloading"
          max-height="520"
        >
          <el-table-column prop="PolicyName" label="策略名" width="220"></el-table-column>
          <el-table-column label="策略描述">
            <template slot-scope="scope">
              <p class="omit">{{scope.row.Remark}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <p style="color:#006eff;cursor: pointer;" @click="_del(scope.row)">解除</p>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="userList"
          style="width: 100%"
          v-if="activeName == 'third'"
          v-loading="tableloading"
          max-height="520"
        >
          <el-table-column prop="GroupName" label="组名"></el-table-column>
          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <p style="color:#006eff;cursor: pointer;" @click="_del(scope.row)">解除</p>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box Right-style pagstyle">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[20, 30, 40,50,100]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="num"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  QUERY_USER,
  QUERY_POLICY,
  REMOVEBIND_USER,
  RELATE_USER,
  DEL_USERTOGROUP,
  UPDATA_USER
} from "@/constants";
export default {
  name: "edit",
  data() {
    return {
      loading: true, //加载
      tableloading: true, //表格加载
      //表单
      form: {},
      num: 0,
      userList: [],
      policyData: [], //策略列表
      userData: {}, //用户信息
      userInp: false, //用户信息input
      pagesize: 10, // 分页条数
      currpage: 1 // 当前页码
    };
  },
  methods: {
    //用户组列表
    _groupList() {
      const params = {
        Version: "2019-01-16",
        Uid: this.userData.Uid,
        Page: this.currpage,
        Rp: this.pagesize
      };
      this.axios.post(RELATE_USER, params).then(res => {
        this.userList = res.Response.GroupInfo;
        this.num = res.Response.TotalNum;
        this.tableloading = false;
      });
    },
    //用户组解除绑定
    _userDel(val) {
      const params = {
        Version: "2019-01-16",
        "Info.0.Uid": this.userData.Uid,
        "Info.0.GroupId": val.GroupId
      };
      this.axios.post(DEL_USERTOGROUP, params).then(res => {
        if (res.Response.RequestId) {
          this.$message("解除成功");
        } else {
          this.$message.error(Response.Error.Message);
        }
        this._getUser();
      });
    },
    //策略解除绑定
    _del(val) {
      this.$confirm("此操作将解除绑定, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.activeName == "first") {
            this._remove(val);
          } else if (this.activeName == "third") {
            this._userDel(val);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //策略解除绑定
    _remove(val) {
      const params = {
        Version: "2019-01-16",
        DetachUin: this.userData.Uin,
        PolicyId: val.PolicyId
      };
      this.axios.post(REMOVEBIND_USER, params).then(res => {
        if (res.Response.RequestId) {
          this.$message("解除成功");
        } else {
          this.$message.error(Response.Error.Message);
        }
        this._getUser();
      });
    },
    //策略列表
    _tactics() {
      const params = {
        Version: "2019-01-16",
        TargetUin: this.userData.Uin,
        Page: this.currpage,
        Rp: this.pagesize
      };
      console.log(params);
      this.axios.post(QUERY_POLICY, params).then(res => {
        console.log(res);
        this.num = res.Response.TotalNum;
        this.policyData = res.Response.List;
        this.tableloading = false;
      });
    },
    //获取用户信息
    _getUser() {
      const params = {
        Version: "2019-01-16",
        Name: this.name
      };
      this.axios
        .post(QUERY_USER, params)
        .then(res => {
          this.userData = res.Response;
          this.form = res.Response;
          this.loading = false;
        })
        .then(() => {
          console.log(this.activeName);
          if (this.activeName == "first" || this.activeName == "second") {
            this._tactics();
          } else if (this.activeName == "third") {
            this._groupList();
          }
        });
    },
    //用户信息编辑
    _edit() {
      this.userInp = !this.userInp;
    },
    //用户信息取消
    _userCancel() {
      this.userInp = !this.userInp;
    },
    //用户信息确定
    _userConfirm() {
      const params = {
        Version: "2019-01-16",
        Name: this.name,
        Remark: this.form.Remark,
        PhoneNum: this.form.PhoneNum,
        Email: this.form.Email
      };
      this.axios
        .post(UPDATA_USER, params)
        .then(res => {
          if (res.Response.RequestId) {
            this.$message("编辑成功");
            this.userInp = !this.userInp;
          } else {
            this.$message.error("编辑失败");
          }
        })
        .then(() => {
          this._getUser();
        });
    },
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.currpage = 1;
      if (this.activeName == "first") {
        this._tactics();
      } else if (this.activeName == "third") {
        this._groupList();
      }
    },
    handleCurrentChange(val) {
      this.currpage = val;
      if (this.activeName == "first") {
        this._tactics();
      } else if (this.activeName == "third") {
        this._groupList();
      }
    }
  },
  created() {
    this._getUser();
  },
  props: {
    name: String,
    activeName: String,
    pwdType: Array,
    pwdRadio: Boolean
  }
};
</script>

<style scoped lang='scss'>
.edit-wrap {
  width: 100%;
  height: 100%;
  .edit-main >>> .el-form-item {
    margin-bottom: 0;
  }
  .edit-main >>> .el-form-item__content {
    p {
      font-size: 12px;
    }
  }
  .edit-main {
    box-sizing: border-box;

    .omit {
      // width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .page-box {
      padding: 15px 0;
      box-sizing: border-box;
      color: #666;
    }

    .edit {
      color: #006eff;
      cursor: pointer;
    }

    h3 {
      font-size: 14px;
      line-height: 14px;
      margin: 15px 0;
    }
    .edit-box {
      padding-bottom: 15px;
      box-sizing: border-box;
    }
    table {
      border: 1px #f2f2f2 solid;
      thead {
        td {
          font-weight: bold;
          color: #888;
          padding: 10px;
          box-sizing: border-box;
        }
      }
      tbody {
        td {
          padding: 10px;
          box-sizing: border-box;
        }
        .userInp {
          td {
            padding: 16px 10px;
          }
        }
      }
      td {
        font-size: 12px;
        border: 0.5px #f2f2f2 solid;
        border-right: 0;
        border-left: 0;
        padding: 0 10px;
        box-sizing: border-box;
      }
    }
  }
  .explain {
    font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    p {
      line-height: 20px;
    }
  }
}
.Right-style {
  display: flex;
  justify-content: flex-end;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
</style>