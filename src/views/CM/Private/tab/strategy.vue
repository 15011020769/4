<template>
  <div class="strategy-wrap">
     <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loadShow"
        height="550"
        id="exportTable"
        :empty-text="$t('CVM.clBload.zwsj')"
     >
        <el-table-column label="策略名称">
          
        </el-table-column>
        <el-table-column label="策略类型">
         
        </el-table-column>
        <el-table-column label="触发条件">
          
        </el-table-column>
        
        <el-table-column label="最后修改">
          
        </el-table-column>
        <el-table-column label="关联实例组">
          
        </el-table-column>
        
        <el-table-column label="操作">
            
        </el-table-column>
     </el-table>
     
  </div>
</template>
<script>
import Header from "@/components/public/Head";
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import { 
  ALARM_STRATEGY_LIST,
  LIFTING_OPERATION_EVENT,
  QUERY_PRODUCT_LIST 
  } from "@/constants"; // 接口：告警策略列表，解除操作 ,按照Id查询产品列表
export default {
  name: "strategy",
  data() {
    return {
      tableData: [],
      loadShow: false,
      
    }
  },
  components: {
    // Header,
    // Dialog
  },
  mounted() {
    this.GetPolicyInfoByInstance()
  },
  methods: {
    GetPolicyInfoByInstance () {
      const params = {
        Action: 'DescribePolicyInfoByInstance',
        Region: localStorage.getItem("regionv2"),
        Version: "2018-07-24",
        Module: "monitor",
        ViewName: "dcchannel",
        // Dimensions: ["{\"name\": \"directconnectconnid\",\"value\" : \"dcx-l1zv1sxs\"}"],
        'Dimensions.0.Name': "directconnectconnid",
        'Dimensions.0.Value': this.$router.currentRoute.query.id,
        Offset:0,
        Limit:20
      };
      // directConnectConnId
      this.axios.post(ALARM_STRATEGY_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.Events; //列表数据
          
        } else {
          this.loadShow = false;
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
    }
     
   },
  filters: { }
};
</script>

<style lang="scss" scoped>
.strategy-wrap >>> .el-button,
.strategy-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.strategy-wrap >>> .el-button:nth-child(0) {
  background: #006eff;
  width: 66px;
  height: 30px;
}
.strategy-wrap >>> .clearBtn > span:hover {
  border-bottom: 1px solid #006eff;
}

.strategy-wrap >>> .el-form-item__label {
  font-size: 12px;
  color: #888;
  font-weight: 200;
}

.strategy-wrap >>> .el-table .cell {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.Right-style {
  display: flex;
  justify-content: flex-end;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}

</style>