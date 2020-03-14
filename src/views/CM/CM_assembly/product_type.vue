<template>
  <div>
    <el-select v-model="productValue" placeholder="请选择">
      <el-option v-for="item in productOptions" :key="item.viewName" :label="item.label" :value="item.viewName">
      </el-option>
    </el-select>
  </div>
</template>
<script>
  import {
    CVM_LIST, //云服务器列表
    ALL_PROJECT
  } from "@/constants";
  import {
    ErrorTips
  } from '@/components/ErrorTips'
  export default {
    data() {
      return {
        productOptions: [{
          label: '云服务器',
          viewName: 'cvm_device',
          Namespace: 'QCE/CVM'
        }, {
          label: 'VPN网关',
          viewName: 'VPN_GW',
          Namespace: 'QCE/CVM'
        }, {
          label: 'VPN通道',
          viewName: 'vpn_tunnel',
          Namespace: 'QCE/CVM'
        }, {
          label: 'NAT网关',
          viewName: 'nat_tc_stat',
          Namespace: 'QCE/CVM'
        }, {
          label: '专线网关',
          viewName: 'DC_GW',
          Namespace: 'QCE/CVM'
        }, {
          label: '弹性公网IP',
          viewName: 'EIP',
          Namespace: 'QCE/CVM'
        }, {
          label: 'MYSQL',
          viewName: 'cdb_detail',
          Namespace: 'QCE/CVM'
        }, {
          label: 'Redis',
          viewName: 'REDIS-CLUSTER',
          Namespace: 'QCE/CVM'
        }, {
          label: '专用通道',
          viewName: 'dcchannel',
          Namespace: 'QCE/CVM'
        }, {
          label: '物理专线',
          viewName: 'dcline',
          Namespace: 'QCE/CVM'
        }, {
          label: '对象存储',
          viewName: 'COS',
          Namespace: 'QCE/CVM'
        }],
        productValue: 'cvm_device'
      }
    },
    watch: {
      productValue() {
        this._switchType()
      }
    },
    created() {

      this._switchType()

    },
    methods: {
      _switchType() {
        if (this.productValue === 'cvm_device') {
          this._GetCVM()
        }
      },
      // 获取云服务器列表
      _GetCVM() {
        let parms = {
          Region: localStorage.getItem("regionv2"),
          Version: "2017-03-12",
        }
        this.axios.post(CVM_LIST, parms).then(data => {
          console.log(data)
        });
      }
    }
  }

</script>
<style lang="scss" scoped>
  ::v-deep .el-input__inner {
    height: 30px;
    line-height: 30px;
    width: 200px;
  }

</style>
