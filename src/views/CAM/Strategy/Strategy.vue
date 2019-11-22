<template>
  <div class="Cam">
    <div class="top">
      <div class="top-left">
        <span class="top-text">策略</span>
        <el-select size="mini" v-model="value" placeholder="全部策略">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            size="mini"
          ></el-option>
        </el-select>
      </div>
      <div class="top-right">
        <span class="right-text">
          <a href>CAM策略使用说明</a>
        </span>
        <i class="el-icon-share"></i>
      </div>
    </div>
    <div class="container">
      <div class="contant">
        <p class="contant_top">用户或者用户组与策略关联后，即可获得策略所描述的操作权限。</p>
        <div class="table_opare">
          <div>
            <el-button plain size="small">删除</el-button>
          </div>
          <div>
            <el-input v-model="input" placeholder="支持搜索策略名称/描述/备注" size="small">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </div>
        </div>
        <div class="table">
          <el-table
            :data="tableData"
            height="610"
            border
            style="width: 100%"
            :row-style="{height:0}"
            :cell-style="{padding:'5px 10px'}"
            :header-cell-style="{height:'20px',padding:'0px 10px'}"
          >
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column prop="PolicyName" label="策略名" width="150">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">{{scope.row.PolicyName}}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="Description" label="描述"></el-table-column>
            <el-table-column align="center" width="150">
              <template slot="header" slot-scope="scope">
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
              <template slot-scope="scope">{{scope.row.ServiceType}}</template>
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="150">
              <template slot-scope="scope">
                <el-button @click="handleClick_user(scope.row)" type="text" size="small">关联用户/组</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div
          style="background:#fff;padding:10px;display:flex;justify-content: space-between;line-height:30px"
        >
          <div>
            <span style="font-size:12px;color:#888">已选 33 项，共 {{total}} 项</span>
          </div>
          <div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync=currentPage
              :page-sizes="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]"
              :page-size=pageSize
              layout="sizes, prev, pager, next"
              :total=total
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    // 关联用户/用户组 模态窗
    <el-dialog title :visible.sync="dialogVisible" width="40%">
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
      options: [
        {
          value: "选项1",
          label: "全部策略"
        },
        {
          value: "选项2",
          label: "自定义策略"
        },
        {
          value: "选项3",
          label: "预设策略"
        }
      ],
      value: "",
      input: "",
      tableData: [{}],  //策略列表数据
      table_options: [
        {
          value: "选项1",
          label: "全部服务"
        },
        {
          value: "选项2",
          label: "智能物联网关"
        },
        {
          value: "选项3",
          label: "API网关"
        }
      ],
      table_value: "",
      tableTitle: "服务类型",
      dialogVisible: false,
      policyId: '', // 策略Id
      transfer_value: [],
      //  用户列表
      transfer_data: [{}],
      // 选定的用户列表
      transfer_data_right: [],
      //  用户组列表
      pageSize: 20,
      total: 0,
      currentPage: 1,
    };
  },
  created() {
    this.getData()
  },
  methods: {
    // 初始化策略列表数据（全部策略）
    getData () {
      var params = {
        Version: '2019-01-16',
        // Region: 'ap-taipei',
        // Rp: '',
        // Page: '',
        // Scope: '',
        // Keyword: ''
      }
      this.$axios.post('cam2/ListPolicies', params).then(res => {
        console.log('获取策略列表成功')
        console.log(res)
        this.tableData = res.Response.List
        this.total = res.Response.TotalNum
      })
    },
    // 关联用户/用户组（展现模态框）
    handleClick_user(policy) {
      this.policyId = policy.PolicyId
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
      // 2.查询用户组列表ListGroups
      let paramsGroup = {
        Version: '2019-01-16',
      }
      this.$axios.post('cam2/ListGroups', paramsGroup).then(res => {
        console.log(res)
        // this.transfer_data = res.Response.Data
      })
      // 3.查询策略关联的实体列表
      // let params2 = {
      //   Version: '2019-01-16',
      //   PolicyId: policy.PolicyId
      // }
      // this.$axios.post('cam2/ListEntitiesForPolicy', params2).then(res  => {
      //   console.log(res)
      // })
      this.dialogVisible = true
    },
    // 穿梭框：value右侧框值、direction操作、movedKeys移动值
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
      this.transfer_data_right = value
    },
    // 关联用户/用户组
    attachPolicy(){
      if(this.transfer_data_right.length > 0) {
        for(let i=0; i < this.transfer_data_right.length; i++) {
          this.attachUserPolicy(this.policyId, this.transfer_data_right[i])
        }
      }
      this.dialogVisible = false
    },
    // 绑定策略到用户组
    attachGroupPolicy(val1, val2) {
      let params = {
        Version: '2019-01-16',
        PolicyId: val1,
        AttachGroupId: val2
      }
      this.$axios.post('cam2/AttachGroupPolicy', params).then(res  => {
        console.log(res)
      })
    },
    // 绑定策略到用户
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

    handleCommand(command) {
      console.log(command);
      this.tableTitle = command;
    },
    handleClick(scope) {
      console.log(scope);
      this.$router.push("/StrategyDetail");
    },
    // page操作
    handleSizeChange(val) {
      console.log(val)
      this.pageSize = val
    },
    handleCurrentChange(val) {
      console.log(val)
      this.currentPage = val
    }
  }
};
</script>
<style lang="scss" scoped>
.Cam {
  height: 100%;
  .top {
    color: #000;
    height: 45px;
    line-height: 45px;
    margin-bottom: 20px;
    padding: 0 20px;
    background: #fff;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    .top-left {
      font-size: 16px;
      font-weight: 700;
      .top-text {
        margin-right: 15px;
      }
    }
    .top-right {
      line-height: 30px;
      cursor: pointer;
      .right-text {
        margin-right: 10px;
      }
    }
  }
  .container {
    .contant {
      max-width: 96%;
      margin: 0 auto;
      .contant_top {
        font-size: 12px;
        line-height: inherit;
        padding: 10px 30px 10px 20px;
        vertical-align: middle;
        color: #003b80;
        border: 1px solid #97c7ff;
        border-radius: 2px;
        background: #e5f0ff;
        position: relative;
        box-sizing: border-box;
        max-width: 96%;
        margin-bottom: 20px;
      }
      .table_opare {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .dialog_div {
        text-align: center;
      }
    }
  }
}
</style>
