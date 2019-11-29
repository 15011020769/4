<template>
  <div class="Cam">
    <div class="top">
      <i
      @click="backoff"
      class="el-icon-back"
      style="padding-right: 10px;
      font-size: 130%;
      color: #006eff;
      font-weight: 900;
      cursor:pointer;"
      ></i>
      <span class="title-left">{{$t('CAM.CAM.userList.addChileUser')}}</span>
    </div>
    <div class="box-ctr">
      <div class="step">
        <el-steps :active="active" direction="vertical" simple :space="200" style="margin-right: 44%"  finish-status="success">
          <el-step :title="$t('CAM.CAM.userList.userInformation')"></el-step>
          <el-step :title="$t('CAM.CAM.userList.userPermissions')"></el-step>
          <el-step :title="$t('CAM.CAM.userList.userInfor')"></el-step>
        </el-steps>
      </div>
      <div >
        <div class="tea-alert">
          <div class="tea-alert__info">{{$t('CAM.CAM.userList.userWhy')}}</div>
        </div>
        <div class="blish">
          <!-- table表格 -->
          <el-form ref="tableData" label-width="100px">
            <el-form-item :label="$t('CAM.CAM.userList.setUser')" prop="type">
              <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                row-style="height:50px" :header-cell-style="{padding:'0'}" cell-style="padding:0" border style="width: 100%"
                @selection-change="handleSelectionChange()"
              >
                <el-table-column prop="name" :label="$t('CAM.CAM.userList.setName')">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('CAM.CAM.userList.setNote')" show-overflow-tooltip prop="mailbox">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.mailbox"></el-input>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('CAM.CAM.userList.setPhone')" width="380">
                  <template slot-scope="scope">
                  <el-select size="mini" v-model="value" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-input size="mini" class="hanlin wid" v-model="scope.row.iphone"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" :label="$t('CAM.CAM.userList.setEmail')">
                  <template slot-scope="scope">
                    <el-input class="hanlin wids" size="mini" v-model="scope.row.remarks"></el-input>
                    <el-button type="text">{{$t('CAM.CAM.userList.setDelete')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="btn">
                <el-button size="small">{{$t('CAM.CAM.userList.setAddUser')}}</el-button>
                <p>{{$t('CAM.CAM.userList.addTenUser')}}</p>
              </div>
            </el-form-item>
            <!-- 接收微信消息 -->
            <el-form-item :label="$t('CAM.CAM.userList.getWeChat')" prop="type">
              <el-switch v-model="value1"></el-switch>
              <div class="describe">
                <p>1.{{$t('CAM.CAM.userList.weChatContent')}}</p>
                <p>2.{{$t('CAM.CAM.userList.setGo')}}</p>
              </div>
            </el-form-item>
            <!-- 访问方式 -->
            <el-form-item :label="$t('CAM.CAM.userList.accessWay')" prop="type">
              <div class="visit">
                <el-checkbox v-model="checked">{{$t('CAM.CAM.userList.programmingAccess')}}</el-checkbox>
                <p>{{$t('CAM.CAM.userList.setMore')}}</p>
                <el-checkbox v-model="checked1">{{$t('CAM.CAM.userList.tencentAccess')}}</el-checkbox>
                <p>{{$t('CAM.CAM.userList.tencentMore')}}</p>
              </div>
            </el-form-item>
            <el-form-item v-if="checked1" label="控制台密码" prop="type">
              <div class="visits">
                <template>
                  <p><el-radio v-model="radio" label="1">自动生成密码</el-radio></p>
                  <p><el-radio v-model="radio" label="2">自定义密码</el-radio></p>
                  <p><el-input v-if="radio == 2" class="wid" size="small" placeholder="" v-model="input" show-password></el-input></p>
                </template>         
              </div>
            </el-form-item>
            <!-- 勾选复选框显示隐藏部分 -->
            <el-form-item v-if="checked1" label="需要重置密码" prop="type">
              <div class="visits">
                  <p><el-checkbox v-model="checked2">用户必须在下次登录时重置密码</el-checkbox></p>
              </div>
            </el-form-item>
            <el-form-item v-if="checked1" label="登录保护" prop="type">
              <div class="visits">
                <template>
                  <p><el-radio v-model="radio2" label="3">启用虚拟 MFA 设备校验</el-radio></p>
                  <p><el-radio v-model="radio2" label="4">不开启</el-radio></p>
                </template>         
              </div>
            </el-form-item>
            <el-form-item v-if="checked1" label="操作保护" prop="type">
              <div class="visits">
                <template>
                  <p><el-radio v-model="radio3" label="5">启用虚拟 MFA 设备校验</el-radio></p>
                  <p><el-radio v-model="radio3" label="6">不开启</el-radio></p>
                </template>        
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="active==2">
        <template>
          <Userprivileges/>
        </template>
      </div>
      <div v-show="active==3">
        <template>
          <Reviewinformation/>
        </template>
      </div>
      <div>
        <el-button style="margin-top: 12px;" type="primary" size="medium" @click="prev()" v-if="active==2 || active==3">上一步</el-button>
        <el-button style="margin-top: 12px;" type="primary" size="medium" @click="next()" v-if="active==0 || active==1 || active==2">下一步</el-button>
        <el-button style="margin-top: 12px;" type="primary" size="medium" @click="complete()" v-if="active==3">完成</el-button>
      </div>
  </div>
</div>
</template>

<script>
import Userprivileges from './Userprivileges'
import Reviewinformation from './Reviewinformation'
export default {
  components:{
    Userprivileges,
    Reviewinformation
  },
  data() {
    return {
      show:false,
      input: '',
      inpsd:false,
      checked: false,
      checked1: false,
      checked2: true,
      checked3: true,
      radio: '1',
      radio2: '3',
      radio3: '5',
      active: 1,
      tableData: [
        {
          name: "",
          remarks: "",
          mailbox: "",
          iphone:"",
          value:""
        }
      ],
      value1: false,
      // Boolean: true,
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: ""
    }
  },

  methods: {
    complete(){
      console.log(this.tableData)
       let params = {
         Action:'AddUser',
         Version:'2019-01-16',
         Name:this.tableData[0].name,
         PhoneNum:this.tableData[0].iphone,
         Remark:this.tableData[0].mailbox,
         Email:this.tableData[0].remarks
       }
       let url = 'cam2/AddUser'
       this.axios.post(url,params).then((data)=>{
           console.log(data)
       })
    },
    prev() {
      --this.active;
      if(this.active < 0) this.active = 0;
    },
    next() {
      if (this.active++ > 3) this.active = 0;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    backoff(){
      this.$router.push({ path: "UserList" });
    }
  },
  created() {
    
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
      font-size: 18px;
      font-weight: bolder;
      margin-left: 20px;
    }
  }
  .box-ctr {
    margin: 0 auto;
    width: 96%;
    background-color: #fff;
    padding: 20px;
  }
  .step {
    height: 59px;
    margin: 0px auto 20px;
    padding: 0px 0px 80px;
    
  }
  .tea-alert {
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 20px;
  }
  .tea-alert,
  .tea-alert__info {
    font-size: 12px;
    line-height: inherit;
  }
  .btn {
    margin-top: 10px;
  }
  .btn p {
    display: inline-block;
    font-size: 12px;
    padding-left: 10px;
  }
  .describe p {
    height: 20px;
    font-size: 12px;
    margin: 0;
    color: #888;
  }
  .visit p {
    height: 20px;
    line-height: 6px;
    padding-left: 20px;
    font-size: 12px;
    margin: 0;
    color: #888;
  }
  .blish {
    border-bottom: 1px solid #ddd;
  }
  .hanlin {
    display: inline-block;
  }
  .wid {
    margin-left: 10px;
    width: 170px;
  }
  .wids{
    width: 120px;
    margin-right: 10px;
  }
  .visits p{
    height: 20px;
    line-height: 6px;
    padding-left: 20px;
    font-size: 12px;
    margin: 0;
    color: #888;
    margin: 10px 0 10px 0;
  }
  .el-steps--simple{
    background-color: #fff;
  }
  .el-steps--simple{
    padding:0 8px;
  }
  .step{
    height: 45px;
    padding: 0;
  }
}
</style>  
