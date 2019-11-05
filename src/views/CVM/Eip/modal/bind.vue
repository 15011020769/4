<template>
  <div class="renew">
    <el-dialog :visible.sync="bindObj.bindShow" :show-close="false" width="45%">
      <div slot="title" class="title-wrap">
        <span>绑定资源</span>
        <i class="el-icon-close" @click="handleCancel"></i>
      </div>
      <div class="content">
        <div>
          <p class="p-1">请选择弹性公网IP: {{bindObj.bindInfo.AddressId}} 要绑定的资源</p>
          <div class="div-r">
            <el-radio-group v-model="radio">
              <el-radio :label="1">CVM实例</el-radio>
              <el-radio :label="2">NAT网关</el-radio>
              <el-radio :label="3">弹性网卡</el-radio>
              <el-radio :label="4">高可用虚拟IP</el-radio>
            </el-radio-group>
          </div>
          <div class="div-t">
            <div class="table-1" v-show="this.radio === 1">
              <!-- <input class="input-1" type="text" placeholder="请输入CVM实例名称/IP" /> -->
              <el-table :data="tableData1" border style="width: 100%"  @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop label="实例ID/名称">
                  <template slot-scope="scope">
                    <p>{{scope.row.InstanceId}}</p>
                    <p>{{scope.row.InstanceName}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop label="可用区">
                  <template slot-scope="scope">
                    <p>{{scope.row.Placement.Zone | Regionfilter()}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop label="当前带宽"></el-table-column>
                <el-table-column prop="PrivateIpAddresses" label="内网IP">--</el-table-column>
                <el-table-column prop="PublicIpAddresses" label="已绑定公网IP">--</el-table-column>
              </el-table>
            </div>

            <div class="table-1" v-show="this.radio === 2">
              <!-- <input class="input-1" type="text" placeholder="请输入名称或ID" /> -->
              <el-table :data="tableData2" border height="300" style="width: 100%"  @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop label="NAT网关ID/名称">
                  <template slot-scope="scope">
                    <p>{{scope.row.NatGatewayId}}</p>
                    <p>{{scope.row.NatGatewayName}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop label="已绑定弹性IP">
                  <template slot-scope="scope">
                    <p>{{scope.row.PublicIpAddress}}</p>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="table-1" v-show="this.radio === 3">
              <!-- <input class="input-1" type="text" placeholder="请输入名称或ID" /> -->
              <el-table :data="tableData3" border height="300" style="width: 100%"  @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop label="弹性网卡ID/名称">
                  <template slot-scope="scope">
                    <p>{{scope.row.NetworkInterfaceId}}</p>
                    <p>{{scope.row.NetworkInterfaceName}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop label="内网IP">
                  <template slot-scope="scope">
                    <p>{{scope.row.PrivateIpAddress}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop label="已绑定公网IP">
                  <template slot-scope="scope">
                    <p>{{scope.row.PublicIpAddress === '' ? '-':'scope.row.PublicIpAddress'}}</p>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="table-1" v-show="this.radio === 4">
              <!-- <input class="input-1" type="text" placeholder="请输入名称或ID" /> -->
              <el-table :data="tableData4" border style="width: 100%"  @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop label="ID/名称">
                  <template slot-scope="scope">
                    <p>{{scope.row.HaVipId}}</p>
                    <p>{{scope.row.HaVipName}}</p>
                  </template>
                </el-table-column>
                <el-table-column prop="Vip" label="IP地址"></el-table-column>
                <el-table-column prop="State" label="状态"></el-table-column>
                <el-table-column prop="VpcId" label="所属网络"></el-table-column>
                <el-table-column prop="SubnetId" label="所属子网">--</el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="submitForm()">确定</el-button>
          <el-button size="mini" @click="handleCancel">取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      basic: true,
      currentIndex: 0,
      radio: 1,
      tableData1: [],
      tableData2: [],
      tableData3: [],
      tableData4: []
    }
  },
  props: {
    bindObj: {
      type: Object,
      default: () => []
    }
  },
  created () {
    this.getCvm()
    this.getEip()
    this.getNat()
    this.gethavIp()
  },
  methods: {
    tableRowStyle ({ row, rowIndex }) {
      return {
        'font-size': '12px'
      }
    },
    // cvm列表
    getCvm () {
      var params = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2')
      }
      this.axios.post('vpc2/DescribeInstances', params).then(data => {
        this.tableData1 = data.Response.InstanceSet
      })
    },
    // nat列表
    getNat () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2')
      }
      this.axios.post('vpc2/DescribeNatGateways', parms).then(data => {
        let list = data.Response.NatGatewaySet
        let ipArr = []
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < list[i].PublicIpAddressSet.length; j++) {
            list[i].PublicIpAddressSet[j].NatGatewayId = list[i].NatGatewayId
            list[i].PublicIpAddressSet[j].NatGatewayName =
              list[i].NatGatewayName
            ipArr.push(list[i].PublicIpAddressSet[j])
          }
        }
        this.tableData2 = ipArr
      })
    },
    // 弹性网卡列表
    getEip () {
      var params = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2')
      }
      this.axios.post('vpc2/DescribeNetworkInterfaces', params).then(data => {
        let list = data.Response.NetworkInterfaceSet
        let ipArr = []
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < list[i].PrivateIpAddressSet.length; j++) {
            list[i].PrivateIpAddressSet[j].NetworkInterfaceId =
              list[i].NetworkInterfaceId
            list[i].PrivateIpAddressSet[j].NetworkInterfaceName =
              list[i].NetworkInterfaceName
            ipArr.push(list[i].PrivateIpAddressSet[j])
          }
        }
        this.tableData3 = ipArr
      })
    },
    // 高可用虚拟IP
    gethavIp () {
      var params = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2')
      }
      this.axios.post('vpc2/DescribeHaVips', params).then(data => {
        this.tableData4 = data.Response.HaVipSet
      })
    },
    // 绑定
    submitForm () {
      var params = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        AddressId: this.bindObj.bindInfo.AddressId,
        // 'InstanceId': this.tableData1.InstanceId,
        'NetworkInterfaceId': this.tableData3.NetworkInterfaceId,
        'PrivateIpAddress': this.tableData3.PrivateIpAddress
      }
      this.axios.post('vpc2/AssociateAddress', params).then(data => {
        // console.log(data)
        setTimeout(() => {
          this.$parent.getDataList() // 请求父组件的列表
        }, 1000)
        this.$emit('bindShowVal', false)
      })
    },
    handleCancel () {
      this.$emit('bindShowVal', false)
    },
    handleCheck (index) {
      this.currentIndex = index
      if (this.currentIndex <= 2) {
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  },
  components: {},
  mounted () {}
}
</script>
<style lang="scss" scoped>
.renew {
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
    .p-1 {
      color: #444;
      font-weight: bold;
    }
    .div-r {
      font-size: 12px;
    }
    .div-t {
      .table-1 {
        margin-top: 10px;
        .input-1 {
          width: 100%;
          height: 30px;
          padding-left: 10px;
        }
        table {
          border-top: none;
        }
      }
    }
    .dialog-footer {
      display: block;
      text-align: center;
      padding-top: 10px;
    }
  }
}
</style>
