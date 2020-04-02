<template>
  <div class="strategy-wrap">
    <el-table :data="tableData" style="width: 100%" v-loading="loadShow" height="550" id="exportTable"
      :empty-text="$t('CVM.clBload.zwsj')">
      <el-table-column label="策略名稱">
        <template slot-scope="scope">
          <p>{{scope.row.GroupName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="策略類型">
        <template slot-scope="scope">
          <p>{{scope.row.ViewName === 'dcchannel' ? '專線通道' : ''}}</p>
        </template>
      </el-table-column>
      <el-table-column label="觸發條件">
        <template slot-scope="scope">
          <p>{{scope.row.Conditions[0].MetricDisplayName}}
            {{scope.row.Conditions[0].CalcType === "1" ? "&gt;" : "&lt;"}}
            {{scope.row.Conditions[0].CalcValue}}
            {{scope.row.Conditions[0].Unit}}
            ,{{scope.row.Conditions[0].AlarmNotifyType == '0' ? '只告警壹次' : scope.row.Conditions[0].AlarmNotifyType == '1' ? "指數告警" : "連接告警"}}</p>
        </template>
      </el-table-column>

      <el-table-column label="最後修改">
        <template slot-scope="scope">
          <p>{{scope.row.LastEditUin}}</p>
        </template>
      </el-table-column>
      <el-table-column label="關聯實例組">
        <template slot-scope="scope">
          <p>{{scope.row.InstanceGroup.GroupName === "" ? "-" :  scope.row.InstanceGroup.GroupName}}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
         <p class="LiftingOperation"><a  @click="LiftingOperationEvent(scope.row.GroupID)">解除</a></p>
        </template>
      </el-table-column>
    </el-table>

    <!-- 解除 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="500px"
      custom-class="tke-dialog"
    >
      <p>確定解除該告警策略與物件的關聯？</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="LiftingOperation()">解除</el-button>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Header from "@/components/public/Head";
  import Loading from "@/components/public/Loading";
  import {
    ErrorTips
  } from "@/components/ErrorTips.js"; //公共错误码
  import {
    ALARM_STRATEGY_LIST,
    LIFTING_OPERATION_EVENT,
  } from "@/constants"; // 接口：告警策略列表，解除操作 ,按照Id查询产品列表
  export default {
    name: "strategy",
    data() {
      return {
        tableData: [],
        loadShow: false,
        UniqueID: '',
        deleteDialogVisible: false,
        GroupID: ''
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
      LiftingOperationEvent (id) {
        this.deleteDialogVisible= true;
        this.GroupID = id;
      },
      LiftingOperation() {
        this.loadShow = true;
        this.deleteDialogVisible= false;
        const params = {
          Version: "2018-07-24",
          Region: localStorage.getItem("regionv2"),
          Module: "monitor",
          GroupId: this.GroupID,
          "UniqueId.0": this.UniqueID
        };
          this.axios.post(LIFTING_OPERATION_EVENT, params).then(res => {
          if (res.Response.Error === undefined) {
            this.$message.success("解除成功");
            this.GetPolicyInfoByInstance();
          } else {
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
      },
      GetPolicyInfoByInstance() {
          this.loadShow = true;

        const params = {
          Version: "2018-07-24",
          Module: "monitor",
          ViewName: "dcchannel",
          "Dimensions.0": {"name": "directconnectconnid","value":this.$router.currentRoute.query.id}
        };
        //测试
        // const params = {
        //   Version: "2018-07-24",
        //   Module: "monitor",
        //   ViewName: "cvm_device",
        //   "Dimensions.0": {"name": "unInstanceId","value":"ins-7xygzuog"}
        // };
        
        
        
        //   directconnectconnid: this.$router.currentRoute.query.id
        // Action: 'DescribePolicyInfoByInstance',
        this.axios.post(ALARM_STRATEGY_LIST, params).then(res => {
          this.loadShow = false;
          if (res.Response.Error === undefined) {
            this.tableData = res.Response.GroupList; //列表数据
            this.UniqueID = res.Response.UniqueID // 唯一id
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
    filters: {}
  };

</script>

<style lang="scss" scoped>
  .strategy-wrap>>>.el-button,
  .strategy-wrap>>>.el-input__inner {
    height: 30px;
    border-radius: 0;
    padding-top: 0;
    line-height: 30px;
    font-size: 12px;
  }

  .strategy-wrap>>>.el-button:nth-child(0) {
    background: #006eff;
    width: 66px;
    height: 30px;
  }

  .strategy-wrap>>>.clearBtn>span:hover {
    border-bottom: 1px solid #006eff;
  }

  .strategy-wrap>>>.el-form-item__label {
    font-size: 12px;
    color: #888;
    font-weight: 200;
  }

  .strategy-wrap>>>.el-table .cell {
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
  .LiftingOperation:hover{
      cursor: pointer;
    }

</style>
