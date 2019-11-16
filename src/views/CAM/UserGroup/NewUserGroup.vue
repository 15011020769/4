<template>
  <div class="Cam" id="app">
    <div class="top">
      <i class="el-icon-arrow-left" @click="goback"></i>
      <span class="title-left">{{$t('CAM.CAM.userGroup.createBtn')}}</span>
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
          <FirstStep :addModel="addModel"/>
        </template>
      </div>
      <div v-show="active==1">
        <template>
          <SecondStep :addModel="addModel"/>
        </template>
      </div>
      <div v-show="active==2">
        <template>
          <ThirdlyStep :addModel="addModel"/>
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
      };
    },
    methods: {
      goback () {
        this.$router.push({name: 'UserGroup'})
      },
      next() {
        const addModel = this.addModel;
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
    height:570px;
    min-height: 500px;
    margin:10px auto 0;
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
