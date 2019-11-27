<template>
  <div class="createAccount">
    <div class="top">
      <img
        style="width:20px;cursor: pointer;"
        @click="back"
        src="../../../assets/CAM/images/left.png"
        alt
      >
      <span class="top_text">{{$t('CAM.CAM.Role.top_text')}}</span>
    </div>
    <div class="container">
      <div class="contant">
        <div class="step">
          <el-steps :active="active" simple :space="200" finish-status="success">
            <el-step :title="$t('CAM.CAM.Role.step_titile1')"></el-step>
            <el-step :title="$t('CAM.CAM.Role.step_titile2')"></el-step>
            <el-step :title="$t('CAM.CAM.Role.step_titile3')"></el-step>
          </el-steps>
        </div>
        <div v-if="active == 1" class="contant_flex">
          <div class="first">
            <div class="first_left">
              <p style="margin-bottom:40px">{{$t('CAM.CAM.Role.cloudCardType')}}</p>
              <p>{{$t('CAM.CAM.Role.cardId')}}</p>
            </div>
            <div class="first_right">
              <p style="margin-bottom:30px">
                <el-radio v-model="radio" label="1">{{$t('CAM.CAM.Role.currentMainAccount')}}</el-radio>
                <el-radio v-model="radio" label="2">{{$t('CAM.CAM.Role.otherMainAccount')}}</el-radio>
              </p>
              <p>
                <el-input
                  v-model="input_num"
                  placeholder="请输入内容"
                  size="mini"
                  disabled
                  style="width:150px"
                ></el-input>
              </p>
            </div>
          </div>
        </div>
        <div class="tansfer" v-if="active == 2">
          <transfer ref="tansferStep"></transfer>
        </div>
        <div class="shenyue" v-if="active == 3">
          <div class="content_flex">
            <div class="content_left">
              <p class="juese" >{{$t('CAM.CAM.Role.roleName')}}*</p>
              <p class="juese" style="margin-top:55px">{{$t('CAM.CAM.Role.roleDesc')}}</p>
              <p class="juese">{{$t('CAM.CAM.Role.roleCarrier')}}</p>
            </div>
            <div class="content_right">
              <div class="jscontent" style="height:50px">
                <el-input v-model="inputRoleName" :placeholder="$t('CAM.CAM.Role.inputRoleName')" size="mini" @blur="jsname"></el-input>
                <p v-if="have" style="font-size:12px;color:#E1504A;padding-top:10px">{{$t('CAM.CAM.Role.isNotNullRoleName')}}</p>
              </div>
              <p class="jscontent">
                <el-input v-model="inputRoleDesc" placeholder size="mini"></el-input>
              </p>
              <p class="jscontent text">服务-mps.cloud.tencent.com</p>
            </div>
          </div>
          <div class="content_table">
            <el-table :data="policiesSelectedData" height="300" border style="width: 100%">
              <el-table-column prop="PolicyName" :label="$t('CAM.CAM.Role.strategyName')"></el-table-column>
              <el-table-column prop="Description" :label="$t('CAM.CAM.Role.desc')"></el-table-column>
              <el-table-column prop="Type" :label="$t('CAM.CAM.Role.strategyType')"></el-table-column>
            </el-table>
          </div>
        </div>
        <div style="margin:20px 0px">
          <el-button size="small" v-if="active != 1" @click="reTurn">{{$t('CAM.CAM.Role.goBack')}}</el-button>
          <el-button type="primary" size="small" @click="next" v-if="active != 3">{{$t('CAM.CAM.Role.toStep')}}</el-button>
          <el-button type="primary" size="small" v-if="active == 3" @click="complete">{{$t('CAM.CAM.Role.complete')}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import transfer from './component/transfer'
export default {
  components: {
      transfer,
    },
  data() {
    return {
      active: 1,
      input_num: "10001921910",
      inputRoleName: '',
      inputRoleDesc:'',
      have: false,
      radio: "1",
      policiesData: [],
      policiesSelectedData: [],
      transfer_value: [],
      tableData: [
        {
          date: "QCloudFinanceFullAccess",
          name: "	该策略允许您管理账户内财务相关的内容，例如：付款、开票。",
          address: "预设策略"
        }
      ]
    };
  },
  
  methods: {
    back() {
      this.$router.push("/Role");
    },
    next() {
      if (this.active == 1) {
        this.active = this.active + 1;
      } else if (this.active == 2) {
        this.policiesSelectedData = this.$refs.tansferStep.getData()
        console.log(this.policiesSelectedData)
        if (this.active == 3) {
          return;
        }
        this.active = this.active + 1;
      }
    },
    reTurn() {
      if (this.active == 1) {
        return;
      }
      this.active = this.active - 1;
    },
 
    leftCheck(val) {},
    jsname() {
      if (!this.inputName) {
        this.have = true;
      } else {
        this.have = false;
      }
    },
    //新建自定义角色创建
    complete() {
      if (!this.inputRoleName) {
        this.have = true;
        return;
      }
       let params = {
         Action:"CreateRole",
         Version:"2019-01-16",
         RoleName:this.inputRoleName,
         Description:this.inputRoleDesc,
         PolicyDocument:this.policiesSelectedData
       }
       let url = "cam2/CreateRole"
       this.axios.post(url,params).then(data => {
         debugger;
       this.policiesData = data.Response.RoleId
       this.$message("创建角色成功");

       })
    }
  }
};
</script>
<style lang="scss" scoped>
.createAccount {
  .top {
    padding: 0 20px;
    background-color: #fff;
    margin-bottom: 20px;
    color: #000;
    height: 45px;
    line-height: 45px;
    .top_text {
      font-size: 16px;
      font-weight: 700;
      vertical-align: bottom;
      margin-left: 20px;
    }
  }
  .container {
    padding-top: 20px;
    .contant {
      max-width: 96%;
      margin: 0 auto;
      padding: 20px;
      background: #fff;
      .step {
        border-bottom: 1px solid #ddd;
        padding-bottom: 20px;
      }
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
    }
  }
  .shenyue {
    .content_flex {
      display: flex;
      padding: 20px 0 0 5px;
      .content_left {
        color: #888;
        padding-right: 20px;
        .juese {
          margin-bottom: 40px;
          margin-top: 10px;
        }
      }
      .content_right {
        .jscontent {
          margin-bottom: 20px;
        }
        .text {
          margin-top: 35px;
        }
      }
    }
  }
  .first {
    display: flex;
    .first_left {
      color: #888;
    }
    .first_right {
      padding-left: 50px;
    }
  }
}
</style>
