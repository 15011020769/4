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
      <span class="title-left">用户详情</span>
      <span class="title-right">
        <span>CAM用户使用说明</span>
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
                  <span>100011241184_123456789</span>
                  <span class="tag">主账号</span>
                </h3>
              </div>
              <div class="account-right">
                <el-button type="text" @click="dialogVisible = true">修改</el-button>
              </div>
              <el-dialog
                title="编辑信息"
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
                    <el-input
                      class="inp-width"
                      :disabled="true"
                      size="mini"
                      v-model="formLabelAlign.name"
                    ></el-input>
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
                    <el-input class="inps-width" size="mini" v-model="formLabelAlign.type"></el-input>
                  </el-form-item>
                  <el-form-item label-width="160px" label="邮箱">
                    <el-input class="inp-width" size="mini" v-model="formLabelAlign.type"></el-input>
                  </el-form-item>
                  <el-form-item label-width="160px" label="是否允许微信接收通知">
                    <el-switch v-model="value1"></el-switch>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
              </el-dialog>
              <div class="content-box">
                <div class="content-left">
                  <div class="content-id">
                    <label for>
                      账号ID
                      <i>*</i>
                    </label>
                    <span>100011921910</span>
                  </div>
                  <div class="content-remarks">
                    <label for>
                      备注
                      <i>*</i>
                    </label>
                    <span>-</span>
                  </div>
                </div>
                <div class="content-right">
                  <div class="iphone">
                    <label for>
                      手机
                      <i>*</i>
                    </label>
                    <span>+86-</span>
                  </div>
                  <div class="mailbox">
                    <label for>
                      邮箱
                      <i>*</i>
                    </label>
                    <span>-</span>
                  </div>
                  <div class="wechat">
                    <label for>
                      微信
                      <i>*</i>
                    </label>
                    <span>-</span>
                  </div>
                  <div class="notice">
                    <label for>
                      是否允许微信接收通知
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
                <span>快捷操作</span>
              </h3>
              <div class="subscribe">
                <div class="btns">
                  <el-button size="mini" @click="dialogVi = true">订阅消息</el-button>
                </div>
                <el-dialog
                  title="订阅信息"
                  :visible.sync="dialogVi"
                  width="900px"
                  :before-close="handleClose"
                >
                  <div class="title">
                    <p class="title-p">
                      要管理不同消息类型的接收人及接收方式可以前往
                      <a href>消息中心-消息订阅</a>
                    </p>
                  </div>
                  <div class="letter">
                    <div class="receive">
                      <label>消息接收人</label>
                    </div>
                    <div class="number">
                      <p>100011241184_123456789</p>
                    </div>
                  </div>
                  <div class="subs">
                    <label>订阅消息类型</label>
                  </div>
                  <div class="subs-right">
                    <el-table :data="tableData" style="width: 100%; border:1px solid #ddd">
                      <el-table-column type="expand">
                        <el-table :data="tableData" :show-header="showHeader" style="width: 100%">
                          <el-table-column label width="48"></el-table-column>
                          <el-table-column label width="281">
                            <template slot-scope="scope">
                              <span>
                                <el-checkbox v-model="checked">账户欠费通知</el-checkbox>
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
                        <el-checkbox v-model="checked">财务信息</el-checkbox>
                      </el-table-column>
                      <el-table-column label="站内信" prop="name"></el-table-column>
                      <el-table-column label="邮件" prop="desc"></el-table-column>
                      <el-table-column label="短信" prop="id"></el-table-column>
                      <el-table-column label="微信" prop="name"></el-table-column>
                      <el-table-column label="操作" prop="desc">
                        <template slot-scope="scope">
                          <span>
                            <el-link type="primary">展开</el-link>
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>

                  <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVi = false">确 定</el-button>
                    <el-button @click="dialogVi = false">取 消</el-button>
                  </div>
                </el-dialog>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 下半部分 -->
      <div class="userlist">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="组（0）" name="first">
            <div class="userlist-box">
              <div class="userlist-left">
                <i class="iconfont block">&#xe6f8;</i>
                <i>&nbsp;</i>
              </div>
              <div class="userlist-right">
                <h4>开始使用用户组</h4>
                <p>此用户还没有加入任何用户组</p>
                <el-button @click="add" type="primary" size="mini">添加到用户组</el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checked: true,
      dialogVi: false,
      showHeader: false,
      dialogVisible: false,
      activeName: "first",
      labelPosition: "left",
      value1: false,
      value: "+86",
      formLabelAlign: {
        name: "100011241184_123456789",
        region: "",
        type: ""
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
    backoff(){
      this.$router.push({ path: "UserList" });
    }
  }
};
</script>
<style lang="scss">
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
      height: 291px;
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