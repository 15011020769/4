<template>
  <div class="safeGroup">
    <el-dialog :visible.sync="safeGroupStatus.safeGroupDialog" :show-close="false" width="55%">
      <div slot="title" class="title-wrap">
        <span>分配至项目</span>
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
          >
            <el-table-column type="index" width="55" label="No"></el-table-column>
            <el-table-column label="实例名">
              <template slot-scope="scope">
                <div>
                  <span>{{scope.row.InstanceName}}</span>
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
                  <span>{{scope.row.InternetAccessible.InternetMaxBandwidthOut}}</span>
                  Mbps
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <div style="margin:10px 0;">
            <span>选择处于当前地区和项目的安全组</span>
            <span style="display:inline-block;float:right;">
              <el-input
                type="text"
                style="width: 100%;"
                placeholder="搜索名称,内网IP"
                suffix-icon="el-icon-search"
                size="mini"
              />
            </span>
          </div>
          <div class="safeGroupList">
            <div v-for="(item,key) in safegroupList" :key="key">
              <el-checkbox v-model="checked">备选项</el-checkbox>
              <span>ID:{{item.value}} {{item.value}}</span>
            </div>
          </div>
          <div class="renewdetail">
            <span>每个实例至少需要加入一个安全组，<a>新建或查看我的安全组详情</a></span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="handleCancel(true)">确定</el-button>
          <el-button size="mini" @click="handleCancel(false)">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      basic: true,
      instanceInfo: [],
      checked: true,
      safegroupList: [
        {
          key: 1,
          value: 1
        },
        {
          key: 2,
          value: 2
        },
        {
          key: 3,
          value: 3
        }
      ]
    };
  },
  props: {
    safeGroupStatus: {
      type: Object,
      default: () => []
    }
  },
  mounted() {
    this.instanceInfo = this.safeGroupStatus.InstanceItem;
  },
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return {
        "font-size": "12px"
      };
    },
    handlePack() {
      this.basic = !this.basic;
    },
    handleInstanceId() {},
    handleCancel(val) {
      if (val) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2")
        };
        this.instanceInfo.forEach(function(item, index) {
          params["InstanceIds." + index] = item.InstanceId;
        });
        // this.axios.post("cvm2/StartInstances", params).then(data => {
        //   if(data.Response) {
        //     this.$parent.getListData();
        //   }
        // });
      }
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.safeGroup {
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
    .safeGroupList {
      padding: 10px;
      border: 1px solid #ccc;
    }
    .renewdetail {
      margin-top: 10px;
      padding: 10px 20px;
      font-size: 12px;
      height: 35px;
      line-height: 15px;
      background: #fff4e3;
      color: #c07400;
      border: 1px solid #ffd18b;
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>

