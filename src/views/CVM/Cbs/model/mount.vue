<template>
  <div class="Cbs-mount">
    <el-dialog :visible.sync="mountShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      width="600px"
      center>
      <div slot="title"
        class="title-wrap">
        <span>挂载到实例</span>
        <i class="el-icon-close"
          @click="close"></i>
      </div>

      <div class="Cbs-mountbottom"> 您已选 1台 云硬盘 <a @click="Detailshow">查看详情</a></div>
      <div v-if="Detailsshow"
        class="Cbs-mountbottom">
        <el-table :data="tableData"
          border
          style="width: 100%">
          <el-table-column prop="date"
            label="No."
            width="55">
            <template slot-scope="scope">
              1
            </template>
          </el-table-column>
          <el-table-column prop="DiskName"
            label="云硬盘名称"
            width="120">
          </el-table-column>
          <el-table-column prop="DiskId"
            label="云硬盘ID" width="120">
          </el-table-column>
          <el-table-column prop=""
            label="计费模式"
            width="80">
            <template slot-scope="scope">
              {{scope.row.DiskChargeType|Billingmodelfilter()}}
            </template>
          </el-table-column>
          <el-table-column prop="DeadlineTime"
            label="到期/创建时间">
              <template slot-scope="scope">
            {{scope.row.DeadlineTime}} 到期
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="Cbs-mountxin Cbs-mountbottom">
        <p>手动挂载云硬盘后，云硬盘作为云服务器的数据盘使用，默认为脱机状态。您需要对数据盘进行格式化、分区及创建文件系统等初始化操作。详情可见 挂载云硬盘</p>
      </div>
      <h2 class="Cbs-mountbottom">请选择实例</h2>
      <div class="Cbs-cvmtable">
        <el-input placeholder="请输入实例ID"
          v-model="input">
          <el-button slot="append"
            icon="el-icon-search"
            @click="search"></el-button>
        </el-input>
        <el-table :data="cvmmount"
          border
          v-loading='loading'
          style="width: 100%">
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-radio class="radio"
                v-model="radio"
                :label="scope.row"
                @change='radiovalue'>&nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop=""
            label="ID/名称">
            <template slot-scope="scope">
              <p>{{scope.row.InstanceId}}</p>
              <p>{{scope.row.InstanceName}}</p>
            </template>
          </el-table-column>
          <el-table-column prop=""
            label="已挂载/总可挂载">
            <template slot-scope="scope">
              <p>{{scope.row.AttachedDiskCount}}/{{scope.row.MaxAttachCount}}</p>

            </template>
          </el-table-column>
          <el-table-column prop=""
            label="实例到期时间">
            <template slot-scope="scope">
              <p>{{scope.row.InstanceChargeType|Billingmodelfilter()}}</p>
              <p>{{scope.row.ExpiredTime |renderTime()}}</p>
            </template>
          </el-table-column>
        </el-table>
        <div class="mount-pag Cbs-mountbottom">
          <el-pagination @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper"></el-pagination>
        </div>
      </div>
      <div v-if="this.SelectionArr!==''"
        class="mount-radio">
        <ul>
          <li>
            <p>挂载选项</p>
            <div>
              <el-radio-group v-model="radiok"
                @change='radiovaluekk'>
                <p>
                  <el-radio :label="1">对齐实例到期时间，到期时间将延长至{{SelectionArr.ExpiredTime |renderTime()}}</el-radio>
                </p>
                <p>
                  <el-radio :label="2">硬盘到期后按月自动续费</el-radio>
                </p>
                <p>
                  <el-radio :label="3">直接挂载，不做续费处理（不推荐）</el-radio>
                </p>
              </el-radio-group>
            </div>
          </li>
          <li v-if="this.radiok===1">
            <p>补齐费用</p>
            <div class="pirce-style">{{price.DiscountPrice}}元</div>
          </li>
          <li v-if="this.radiok===3">
            <div>
              <el-checkbox v-model="checked"></el-checkbox>您需了解：选择当前挂载选项，云硬盘可能在实例到期前被隔离，导致业务中断。建议您挂载前对齐实例到期时间补齐费用，或开启该云硬盘的自动续费功能。
            </div>
          </li>
        </ul>
      </div>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          @click="mount"
          :disabled="this.radiok===3&&!checked">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    mountShow: Boolean,
    Cbsdata: Object
  },
  data () {
    return {
      checked: false,
      Detailsshow: false,
      tableData: [],
      radio: '1',
      radiok: 1,
      CvmArr: [], // 云主机列表
      CvmArrNum: [], // 可挂载数据
      cvmmount: [],
      loading: false,
      input: '', // 搜索
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度
      SelectionArr: '',
      price: {} // 续费询价
    }
  },
  components: {},
  created () {
    this.tableData.push(this.Cbsdata)
    this.GetCvm()
  },
  methods: {
    // 获取云主机列表
    GetCvm () {
      this.loading = true
      this.radio = '1'
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        Offset: this.pageIndex * this.pageSize - this.pageSize,
        Limit: this.pageSize
      }
      if (this.input !== '') {
        parms['InstanceIds.0'] = this.input
      }
      this.axios
        .post('cvm2/DescribeInstances', parms)
        .then(data => {
          if (data.Response.Error === undefined) {
            this.CvmArr = data.Response.InstanceSet
            this.totalPage = data.Response.TotalCount
          } else {
            this.CvmArr = []
            this.totalPage = 0
          }
        })
        .then(data => {
          this.GetCvmNum()
        })
    },
    // 查询实例关联的云硬盘数量
    GetCvmNum () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2')
      }
      for (let i in this.CvmArr) {
        parms['InstanceIds.' + i] = this.CvmArr[i].InstanceId
      }
      this.axios.post('cbs2/DescribeInstancesDiskNum', parms).then(data => {
        this.CvmArrNum = data.Response.AttachDetail
        for (var i = 0; i < this.CvmArr.length; i++) {
          for (var j = 0; j < this.CvmArrNum.length; j++) {
            if (this.CvmArr[i].InstanceId === this.CvmArrNum[j].InstanceId) {
              this.CvmArr[i].AttachedDiskCount = this.CvmArrNum[j].AttachedDiskCount
              this.CvmArr[i].MaxAttachCount = this.CvmArrNum[j].MaxAttachCount
            }
          }
        }
        this.cvmmount = this.CvmArr
        this.loading = false
      })
    },
    // 搜索
    search () {
      this.GetCvm()
    },
    // 每页数
    sizeChangeHandle (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.pageIndex = 1
      this.GetCvm()
    },
    // 当前页
    currentChangeHandle (val) {
      console.log(`当前页: ${val}`)
      this.pageIndex = val
      this.GetCvm()
    },

    Detailshow () {
      this.Detailsshow = !this.Detailsshow
    },
    // 表格选中
    radiovalue (value) {
      this.SelectionArr = value
      if (this.SelectionArr !== '') {
        this.inquiry()
      }
    },
    // 挂载选中
    radiovaluekk (value) {
      console.log(this.radiok)
    },
    // 续费询价
    inquiry () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'DiskIds.0': this.Cbsdata.DiskId,
        NewDeadline: moment(new Date(this.SelectionArr.ExpiredTime)).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      }
      this.axios.post('cbs2/InquiryPriceRenewDisks', parms).then(data => {
        this.price = data.Response.DiskPrice
      })
    },
    // 续费(与云主机时长一样)
    renew () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        DiskId: this.Cbsdata.DiskId,
        'DiskChargePrepaid.Period': 1,
        'DiskChargePrepaid.RenewFlag': 'NOTIFY_AND_AUTO_RENEW',
        'DiskChargePrepaid.CurInstanceDeadline': moment(
          new Date(this.SelectionArr.ExpiredTime)
        ).format('YYYY-MM-DD HH:mm:ss')
      }
      this.axios.post('cbs2/RenewDisk', parms).then(data => {
        if (data.Response.Error === undefined) {
          this.mountBkl()
        }
      })
    },
    // 修改云硬盘续费标识
    Automaticrenewal () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'DiskIds.0': this.Cbsdata.DiskId,
        RenewFlag: 'NOTIFY_AND_AUTO_RENEW'
      }
      this.axios.post('cbs2/ModifyDisksRenewFlag', parms).then(data => {
        if (data.Response.Error === undefined) {
          this.mountBkl()
        }
      })
    },
    // 挂载
    mountBkl () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'DiskIds.0': this.Cbsdata.DiskId,
        InstanceId: this.SelectionArr.InstanceId
      }
      this.axios.post('cbs2/AttachDisks', parms).then(data => {
        if (data.Response.Error === undefined) {
          this.$emit('mountShow', false)
          this.$parent.getDataList()
          this.$message({
            message: '挂载成功',
            type: 'success'
          })
        }
      })
    },
    // 挂载确定
    mount () {
      if (this.radiok === 1) {
        this.renew()
      } else if (this.radiok === 2) {
        this.Automaticrenewal()
      } else {
        this.mountBkl()
      }
    },
    // 取消
    close () {
      this.$emit('mountShow', false)
    }
  }
}
</script>

<style lang="scss" >
.Cbs-mount {
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
    .el-table .cell {
      font-size: 12px;
    }
  }
  .Cbs-mountbottom {
    margin-bottom: 15px;
  }
  .Cbs-mountxin {
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    padding: 10px 30px 10px 20px;
  }
  .mount-pag {
    height: 36px;
    border: 1px solid#ebeef5;
    border-top: none;
    .el-pagination {
      float: right;
    }
  }
  .mount-radio {
    ul {
      li {
        display: flex;
        p {
          width: 100px;
          color: #ccc;
        }
        div {
          p {
            padding-bottom: 10px;
          }
        }
        .pirce-style {
          color: #ff7800;
          font-size: 24px;
        }
      }
    }
  }
  h2 {
    color: black;
    font-size: 14px;
  }
  .Cbs-cvmtable {
    .el-input-group > .el-input__inner {
      width: 503px;
    }
  }
}
</style>
