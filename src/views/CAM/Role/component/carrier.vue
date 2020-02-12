<template>
  <div class="carrier">
    <Head :title="$t('CAM.Role.gljszt')" :backShow="true" @_back="_back" />
    <div class="main">
      <div class="box contant_flex">
        <div class="flex_left">
          <p
            style="margin-top:5px;text-overflow:ellipsis;white-space:nowrap"
          >{{$t('CAM.Role.support')}}*</p>
        </div>
        <div class="flex_right">
          <el-checkbox-group
            v-model="checkedPrinCipalService"
            @change="handleCheckedCitiesChange"
            style="display:flex;flex-flow: row wrap;align-content: flex-start;font-size:12px"
          >
            <el-checkbox
              v-for="item in prinCipalService"
              :label="item"
              :key="item.Domain"
              style="margin-bottom:15px"
              v-if="item.Name.Zh !==''"
            >{{item.Name.Zh}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="box button-box">
        <div class="button-wrap">
          <el-button
          type="primary"
          @click="onSubmit"
          size="small"
        >{{$t('CAM.userGroup.delConfirmBtn')}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Head from "../../UserListNew/components/Head";
import { GET_PRINCIPAL_SERVICE, GET_ROLE, UPDATE_ASSUME } from '@/constants'
export default {
  name: "carrier",
  data() {
    return {
      prinCipalService:[],
      checkedPrinCipalService: [],
      RoleId: this.$route.query.id
    };
  },
  methods: {
    handleCheckedCitiesChange(val) {
      console.log(val);
    },
    //返回上一级
    _back() {
      this.$router.go(-1);
    },
    // 获取载体列表
    getPrinCipalService() {
      let params = {
        Version: "2019-01-16",
        Region: "ap-guangzhou"
      }
      this.axios.post(GET_PRINCIPAL_SERVICE, params).then(res => {
         if (res.Response.Error === undefined) {
           this.prinCipalService = res.Response.PrinciPalService
         } else {
            let ErrTips = {
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.RoleNotExist": "角色不存在"
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
    },

    // 获取角色详情
    getRoleDetail() {
      let params = {
        Version: "2019-01-16",
        RoleId: this.RoleId
      }
       this.axios
        .post(GET_ROLE, params)
        .then(res => {
          if (res.Response.Error === undefined) {
          let { PolicyDocument } = res.Response.RoleInfo
          PolicyDocument = JSON.parse(PolicyDocument)
          setTimeout(() => {
            PolicyDocument.statement[0].principal.service.forEach(item => {
              let temp = this.prinCipalService.find(_item => (
                _item.Domain === item
              ))
              this.checkedPrinCipalService.push(temp)
            })
          })
         } else {
            let ErrTips = {
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.RoleNotExist": "角色不存在"
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
    },

    // 提交
    onSubmit() {
      let policyDocument = JSON.parse(
        '{"version":"2.0","statement":[{"action":"name/sts:AssumeRole","effect":"allow","principal":{"service":[]}}]}'
      )
      let roleCarrier = this.checkedPrinCipalService.reduce((prev, next) => {
        return prev.concat(next.Domain)
      }, [])
      policyDocument.statement[0].principal.service = policyDocument.statement[0].principal.service.concat(
        roleCarrier
      )
      let paramsPolicy = {
        Version: "2019-01-16",
        PolicyDocument: policyDocument,
        RoleId: this.RoleId
      };
      this.axios
        .post(UPDATE_ASSUME, paramsPolicy)
        .then(res => {
          if (res.Response.Error === undefined) {
            this.$message.success('操作成功')
            this._back()
          } else {
            let ErrTips = {
              "InternalError.SystemError": "內部錯誤",
              "InvalidParameter.AttachmentFull":
                "principal欄位的授權對象關聯策略數已達到上限",
              "InvalidParameter.ConditionError":
                "策略文件的condition欄位不合法",
              "InvalidParameter.ParamError": "非法入參",
              "InvalidParameter.PrincipalError":
                "策略文件的principal欄位不合法",
              "InvalidParameter.RoleNotExist": "角色不存在",
              "InvalidParameter.UserNotExist": "principal欄位的授權對象不存在"
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
    }
  },

  mounted() {
    this.getPrinCipalService()
    this.getRoleDetail()
  },

  components: {
    Head
  },
};
</script>

<style scoped lang='scss'>
.carrier >>> .el-checkbox {
  width: 20% !important;
}
.carrier {
  .contant_flex {
    display: flex;
    padding-top: 20px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
    .flex_right {
      padding-left: 20px;
      .el-checkbox {
        margin-left: 0;
      }
    }
  }
  .main {
    padding: 20px;
    box-sizing: border-box;
    .box {
      background: white;
      padding: 20px;
      box-sizing: border-box;
      margin-top: -1px;
      .button-wrap {
        padding-top: 20px;
        margin: 0 10px;
        border-top: 1px solid #ddd;
      }
    }
    .button-box {
      padding-top: 0px;
    }
  }
}
</style>