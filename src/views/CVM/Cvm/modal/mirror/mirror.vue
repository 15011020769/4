<template>
  <div class="distribute">
    <el-dialog :visible.sync="mirrorStatus.mirrorDialog" :show-close="false" width="40%">
      <div slot="title" class="title-wrap">
        <span>制作自定义镜像</span>
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
        <div :class="[basic?'tableList':'']">
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
        <div class="renewdetail">
          <div>1.创建自定义镜像的同时系统默认会创建相关快照，删除此快照之前需要先删除关联的镜像， 当前快照已经商业化，保留镜像会产生一定的快照费用。账户欠费，会导致制作镜像失败。详细可见快照商业化FAQ</div>
          <div>2.该实例支持在线制作镜像, 镜像制作过程约需10分钟。</div>
          <div>3.Linux实例制作自定义镜像请确认 /etc/fstab不包含数据盘配置，否则会导致使用该镜像创建的实例无法正常启动。如果有挂载数据盘， 需要注释或删掉/etc/fstab中自行配置的数据盘的相关配置。</div>
        </div>
        <div style="margin-top: 10px;">
          <el-form ref="projectform" :model="projectform" :label-position="labelPosition" :rules="rules" label-width="80px">
            <el-form-item label="镜像名称" prop="password">
              <el-input
                v-model="projectform.mirrorName"
                placeholder
                size="mini"
                style="width: 130px;"
              ></el-input>
              <span
                style="display:block;font-size:12px;line-height:18px;color:#aaa;"
              >只支持字母、数字或连接符号"-"</span>
            </el-form-item>
            <el-form-item label="镜像描述" prop="passwordconfirm">
              <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="projectform.textarea"></el-input>
            </el-form-item>
          </el-form>
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
      labelPosition: 'left',
      instanceInfo: [],
      projectform: {
        mirrorName: '',
        textarea: ''
      },
      rules: {
        mirrorName: [
          { required: true, message: "", trigger: "blur" }
        ],
      }
    };
  },
  props: {
    mirrorStatus: {
      type: Object,
      default: () => []
    }
  },
  mounted() {
    this.instanceInfo = this.mirrorStatus.InstanceItem;
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
    handleCancel(value) {
      if (value) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2"),
          AutoRenewFlag: 0
        };
        this.instanceInfo.forEach(function(item, index) {
          params["DBInstanceIdSet." + index] = item.InstanceId;
        });
        this.axios.post("postgres2/SetAutoRenewFlag", params).then(data => {
          if (data.Response) {
            this.$parent.getListData();
          }
        });
      }
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.distribute {
  ::v-deep .el-dialog__body {
    padding: 0px 20px 30px;
  }
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
    .renewdetail {
      padding: 10px 20px;
      margin-top: 20px;
      font-size: 12px;
      background: #e5f0ff;
      color: #003b80;
      border: 1px solid #97c7ff;
    }
    .packdown {
      color: #006eff;
    }
    .tableList {
      border: 1px solid #eee;
      border-bottom: none;
    }
    .left-label {
      display: inline-block;
      float: left;
      width: 100px;
    }
    .priceNow {
      font-size: 18px;
      color: #ff7800;
      .priceOld {
        margin-left: 5px;
        font-size: 12px;
        color: #a2a2a2;
        text-decoration: line-through;
      }
    }
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
    ::deep .el-dialog__body {
      padding: 0 20px 20px;
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>

