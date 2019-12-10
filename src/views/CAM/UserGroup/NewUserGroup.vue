<template>
  <div class="Cam" id="app">
    <div class="top">
      <i
        @click="goback"
        class="el-icon-back"
        style="padding-right: 10px;font-size: 130%;color: #006eff;font-weight: 900;cursor:pointer;"
      ></i>
      <span class="title-left">{{$t('CAM.userGroup.addBtn')}}</span>
    </div>
    <div class="container">
      <div class="step">
        <el-steps
          :space="200"
          :active="active"
          simple
          style="margin-top: 20px;margin-right: 450px;padding-left: 10px;"
        >
          <el-step :title="$t('CAM.userGroup.createWrite')"></el-step>
          <el-step :title="$t('CAM.userGroup.createRelevance')"></el-step>
          <el-step :title="$t('CAM.userGroup.createCheck')"></el-step>
        </el-steps>
      </div>
      <div v-show="active==1" style="width:100%;">
        <FirstStep ref="firstStep" :addModel="addModel" />
      </div>
      <div v-show="active==2">
        <SecondStep ref="secondStep" />
      </div>
      <div v-show="active==3">
        <ThirdlyStep :addModel="addModel" :policiesSelectedData="policiesSelectedData" />
      </div>

      <div class="button">
        <el-button
          style="margin-top:70px;"
          type="primary"
          size="medium"
          @click="prev()"
          v-if="active==1 || active==2 || active==3"
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
import FirstStep from "./AddGroup/AddUserGroup.vue";
import SecondStep from "./AddGroup/PoliciesList";
import ThirdlyStep from "./AddGroup/ConfirmationGroup";
export default {
  name: "app",
  components: {
    FirstStep,
    SecondStep,
    ThirdlyStep
  },
  data() {
    return {
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
      if(this.active==2){
        this.policiesSelectedData = this.$refs.secondStep.getDaata();
      }
      const addModel = this.addModel;
      if (this.active++ > 2) {
        this.active = 0;
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
      let _this = this;
      if (this.active == 3) {
        this.$router.push({
          name: "UserGroup"
        });
        // 创建用户组
        let params = {
          Action: "CreateGroup",
          Version: "2019-01-16"
        };
        if (this.addModel.groupName != null && this.addModel.groupName != "") {
          params["GroupName"] = this.addModel.groupName;
        }
        if (this.addModel.remark != null && this.addModel.remark != "") {
          params["Remark"] = this.addModel.remark;
        }
        let url = "cam2/CreateGroup";
        this.axios
          .post(url, params)
          .then(res => {
            // 获取新创建的用户组ID
            let AttachGroupId = res.Response.GroupId;
            let selArr = _this.policiesSelectedData;
            // 绑定策略到用户组
            if (AttachGroupId != "" && selArr != "") {
              let urlPolicies = "cam2/AttachGroupPolicy";
              //目前系统接口只支持单个策略绑定到用户组，不支持多个，所以循环执行绑定方法
              for (var i = 0; i < selArr.length; i++) {
                let paramsurlPolicies = {
                  Action: "AttachGroupPolicy",
                  AttachGroupId: AttachGroupId,
                  PolicyId: selArr[i].PolicyId,
                  Version: "2019-01-16"
                };
                // 获取策略id
                this.axios
                  .post(urlPolicies, paramsurlPolicies)
                  .then(res => {
                    console.log(res)
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }
            }
            // 添加返回值回显，如用户组名称重复
            this.loading = false;
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }
};
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
    display: flex;
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
