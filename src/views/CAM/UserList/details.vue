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
      <span class="title-left">{{$t('CAM.CAM.userDetails.title')}}</span>
      <span class="title-right">
        <span>{{$t('CAM.CAM.userDetails.CAMUse')}}</span>
        <i class="el-icon-share"></i>
      </span>
    </div>
    <!-- 上半部分 -->
    <div class="details">
      <el-row :gutter="20">
        <el-col :span="20">
          <div class="grid-content bg-purple">
            <div class="account">
              <div class="account-left">
                <h3>
                  <span>{{content.Name}}</span>
                  <span class="tag">{{$t('CAM.CAM.userDetails.userNumb')}}</span>
                </h3>
              </div>
              <div class="account-right">
                <el-button
                  type="text"
                  @click="dialogVisible = true"
                >{{$t('CAM.CAM.userDetails.updata')}}</el-button>
              </div>
              <el-dialog
                :title="$t('CAM.CAM.userDetails.updataTest')"
                :visible.sync="dialogVisible"
                width="40%"
                :before-close="handleClose"
              >
                <el-form
                  :label-position="labelPosition"
                  label-width="160px"
                  :model="formLabelAlign"
                >
                  <el-form-item label="用户名">
                    <el-input class="inp-width" size="mini" v-model="formLabelAlign.name"></el-input>
                  </el-form-item>
                  <el-form-item label-width="160px" label="备注">
                    <el-input class="inp-width" size="mini" v-model="formLabelAlign.region"></el-input>
                  </el-form-item>
                  <el-form-item label-width="160px" label="手机">
                    <select class="slt-width">
                      <option value="+86">+86</option>
                      <option value="阿尔巴尼亚(+355)">+355</option>
                      <option value></option>
                      <option value></option>
                    </select>
                    <el-input class="inps-width" size="mini" v-model="formLabelAlign.phone"></el-input>
                  </el-form-item>
                  <el-form-item label-width="160px" label="邮箱">
                    <el-input class="inp-width" size="mini" v-model="formLabelAlign.email"></el-input>
                  </el-form-item>
                  <el-form-item label-width="160px" label="是否允许微信接收通知">
                    <el-switch v-model="value1"></el-switch>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button size="mini" type="primary" @click="sureUpdata">确 定</el-button>
                  <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
                </span>
              </el-dialog>
              <div class="content-box">
                <div class="content-left">
                  <div class="content-id">
                    <label for>
                      {{$t('CAM.CAM.userDetails.numbId')}}
                      <i>*</i>
                    </label>
                    <span>{{content.Uin}}</span>
                  </div>
                  <div class="content-remarks">
                    <label for>
                      {{$t('CAM.CAM.userDetails.rember')}}
                      <i>*</i>
                    </label>
                    <span>{{content.Remark}}</span>
                  </div>
                </div>
                <div class="content-right">
                  <div class="iphone">
                    <label for>
                      {{$t('CAM.CAM.userDetails.phone')}}
                      <i>*</i>
                    </label>
                    <span>+86-{{content.PhoneNum}}</span>
                  </div>
                  <div class="mailbox">
                    <label for>
                      {{$t('CAM.CAM.userDetails.email')}}
                      <i>*</i>
                    </label>
                    <span>-{{content.Email}}</span>
                  </div>
                  <div class="wechat">
                    <label for>
                      {{$t('CAM.CAM.userDetails.weChat')}}
                      <i>*</i>
                    </label>
                    <span>-</span>
                  </div>
                  <div class="notice">
                    <label for>
                      {{$t('CAM.CAM.userDetails.recive')}}
                      <i>*</i>
                    </label>
                    <span>否</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <div class="quick">
              <h3>
                <span>{{$t('CAM.CAM.userDetails.shortcuts')}}</span>
              </h3>
              <div class="subscribe">
                <div class="btns">
                  <el-button size="mini" @click="dialogVi = true">{{$t('CAM.CAM.userDetails.news')}}</el-button>
                </div>
                <el-dialog
                  :title="$t('CAM.CAM.userDetails.news')"
                  :visible.sync="dialogVi"
                  width="900px"
                  :before-close="handleClose"
                >
                  <div class="title">
                    <p class="title-p">
                      {{$t('CAM.CAM.userDetails.newsTitle')}}
                      <a
                        href
                      >{{$t('CAM.CAM.userDetails.test')}}</a>
                    </p>
                  </div>
                  <div class="letter">
                    <div class="receive">
                      <label>{{$t('CAM.CAM.userDetails.testPerson')}}</label>
                    </div>
                    <div class="number">
                      <p>100011241184_123456789</p>
                    </div>
                  </div>
                  <div class="subs">
                    <label>{{$t('CAM.CAM.userDetails.testType')}}</label>
                  </div>
                  <div class="subs-right">
                    <el-table :data="tableData" style="width: 100%; border:1px solid #ddd">
                      <el-table-column type="expand">
                        <el-table :data="tableData" :show-header="showHeader" style="width: 100%">
                          <el-table-column label width="48"></el-table-column>
                          <el-table-column label width="281">
                            <template slot-scope="scope">
                              <span>
                                <el-checkbox
                                  v-model="checked"
                                >{{$t('CAM.CAM.userDetails.oweInform')}}</el-checkbox>
                              </span>
                            </template>
                          </el-table-column>
                          <el-table-column label width="85">
                            <template slot-scope="scope">
                              <span>
                                <i class="el-icon-circle-check"></i>
                              </span>
                            </template>
                          </el-table-column>
                          <el-table-column label width="83">
                            <template slot-scope="scope">
                              <span>
                                <i class="el-icon-circle-check"></i>
                              </span>
                            </template>
                          </el-table-column>
                          <el-table-column label width="83">
                            <template slot-scope="scope">
                              <span>
                                <i class="el-icon-circle-check"></i>
                              </span>
                            </template>
                          </el-table-column>
                          <el-table-column label width="83">
                            <template slot-scope="scope">
                              <span>
                                <i class="el-icon-circle-check"></i>
                              </span>
                            </template>
                          </el-table-column>
                          <el-table-column label width="83"></el-table-column>
                        </el-table>
                      </el-table-column>
                      <el-table-column label prop="id" width="281px">
                        <el-checkbox v-model="checked">{{$t('CAM.CAM.userDetails.financial')}}</el-checkbox>
                      </el-table-column>
                      <el-table-column :label="$t('CAM.CAM.userDetails.standLetter')" prop="name"></el-table-column>
                      <el-table-column :label="$t('CAM.CAM.userDetails.setEmail')" prop="desc"></el-table-column>
                      <el-table-column :label="$t('CAM.CAM.userDetails.SMS')" prop="id"></el-table-column>
                      <el-table-column :label="$t('CAM.CAM.userDetails.weChat')" prop="name"></el-table-column>
                      <el-table-column :label="$t('CAM.CAM.userDetails.operation')" prop="desc">
                        <template slot-scope="scope">
                          <span>
                            <el-link type="primary">{{$t('CAM.CAM.userDetails.open')}}</el-link>
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>

                  <div slot="footer" class="dialog-footer">
                    <el-button size="mini" type="primary" @click="dialogVi = false">确定</el-button>
                    <el-button size="mini" @click="dialogVi = false">取 消</el-button>
                  </div>
                </el-dialog>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 下半部分 -->
      <div class="userlist">
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="权限(0)" name="first">
              <div class="explain">
                <p>关联策略以获取策略包含的操作权限。解除策略将失去策略包含的操作权限。特别的，解除随组关联类型的策略是通过将用户从关联该策略的用户组中移出。</p>
              </div>
              <el-button class="clButton" type="primary" @click="NewUser" size="small">关联策略</el-button>
              <el-button class="clButton" type="primary" @click="NewUser" size="small" disabled="true">解除策略</el-button>
            
    <el-table :data="tableDatas" style="width: 96%; margin: 0 auto;">
      <el-table-column type="selection" width="55" v-if="show"></el-table-column>
      <el-table-column label="策略名" prop="PolicyName"></el-table-column>

      <el-table-column label="关联类型" prop="Remark"></el-table-column>

      <el-table-column label="策略类型"  prop="Type"> 
         <template slot-scope="scope">
            {{scope.row.Type == '1'?'自定义策略':'预设策略'}}
         </template>
      </el-table-column>

      <el-table-column label="关联时间" prop="AddTime" ></el-table-column>
      <el-table-column prop="oper" label="操作" width="140">
        <template scope="scope">
          <el-button @click="authorization=true" type="text">授权</el-button>
          <span>|</span>
          <el-dropdown :hide-on-click="false">
            <span class="el-dropdown-link" style="color: #3E8EF7">
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text" style="color:#000" @click="dialogVisible= true">添加到组</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="text" style="color:#000" @click="subscribe= true">订阅信息</el-button>
              </el-dropdown-item>
              <!-- <el-dropdown-item>删除</el-dropdown-item> -->
              <el-button type="text" style="color:#000;padding-left:20px;"  @click="todeleteShow(scope.row)">删除</el-button>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
</el-tab-pane>


            <el-tab-pane label="组(1)" name="second">
              <el-button class="clButton" type="primary" @click="NewUser" size="small">加入到组</el-button>
              <el-button class="clButton" type="primary" @click="NewUser" size="small" disabled="true">移出组</el-button>
                 <el-table :data="teamTableData" style="width: 96%; margin: 0 auto;">
      <el-table-column type="selection" width="55" v-if="show"></el-table-column>
      <el-table-column label="组名称"></el-table-column>
      <el-table-column label="关联策略"></el-table-column>
      <el-table-column label="备注"> </el-table-column>
      <el-table-column label="操作"></el-table-column>
      <el-table-column prop="oper" label="操作" width="140"></el-table-column>
       </el-table>
            </el-tab-pane>

            <el-tab-pane label="安全" name="third">安全</el-tab-pane>
            <el-tab-pane label="API密钥" name="fourth">密钥</el-tab-pane>
            <el-tab-pane label="小程序" name="fifth" v-yjy>小程序</el-tab-pane>
          </el-tabs>
        </template>
      </div>
    </div>
  </div>
</template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  directives: {
    yjy: {
      inserted: function(el) {
        console.log(111);
      }
    }
  },
  data() {
    return {
      show:true,
      disabled:false,
      tableDatas: [],
      content: {},
      checked: true,
      dialogVi: false,
      showHeader: false,
      dialogVisible: false,
      activeName: "first",
      labelPosition: "left",
      value1: false,
      value: "+86",
      formLabelAlign: {
        name: "",
        region: "",
        type: "",
        phone: "",
        email: ""
      },
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
      tableData: [
        {
          id: "",
          name: "",
          category: "",
          desc: "",
          address: "",
          shop: "",
          shopId: ""
        },
        {
          id: "",
          name: "",
          category: "",
          desc: "",
          address: "",
          shop: "",
          shopId: ""
        },
        {
          id: "",
          name: "",
          category: "",
          desc: "",
          address: "",
          shop: "",
          shopId: ""
        },
        {
          id: "",
          name: "",
          category: "",
          desc: "",
          address: "",
          shop: "",
          shopId: ""
        }
      ]
    };
  },
  methods: {
    init() {
      let userList = {
        Action: "ListUsers",
        Version: "2019-01-16"
      };
      let userListUrl = "cam2/ListUsers";
      this.axios
        .post(userListUrl, userList)
        .then(data => {
          this.tableData = data.Response.Data;
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    sureUpdata() {
      console.log("11");
      let params = {
        policyDocument: {
          "version":"2.0",
          "statement":[{
               "action":"name/sts:AssumeRole",
               "effect":"allow",
               "principal":{
                 "qcs":["qcs::cam::uin/100011921910:root"]
                }
            }]
        },
        Action: "UpdateUser",
        Version: "2019-01-16",
        Name: this.formLabelAlign.name,
        Email: this.formLabelAlign.email,
        PhoneNum: this.formLabelAlign.phone,
        Remark: this.formLabelAlign.region
      };
      let url = "cam2/UpdateUser";
      this.axios.post(url, params).then(data => {
        console.log(data);
        this.init();
      });
      this.dialogVisible = false;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    add() {
      this.$router.push({ path: "adduser" });
    },
    backoff() {
      this.$router.push({ path: "UserList" });
    }
  },
  created() {
    var data = 
    this.content = this.$route.query.content;
    let params = {
      Action:'ListPolicies',
      Version:'2019-01-16'
    }
    let url = 'cam2/ListPolicies'
    this.axios.post(url,params).then((data)=>{
       this.tableDatas = data.Response.List
    })
  }
};
</script>
<style lang="scss">
.table1{
  text-align: center;
}
.clButton {
  margin-top: 15px;
}
.explain {
  width: 100%;
  font-size: 12px;
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  border-radius: 2px;
  background: #e5f0ff;
  position: relative;
  box-sizing: border-box;
}
.aaa {
  padding: 0 !important;
}
.Cam {
  .top {
    height: 45px;
    line-height: 45px;
    padding: 0 20px;
    background: #fff;
    .title-left {
      font-size: 14px;
      font-weight: bolder;
    }
    .title-right {
      float: right;
      span:hover {
        color: #006eff;
        border-bottom: 1px solid #006eff;
      }
    }
  }
  .details {
    padding: 20px;
    .account {
      width: 100%;
      height: 226px;
      padding: 20px;
      font-size: 12px;
      background-color: #ffffff;
      margin-right: 2%;
    }
    .el-table__expanded-cell {
      padding: 0 !important;
    }
    .subs-right {
      width: 87%;
      display: inline-block;
    }
    .btns {
      text-align: center;
    }
    .tag {
      font-size: 12px;
      line-height: 20px;
      height: 20px;
      color: #006eff;
      background-color: #cfe4ff;
      padding-left: 10px;
      padding-right: 10px;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;
      margin-left: 10px;
    }
    .account-left {
      width: 80%;
      display: inline-block;
    }
    .account-right {
      width: 20%;
      display: inline-block;
      text-align: right;
    }
    .btn {
      padding: 0;
    }
    .content-box {
      width: 100%;
      height: 164px;
    }
    .content-left {
      float: left;
      width: 40%;
    }
    .content-right {
      border-left: 1px solid #ddd;
      float: left;
      width: 55%;
    }
    .content-id {
      vertical-align: baseline;
      color: #888;
      padding-right: 20px;
      padding-top: 6px;
      padding-bottom: 6px;
      width: 100%;
      margin-bottom: 14px;
    }
    .content-remarks {
      vertical-align: baseline;
      color: #888;
      padding-right: 20px;
      padding-top: 6px;
      padding-bottom: 6px;
      width: 100%;
    }
    .content-id i,
    .content-remarks i {
      color: red;
    }
    .content-id label,
    .content-remarks label {
      width: 60px;
      display: inline-block;
    }
    .content-id span,
    .content-remarks span {
      color: #000;
    }
    .iphone {
      vertical-align: baseline;
      color: #888;
      padding-right: 20px;
      padding-top: 6px;
      padding-bottom: 6px;
      width: 100%;
    }
    .mailbox {
      vertical-align: baseline;
      color: #888;
      padding-right: 20px;
      padding-top: 6px;
      padding-bottom: 6px;
      width: 100%;
    }
    .wechat {
      vertical-align: baseline;
      color: #888;
      padding-right: 20px;
      padding-top: 6px;
      padding-bottom: 6px;
      width: 100%;
    }
    .notice {
      vertical-align: baseline;
      color: #888;
      padding-right: 20px;
      padding-top: 6px;
      padding-bottom: 6px;
      width: 100%;
    }
    .iphone,
    .mailbox,
    .wechat {
      margin-bottom: 18px;
    }
    .iphone i,
    .mailbox i,
    .wechat i,
    .notice i {
      color: red;
    }
    .iphone label,
    .mailbox label,
    .wechat label,
    .notice label {
      width: 160px;
      display: inline-block;
      padding-left: 10px;
    }
    .userlist {
      margin-top: 20px;
      padding: 20px;
      height: 600px;
      background-color: #ffffff;
    }
    .quick {
      width: 100%;
      height: 226px;
      padding: 20px;
      font-size: 12px;
      background-color: #ffffff;
    }
    .quick h3 {
      margin-bottom: 18px;
    }
    .userlist-box {
      width: 234px;
      margin: 50px auto;
    }
    .userlist-left {
      display: inline-block;
    }
    .userlist-left i {
      display: block;
      color: #006eff;
      font-size: 266%;
    }
    .userlist-right {
      display: inline-block;
    }
    .userlist-right h4 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .userlist-right p {
      font-size: 14px;
      line-height: 1.5;
      color: #a2a2a2;
      margin-bottom: 10px;
    }
    .inp-width {
      width: 200px;
    }
    .inps-width {
      width: 120px;
    }
    .slt-width {
      width: 80px;
      height: 28px;
      border: 1px solid #ddd;
      border-right: none;
      background: #f2f2f2;
      font-size: 12px;
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
    .title {
      width: 100%;
      font-size: 12px;
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
    }
    .demo-table-expand {
      font-size: 0;
    }
    .demo-table-expand label {
      width: 90px;
      color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
    .letter {
      margin-bottom: 30px;
      width: 100%;
      margin-top: 20px;
    }
    .receive {
      text-align: center;
      display: inline-block;
      padding-right: 34px;
    }
    .number {
      display: inline-block;
    }
    .cam_button {
      position: relative;
    }
    .suo {
      position: absolute;
      right: 0;
    }
    .title {
      width: 100%;
      font-size: 12px;
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
    }
    .el-submenu {
      width: 100%;
      margin: 0 auto;
      border: 1px solid #dddddd;
      border-bottom: 0;
    }
    .el-menu {
      display: inline-block;
      height: 300px;
      width: 500px;
      overflow: auto;
    }
    .bor {
      margin: 0;
      width: 100%;
      height: 30px;
      line-height: 30px;
      padding-left: 5%;
      border-top: 1px solid #dddddd;
    }
    .block {
      float: right;
      padding-bottom: 20px;
      padding-right: 20px;
    }
    .tab-top {
      height: 56px;
      line-height: 56px;
      border: 1px solid #dddddd;
      border-bottom: 0;
      padding: 0 20px;
    }
    .btn {
      margin-top: 20px;
      text-align: center;
    }
    .subs {
      text-align: center;
      padding-right: 20px;
      float: left;
    }
  }
}
</style>