<template>
  <div class="loadpassword">
    <el-dialog
      :visible.sync="loadpasswordStatus.loadpasswordDialog"
      :show-close="false"
      width="40%"
    >
      <div slot="title" class="title-wrap">
        <span>加载密钥</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <span>
          您已选
          <span>1</span>台 实例，
        </span>
        <span class="packdown">查看详情</span>
        <el-button type="text" class="basicInfo-pack" @click="handlePack">
          <i :class="[basic?'el-icon-arrow-up':'el-icon-arrow-down']"></i>
        </el-button>
        <div :class="[basic?'table':'']">
          <el-table
            ref="instanceTable"
            :data="instanceInfo"
            :header-cell-style="{'font-size':'12px'}"
            :row-style="tableRowStyle"
            v-if="basic"
            max-height="200px"
          >
            <el-table-column type="index" width="55" label="No."></el-table-column>
            <el-table-column label="实例名">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.InstanceId}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="实例ID">
              <template slot-scope="scope">
                <div>
                  <a href @click="handleInstanceId">{{scope.row.InstanceId}}</a>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="当前带宽上限">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.InstanceId}}</span>
                  Mbps
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-show="showStatus==1">
          <div style="margin-top: 10px;">
            <span class="start-title">对选中实例加载以下密钥：</span>
            <div class="check">
              <el-input type="text" v-model="inputSearch" width="100%" suffix-icon="el-icon-search"></el-input>
              <!-- <div v-for="(item, index) in instanceList" class="checkchange">
                <el-checkbox v-model="radio[index]" >{{item.KeyName}}</el-checkbox>
              </div>-->
              <el-table
                ref="multipleTable"
                :show-header="false"
                :data="instanceList"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="KeyName" label></el-table-column>
              </el-table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="nextstep()">下一步</el-button>
            <el-button size="mini" @click="handleCancel(false)">取消</el-button>
          </span>
        </div>
        <div v-show="showStatus==2">
          <div style="margin-top: 10px;">
            <div>1、为了避免数据丢失，加载密钥需要在 关机状态下操作，实例将关机中断您的业务，请仔细确认</div>
            <div>2、强制关机可能会导致数据丢失或文件系统损坏，您也可以主动关机后进行加载密钥</div>
            <div>3、强制关机可能需要您等待较长时间，请耐心等待</div>
            <el-checkbox v-model="closeStatus">同意强制关机</el-checkbox>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="handleCancel(true)">确定</el-button>
            <el-button size="mini" @click="handleCancel(false)">取消</el-button>
          </span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      basic: true,
      instanceInfo: [], //实例列表
      inputSearch: "", //搜索值
      radio: [],
      instanceList: [], //密钥列表
      showStatus: 1, //默认是第一步
      closeStatus: false, //关机状态
      multipleSelection: []
    };
  },
  props: {
    loadpasswordStatus: {
      type: Object,
      default: () => []
    }
  },
  computed: {},
  mounted() {
    this.instanceInfo = this.loadpasswordStatus.InstanceItem;
    this.getList();
  },
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return {
        "font-size": "12px"
      };
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handlePack() {
      this.basic = !this.basic;
    },
    handleInstanceId() {},
    // 查询列表
    getList() {
      var params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2")
      };
      this.axios.post("cvm/DescribeKeyPairs", params).then(data => {
        this.instanceList = data.Response.KeyPairSet;
      });
    },
    //下一步
    nextstep() {
      this.showStatus = this.showStatus + 1;
    },
    //关闭弹框
    handleCancel(value) {
      if (value) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2"),
          ForceStop: 'true'
        };
        this.instanceInfo.forEach(function(item, index) {
          params["InstanceIds." + index] = item.InstanceId;
        });
        var b = this.multipleSelection.map(function(v) {
          return v.KeyId;
        });
        b.forEach(function(item, index) {
          params["KeyIds."+index] = item;
        })
        this.axios.post("cvm/AssociateInstancesKeyPairs", params).then(data => {
          
        });
      }
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.loadpassword {
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    span {
      font-weight: bolder;
    }
    i {
      font-size: 16px;
      font-weight: 900;
    }
  }
  .content {
    font-size: 12px;
    .packdown {
      color: #006eff;
    }
    .table {
      border: 1px solid #eee;
      border-bottom: none;
    }
    .start-title {
      display: inline-block;
      margin-top: 10px;
      font-size: 16px;
      font-weight: bolder;
    }
    .check {
      max-height: 200px;
      overflow-y: auto;
      .checkchange {
        height: 30px;
        line-height: 30px;
        border: 1px solid #ccc;
        border-top: none;
        padding: 0 5px;
      }
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
    ::v-deep .el-form-item {
      margin-bottom: 5px;
    }
    ::v-deep .el-form-item__error {
      padding-top: 0;
      top: 95%;
    }
  }
}
</style>

