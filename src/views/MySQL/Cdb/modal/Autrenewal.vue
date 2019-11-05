<template>
  <div class="Cdb-Autrenewal">
    <el-dialog :visible.sync="AutrenewallShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      width="580px"
      center>
      <div slot="title"
        class="title-wrap">
        <span>设置自动续费</span>
        <i class="el-icon-close"
          @click="close"></i>
      </div>
      <div class="Cdb-mountbottom"> 您已选 1台 云硬盘 <a @click="Detailshow">查看详情</a></div>
      <div v-if="Detailsshow"
        class="Cdb-mountbottom">
        <el-table :data="tableDataCDB"
          border
          style="width: 100%">
          <el-table-column prop="InstanceId"
            label="实例ID">
          </el-table-column>
          <el-table-column prop="InstanceName"
            label="实例名">
          </el-table-column>
          <el-table-column prop=""
            label="实例类型">
            <template slot-scope="scope">
              {{scope.row.InstanceType|MYSQLTYPEFilter()}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="Cdb-renew">
        <p>费用</p>
        <div>{{OriginalPrice.Price}}元</div>
      </div>

      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          @click="Autrenewal">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    AutrenewallShow: Boolean,
    Cdbdata: Object
  },
  data () {
    return {
      Detailsshow: false,
      tableDataCDB: [],
      OriginalPrice: ''
    }
  },
  components: {},
  created () {
    console.log(this.Cdbdata)
    this.tableDataCDB.push(this.Cdbdata)
    this.inquiry()
  },
  methods: {
    Detailshow () {
      this.Detailsshow = !this.Detailsshow
    },
    // 询价
    inquiry () {
      var parms = {
        Version: '2017-03-20',
        Region: this.$cookie.get('regionv2'),
        Zone: this.Cdbdata.Zone,
        GoodsNum: 1,
        Memory: this.Cdbdata.Qps,
        Volume: this.Cdbdata.Volume,
        PayType: 'PRE_PAID',
        Period: 1
      }
      this.axios.post('cdb2/DescribeDBPrice', parms).then(data => {
        this.OriginalPrice = data.Response
      })
    },

    // 编辑标签确定
    Autrenewal () {
      // console.log(this.keyValueArr)
      // var parms = {
      //   Version: '2017-03-20',
      //   Region: this.$cookie.get('regionv2'),
      //   InstanceId: this.Cdbdata.InstanceId
      // }
      // for (let i in this.keyValueArr) {
      //   parms['ReplaceTags.' + i + '.TagKey'] = this.keyValueArr[i].key
      //   parms['ReplaceTags.' + i + '.TagValue.' + i] = this.keyValueArr[i].value
      // }
      // this.axios.post('cdb2/ModifyInstanceTag', parms).then(data => {
      //   console.log(data)
      //   if (data.Response.Error === undefined) {
      //     this.$emit('AutrenewallShow', false)
      //     this.$parent.getDataList()
      //     this.$message({
      //       message: '编辑标签成功',
      //       type: 'success'
      //     })
      //   }
      // })
    },
    // 取消
    close () {
      this.$emit('AutrenewallShow', false)
    }
  }
}
</script>

<style lang="scss" >
.Cdb-Autrenewal {
  a {
    cursor: pointer;
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
      cursor: pointer;
    }
  }
  .el-dialog__body {
    padding: 10px 20px 30px;
    font-size: 12px;
    line-height: 20px;
    .Cdb-renew{
      display: flex;
      p{
        color: #ccc;
        width: 100px;
      }
      div{
  color: #ff7800;
    font-size: 24px;
      }
    }
  }
  .Cdb-mountbottom {
    margin-bottom: 15px;
  }
  h2 {
    color: black;
    font-size: 14px;
  }
}
</style>
