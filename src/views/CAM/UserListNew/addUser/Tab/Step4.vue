<template>
  <div class="edit-wrap">
    <div class="explain">
      <p>请检查您设置的信息，访问管理将按照如下信息为您创建用户。</p>
    </div>
    <div class="edit-main">
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
              <td class="edit">
                <span @click="_userConfirm">确定</span>
                <span style="margin-left:5px;" @click="_userCancel">取消</span>
              </td>
            </tr>
            <tr v-show="userInp">
              <td>
                <el-input></el-input>
              </td>
              <td>
                <el-input></el-input>
              </td>
              <td>
                <el-input></el-input>
              </td>
              <td>
                <el-input></el-input>
              </td>
              <td class="edit" @click="_edit">编辑</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="edit-box">
        <h3>访问信息</h3>
        <el-form ref="form" label-width="100px">
          <el-form-item label="访问方式" required>
            <p>编程访问，控制台访问</p>
          </el-form-item>
          <el-form-item label="控制台密码类型">
            <p>自动生成密码</p>
          </el-form-item>
          <el-form-item label="需要重置密码">
            <p>是</p>
          </el-form-item>
        </el-form>
      </div>
      <div class="edit-box">
        <h3>权限信息</h3>
        <el-table :data="policyData" style="width: 100%">
          <el-table-column prop="PolicyName" label="策略名" width="220"></el-table-column>
          <el-table-column label="策略描述">
            <template slot-scope="scope">
              <p class="omit">{{scope.row.Remark}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <p style="color:#006eff;cursor: pointer;">解除</p>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-box">
          <span>共 {{policyData.length}} 项</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QUERY_USER, QUERY_POLICY } from "@/constants";
export default {
  name: "edit",
  data() {
    return {
      policyData: [], //策略列表
      userData: {}, //用户信息
      userInp: false //用户信息input
    };
  },
  methods: {
    //策略列表
    _tactics() {
      const params = {
        Version: "2019-01-16",
        TargetUin: this.userData.Uin
      };
      this.axios.post(QUERY_POLICY, params).then(res => {
        console.log(res);
        this.policyData = res.Response.List;
      });
    },
    //获取用户信息
    _getUser() {
      const params = {
        Version: "2019-01-16",
        Name: "xxx"
      };
      this.axios
        .post(QUERY_USER, params)
        .then(res => {
          this.userData = res.Response;
          console.log(res);
        })
        .then(() => {
          this._tactics();
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
      this.userInp = !this.userInp;
    }
  },
  created() {
    this._getUser();
  },
  props: {
    name: String
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
    padding-bottom: 20px;
    box-sizing: border-box;
    
    .page-box{
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
</style>