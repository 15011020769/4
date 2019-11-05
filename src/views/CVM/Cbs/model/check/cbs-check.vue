<template>
  <div class="check">
    <div class="check-title">
      <div class="check-title-pag">
        <p>核对信息</p>
      </div>
    </div>
    <div class="check-conter">
      <el-table :data="tableData"
        style="width: 100%">
        <el-table-column prop="date"
          label="产品名称">
          <template slot-scope="scope">
            <p>新购弹性云盘</p>
          </template>
        </el-table-column>
        <el-table-column prop="name"
          width="180"
          label="配置信息">
          <template slot-scope="scope">
            <p> 磁盘属性：{{scope.row.selectedDiskType.DiskUsage|Attributefilter()}}</p>
            <p>容量：{{scope.row.DiskSize}}GB</p>
            <p> 磁盘属性：{{scope.row.selectedDiskType.DiskType|Toconfigurefilter()}}</p>
            <p>可用区：{{scope.row.selectedCity.ZoneName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="address"
          label="单价">
          <template slot-scope="scope">
            <p>{{scope.row.Price.OriginalPrice/scope.row.DurationNum/scope.row.DiskCount}}元/月</p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="数量">
          <template slot-scope="scope">
            <p>{{scope.row.DiskCount}}</p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="付费方式">
          <template slot-scope="scope">
            <p v-if="scope.row.selectedBilling.type==='PREPAID'">预付费</p>
            <p v-if="scope.row.selectedBilling.type==='POSTPAID_BY_HOUR'">后付费</p>
          </template>

        </el-table-column>
        <el-table-column prop=""
          label="购买时长">
          <template slot-scope="scope">
            <p>{{scope.row.DurationNum}}个/月</p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="优惠">
          <template slot-scope="scope">
            <p>优惠：{{(scope.row.Price.DiscountPrice/scope.row.Price.OriginalPrice*10).toFixed(1)}}折</p>
          </template>

        </el-table-column>
        <el-table-column prop=""
          label="费用">
          <template slot-scope="scope">
            <p class="p-color-k">{{scope.row.Price.DiscountPrice}}元</p>
            <p class="p-color-l">原价{{scope.row.Price.OriginalPrice}}元</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="check-conter BoBStyle">
      <p>服务协议:
        <el-checkbox v-model="checked"></el-checkbox>
        XX云商目前仅针对签约客户开放，新客户请先与客服联系。
        已签约客户，当前配置提交后会由专人审核，审核通过后即可开通
      </p>
      <p style="float:right;padding-right:20px">
        <el-button type="warning"
          size="mini"
          @click="purchase">购买云硬盘</el-button>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      checked: false,
      disbleds: true,
      tableData: [],
      parms: '',
      active: 0
    }
  },
  created () {
    this.getparms()
  },
  methods: {
    getparms () {
      this.parms = JSON.parse(localStorage.getItem('CBS-parms'))
      console.log(this.parms)
      this.tableData.push(this.parms)
    },
    purchase () {
      if (this.checked === false) {
        this.$message.error('请勾选服务协议')
      } else {
        var parameter = {
          Version: '2017-03-12',
          Region: this.parms.Region,
          DiskType: this.parms.selectedDiskType.DiskType,
          DiskChargeType: this.parms.selectedDiskType.DiskChargeType,
          Placement: this.parms.selectedCity.Zone,
          DiskCount: this.parms.DiskCount,
          'DiskChargePrepaid.Period': this.parms.DurationNum,
          DiskSize: this.parms.DiskSize,
          '__fee__': this.parms.Price.OriginalPrice

        }

        if (this.parms.mirrorvalue) {
          parameter.SnapshotId = this.parms.mirrorvalue
        }

        if (this.parms.diskName) {
          parameter.DiskName = this.parms.diskName
        }
        if (this.parms.keyValueArr) {
          for (var i = 0; i < this.parms.keyValueArr.length; i++) {
            // console.log(this.parms.keyValueArr[i])
            parameter['Tags.' + i + '.key'] = this.parms.keyValueArr[i].key
            parameter['Tags.' + i + '.Value'] = this.parms.keyValueArr[i].value
          }
        }
        console.log(parameter)
        this.axios
          .post('cbs2/CreateDisks', parameter)
          .then(data => {
            console.log(data)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.check {
  background: #f0f2f5;
  min-height: 100%;
  .check-title {
    background: #fff;
    .check-title-pag {
      display: flex;
      justify-content: space-between;
      width: 1180px;
      height: 90px;

      margin: 0 auto;
      p {
        line-height: 90px;
        font-size: 26px;
        font-weight: 400;
      }
      div {
        width: 600px;
        padding-top: 6px;
      }
    }
  }
  .check-conter {
    font-size: 12px;
    width: 1180px;
    background: #fff;
    margin: 0 auto;
    margin-top: 20px;
    .p-color-k {
      color: #ff7a22;
    }
    .p-color-l {
      color: #a2a2a2;
      text-decoration: line-through;
    }
  }
  .BoBStyle {
    height: 90px;
    p {
      padding: 10px 0 10px 20px;
    }
  }
}
</style>
