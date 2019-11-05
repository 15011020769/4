<template>
  <div class="ShhkeyDetail">
    <div class="details-title">
      <router-link class="el-icon-back" to='/Sshkey' tag='i'></router-link>
      <h2>{{ $route.query.KeyId }}</h2>
    </div>
    <div class="details-box">
      <div class="div-info">
        <p>快照信息</p>
        <div class="list-row">
          <el-row class="list">
            <el-col :span="2">
              <span class="span-1">名称</span>
            </el-col>
            <el-col :span="22">
              <span class="span-2">{{ sshkeyInfo.KeyName }}</span>
            </el-col>
          </el-row>
          <el-row class="list">
            <el-col :span="2">
              <span class="span-1">密钥ID</span>
            </el-col>
            <el-col :span="22">
              <span class="span-2">{{ sshkeyInfo.KeyId }}</span>
            </el-col>
          </el-row>
          <el-row class="list">
            <el-col :span="2">
              <span class="span-1">密钥描述</span>
            </el-col>
            <el-col :span="22">
              <span class="span-2">{{ sshkeyInfo.Description }}</span>
            </el-col>
          </el-row>
          <el-row class="list">
            <el-col :span="2">
              <span class="span-1">公钥内容</span>
            </el-col>
            <el-col :span="22">
              <span class="span-2">{{ sshkeyInfo.PublicKey }}</span>
            </el-col>
          </el-row>
          <el-row class="list">
            <el-col :span="2">
              <span class="span-1">创建时间</span>
            </el-col>
            <el-col :span="22">
              <span class="span-2">{{ sshkeyInfo.CreatedTime | renderTime }}</span>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="div-table">
        <p>已绑定实例</p>
        <city :parm="parm" @changeCity="changeCity" class="region-btn"></city>
        <div class="table-info">
          <el-table :data="tableData" v-loading="tableLoading" style="width: 100%">
            <el-table-column prop="InstanceId" label="实例ID">
            </el-table-column>
            <el-table-column prop="InstanceName" label="实例名称">
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span>{{ scope.row.InstanceState | cvmState }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="所属网络">
            </el-table-column>
            <el-table-column prop="PrivateIpAddresses[0]" label="内网IP">
            </el-table-column>
            <el-table-column prop="address" label="操作">
              <template slot-scope="scope">
                <span v-if="scope.row.InstanceState === 'STOPPED'" @click="unbind(scope.row.InstanceId)" class="span-1">解绑</span>
                <el-tooltip v-else content="关机状态下才可哟解绑秘钥" placement="bottom" effect="light">
                  <span class="span-2">解绑</span>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import City from '@/components/Tools/RegionBtn'
export default {
  data() {
    return {
      parm: 'FWQ',
      sshkeyInfo: '',    // 获取当前实例的信息
      tableData: [],      // 以绑定的云主机
      tableLoading: false, // 表格加载动画
    }
  },
  components: {
    City
  },
  mounted() {
    this.getSshkeyInfo()
  },
  methods: {
    // 根据KeyId获取Sshkey详情
    getSshkeyInfo() {
      this.tableLoading = true;
      var params = {
        Version: "2017-03-12",
        Region: this.$cookie.get("regionv2"),
        'KeyIds.0': this.$route.query.KeyId
      }

      this.axios
        .post("cvm2/DescribeKeyPairs", params)
        .then(data => {
          this.sshkeyInfo = data.Response.KeyPairSet[0]
          if (this.sshkeyInfo.AssociatedInstanceIds.length !== 0) {
            this.getCvm()     // 请求已绑定cvm的详情信息
          } else {
            this.tableData = []
            this.tableLoading = false
          }
        });
    },

    // 点击城市请求以绑定cvm的数量
    changeCity() {
      this.getSshkeyInfo()
    },

    // 查询当前实例已经绑定的云主机
    getCvm() {
      this.tableLoading = true
      var params = {
        Region: this.$cookie.get('regionv2'),
        Version: "2017-03-12"
      }
      for (let i = 0; i < this.sshkeyInfo.AssociatedInstanceIds.length; i++) {
        params['InstanceIds.' + i] = this.sshkeyInfo.AssociatedInstanceIds[i]
      }
      this.axios
        .post("cvm2/DescribeInstances", params)
        .then(data => {
          this.tableLoading = false
          this.tableData = data.Response.InstanceSet
        });
    },

    // 解绑
    unbind(InstanceId) {
      this.$confirm('确定解绑该密钥？', '解绑密钥', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var params = {
          Region: this.$cookie.get('regionv2'),
          Version: "2017-03-12",
          'InstanceIds.0': InstanceId,
          'KeyIds.0': this.$route.query.KeyId
        }
        this.axios
          .post("cvm2/DisassociateInstancesKeyPairs", params)
          .then(data => {
            setTimeout(() => {
              this.getSshkeyInfo()
            }, 2000);
            
          });
      }).catch(() => {

      });
    }


  }
}
</script>

<style lang="scss" scoped>
.ShhkeyDetail {
  .details-title {
    background: #fff;
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
    display: flex;
    & > i {
      font-size: 16px;
      font-weight: 900;
      line-height: 30px;
      width: 26px;
      box-sizing: border-box;
      display: inline-block;
      text-align: center;
      margin-left: -6px;
      margin-right: 24px;
      vertical-align: middle;
      overflow: hidden;
      color: #006eff;
      cursor: pointer;
    }
    & > h2 {
      font-size: 16px;
      font-weight: 700;
      color: #171d25;
      height: 30px;
      line-height: 30px;
    }
  }
  .details-box {
    padding: 10px 20px;
    .div-info {
      padding: 15px 15px;
      background: white;
      p {
        font-size: 14px;
        font-weight: bold;
        margin: 10px 0;
      }
      .list-row {
        .list {
          padding: 10px 0px;
          .span-1 {
            color: #888;
            padding-right: 20px;
            white-space: nowrap;
            text-align: left;
          }
          .span-2 {
            color: #444;
            word-break: break-word;
          }
        }
      }
    }
    .div-table {
      margin-top: 20px;
      padding: 15px 15px 30px 15px;
      background: white;

      p {
        font-size: 14px;
        font-weight: bold;
        margin: 10px 0 15px 0;
      }
      .table-info {
        margin-top: 10px;
        border: 1px solid #eaeef5;
        border-bottom: 0;
        .span-1 {
          color: #006eff;
          cursor: pointer;
        }
        .span-2 {
          color: #999;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
