<template>
  <div class="bindNetwork">
    <el-dialog :visible.sync="bindNetworkStatus.bindNetworkDialog" :show-close="false" width="35%">
      <div slot="title" class="title-wrap">
        <span>绑定弹性网卡</span>
        <i class="el-icon-close" @click="handleCancel(false)"></i>
      </div>
      <div class="content">
        <div>
          <span style="font-weight:bold;">请选择实例"{{instance.InstanceId}}"要绑定的弹性网卡</span>
        </div>
        <div>
          <span>
            该实例支持2块网卡，每个网卡支持2个内网IP，
            <a href="javascript: void(0);">查看网卡配额说明</a>
          </span>
        </div>
        <div class="radiolist">
          <el-radio v-model="radio" label="1">绑定已有弹性网卡</el-radio>
          <el-radio v-model="radio" label="2">新建弹性网卡并绑定</el-radio>
        </div>
        <div v-show="radio==1">
          <div>
            <span>已筛选"私有网络：Default-VPC，可用区：成都二区"下的弹性网卡</span>
          </div>
          <div class="tableList">
            <el-input
              type="text"
              style="width: 100%;"
              placeholder="搜索名称,内网IP"
              suffix-icon="el-icon-search"
              size="mini"
            />
            <el-table
              ref="instanceInfo"
              :data="instanceInfo"
              :header-cell-style="{'font-size':'12px'}"
              :row-style="tableRowStyle"
              max-height="200px"
            >
              <el-table-column width="55">
                <template slot-scope="scope">
                  <el-radio v-model="scope.row.radio"></el-radio>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="网卡ID/名称">
                <template slot-scope="scope">
                  <p>{{scope.row.InstanceId}}</p>
                  <p>{{scope.row.InstanceId}}</p>
                </template>
              </el-table-column>
              <el-table-column prop="address" label="所属子网"></el-table-column>
              <el-table-column prop="address" label="网卡内网IP数">
                <template slot-scope="scope">
                  <p>{{scope.row.PrivateIpAddresses.length}}</p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div v-show="radio==2">
          <el-form
            ref="instance"
            :rules="rules"
            :model="instance"
            label-width="90px"
            class="instance"
            :label-position="labelPosition"
          >
            <el-form-item label="名称:" prop="instanceName">
              <el-input
                v-model="instance.instanceName"
                placeholder
                size="mini"
                style="width: 130px;"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属网络" prop="network">
              <span>{{instance.instanceName}}({{instance.instanceName}})</span>
            </el-form-item>
            <el-form-item label="所属子网">
              <el-select v-model="instance.subnetId" placeholder size="mini">
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="可用区">
              <span>{{1}}</span>
            </el-form-item>
            <el-form-item label="可分配IP数" prop="area">
              <span>4/4个(当前子网可用IP剩余4092个)</span>
            </el-form-item>
            <el-form-item label="分配IP" prop="area">
              <div class="distribute">
                <span style="margin-right:3px;">主IP</span>
                <span>
                  <el-select v-model="instance.subnetId" placeholder size="mini">
                    <el-option
                      v-for="item in userOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </span>
                <span v-if="1">
                  <el-input
                    v-model="instance.instanceName"
                    placeholder
                    size="mini"
                    style="width: 130px;"
                  ></el-input>
                </span>
                <span v-else>系统将自动分配IP地址</span>
              </div>
              <div class="distribute">
                <span style="margin-right:3px;">辅助IP</span>
                <span>
                  <el-select v-model="instance.subnetId" placeholder size="mini">
                    <el-option
                      v-for="item in userOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </span>
                <span v-if="1">
                  <el-input
                    v-model="instance.instanceName"
                    placeholder
                    size="mini"
                    style="width: 130px;"
                  ></el-input>
                </span>
                <span v-else>系统将自动分配IP地址</span>
                <i class="el-icon-close"></i>
              </div>
              <p class="distribute">增加一个辅助IP</p>
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
      labelPosition: "left",
      instance: {},
      instanceInfo: [],
      radio: "1",
      userOptions: [
        {
          value: 1,
          label: 1
        }
      ],
      rules: {
        mirrorName: [{ required: true, message: "", trigger: "blur" }]
      }
    };
  },
  props: {
    bindNetworkStatus: {
      type: Object,
      default: () => []
    }
  },
  mounted() {
    this.instanceInfo = this.bindNetworkStatus.InstanceItem;
    this.instance = this.bindNetworkStatus.InstanceItem[0];
    console.log(this.instance);
  },
  methods: {
    tableRowStyle({ row, rowIndex }) {
      return {
        "font-size": "12px"
      };
    },
    //确定开机/取消
    handleCancel(value) {
      if (value) {
        var params = {
          Version: "2017-03-12",
          Region: this.$cookie.get("regionv2")
        };
      }
      this.$emit("close", false);
    }
  }
};
</script>
<style lang="scss" scoped>
.bindNetwork {
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
    span {
      font-size: 12px;
    }
    .radiolist {
      ::v-deep el-radio__label {
        font-size: 12px;
      }
    }
    .tableList {
      margin-top: 10px;
      border: 1px solid #ccc;
      border-top: none;
      border-bottom: none;
    }
    .instance {
      .distribute {
        margin-top: 3px;
        padding: 0 3px;
        background: #eee;
        border: 1px solid #ccc;
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

