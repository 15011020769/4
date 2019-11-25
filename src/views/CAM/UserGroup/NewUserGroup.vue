<template>
  <div class="Cam" id="app">
    <div class="top">
      <i @click="goback" class="el-icon-back" style="padding-right: 10px;font-size: 130%;color: #006eff;font-weight: 900;cursor:pointer;"></i>
      <span class="title-left">{{$t('CAM.CAM.userGroup.addBtn')}}</span>
    </div>
    <div class="container">
      <el-steps :space="200" :active="active" finish-status="success" simple style="margin-top: 20px;margin-right: 450px;padding-left: 10px;">
        <el-step :title="$t('CAM.CAM.userGroup.createWrite')">
        </el-step>
        <el-step :title="$t('CAM.CAM.userGroup.createRelevance')" >
        </el-step>
        <el-step :title="$t('CAM.CAM.userGroup.createCheck')" >
        </el-step>
      </el-steps>
      <div v-show="active==0">
        <template>
          <FirstStep ref="firstStep" :addModel="addModel"/>
        </template>
      </div>
      <div v-show="active==1" >
        <template>
          <SecondStep ref="secondStep" />
        </template>
      </div>
      <div v-show="active==2">
        <template>
          <ThirdlyStep :addModel="addModel" :policiesSelectedData='policiesSelectedData'  />
        </template>
      </div>
      <el-button v-show="active<2&active>0" type="primary" @click="step">上一步</el-button>
      <el-button v-show="active<2" type="primary" style="margin-top: 12px;" @click="next">{{$t('CAM.CAM.userGroup.createNext')}}</el-button>
      <el-button v-show="active==2" type="primary" @click="step">返回</el-button>
      <el-button v-show="active==2" type="primary" @click="confirm">确认</el-button>
    </div>
  </div>
</template>
<script>
  import FirstStep from './AddGroup/AddUserGroup.vue'
  import SecondStep from './AddGroup/PoliciesList'
  import ThirdlyStep from './AddGroup/ConfirmationGroup'
  export default {
    name:'app',
    components: {
      FirstStep,
      SecondStep,
      ThirdlyStep
    },
    data() {
      return {
        active: 0,
        addModel : {
          groupName: '',
          remark: ''
        }
        ,
        policiesSelectedData: []
      };
    },
    methods: {
      goback () {
        this.$router.push({name: 'UserGroup'})
      },
      next() {
        this.policiesSelectedData = this.$refs.secondStep.getDaata()
        const addModel = this.addModel;
        // const addModelRules = this.$refs.firstStep.$refs.addModel
        // const groupNameRules = this.$refs.firstStep.$refs.groupNameRules
        // console.log(groupNameRules)
        // groupNameRules.validate(valid => {
        //   if (valid) {
        //     console.log('(^o^)~ 验证成功！')
        //   } else {
        //     console.log('-_- 验证失败！')
        //   }
        // })
        // console.log(addModelRules.rules)
        // console.log(addModelRules.rules.groupName)
        // console.log(addModelRules.rules.groupName[0].message)
        // console.log(addModelRules.rules.groupName[0].required)
        // console.log(addModelRules.rules.groupName[0].trigger)
        // if(addModelRules.rules.groupName != ''){
        //   return;
        // }
        if (this.active++ > 2) {
          this.active = 0;
        }
      },
      step() {
        if (this.active >0) {
          this.active--;
        }

      },
      confirm() {
        if(this.active ==2) {
         this.$router.push({name: 'UserGroup'})
          // 创建用户组
          let params = {
            Action: 'CreateGroup',
            Version: '2019-01-16'
          }
          if(this.addModel.groupName != null && this.addModel.groupName != ''){
            params["GroupName"] = this.addModel.groupName
          }
          if(this.addModel.remark != null && this.addModel.remark != ''){
            params["Remark"] = this.addModel.remark
          }
          let url = "cam2/CreateGroup"
          let _this = this
          this.axios.post(url, params).then(res => {
            // 获取新创建的用户组ID
            let AttachGroupId = res.Response.GroupId
            let selArr = _this.policiesSelectedData
            // let PolicyIds = []
            // 绑定策略到用户组
            if(AttachGroupId != '' && selArr != '') {
              // let PolicyId = Array
              let PoliciesParams = {
                // Action: 'AttachGroupPolicies',
                Action: 'AttachGroupPolicy',
                // PolicyId: PolicyIds,
                AttachGroupId: AttachGroupId,
                Version: '2019-01-16'
              }
              //目前系统接口只支持单个策略绑定到用户组，不支持多个，所以循环执行绑定方法;此循环只能绑定一个策略。暂时先这么用着，等待接口升级
              for(var i = 0; i < selArr.length; i++) {
                // PolicyIds[i] = selArr[i].policyId
                PoliciesParams['PolicyId'] = selArr[i].policyId
                // 获取策略id
                let url = "cam2/AttachGroupPolicy"
                this.axios.post(url, PoliciesParams).then(res => {
                }).catch(error => {
                  console.log(error)
                })
              }
            }
            // 添加返回值回显，如用户组名称重复
            this.loading = false
          }).catch(error => {
            console.log(error)
          })
        }
      }
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
    width:96%;
    height: 100%;
    // height:570px;
    // min-height: 500px;
    margin:0 auto;
    background: #fff;
    padding:20px;
    p.title,p.explain{
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }
    p.explain {
      font-size: 12px;
      color:#ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }
    .buttons {
      margin-top:25px;
      p {
        margin-bottom:10px;
      }
      .el-button--primary.is-plain {
        color: #0075FF;
        border: 1px solid #006EFF;
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
      .el-button--primary.is-plain:hover{
        color: #fff;
        background-color: #006EFF;
        text-decoration: none;
      }
    }
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
  }
  .cam_button{
    position: relative;
  }
  .suo{
    position: absolute;
    right: 0;
  }

}
</style>
