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
              <el-input
                v-if="input_show"
                v-model="input_Value"
                size="mini"
                style="width:150px"
                placeholder="请输入内容"
              ></el-input>
              <a
                v-if="input_show"
                @click="input_sure"
                style="margin-left:10px"
                href="javascript:;"
              >确定</a>
              <a
                v-if="input_show"
                @click="input_cancel"
                style="margin-left:10px"
                href="javascript:;"
              >取消</a>
              <span v-if="!input_show">{{inputValue}}</span>
              <i
                v-if="!input_show"
                @click="icon_click"
                style="cursor: pointer;"
                class="el-icon-edit item"
              ></i>
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
          <el-tab-pane label="关联用户/组" name="second">
            <div class="config">
              <p style="margin:10px">
                <el-button type="primary" @click="Relation_user" size="small">关联用户/用户组</el-button>
                <el-button
                  type="primary"
                  @click="Relieve_user"
                  size="small"
                  :disabled="display"
                >解除用户/用户组</el-button>
              </p>
              <div class="config_table">
                <el-table
                  :data="tableData"
                  height="300"
                  border
                  @selection-change="handleSelectionChange"
                  :row-style="{height:0}"
                  :cell-style="{padding:'5px 10px'}"
                  :header-cell-style="{height:'20px',padding:'0px 10px'}"
                  style="width: 100%"
                >
                  <el-table-column type="selection" width="60"></el-table-column>
                  <el-table-column prop="Name" label="关联用户/组">
                    <template slot-scope="scope">
                      <el-button
                        @click="handleClick1(scope)"
                        type="text"
                        size="small"
                      >{{scope.row.Name}}</el-button>
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
                            :command="item.label"
                          >{{item.label}}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                    <template slot-scope="scope">
                      <div v-if="scope.row.RelatedType == '1'" class="off_color">用户</div>
                      <div v-else-if="scope.row.RelatedType == '2'" class="close_color">用户组</div>
                      <div v-else-if="scope.row.RelatedType == '3'" class="close_color">角色</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="operate" label="操作">
                    <template slot-scope='scope'>
                      <el-button @click="detachPolicy(scope.row)" type="text" size="small">解除用户</el-button>
                      <!-- <el-popover
                        placement="bottom"
                        title
                        width="400"
                        trigger="click"
                        v-model="popover_visible"
                      >
                        <p style="margin:20px 10px">解除此用户后，将不具备该策略对应的权限，是否确认？</p>
                        <div style="text-align: right; margin: 0">
                          <el-button size="mini" type="text" @click="popover_visible = false">取消</el-button>
                          <el-button
                            type="primary"
                            size="mini"
                            @click="popover_visible = false"
                          >确定解除</el-button>
                        </div>
                        <a href="javascript:;" slot="reference">解除用户</a>
                      </el-popover> -->
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px"
                >
                  <div>
                    <span style="font-size:12px;color:#888">已选 0 项，共 {{total}} 项</span>
                  </div>
                  <div>
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page.sync="currentPage"
                      :page-sizes="[100, 200, 300, 400]"
                      :page-size=pageSize
                      layout="sizes, prev, pager, next"
                      :total=total
                    ></el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 关联用户/用户组 模态框 -->
      <!-- <el-dialog :visible.sync="dialogVisible" width="72%" :before-close="handleClose">
        <p class="dialog">关联用户/用户组</p>
        <div>
         <transfer></transfer>
        </div>
        <p style="text-align:center;margin-top:20px">
          <el-button @click="dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false" size="small">确 定</el-button>
        </p>
      </el-dialog> -->
      <el-dialog :visible.sync="dialogVisible" width="40%">
        <h3 style="color:#000;margin-bottom:20px;">关联用户/用户组</h3>
        <div class="dialog_div">
          <el-transfer
            v-model="transfer_value"
            :titles="['关联用户', '已选择']"
            :props="{key: 'Uin',label: 'Name'}"
            :data="transfer_data"
            filterable
            @change="handleChange"
          ></el-transfer>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="attachPolicy">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 解除用户/组 模态框 -->
      <el-dialog :visible.sync="Relieve_dialogVisible" width="30%" :before-close="handleClose">
        <p class="dialog">解除用户/组</p>
        <div style="margin:15px 0">
          <p>
            已选择1个用户/组，
            <a href="javascript:;" @click="look_detail">查看详情</a>
            <i v-if="!isShow" class="el-icon-caret-bottom"></i>
            <i v-if="isShow" class="el-icon-caret-top"></i>
          </p>
          <div v-if="isShow" class="box">
            <p class="list" v-for="item in RelieveData" :key="item">{{item}}</p>
          </div>
          <h3 style="margin-top:15px">确认是否解除？</h3>
          <p>解除后，以上策略关联的用户或用户组将失去对应的权限。</p>
        </div>
        <p style="text-align:center">
          <el-button @click="Relieve_dialogVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="Relieve_dialogVisible = false" size="small">确 定</el-button>
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
      entityFilter: 'All', // 4种值：All User Group Role
      tableData: [{}],
      table_options: [
        {
          value: '选项1',
          label: '全部'
        },
        {
          value: '选项2',
          label: '用户'
        },
        {
          value: '选项3',
          label: '用户组'
        }
      ],
      tableTitle: '类型',
      dialogVisible: false,
      Relieve_dialogVisible: false,
      transfer_value: [],
      //  用户列表
      transfer_data: [{}],
      // 选定的用户列表
      transfer_data_right: [],

      display: true,
      RelieveData: [],
      isShow: false,
      popover_visible: false,
      inputValue: '-',
      input_Value: '',
      input_show: false,
      pageSize: 100,
      total: 0,
      currentPage: 1,
    }
  },
  created() {
    console.log(this.$route.query.policy)
    this.policy = this.$route.query.policy
  },
  methods: {
    // 切换选择tab标签页
    handleClick (obj) {
      console.log(obj.name)
      if (obj.name == 'second') {
        this.listEntitiesForPolicy()
      }
    },
    // 查询策略关联实例列表
    listEntitiesForPolicy () {
      let params = {
        Version: '2019-01-16',
        PolicyId: this.policy.PolicyId,
        EntityFilter: this.entityFilter
      }
      this.$axios.post('cam2/ListEntitiesForPolicy', params).then(res => {
        console.log(res)
        this.tableData = res.Response.List
        this.total = res.Response.TotalNum
      })
    },
    // 解除用户、用户组
    detachPolicy (entity) {
      console.log()
      if (entity.RelatedType == 1) {  // user
        let params = {
          Version: '2019-01-16',
          PolicyId: this.policy.PolicyId,
          DetachUin: entity.Uin
        }
        this.$axios.post('cam2/DetachUserPolicy', params).then(res => {
          this.listEntitiesForPolicy()
        })
      } else if (entity.RelatedType == 2) { // group
        let params = {
          Version: '2019-01-16',
          PolicyId: this.policy.PolicyId,
          DetachGroupId: entity.Id
        }
        this.$axios.post('cam2/DetachGroupPolicy', params).then(res => {
          this.listEntitiesForPolicy()
        })
      }
    },
    // 根据条件查询：策略关联的实例列表
    handleCommand (command) {
      this.tableTitle = command
      if (command == "全部") {
        this.entityFilter = 'All'
      } else if (command == "用户") {
        this.entityFilter = 'User'
      } else if (command == '用户组') {
        this.entityFilter = 'Group'
      }
      this.listEntitiesForPolicy()
    },
    // 2.穿梭框：value右侧框值、direction操作、movedKeys移动值
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
      this.transfer_data_right = value
    },
    // 3.关联用户、用户组
    attachPolicy(){
      if(this.transfer_data_right.length > 0) {
        for(let i=0; i < this.transfer_data_right.length; i++) {
          this.attachUserPolicy(this.policy.PolicyId, this.transfer_data_right[i])
        }
      }
      setTimeout(() => {
        this.listEntitiesForPolicy()
      }, 1000) // 延时1000ms刷新页面
      this.dialogVisible = false
    },
    // 4.绑定策略到用户
    attachUserPolicy(val1, val2) {
      let params = {
        Version: '2019-01-16',
        PolicyId: val1,
        AttachUin: val2
      }
      this.$axios.post('cam2/AttachUserPolicy', params).then(res  => {
        console.log(res)
      })
    },
    // 1.关联用户 模态框
    Relation_user () {
      // this.policyId = this.policy.PolicyId
      this.transfer_data.splice(0, this.transfer_data.length)
      this.transfer_data_right.splice(0, this.transfer_data_right.length)
      // console.log(policy.PolicyId)
      // 1.查询用户列表
      let paramsUser = {
        Version: '2019-01-16',
      }
      this.$axios.post('cam2/ListUsers', paramsUser).then(res => {
        console.log(res)
        this.transfer_data = res.Response.Data
      })
      this.dialogVisible = true
    },
    Relieve_user () {
      this.Relieve_dialogVisible = true
    },
    handleSizeChange () {},
    handleCurrentChange () {},
    handleClose () {},
    handleSelectionChange (val) {
      if (val.length !== 0) {
        this.display = false
        val.forEach(element => {
          this.RelieveData.push(element.date)
        })
      } else {
        this.display = true
      }
    },
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
