<template>
  <div class="Cam">
    <div class="top">
      <span class="title-left">用户列表</span>
      <span class="title-right">
        <span>CAM用户使用说明</span>
        <i class="el-icon-share"></i>
      </span>
    </div>
    <div class="explain">
      <p>
        <span>如何查看更多信息？</span>
      </p>
      <p>
        <span>&nbsp;&nbsp;访问管理对您的敏感信息进行安全升级保护，您可以点击列表中【详情】列下拉按钮【?】查看用户的身份安全状态、已加入组以及消息订阅等更多信息。您也可以点击用户名进入用户详细信息中</span>
      </p>
      <p>
        <span>&nbsp;&nbsp;&nbsp;查看或编辑。</span>
      </p>
    </div>

    <div class="cam_button">
      <el-row class="cam-lt">
        <el-button size="small" type="primary" @click="NewUser">新建用户</el-button>
        <template>
          <el-select size="small"  placeholder="更多操作">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </template>
      </el-row>

      <div class="head-container">
        <!-- 搜索 -->
        <el-input
          size="small"
          v-model="value"
          clearable
          placeholder="支持多关键词(间隔为空格)搜索用户名/ID/SecretId/手机/邮箱/备注"
          style="width: 200px;"
          @keyup.enter.native="toQuery"
        />
        <i class="iconfont magnifier" @click="input()">&#xe608;</i>
        <i @click="list = true" class="el-icon-s-tools gear"></i>
        <el-dialog title="自定义列表字段" :visible.sync="list" width="45%" :before-close="handleClose">
          <div>
            <div class="tip_box">
              请选择您想显示的列表详细信息，根据您的分辨率
              <span id="limitTip">，最多勾选6个字段，已勾选6个。</span>
            </div>
            <div>
              <el-form ref="form" :model="form">
                <el-form-item label>
                  <el-checkbox-group v-model="form.type">
                    <el-checkbox disabled label="详情" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label>
                  <el-checkbox-group v-model="form.type">
                    <el-checkbox disabled label="用户名称" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label>
                  <el-checkbox-group v-model="form.type">
                    <el-checkbox disabled label="用户类型" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label>
                  <el-checkbox-group v-model="form.type">
                    <el-checkbox v-model="checked1" label="账号ID" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label>
                  <el-checkbox-group v-model="form.type">
                    <el-checkbox disabled label="关联信息" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label>
                  <el-checkbox-group v-model="form.type">
                    <el-checkbox disabled label="操作" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">确认</el-button>
                  <el-button>取消</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" style="width: 96%; margin: 0 auto;">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="expand" label="详情" width="50">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户名称">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="用户类型">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="账号ID">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
            <el-form-item label="关联信息">
              <span>{{ props.row.address }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="用户名称">
        <template slot-scope="scope">
         <el-link @click="details" type="primary">{{ scope.row.name }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" prop="type">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号ID" prop="id">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="关联信息" prop="relation">
        <template slot-scope="scope">
          <i @click="details" class="el-icon-mobile mobile"></i>
          <i @click="details" class="el-icon-message message"></i>
        </template>
      </el-table-column>
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
              <el-dropdown-item>删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 授权自定义弹框 -->
    <!-- <el-dialog title="关联策略" :visible.sync="authorization" width="80%" :before-close="handleClose">
      <div class="container">
        <div class="container-left">
          <span>策略列表（共{{totalNum}}条）</span>
          <div>
            <el-input
              size="mini"
              v-model="searchValue"
              style="width:89%"
              @keyup.enter.native="toQuery"
            />
            <el-button
              size="mini"
              class="suo"
              icon="el-icon-search"
              show-overflow-tooltip
              @click="toQuery"
            ></el-button>
          </div>
          <el-table
            class="table-left"
            ref="multipleOption"
            :data="policiesData"
            height="300"
            tooltip-effect="dark"
            style="width: 100%; border:1px solid #ddd"
            @row-click="selectedRow"
            @selection-change="handleSelectionChange"
          >
            <el-input
              size="mini"
              v-model="searchValue"
              style="width:40%"
              @keyup.enter.native="toQuery"
            />
            <el-button
              size="mini"
              class="suo"
              icon="el-icon-search"
              show-overflow-tooltip
              @click="toQuery"
            ></el-button>
            <el-table-column type="selection" prop="policyId" width></el-table-column>
            <el-table-column  prop="Description" label="策略名" width></el-table-column>
            <el-table-column prop="PolicyId" label="策略类型" width></el-table-column>
          </el-table>
        </div>

        <div class="abs">
          <div>&nbsp;</div>
        </div>

        <div class="container-left">
          <span>已选择（共条）</span>
          <el-table
            class="table-left"
            ref="multipleSelected"
            :data="policiesSelectedData"
            tooltip-effect="dark"
            height="300"
            style="width: 100%;border:1px solid #ddd"
          >

            <el-table-column  prop="Description" label="策略名" width></el-table-column>
            <el-table-column prop="PolicyId" label="策略类型" width></el-table-column>
             <el-table-column :label="操作" show-overflow-tooltip>
              &lt;!&ndash;
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, policiesSelectedData)"
                  type="text"
                  size="small"
                >移除</el-button>
              </template>&ndash;&gt;
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authorization = false">取 消</el-button>
        <el-button type="primary" @click="authorization = false">确 定</el-button>
      </div>
    </el-dialog> -->
    <el-dialog title="添加到组" :visible.sync="authorization" width="74%" :before-close="handleClose">
      <div class="container">
        <div class="container-left">
          <span>策略列表（共{{totalNum}}条）</span>
          <div>
            <el-input
            size="mini"
            v-model="searchValue"
            style="width:89%"
            @keyup.enter.native="toQuery"
          />
          <el-button
            size="mini"
            class="suo"
            icon="el-icon-search"
            show-overflow-tooltip
            @click="toQuery"
          ></el-button>
          </div>
           
          <el-table
            class="table-left"
            ref="multipleOption"
            :data="policiesData"
            height="300"
            tooltip-effect="dark"
            style="width: 100%; border:1px solid #ddd"
            @row-click="selectedRow"
            @selection-change="handleSelectionChange"
          >
            <el-input
              size="mini"
              v-model="searchValue"
              style="width:40%"
              @keyup.enter.native="toQuery"
            />
            <el-button
              size="mini"
              class="suo"
              icon="el-icon-search"
              show-overflow-tooltip
              @click="toQuery"
            ></el-button>
            <el-table-column type="selection" prop="policyId" width></el-table-column>
            <el-table-column  prop="Description" label="策略名" width></el-table-column>
            <el-table-column prop="PolicyId" label="策略类型" width></el-table-column>
          </el-table>
         
        </div>


  
        <div class="abs">
          <div>&nbsp;</div>
        </div>

        <div class="container-left">
          <span>已选择（共条）</span>
          <el-table
            class="table-left"
            ref="multipleSelected"
            :data="policiesSelectedData"
            tooltip-effect="dark"
            height="300"
            style="width: 100%;border:1px solid #ddd"
          >
            <el-table-column type="selection" prop="policyId" width></el-table-column>
            <el-table-column  prop="Description" label="策略名" width></el-table-column>
            <el-table-column prop="PolicyId" label="策略类型" width></el-table-column>
            <el-table-column :label="操作" show-overflow-tooltip>
              &lt;!&ndash;
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, policiesSelectedData)"
                  type="text"
                  size="small"
                >移除</el-button>
              </template>&ndash;&gt;
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 自定义弹框 -->
    <el-dialog title="添加到组" :visible.sync="dialogVisible" width="74%" :before-close="handleClose">
      <div class="container">
        <div class="container-left">
          <span>策略列表（共{{totalNum}}条）</span>
          <div>
            <el-input
            size="mini"
            v-model="searchValue"
            style="width:89%"
            @keyup.enter.native="toQuery"
          />
          <el-button
            size="mini"
            class="suo"
            icon="el-icon-search"
            show-overflow-tooltip
            @click="toQuery"
          ></el-button>
          </div>
           
          <el-table
            class="table-left"
            ref="multipleOption"
            :data="policiesDatas"
            height="300"
            tooltip-effect="dark"
            style="width: 100%; border:1px solid #ddd"
            @row-click="selectedRow"
            @selection-change="handleSelectionChange"
          >
            <el-input
              size="mini"
              v-model="searchValue"
              style="width:40%"
              @keyup.enter.native="toQuery"
            />
            <el-button
              size="mini"
              class="suo"
              icon="el-icon-search"
              show-overflow-tooltip
              @click="toQuery"
            ></el-button>
            <el-table-column type="selection" prop="policyId" width></el-table-column>
            <el-table-column  prop="GroupName" label="用户名"  width></el-table-column>
            <!-- <el-table-column prop="PolicyId" label="策略类型" width></el-table-column> -->
          </el-table>
         
        </div>


  
        <div class="abs">
          <div>&nbsp;</div>
        </div>

        <div class="container-left">
          <span>已选择（共条）</span>
          <el-table
            class="table-left"
            ref="multipleSelected"
            :data="policiesSelectedData"
            tooltip-effect="dark"
            height="300"
            style="width: 100%;border:1px solid #ddd"
          >
            <el-table-column type="selection" prop="policyId" width="55"></el-table-column>
            <el-table-column label="用户组" width="120" prop="GroupName"></el-table-column>
            <!-- <el-table-column prop="type" label="策略类型" width="120"></el-table-column> -->
            <el-table-column :label="操作" show-overflow-tooltip>
              &lt;!&ndash;
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, policiesSelectedData)"
                  type="text"
                  size="small"
                >移除</el-button>
              </template>&ndash;&gt;
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 自定义弹框 -->
    <el-dialog title="订阅信息" :visible.sync="subscribe" width="700px" :before-close="handleClose">
      <div class="title">
        <p class="title-p">
          要管理不同消息类型的接收人及接收方式可以前往
          <a href>
            消息中心-消息订阅
            <i class="external-link-icon"></i>
          </a>
        </p>
      </div>
      <div class="letter">
        <div class="receive">
          <label>消息接收人</label>
        </div>
        <div class="number">
          <p>123123123123123</p>
        </div>
      </div>
      <div class="subs">
        <label>订阅消息类型</label>
      </div>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
      >
        <div class="tab-top">
          <el-checkbox v-model="checked"></el-checkbox>
          <span>全部</span>
        </div>
        <el-submenu index="1">
          <template slot="title">
            <el-checkbox v-model="checked"></el-checkbox>
            <span>财务消息</span>
          </template>
          <el-menu-item-group>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账户欠费通知
              <span>站内信，邮件，短信，微信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账户提现通知
              <span>站内信，邮件，短信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              余额预警通知
              <span>站内信，邮件，短信，微信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账单出账通知
              <span>站内信，邮件，短信</span>
            </el-checkbox>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <el-checkbox v-model="checked"></el-checkbox>
            <span>产品消息</span>
          </template>
          <el-menu-item-group>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账户欠费通知
              <span>站内信，邮件，短信，微信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账户提现通知
              <span>站内信，邮件，短信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              余额预警通知
              <span>站内信，邮件，短信，微信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账单出账通知
              <span>站内信，邮件，短信</span>
            </el-checkbox>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <el-checkbox v-model="checked"></el-checkbox>
            <span>安全消息</span>
          </template>
          <el-menu-item-group>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账户欠费通知
              <span>站内信，邮件，短信，微信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账户提现通知
              <span>站内信，邮件，短信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              余额预警通知
              <span>站内信，邮件，短信，微信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账单出账通知
              <span>站内信，邮件，短信</span>
            </el-checkbox>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <el-checkbox v-model="checked"></el-checkbox>
            <span>腾讯云动态</span>
          </template>
          <el-menu-item-group>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账户欠费通知
              <span>站内信，邮件，短信，微信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账户提现通知
              <span>站内信，邮件，短信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              余额预警通知
              <span>站内信，邮件，短信，微信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账单出账通知
              <span>站内信，邮件，短信</span>
            </el-checkbox>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <el-checkbox v-model="checked"></el-checkbox>
            <span>运维消息</span>
          </template>
          <el-menu-item-group>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账户欠费通知
              <span>站内信，邮件，短信，微信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账户提现通知
              <span>站内信，邮件，短信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              余额预警通知
              <span>站内信，邮件，短信，微信</span>
            </el-checkbox>
            <el-checkbox class="bor" v-model="checked2" disabled>
              账单出账通知
              <span>站内信，邮件，短信</span>
            </el-checkbox>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subscribe = false">确 定</el-button>
        <el-button @click="subscribe = false">取 消</el-button>
      </div>
    </el-dialog>

    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="40"
      ></el-pagination>
    </div>
  </div>
</template>
<script>


export default {
  props: {
    policiesSelectedData: [
      {
        policyId: String,
        policyName: String,
        description: String,
        attachments: String,
        createMode: String,
        serviceType: String,
        addTime: String,
        type: String
      }
    ]
  },
  data() {
    const generateData = _ => {
      const data = [];
      const cities = ["上海", "北京", "广州", "深圳", "南京", "西安", "成都"];
      const pinyin = [
        "shanghai",
        "beijing",
        "guangzhou",
        "shenzhen",
        "nanjing",
        "xian",
        "chengdu"
      ];
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        });
      });
      return data;
    };
    return {
      policiesDatas:[],
      policiesData: [],
      totalNum: "",
      list: false,
      authorization: false,
      data: generateData(),
      val: [],
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      checked1: true,
      checked2: true,
      subscribe: false,
      dialogVisible: false,
      checked: true,
      tableData: [
        {
          name: "100011241184_123456789",
          type: "主账号",
          id: "12987122"
        },
        {
          name: "13124234325",
          type: "主账号",
          id: "12987122"
        },
        {
          name: "taifucloud",
          type: "主账号",
          id: "12987122"
        }
      ],
      options: [
        {
          value: "选项1",
          label: "添加到组",
          disabled: true
        },
        {
          value: "选项2",
          label: "删除",
          disabled: true
        }
      ],
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  methods: {
  //   input(){
  //     let params = {
  //      Action:'GetUser',
  //      Version:'2019-01-16',
  //      Name:''
  //   }
  //   let url = 'cam2/GetUser'
  //   this.axios.post(url,params).then((data)=>{
  //     console.log(data)
  //   }).catch(error=>{
  //     console.log(error)
  //   })
  // },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    NewUser() {
      this.$router.push({ name: "custormCreate" });
    },
    changeLeftData(val) {
      // console.log("change left data", val);
      // console.log("this is value data:", this.value);
      this.val = [...this.val, ...val];
    },
    details() {
      this.$router.push({ path: "details" });
    },
    handleSelectionChange(val) {
      // 给右边table框赋值，只需在此处赋值即可，selectedRow方法中不写，因为单独点击复选框，只有此方法有效。
      this.policiesSelectedData = val;
    },
    selectedRow(row, column, event) {
      // 设置选中或者取消状态
      this.$refs.multipleOption.toggleRowSelection(row);
    },
    deleteRow(index, rows) {
      // 获取右边框中取消的行数据，将此行数据在右边框中的选中状态取消
      this.$refs.multipleOption.toggleRowSelection(rows[index], false);
    },
    toQuery() {}

  },
  created(){
    //获取授权数据
    let params = {
       Action:'ListPolicies',
       Version:'2019-01-16'
    }
    let url = 'cam2/ListPolicies'
    this.axios.post(url,params).then((data)=>{
       this.policiesData = data.Response.List
    }).catch(error=>{
      console.log(error)
    })
    
    //策略绑定到用户
    let More = {
      Action:'ListGroups',
      Version:'2019-01-16',
    }
    let moreUrl = 'cam2/ListGroups'
    this.axios.post(moreUrl,More).then((data)=>{
      this.policiesDatas = data.Response.GroupInfo
      // console.log(data.Response.GroupInfo)
    }).catch(error=>{
      console.log(error)
    })
   
   }
};
</script>
<style lang="scss" scoped>
.el-transfer-city {
  display: flex;
  .city-left,
  .city-right {
    width: 400px;
    padding: 8px;
  }
  .city-right {
    margin-left: 15px;
  }
  .city-left-header,
  .city-right-header {
    height: 40px;
    padding: 3px;
    border: 1px solid #dcdfe6;
    .el-input {
      width: 300px;
    }
  }
  .city-right-header {
    display: flex;
  }
  .scrollbar-change {
    height: 350px;
    width: 100%;
    background-color: #fff;
    border-radius: 5px;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .city-middle {
    padding: 60px 20px;
    .middle-left {
      display: block;
      margin-top: 10px;
      margin-left: 0;
    }
    .middle-right {
      display: block;
      margin-right: 0;
    }
    .middle-left,
    .middle-right {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      padding: 0;
    }
  }
  .left-select-all {
    float: right;
    margin: 10px 7px 0 0;
  }
  .clear-select-all {
    float: right;
    margin: 10px 7px 0 0;
    font-size: 14px;
    color: #0000ff;
    cursor: pointer;
  }
  .el-radio-group {
    font-size: 14px;
    margin: 13px auto;
    float: left;
  }
}
.Cam {
  .top {
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
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
  .tip_box {
    background: #e5f0ff;
    padding: 8px 10px;
    margin-bottom: 15px;
    border-radius: 2px;
    border: 1px solid #97c7ff;
    line-height: 20px;
    color: #003b80;
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
  .el-form-item {
    margin-bottom: 0;
  }
  .content {
    padding: 20px;
    .operation {
      margin-bottom: 10px;
    }
    .search {
      overflow: hidden;
      padding: 10px 0;
      .search-left {
        float: left;
        .searchBox {
          display: inline-block;
        }
      }
      .search-right {
        float: right;
        margin-top: 10px;
        :hover {
          cursor: pointer;
        }
        i {
          padding: 0 3px;
        }
      }
    }
    .cam-pag {
      padding: 10px 0;
      display: flex;
      justify-content: flex-end;
    }
  }
  .magnifier {
    right: 30px;
    top: 6px;
    position: absolute;
  }
  .tc-15-search .tc-15-btn.search {
    position: absolute;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: 28px !important;
    right: 1px;
    border: none;
    height: 28px;
    top: 1px;
    z-index: 99;
  }
  .mobile {
    font-size: 120%;
    cursor: pointer;
    margin-right: 10px;
  }
  .message {
    cursor: pointer;
    font-size: 120%;
  }
  .subs {
    text-align: center;
    padding-right: 20px;
    float: left;
  }
  .explain {
    width: 96%;
    font-size: 12px;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    border-radius: 2px;
    background: #e5f0ff;
    position: relative;
    box-sizing: border-box;
    margin-left: auto;
    margin-right: auto;
  }
  .explain p {
    line-height: 1.5;
    margin-bottom: 8px;
  }
  .cam_button {
    height: 40px;
    width: 96%;
    margin: 10px auto;
  }
  .cam-lt {
    float: left;
  }
  .head-container {
    position: relative;
    float: right;
  }
  .head-container .gear {
    cursor: pointer;
    font-size: 140%;
    color: #888888;
    margin: 2px 0 0 5px;
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
    margin-top: 10px;
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
  .container {
    width: 96%;
    height: 270px;
    min-height: 360px;
    margin: 10px auto 0;
    background: #fff;
    padding: 20px;
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
    .abs {
      display: inline-block;
      width: 100px;
      height: 300px;
      text-align: center;
    }
    .container-left {
      width: 44%;
      display: inline-block;
    }
  }
}
</style>

