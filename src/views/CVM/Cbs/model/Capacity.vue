<template>
  <div class="Cbs-Capacity">
    <el-dialog :visible.sync="CapacityShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      width="570px"
      center>
      <div slot="title"
        class="title-wrap">
        <span>调整硬盘</span>
        <i class="el-icon-close"
          @click="close"></i>
      </div>
      <ul class="Capacity-xin">
        <li class="Cbs-important">重要提示：</li>
        <li class="Cbs-important">强烈建议您在执行扩容操作前对云硬盘制作快照，防止因误操作造成文件系统损坏</li>
        <li>为了防止数据丢失，硬盘只可扩容不可缩</li>
        <li>硬盘扩容后需要登录虚拟机手动修改文件系统配置，把新增部分容量使用起来，请见详细</li>
        <li>说明： 扩容Windows文件系统 和 扩容Linux文件系统</li>
      </ul>
      <ul class="Capacity-ul">
        <li>
          <p>当前容量</p>
          <div> {{Cbsdata.DiskSize}}GB</div>
        </li>
        <li>
          <p>目标容量</p>
          <div>
            <div class="block">
              <el-slider :max='16000'
                @change='slider'
                :min='10'
                :step="10"
                v-model="slidervalue"
                show-input>
              </el-slider>
            </div>
          </div>
        </li>
        <li>
          <p>需支付费用</p>
          <div class="priceStyle"
            v-if="Price.ChargeUnit===undefined">
            {{Price.DiscountPrice}}元
          </div>
          <div class="priceStyle"
            v-if="Price.ChargeUnit==='HOUR'">
            {{Price.UnitPrice}}元/小时
          </div>
        </li>
      </ul>
      <span slot="footer"
        class="dialog-footer">
        <el-button type="primary"
          @click="Capacity">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    CapacityShow: Boolean,
    Cbsdata: Object
  },
  data () {
    return {
      slidervalue: this.Cbsdata.DiskSize + 10,
      Price: ''
    }
  },
  components: {},
  created () {
    this.inquiry()
  },
  methods: {
    // 取消
    close () {
      this.$emit('CapacityShow', false)
    },
    // 扩容
    Capacity () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        DiskId: this.Cbsdata.DiskId,
        DiskSize: this.slidervalue
      }
      this.axios.post('cbs2/ResizeDisk', parms).then(data => {
        if (data.Response.Error === undefined) {
          this.$emit('CapacityShow', false)
          this.$parent.getDataList()
          this.$message({
            message: '扩容成功',
            type: 'success'
          })
        }
      })
    },
    // 容量发生变化
    slider (value) {
      if (value < this.Cbsdata.DiskSize + 10) {
        this.slidervalue = this.Cbsdata.DiskSize + 10
      } else {
        this.slidervalue = value
      }
      this.inquiry()
    },
    // 扩容询价
    inquiry () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        DiskId: this.Cbsdata.DiskId,
        DiskSize: this.slidervalue,
        ProjectId: this.Cbsdata.Placement.ProjectId
      }
      this.axios.post('cbs2/InquiryPriceResizeDisk', parms).then(data => {
        this.Price = data.Response.DiskPrice
      })
    }
  }
}
</script>

<style lang="scss" >
.Cbs-Capacity {
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
    font-size: 12px;
    line-height: 20px;
    .Capacity-xin {
      background-color: #e5f0ff;
      padding: 10px 30px 10px 20px;
      color: #003b80;
      border: 1px solid #97c7ff;
      .Cbs-important {
        color: red;
      }
      .block {
        width: 300px;
      }
    }
    .Capacity-ul {
      li {
        display: flex;
        padding: 10px 0;
        p {
          width: 18%;
        }
        a {
          padding-left: 20px;
          cursor: pointer;
        }
        .block {
          margin-left: 10px;
          width: 380px;
        }
        .input-style {
          .el-input__inner {
            height: 30px;
          }
          span {
            color: #cccccc;
          }
          .span-color-num {
            color: red;
          }
        }
        .priceStyle {
          color: #ff7800;
          font-size: 24px;
        }
      }
    }
  }
}
</style>
