<template>
  <div class="Cam">
    <div class="top">
      <div class="top-left">
        <span class="top-text">{{$t('CAM.Role.strategy')}}</span>
        <el-select size="mini" v-model="policyScope" :placeholder="$t('CAM.Role.allRol')" @change="changePolicyScope">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            size="mini"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="strage-wrap">
      <div class="contant">
        <p class="contant_top">{{$t('CAM.Role.rolTitle')}}</p>
        <div class="table_opare">
          <div>
            <el-button plain size="small" @click="handleDelete()">删除</el-button>
          </div>
          <!-- <el-input placeholder="支持搜索用户名" size="small" class="inputSearch">
            <i slot="suffix" class="el-input__icon el-icon-search"></i>
          </el-input> -->
          
           <el-input style="width:20%" placeholder="支持搜索策略名称/描述/备注" size="small"  v-model="searchValue"  @keyup.enter.native="changePolicyScope">
                       <i slot="suffix" class="el-input__icon el-icon-search"  @click="changePolicyScope"></i>
           </el-input>
        </div>
        <div class="table">
          <el-table
            :data="tableData"
            height="610"
            style="width: 100%"
            :row-style="{height:0}"
            :cell-style="{padding:'5px 10px'}"
            :header-cell-style="{height:'20px',padding:'0px 10px'}"
            @selection-change="handleSelectionChange"
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
            <span style="font-size:12px;color:#888">已选 {{choiceNum}} 项，共 {{total}} 项</span>
          </div>
          <div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[10, 20, 50, 100, 200]"
              :page-size="pageSize"
              layout="sizes, prev, pager, next"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 关联用户/用户组 模态窗 -->
    <el-dialog title :visible.sync="dialogVisible" width="72%">
      <h3 style="color:#000;margin-bottom:20px;">关联用户/用户组</h3>
      <div class="dialog_div">
        <transfer v-if="transferFlag" ref="userTransfer" :PolicyId="policyId"></transfer>
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
          value: "All",
          label: "全部策略"
        },
        {
          value: "Local",
          label: "自定义策略"
        },
        {
          value: "QCS",
          label: "预设策略"
        }
      ],
      policyScope: 'All',
      searchValue: "",
      tableData: [],  //策略列表数据
      selectedData: [], //选择要删除的
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
      transferFlag: false,  //模态框强制刷新flag
      pageSize: 10,
      choiceNum: 0,
      total: 0,
      currentPage: 1
    };
  },
  created() {
    this.getData()
  },
  methods: {
    // 初始化策略列表数据（默认全部策略）
    getData () {
      var params = {
        Action: 'ListPolicies',
        Version: '2019-01-16',
        Rp: this.pageSize,
        Page: this.currentPage,
        Scope: this.policyScope
        // Keyword: ''
      }
      if(this.searchValue != '') {
        params['Keyword'] = this.searchValue
      }
      this.$axios.post('cam2/ListPolicies', params).then(res => {
        this.tableData = res.Response.List
        this.total = res.Response.TotalNum
      })
    },
    changePolicyScope () {
      this.getData()
    },
    // 跳转到详情页面
    handleClick(policy) {
      // console.log(policy);
      this.$router.push({
        path: '/StrategyDetail',
        query: {
          policy: policy
        }
      });
    },
    // 关联用户/用户组（展现模态框）
    handleClick_user(policy) {
      this.policyId = policy.PolicyId
      this.transferFlag= false
      this.$nextTick(() => {
          this.transferFlag= true;
      })
      this.dialogVisible = true
    },
    // 穿梭框：value右侧框值、direction操作、movedKeys移动值
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
      this.transfer_data_right = value
    },
    // 关联用户/用户组
    attachPolicy(){
      this.$refs.userTransfer.attachPolicy()
      this.dialogVisible = false
    },
    // table标题栏选择项
    handleCommand(command) {
      console.log(command);
      this.tableTitle = command;
    },
    // 选择策略
    handleSelectionChange(data) {
      this.selectedData = data
      this.choiceNum = data.length
    },
    // 批量删除策略
    handleDelete() {
      let val = this.selectedData;
      let params = {
        Version: '2019-01-16'
      }
      if (val) {
        val.forEach(function(item, index) {
          let str = 'PolicyId.' + index
          params[str] = item.PolicyId
        })
      }
       this.$axios.post('cam2/DeletePolicy', params).then(res  => {
         console.log(res)
       })
      this.selectedData.splice(0, this.selectedData.length)
      this.getData()
    },
    // page操作
    handleSizeChange(val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
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
  .strage-wrap {
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
        max-width: 100%;
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
  .el-input__inner{
    width: 200px;
  }
  .el-input__icon{
    cursor:pointer;
  }
}
</style>
