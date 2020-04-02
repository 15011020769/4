<template>
  <div>
    <HeadCom title="角色管理" :backShow="true" @_back="_back" />
    <el-card class="card">
      <h3>服務授權</h3>
      <el-row>同意賦予{{info.serviceName}}權限後，將創建服務預設角色並授予{{info.serviceName}}相關權限</el-row>
      <el-row type="flex">
        <span>角色名稱</span>
        <p>{{info.roleName}}</p>
      </el-row>
      <el-row type="flex">
        <span>授權策略名</span>
        <p>{{info.policyName}}</p>
      </el-row>
      <el-row type="flex">
        <span>角色類型</span>
        <p>{{info.roleType}}</p>
      </el-row>
      <el-row type="flex">
        <span>角色描述</span>
        <p>{{info.roleDesc}}</p>
      </el-row>
       <el-divider></el-divider>
       <el-row>
         <el-button size="small" type="primary" @click="authority">同意授權</el-button>
         <el-button size="small" @click="cancel">取消</el-button>
       </el-row>
    </el-card>
  </div>
</template>
<script>
import HeadCom from "../UserListNew/components/Head";
import { ErrorTips } from "@/components/ErrorTips";
import { CREATE_ROLE, ATTACH_ROLE_POLICIES } from '@/constants'
export default {
  data() {
    return {
      info: {}
    }
  },
  components: {
    HeadCom,
  },
  mounted() {
    this.info = this.$route.query
  },
  methods: {
    _back() {
      this.$router.replace('/Role')
    },
    cancel() {
      window.location.href = this.info.url
    },
    authority() {
      this.axios.post(CREATE_ROLE, {
        Version: "2019-01-16",
        RoleName: this.info.roleName,
        Description: this.info.roleDesc,
        PolicyDocument: `{"version":"2.0","statement":[{"action":"name/sts:AssumeRole","effect":"allow","principal":{"service":"cdb.qcloud.com"}}]}`
      }).then(res => {
        if (res.Response.Error === undefined) {
          let roleId = res.Response.RoleId; // 获取创建的角色id
          this.axios.post(ATTACH_ROLE_POLICIES, {
            "Version": "2019-01-16",
            RoleId: roleId,
            'PolicyName.0': this.info.policyName
          }).then(res1 => {
            if (res1.Response.Error === undefined) {
              window.location.href = this.info.url
            } else {
              this.$message({
                message: '創建角色成功，但是關聯策略失敗',
                type: "error",
                showClose: true,
                duration: 0
              })
            } 
          })
        } else {
          let ErrTips = {
            "InternalError.SystemError":'內部錯誤',
            "InvalidParameter.AttachmentFull":'principal欄位的授權物件關聯策略數已達到上限',
            "InvalidParameter.ConditionError":'策略文件的condition欄位不合法',
            "InvalidParameter.DescriptionLengthOverlimit":'Description入參長度不能大於300位元組',
            "InvalidParameter.ParamError":'非法入參',
            "InvalidParameter.PrincipalError":'策略文件的principal欄位不合法',
            "InvalidParameter.RoleFull":'角色數量達到上限',
            "InvalidParameter.RoleNameError":'角色名不合法',
            "InvalidParameter.RoleNameInUse":'相同名稱的角色已存在',
            "InvalidParameter.UserNotExist":'principal欄位的授權物件不存在'
          };
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[data.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          })
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.card {
  margin: 20px;
  span {
    width: 90px;
  }
  ::v-deep .el-row {
    margin: 20px 0;
  }
}
</style>