<template>
  <div class="resetpassword">
    <el-dialog
      :visible.sync="resetpasswordStatus.resetpasswordDialog"
      :show-close="false"
      width="40%"
    >
      <div slot="title" class="title-wrap">
        <span>重置密码</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <span>
          您已选
          <span>1</span>台 实例，
        </span>
        <span class="packdown">查看详情</span>
        <el-button type="text" class="basicInfo-pack" @click="handlePack">
          <i :class="[basic?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
        </el-button>
        <div :class="[basic?'table':'']">
          <el-table
            ref="instanceTable"
            :data="instanceInfo"
            :header-cell-style="{'font-size':'12px'}"
            :row-style="tableRowStyle"
            v-if="basic"
            max-height="200px"
          >
            <el-table-column type="index" width="55" label="No."></el-table-column>
            <el-table-column label="实例名">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.InstanceId}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="实例ID">
              <template slot-scope="scope">
                <div>
                  <a href @click="handleInstanceId">{{scope.row.InstanceId}}</a>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="当前带宽上限">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.InstanceId}}</span>
                  Mbps
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin-top: 10px;">
          <el-form ref="projectform" :model="projectform" :label-position="labelPosition" :rules="rules" label-width="100px">
            <el-form-item label="用户名" prop="userdrop">
              <el-select v-model="projectform.userdrop" placeholder size="mini">
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div>
                <el-input
                  v-model="projectform.username"
                  placeholder
                  size="mini"
                  style="width: 130px;"
                  :disabled="disabled"
                ></el-input>
                <span style="display:block;height:5px;line-height:5px;font-size:12px;color:#ccc;">仅可对系统中已存在的用户进行重置密码操作</span>
              </div>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input
                v-model="projectform.password"
                placeholder
                size="mini"
                style="width: 130px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="passwordconfirm">
              <el-input
                v-model="projectform.passwordconfirm"
                placeholder
                size="mini"
                style="width: 130px;"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="handleCancel(true)">确认重置</el-button>
          <el-button size="mini" @click="handleCancel(false)">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var validatetPassword = (rule, value, callback) => {
      var regExp = /^(\w)+$/
      if (!value) {
        callback(new Error('请输入新密码'));
      }else if (regExp.test(value)&&(value.length>=8)&&(value.length<=30)) {
        callback()
      } else {
        callback(new Error("Linux 机器密码需8到30位，至少包括三项（[a-z],[A-Z],[0-9]和[()`~!@#$%^&*-+=_|{}[]:;'<>,.?/]的特殊符号）"))
      }
    };
    var validatetPasswordConfirm = (rule, value, callback) => {
      var regExp = /^(\w)+$/
      if (!value) {
        callback(new Error('请输入确认密码'));
      }else if (value==this.projectform.password) {
        callback()
      } else {
        callback(new Error("两次密码不一致"))
      }
    };
    return {
      basic: true,
      labelPosition: 'left',
      instanceInfo: [], //实例列表
      userOptions: [
        {
          value: "1",
          label: "系统默认"
        },
        {
          value: "2",
          label: "指定用户名"
        }
      ],
      //用户信息
      projectform: {
        userdrop: "",
        username: '',
        password: "",
        passwordconfirm: ""
      },
      rules: {
        password: [
          // { required: true, message: "Linux 机器密码需8到30位，至少包括三项（[a-z],[A-Z],[0-9]和[()`~!@#$%^&*-+=_|{}[]:;'<>,.?/]的特殊符号）", trigger: "blur" }
          { validator: validatetPassword, trigger: 'blur' }
        ],
        
        passwordconfirm: [
          // { required: true, message: "请输入确认密码", trigger: "blur" }
          { validator: validatetPasswordConfirm, trigger: 'blur' }
        ]
      }
    };
  },
  props: {
    resetpasswordStatus: {
      type: Object,
      default: () => []
    }
  },
  computed: {
    disabled() {
      return this.projectform.userdrop == "1";
    }
  },
  mounted() {
    this.instanceInfo = this.resetpasswordStatus.InstanceItem;
  },
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return {
        "font-size": "12px"
      };
    },
    handlePack() {
      this.basic = !this.basic;
    },
    handleInstanceId() {},
    //确定开机/取消
    handleCancel(value) {
      if (value) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2"),
          Password: this.projectform.password
        };
        if(this.projectform.username) {
          params['UserName'] = this.projectform.username;
        }
        this.instanceInfo.forEach(function(item, index) {
          params["InstanceIds." + index] = item.InstanceId;
        });
        this.axios.post("cvm/ResetInstancesPassword", params).then(data => {
          this.$parent.getListData();
        });
      }
      this.$emit("close", false);
    }
  },
  components: {}
};
</script>
<style lang="scss" scoped>
.resetpassword {
  ::v-deep .el-form-item__label {
    font-size: 12px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
    }
  }
  .content {
    font-size: 12px;
    .packdown {
      color: #006eff;
    }
    .table {
      border: 1px solid #eee;
      border-bottom: none;
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
    ::v-deep .el-form-item {
     margin-bottom: 5px;
    }
    ::v-deep .el-form-item__error {
      padding-top: 0;
      top: 95%;
    }
  }
}
</style>

