<template>
  <div class="Cam">
    <div class="container">
      <div class="container-left">
        <p>{{$t('CAM.CAM.Role.policyList')}}（共{{totalNum}}条）</p>
        <el-input
          size="mini"
          v-model="strategyValue"
          style="width:100%"
          @keyup.enter.native="tableloadmore"
        />
        <i size="mini" class="el-icon-search fier" show-overflow-tooltip @click="tableloadmore" ></i>
        <el-table
          class="table-left"
          ref="multipleOption"
          :data="policiesData"
          size="small"
          :height="tableHeight"
          tooltip-effect="dark"
          style="width: 100%"
          @row-click="selectedRow"
          @selection-change="handleSelectionChange"
          v-tableloadmore="tableloadmore"
        >
          <el-table-column type="selection" prop="policyId" width="28"></el-table-column>
          <el-table-column
            prop="Description"
            :label="$t('CAM.CAM.Role.policyName')"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>{{scope.row.PolicyName}}</p>
              <p>{{scope.row.Description}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="Type" :label="$t('CAM.CAM.Role.strategyType')" width="100">
              <template slot-scope="scope">
              <p v-show="scope.row.Type == 3">{{$t('CAM.CAM.Role.all')}}</p>
              <p v-show="scope.row.Type == 2">{{$t('CAM.CAM.Role.defaultPolicy')}}</p>
              <p v-show="scope.row.Type == 1">{{$t('CAM.CAM.Role.customPolicy')}}</p>
            </template>  
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
      <div class="direction">
                    <div class="direction-icon">
                      <i class="iconfont">&#xe603;</i>
                    </div>
                  </div>
      <div class="container-left">
        <span>{{$t('CAM.CAM.Role.hasChosen')}}（共条）</span>
        <el-table
          class="table-left"
          ref="multipleSelected"
          :data="policiesSelectedData"
          tooltip-effect="dark"
          size="small"
          :height="tableHeight"
          style="width: 100%"
        >
          <el-table-column
            prop="Description"
            :label="$t('CAM.CAM.Role.strategy')"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <p>{{scope.row.PolicyName}}</p>
              <p>{{scope.row.Description}}</p>
            </template>
          </el-table-column>

          <el-table-column prop="Type" :label="$t('CAM.CAM.Role.strategyType')" width="100">
            <template slot-scope="scope">
              <p v-show="scope.row.Type == 1">{{$t('CAM.CAM.Role.customPolicy')}}</p>
              <p v-show="scope.row.Type == 2">{{$t('CAM.CAM.Role.defaultPolicy')}}</p>
            </template>
          </el-table-column>
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
  directives:{
     tableloadmore:{
       bind(el,binding) {
              // 获取element-ui定义好的scroll盒子
            const SELECTWRAP_DOM = el.querySelector('.el-table__body-wrapper');
            SELECTWRAP_DOM.addEventListener('scroll', function() {
                /*
                * scrollHeight 获取元素内容高度(只读)
                * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
                * clientHeight 读取元素的可见高度(只读)
                * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
                * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
                */
                  let sign = 80; // 定义默认的向上滚于乡下滚的边界
                  const CONDITION = ((this.scrollHeight - this.scrollTop === this.clientHeight) && 
                                  this.scrollTop > sign)// 注意: && this.scrollTop
                  
                  if(this.scrollTop > sign) {
                      sign = this.scrollTop;
                  }
                  if(this.scrollTop < sign) {
                      sign = this.scrollTop;
                  }
                  
                  if(!CONDITION) {
                      binding.value();
                  }
            });
       }
     }
  },
  data() {
    return {
      tableHeight:300,
      policiesData: [],
      policiesSelectedData: [],
      strategyValue: [],
      totalNum: "",
      search: "",
      table_options: [
        {
          value: "3",
          label: this.$t('CAM.CAM.Role.all')
        },
        {
          value: "2",
          label: this.$t('CAM.CAM.Role.defaultPolicy')
        },
        {
          value: "1",
          label: this.$t('CAM.CAM.Role.customPolicy')
        },
      ],
      rp: 20,
      page: 1,
      tableTitle: this.$t('CAM.CAM.Role.strategyType')
    };
  },
 
  mounted() {
    var command='';
    this.tableloadmore(command);
    console.log(window.innerHeight)
        console.log(this.$refs.topictable.$el)
        console.log(this.$refs.topictable.$el.offsetTop)
        this.tableHeight =
          window.innerHeight - this.$refs.topictable.$el.offsetTop - 50;
        console.log(this.tableHeight)
  },
  methods: {
    tableloadmore(command) {
        let params = {
        Action: "ListPolicies",
        Version: "2019-01-16"
      };
       if (this.strategyValue != null && this.strategyValue != "") {
        params["Keyword"] = this.strategyValue;
      }
      if (command!='undefined'&&command!=null&&command!='') {
        if(command===this.$t('CAM.CAM.Role.defaultPolicy')){
          params["Scope"] = 'QCS';
        }else if(command===this.$t('CAM.CAM.Role.customPolicy')){
          params["Scope"] = 'Local';
        }else{
          params["Scope"] = 'All';
        }
      }
      let url = "cam2/ListPolicies";
      this.axios
        .post(url, params)
        .then(res => {
          this.policiesData = res.Response.List;
        })
        .catch(error => {
        });
    },
    handleCommand(command) {
      this.handoverFlag = true
      this.commandObj = command
      this.tableTitle = command.label;
      if(command!= '' || command != 'undefined'){
        this.tableloadmore(command)
      }
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
    getData() {
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
    .direction{
      display: table-cell;
      width: 38px;
      text-align: center;
      vertical-align: middle;
    }
    .direction-icon{
      width: 16px;
      height: 16px;
      display: inline-block;
      vertical-align: middle;
      background-repeat: no-repeat;
      background-position: inherit;
      font-size: 0;
    }
    .el-input--mini .el-input__inner{
      position: relative;
    }
    .fier{
      cursor:pointer;
      font-size: 130%;
      color: #888;
      position: absolute;
      right: 2%;
      top: 6%;
    }
    .container-left {
      width: 48%;
      display: table-cell;
      position: relative;
      vertical-align: top;
    }
  }
}
</style>