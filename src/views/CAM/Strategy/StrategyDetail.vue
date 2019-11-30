<template>
  <div class="StrategyDetail">
    <div class="top">
      <img
        style="width:20px;cursor: pointer;"
        @click="back"
        src="../../../assets/CAM/images/left.png"
        alt
      >
      <span class="top_text">AdministratorAccess</span>
    </div>
    <div class="container">
      <div class="baseInfo">
        <p class="baseInfo_title">基本信息</p>
        <div class="baseInfo_flex">
          <div class="baseInfo_left">
            <p class="baseInfo_cl item">策略</p>
            <p class="baseInfo_ms item">描述</p>
            <p class="baseInfo_mark item">备注</p>
            <p class="baseInfo_type item">策略类型</p>
            <p class="baseInfo_time item">创建时间</p>
          </div>
          <div class="baseInfo_right">
            <p class="baseInfo_cl item">{{policy.PolicyName}}</p>
            <p class="baseInfo_ms item">{{policy.Description}}</p>
            <p class="baseInfo_mark item">
              <el-input v-if="input_show" v-model="input_Value" size="mini" style="width:150px" placeholder="请输入内容" > </el-input>
              <a v-if="input_show" @click="input_sure" style="margin-left:10px" href="javascript:;" >确定</a>
              <a v-if="input_show" @click="input_cancel" style="margin-left:10px" href="javascript:;" >取消</a>
              <span v-if="!input_show">{{inputValue}}</span>
              <i v-if="!input_show" @click="icon_click" style="cursor: pointer;" class="el-icon-edit item" ></i>
            </p>
            <p class="baseInfo_type item">{{policy.Type}}</p>
            <p class="baseInfo_time item">{{policy.AddTime}}</p>
          </div>
        </div>
      </div>
      <div class="tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="策略语法" name="first">
            <div class="markdown"></div>
          </el-tab-pane>
          <!-- tab 策略详情页面，关联用户组tab  start -->
          <el-tab-pane label="关联用户/组" name="second">
            <div class="config">
              <p style="margin:10px">
                <el-button type="primary" @click="Relation_user" size="small">关联用户/用户组</el-button>
                <el-button type="primary" @click="Relieve_user" size="small" :disabled="display">解除用户/用户组</el-button>
              </p>
              <div class="config_table">
                <el-table
                  v-loading="loading"
                  :data="policysData"
                  height="300"
                  border
                  @selection-change="handleSelectionChange"
                  :row-style="{height:0}"
                  :cell-style="{padding:'5px 10px'}"
                  :header-cell-style="{height:'20px',padding:'0px 10px'}"
                  style="width: 100%">
                  <el-table-column type="selection" width="60"></el-table-column>
                  <el-table-column prop="date" label="关联用户/组">
                    <template slot-scope="scope">
                      <el-button @click="handleClickPolicies(scope.row)" type="text" size="small" >{{scope.row.Name}}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column align="center">
                    <template slot="header">
                      <el-dropdown trigger="click" @command="handleCommand" size="mini">
                        <span style="color:#909399">
                          {{ tableTitle }}
                          <i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-for="item in table_options"
                            :key="item.value"
                            :command="item"
                          >{{item.label}}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                    <template slot-scope="scope">
                      <p v-show="scope.row.RelatedType == '1'">用户关联</p>
                      <p v-show="scope.row.RelatedType == '2'">用户组关联</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="address" label="操作">
                    <template slot-scope='scope'>
                      <el-popover
                        placement="top"
                        title
                        width="400"
                        v-model="popover_visible">
                        <p>解除此用户<span v-show="scope.row.RelatedType == '2'">组</span>后，将不具备该策略对应的权限，是否确认？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text" @click="popover_visible = false">取消</el-button>
                          <el-button type="primary" size="mini" @click="popover_visible = false" >确定解除</el-button>
                        </div>
                        <!-- <el-button size="mini" type="text" @click="popover_visible = true" slot="reference">解除用户<span v-show="scope.row.RelatedType == '2'">组</span></el-button> -->
                        <el-button size="mini" type="text" @click="removePolicyEntity(scope.row)" slot="reference">解除用户<span v-show="scope.row.RelatedType == '2'">组</span></el-button>
                      </el-popover>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px">
                  <div>
                    <span style="font-size:12px;color:#888">已选 0 项，共 309 项</span>
                  </div>
                  <div>
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page.sync="currentPage2"
                      :page-sizes="[100, 200, 300, 400]"
                      :page-size="100"
                      layout="sizes, prev, pager, next"
                      :total="1000"
                    ></el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <!-- tab 策略详情页面，关联用户组tab  end -->
        </el-tabs>
      </div>
      <!-- dialog关联用户组弹框页面 start -->
      <el-dialog :visible.sync="dialogVisible" width="72%" :before-close="handleClosePolicy">
        <p class="dialog">关联用户/用户组</p>
        <div>
         <transfer ref="userTransfer" :PolicyId="policy.PolicyId"></transfer>
        </div>
        <p style="text-align:center;margin-top:20px">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="attachPolicy" size="small">确 定</el-button>
        </p>
      </el-dialog>
      <!-- dialog关联用户组弹框页面 end -->
      <el-dialog :visible.sync="Relieve_dialogVisible" width="30%" :before-close="handleClosePolicyRemove">
        <p class="dialog">解除用户/组</p>
        <div style="margin:15px 0">
          <p>
            已选择1个用户/组，
            <a href="javascript:;" @click="look_detail">查看详情</a>
            <i v-if="!isShow" class="el-icon-caret-bottom"></i>
            <i v-if="isShow" class="el-icon-caret-top"></i>
          </p>
          <div v-if="isShow" class="box">
            <p class="list" v-for="item in policysSelData" :key="item">{{item.Name}}</p>
          </div>
          <h3 style="margin-top:15px">确认是否解除？</h3>
          <p>解除后，以上策略关联的用户或用户组将失去对应的权限。</p>
        </div>
        <p style="text-align:center">
          <el-button @click="Relieve_dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="removePolicysEntity" size="small">确 定</el-button>
        </p>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import transfer from './component/transfer'
export default {
  components: {
    transfer
  },
  data () {
    return {
      activeName: "first",
      policy: {},
      policysData: [],
      policysSelData: [],
      table_options: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '用户关联'
        },
        {
          value: '2',
          label: '用户组关联'
        }
      ],
      entityFilter: '',
      tableTitle: '类型',
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      dialogVisible: false,
      Relieve_dialogVisible: false,
      transfer_value: [],
      transfer_data: [
        {
          value: 1,
          desc: '备选项1'
        },
        {
          value: 2,
          desc: '备选项2'
        },
        {
          value: 3,
          desc: '备选项3'
        }
      ],
      display: true,
      isShow: false,
      popover_visible: false,
      inputValue: '-',
      input_Value: '',
      loading: true,
      input_show: false
    }
  },
  created() {
    console.log(this.$route.query.policy)
    this.policy = this.$route.query.policy
    this.getAttachPolicys()
  },
  methods: {
    // 打开 关联用户/用户组 页面
    Relation_user () {
      this.dialogVisible = true
    },
    // 关闭 关联用户/用户组 页面
    handleClosePolicy() {
      this.dialogVisible = false
    },
    // 关联用户/用户组 跳转用户、用户组页面连接方法
    handleClickPolicies(obj) {

    },
    // 策略添加用户/用户组
    attachPolicy() {
      this.$refs.userTransfer.attachPolicy()
      this.dialogVisible = false
      this.getAttachPolicys() // 重新加载策略关联实体列表
    },
    // 获取策略关联的实体列表
    getAttachPolicys() {
      this.policysData = []
      let policyId = this.policy.PolicyId
      let url = 'cam2/ListEntitiesForPolicy'
      let params = {
        Action: 'ListEntitiesForPolicy',
        Version: '2019-01-16',
        PolicyId: policyId
      }
      let entityFilter = this.entityFilter
      //'All' 表示获取所有实体类型，'User' 表示只获取子账号，'Group' 表示只获取用户组，'Role' 表示只获取角色，默认取 'All'
      if(entityFilter != undefined && entityFilter != '') {
        params['EntityFilter'] = entityFilter
      }else{
        params['EntityFilter'] = 'User|Group'
      }
      this.$axios.post(url, params).then(res => {
        console.log(res)
        // RelatedType 关联类型。1 用户关联 ； 2 用户组关联
        this.policysData = res.Response.List
        this.loading = false
      })
    },
    // 解除策略绑定实体
    removePolicyEntity(obj) {
      let policyId = this.policy.PolicyId
      if(obj != '' && obj.RelatedType === 1){
        let paramsUser = {
          Action: 'DetachUserPolicy',
          Version: '2019-01-16',
          PolicyId: policyId,
          DetachUin: obj.Uin
        }
        this.removeUserPolicy(paramsUser)
      }
      if(obj != '' && obj.RelatedType === 2){
        let paramsGroup = {
          Action: 'DetachGroupPolicy',
          Version: '2019-01-16',
          PolicyId: policyId,
          DetachGroupId: obj.Id
        }
        this.removeGroupPolicy(paramsGroup)
      }
    },
    // 解除绑定到用户的策略
    removeUserPolicy(params) {
      let url = "cam2/DetachUserPolicy"
      this.axios.post(url, params).then(res => {
        console.log(res)
        this.getAttachPolicys() // 重新加载
      }).catch(error => {
          console.log(error)
      })
    },
    // 解除绑定到用户组的策略
    removeGroupPolicy(params) {
      let url = "cam2/DetachGroupPolicy"
      this.axios.post(url, params).then(res => {
        console.log(res)
        this.getAttachPolicys() // 重新加载
      }).catch(error => {
          console.log(error)
      })
    },
    handleClick () {},
    Relieve_user () {
      this.Relieve_dialogVisible = true
    },
    // 批量解除绑定到策略的实体
    removePolicysEntity() {
      let arrs = this.policysSelData
      for(let i = 0; i < arrs.length; i++){
        let obj = arrs[i]
        this.removePolicyEntity(obj)
      }
      this.Relieve_dialogVisible = false
    },
    handleSelectionChange (val) {
      if (val != '') {
        this.policysSelData = val
        this.display = false
      } else {
        this.display = true
      }
    },
    handleClosePolicyRemove() {
      this.Relieve_dialogVisible = false
    },
    handleCommand(command) {
      this.tableTitle = command.label
      if(command.value === '0'){
        this.entityFilter = 'User|Group'
      }
      if(command.value === '1'){
        this.entityFilter = 'User'
      }
      if(command.value === '2'){
        this.entityFilter = 'Group'
      }
      // 重新查询策略关联实体
      this.getAttachPolicys()
    },
    handleSizeChange () {},
    handleCurrentChange () {},
    handleClose () {},
    look_detail () {
      this.isShow = !this.isShow
    },
    icon_click () {
      this.input_show = true
      this.input_Value = this.inputValue
    },
    input_cancel () {
      this.input_show = false
    },
    input_sure () {
      this.inputValue = this.input_Value
      this.input_show = false
    },
    back () {
      this.$router.push('/Strategy')
    }
  }
}
</script>
<style lang='scss' scoped>
.StrategyDetail {
  .top {
    padding: 0 20px;
    background-color: #fff;
    margin-bottom: 20px;
    color: #000;
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
    font-size: 16px;
    .top_text {
      font-size: 16px;
      font-weight: 700;
      vertical-align: bottom;
      margin-left: 20px;
    }
  }
  .container {
    max-width: 96%;
    margin: 0 auto;
    .baseInfo {
      padding: 20px;
      background: #fff;
      margin-bottom: 20px;
      .baseInfo_title {
        font-size: 14px;
        color: #000;
        font-weight: 600;
        line-height: 30px;
        color: #000;
        margin-bottom: 11px;
        height: 30px;
      }
      .baseInfo_flex {
        display: flex;
        color: #888;
        .item {
          padding-bottom: 20px;
        }
        .baseInfo_right {
          padding-left: 20px;
        }
        .baseInfo_left {
          .baseInfo_mark {
            padding-bottom: 40px;
          }
        }
      }
    }
    .tabs {
      background: #fff;
      padding: 20px;
      .markdown {
        width: 725px;
        height: 300px;
        background-color: #ddd;
      }
    }
    .dialog {
      color: #000;
      font-weight: 700;
      line-height: 26px;
      font-size: 14px;
    }
    .box {
      height: 125px;
      width: 360px;
      overflow: auto;
      border: 1px solid #ccc;
      .list {
        padding-left: 10px;
        cursor: pointer;
      }
      .list:hover {
        background: #f4f4f4;
      }
    }
  }
}
</style>
