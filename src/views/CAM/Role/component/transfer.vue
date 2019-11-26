<template>
  <div class="Cam">
    <div class="container">
      <div class="container-left">
        <p>{{$t('CAM.CAM.Role.policyList')}}（共{{totalNum}}条）</p>
        <el-input size="mini" v-model="strategyValue" style="width:85%"  @keyup.enter.native="toQueryCL"/>
        <el-button size="mini" class="suo" icon="el-icon-search" show-overflow-tooltip @click="toQueryCL"></el-button>
        <el-table
          class="table-left"
          ref="multipleOption" 
          :data="policiesData"
          size="small"
          height="300"
          tooltip-effect="dark"
          style="width: 100%"
          @row-click="selectedRow"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" prop="policyId" width="30"></el-table-column>
          <el-table-column prop="Description" :label="$t('CAM.CAM.Role.policyName')" show-overflow-tooltip>
           <template slot-scope="scope">
             <p>{{scope.row.PolicyName}}</p>
             <p>{{scope.row.Description}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="Type" :label="$t('CAM.CAM.Role.switchUserGroup')" width="80">
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
          </el-table-column>
        </el-table>
      </div>
      <div class="abs">
        <div>&nbsp;</div>
      </div>
      <div class="container-left">
        <span>{{$t('CAM.CAM.Role.hasChosen')}}（共条）</span>
        <el-table
          class="table-left"
          ref="multipleSelected"
          :data="policiesSelectedData"
          tooltip-effect="dark"
          size="small"
          height="300"
          style="width: 100%"
        >
          <el-table-column prop="Description" :label="$t('CAM.CAM.Role.strategy')" show-overflow-tooltip>
            <template slot-scope="scope">
              <p>{{scope.row.PolicyName}}</p>
              <p>{{scope.row.Description}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="Type" :label="$t('CAM.CAM.Role.strategyType')" width="100"></el-table-column>
          <el-table-column :label="$t('CAM.CAM.userGroup.colHandle')" width="50">
            &lt;!&ndash;
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, policiesSelectedData)"
                type="text"
                size="small"
              >x</el-button>
            </template>&ndash;&gt;
          </el-table-column>
        </el-table>
      </div>
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
    return {
      policiesData: [],
      strategyValue:[],
      totalNum: "",
      search: "",
      rp: 20,
      page: 1,
      tableTitle: "策略类型",
      table_options: [
        {
          value: "选项1",
          label: "全部"
        },
        {
          value: "选项2",
          label: "预设策略"
        },
        {
          value: "选项3",
          label: "自定义策略"
        }
      ]
    };
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
            let params = {
                Action: 'ListPolicies',
                Version:'2019-01-16'
            }
            if(this.search != null && this.search != '') {
              params['Keyword'] = this.search
            }
            let url = "cam2/ListPolicies"
            this.axios.post(url, params).then(res => {
               this.policiesData = res.Response.List;
            }).catch(error => {
                console.log(error)
            })
        },
    //策略搜索
    CeInit(){
       let params = {
         Action:"ListPolicies",
         Version:"2019-01-16"
       }
       debugger;
       if(this.strategyValue != null && this.strategyValue != ''){
          params["Keyword"] = this.strategyValue
       }
       let url = "cam2/ListPolicies"
       this.axios.post(url,params).then(data => {
         this.policiesData = data.Response.List
       })
    },
     toQueryCL(){
      this.CeInit()
    },
    handleCommand(command) {
      console.log(command);
      this.tableTitle = command;
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
    toQuery() {
      this.init();
    },
    getDaata() {
      return this.policiesSelectedData;
    }
  }
};
</script>
<style lang="scss" scoped>
.Cam {
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