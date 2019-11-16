<template>
  <div class="Cam">
    <div class="top">
      <i class="el-icon-arrow-left" @click="goback()"></i>
      <span class="title-left">自定义用户创建</span>
    </div>
    <div class="box-ctr">
      <div class="step">
        <el-steps :active="active" finish-status="success">
          <el-step title="填写用户信息"></el-step>
          <el-step title="设置用户权限"></el-step>
          <el-step title="审阅信息和权限"></el-step>
        </el-steps>
      </div>
      <div v-show="active==1">
        <div class="tea-alert">
          <div class="tea-alert__info">因子用户登录使用用户名，用户名一经确定将无法更改。在创建用户后，您可以查看并下载密钥等相关信息。</div>
        </div>
        <div class="blish">
          <!-- table表格 -->
          <el-form ref="tableData" label-width="100px">
            <el-form-item label="设置用户信息" prop="type">
              <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                row-style="height:50px" :header-cell-style="{padding:'0'}" cell-style="padding:0" border style="width: 100%"
                @selection-change="handleSelectionChange()"
              >
                <el-table-column prop="name" label="用户名">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="备注" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.mailbox"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="手机" width="380">
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
                <el-table-column prop="mailbox" label="邮箱">
                  <template slot-scope="scope">
                    <el-input class="hanlin wids" size="mini" v-model="scope.row.remarks"></el-input>
                    <el-button type="text">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="btn">
                <el-button size="small">新增用户</el-button>
                <p>(单次最多创建10个用户)</p>
              </div>
            </el-form-item>
            <!-- 接收微信消息 -->
            <el-form-item label="接收微信消息" prop="type">
              <el-switch v-model="value1"></el-switch>
              <div class="describe">
                <p>1.邮箱将收到一封包含二维码的邮件，微信扫码并关注公众号即可接收通知</p>
                <p>2.前往 消息中心->消息订阅 设置微信为接收方式后即可接收消息。</p>
              </div>
            </el-form-item>
            <!-- 访问方式 -->
            <el-form-item label="访问方式" prop="type">
              <div class="visit">
                <el-checkbox v-model="checked">编程访问</el-checkbox>
                <p>启用SecretId和SecretKey，支持腾讯云API、SDK和其他开发工具访问</p>
                <el-checkbox v-model="checked1">腾讯云控制台访问</el-checkbox>
                <p>启用密码，允许用户登录到腾讯云控制台</p>
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
      ],goback () {
        this.$router.push({name: 'UserList'})
      },
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
    border-bottom: 1px solid rgb(221, 221, 221);
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
}
</style>  
