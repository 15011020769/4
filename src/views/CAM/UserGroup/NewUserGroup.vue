<template>
  <div class="Cam wrap" id="app">
    <Headcom :title="$t('CAM.userGroup.addBtn')" :backShow="true" @_back="goback" />
    <div class="container">
      <div class="step">
        <el-steps :space="200" :active="active" simple style="padding-left: 10px;">
          <el-step :title="$t('CAM.userGroup.createWrite')"></el-step>
          <el-step :title="$t('CAM.userGroup.createRelevance')"></el-step>
          <el-step :title="$t('CAM.userGroup.createCheck')"></el-step>
        </el-steps>
      </div>
      <div class="table" v-loading="loading">
        <div v-show="active==1" style="width:100%;">
          <FirstStep ref="firstStep" :addModel="addModel" />
        </div>
        <div v-show="active==2">
          <SecondStep ref="secondStep" />
        </div>
        <div v-show="active==3">
          <ThirdlyStep :addModel="addModel" :policiesSelectedData="policiesSelectedData" />
        </div>
      </div>

      <div class="button">
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="prev()"
          v-if="active==2 || active==3"
        >上一步</el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="next()"
          v-if="active==1 || active==2"
        >下一步</el-button>
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="complete()"
          v-if="active==3"
        >完成</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import FirstStep from "./AddGroup/AddUserGroup.vue";
import SecondStep from "./AddGroup/PoliciesList";
import ThirdlyStep from "./AddGroup/ConfirmationGroup";
import { CREATE_USER, ATTACH_GROUP_POLICIES } from "@/constants";
import Headcom from "@/components/public/Head"; //头部组件引入
import {
  Loading
} from 'element-ui'
export default {
  name: "app",
  components: {
    FirstStep,
    SecondStep,
    ThirdlyStep,
    Headcom
  },
  data() {
    return {
      loading: false,
      active: 1,
      addModel: {
        groupName: "",
        remark: ""
      },
      policiesSelectedData: []
    };
  },
  methods: {
    goback() {
      this.$router.push({
        name: "UserGroup"
      });
    },
    next() {
      if (this.addModel.groupName != "") {
        if (this.addModel.groupName.length < 31) {
          if (this.active == 2) {
            console.log(this.$refs.secondStep.getDaata())
            this.policiesSelectedData = this.$refs.secondStep.getDaata();
          }
          const addModel = this.addModel;
          if (this.active++ > 2) {
            this.active = 0;
          }
        } else {
          this.$message({
          showClose: true,
          message: "用戶組名稱長度不能超過30",
          duration: 0
        });
        }
      } else {
        this.$message({
          showClose: true,
          message: "請輸入用戶組名稱",
          duration: 0
        });
      }
    },
    step() {
      if (this.active > 0) {
        this.active--;
      }
    },
    prev() {
      --this.active;
      if (this.active < 0) this.active = 0;
    },
    // next() {
    //   if (this.active++ > 3) this.active = 0;
    // },
    complete() {
      const loading = Loading.service({
        lock: true,
        background: 'rgba(0, 0, 0, 0.1)'
      })
      let _this = this;
      if (this.active == 3) {
        // 创建用户组
        let params = {
          Version: "2019-01-16"
        };
        if (this.addModel.groupName != null && this.addModel.groupName != "") {
          params["GroupName"] = this.addModel.groupName;
        }
        if (this.addModel.remark != null && this.addModel.remark != "") {
          params["Remark"] = this.addModel.remark;
        }
        this.axios
          .post(CREATE_USER, params)
          .then(res => {
            if (res.Response.Error === undefined) {
              // 获取新创建的用户组ID
              let AttachGroupId = res.Response.GroupId;
              let selArr = _this.policiesSelectedData;
              if (selArr.length > 0) {
                  // 绑定策略到用户组
                  const params = {
                    GroupId: AttachGroupId,
                    Version: "2019-01-16"
                  }
                  selArr.forEach((p, i) => {
                    params[`PolicyId.${i}`] = p.PolicyId
                  })
                  this.axios.post(ATTACH_GROUP_POLICIES, params)
                    .then(res => {
                      loading.close()
                      if (!res.Response.Error) {
                        this.$message({
                          message: '添加成功',
                          type: "success",
                          showClose: true,
                          duration: 0
                        });
                        this.$router.push({
                          name: "UserGroup"
                        })
                      } else {
                        let ErrTips = {
                          "FailedOperation.PolicyFull": "用戶策略數超過上限",
                          "InternalError.SystemError": "內部錯誤",
                          "InvalidParameter.AttachmentFull":
                            "principal欄位的授權對象關聯策略數已達到上限",
                          "InvalidParameter.ParamError": "非法入參",
                          "InvalidParameter.PolicyIdError":
                            "輸入參數PolicyId不合法",
                          "InvalidParameter.PolicyIdNotExist": "策略ID不存在",
                          "nvalidParameter.UserNotExist":
                            "principal欄位的授權對象不存在",
                          "ResourceNotFound.GroupNotExist": "用戶組不存在",
                          "ResourceNotFound.PolicyIdNotFound":
                            "PolicyId指定的資源不存在",
                          "ResourceNotFound.UserNotExist": "用戶不存在"
                        };
                        let ErrOr = Object.assign(ErrorTips, ErrTips);
                        this.$message({
                          message: `添加成功，關聯策略失敗。${ErrOr[res.Response.Error.Code]}`,
                          type: "error",
                          showClose: true,
                          duration: 0
                        });
                      }
                    })
              } else {
                loading.close()
                this.$message({
                  message: '添加成功',
                  type: "success",
                  showClose: true,
                  duration: 0
                });
                this.$router.push({
                  name: "UserGroup"
                })
              }
            } else {
              loading.close()
              let ErrTips = {
                "InvalidParameter.GroupFull": "用戶組數量達到上限",
                "InvalidParameter.GroupNameInUse": "用戶組名稱重複"
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
.wrap >>> .el-textarea__inner {
  border-radius: 0;
}
.Cam {
  .top {
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
    padding: 0 20px;
    background: #fff;

    .title-left {
      display: inline-block;
      vertical-align: middle;
      font-size: 18px;
      font-weight: 700;
      margin-left: 20px;
      max-width: 70%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      height: 30px;
      line-height: 30px;
    }
  }

  .container {
    width: 96%;
    background: white;
    margin: 0 auto;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    flex-direction: column;
    padding: 20px;
    box-sizing: border-box;
    p.title,
    p.explain {
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }

    p.explain {
      font-size: 12px;
      color: #ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }

    .buttons {
      margin-top: 25px;

      p {
        margin-bottom: 10px;
      }

      .el-button--primary.is-plain {
        color: #0075ff;
        border: 1px solid #006eff;
        background: #fff;
        display: block;
        margin: 0 auto;
        padding: 0 30px;
        max-width: 150px;
        height: 30px;
        line-height: 28px;
        font-size: 12px;
        box-sizing: border-box;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-radius: 0;
        overflow: hidden;
      }

      .el-button--primary.is-plain:hover {
        color: #fff;
        background-color: #006eff;
        text-decoration: none;
      }
    }
  }
  .table {
    flex: 1;
  }
  .cam_button {
    width: 96%;
    margin: 10px auto;
  }

  .cam-lt {
    float: left;
  }

  .head-container {
    float: right;
  }

  .cam_button {
    position: relative;
  }

  .suo {
    position: absolute;
    right: 0;
  }

  .el-steps--simple {
    background-color: #fff;
  }
  .step {
    width: 100%;
  }
  .button {
    width: 100%;
  }
}
</style>
