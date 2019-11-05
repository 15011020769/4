<template>
  <div class="Cbs-renew">
    <el-dialog :visible.sync="renewShow"
      :close-on-click-modal='false'
      :close-on-press-escape='false'
      :show-close='false'
      center>
      <div slot="title"
        class="title-wrap">
        <span>云硬盘续费</span>
        <i class="el-icon-close"
          @click="close"></i>
      </div>
        <ul>
          <li class="duration-style"
            v-show="showdur">
            <p>购买时长</p>
            <div>
              <Duration :DurationArr='DurationArr'
                class="Durstyle"
                v-on:changeDuration="changeDuration"
                :value.sync="selectedDuration">
              </Duration>
              <a @click="OtherDuration"
                v-if="Durationshow">其他时长</a>

            </div>
          </li>
          <li>
            <p>新到期时间</p>
            <div>
              {{NewTime}}
            </div>
          </li>
          <li>
            <p>费用</p>
            <div class="style-Price">
              <div class="display-line-p">
                <span v-if="this.OriginalPrice.OriginalPrice===this.OriginalPrice.DiscountPrice"
                  class="font-size-span">{{OriginalPrice.OriginalPrice}}<span> 元</span></span>
                <span v-if="this.OriginalPrice.OriginalPrice!==this.OriginalPrice.DiscountPrice"
                  class="font-size-span">{{OriginalPrice.DiscountPrice}}<span> 元</span>
                  <span class="color-span">{{OriginalPrice.OriginalPrice}}元</span>
                </span>
              </div>

            </div>
          </li>
        </ul>
        <span slot="footer"
          class="dialog-footer">

          <el-button type="primary"
            @click="renew">确 定</el-button>
          <el-button @click="close">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: {
    renewShow: Boolean,
    Cbsdata: Object
  },
  data () {
    return {
      OtherDura: false, // 其他时长
      showdur: true, // 按量计费不显示时长
      DurationArr: [], // 时长按钮列表
      selectedDuration: '', // 时长样式判断
      selDuration: {}, // 默认选中时长
      Durationshow: true, // 显示隐藏其他时长按钮
      DurationNum: '', // 购买时长得到值
      NewTime: '', // 新到期时间
      OriginalPrice: '' // 续费询价
    }
  },
  components: {},
  created () {
    this.GetDuration()
    this.newTime()
  },
  methods: {
    // 购买时长
    GetDuration () {
      let DuraArr1 = [
        { type: '1', label: '1个月', value: 'BOB1' },
        { type: '2', label: '2个月', value: 'BOB2' },
        { type: '3', label: '3个月', value: 'BOB3' }
      ]
      let DuraArr2 = [
        { type: '4', label: '4个月', value: 'BOB4' },
        { type: '5', label: '5个月', value: 'BOB5' },
        { type: '6', label: '6个月', value: 'BOB6' },
        { type: '7', label: '7个月', value: 'BOB7' },
        { type: '8', label: '8个月', value: 'BOB8' },
        { type: '9', label: '9个月', value: 'BOB9' },
        { type: '10', label: '10个月', value: 'BOB10' },
        { type: '11', label: '11个月', value: 'BOB11' }
      ]

      let DuraArr3 = [
        { type: '12', label: '1年', value: 'BOA1' },
        { type: '24', label: '2年', value: 'BOA2' },
        { type: '36', label: '3年', value: 'BOA3' }
      ]

      let DuraArr4 = [
        { type: '48', label: '4年', value: 'BOA4' },
        { type: '60', label: '5年', value: 'BOA5' }
      ]
      if (this.OtherDura === false) {
        this.DurationArr = DuraArr1.concat(DuraArr3)
      } else {
        this.DurationArr = DuraArr1.concat(DuraArr2, DuraArr3, DuraArr4)
      }
      this.selectedDuration = this.DurationArr[0].value
      this.value = this.selectedDuration
      this.selDuration = this.DurationArr[0]
      this.DurationNum = this.selDuration.type
      this.newTime()
      this.inquiry()
    },
    // 切换购买时长
    changeDuration (value) {
      this.selDuration = value
      this.value = this.selDuration.value
      this.DurationNum = this.selDuration.type
      this.newTime()
      this.inquiry()
    },
    // 其他时长
    OtherDuration () {
      this.Durationshow = false
      this.OtherDura = true
      this.DurationNum = this.DurationArr[0].type
      this.GetDuration()
    },
    newTime () {
      const nian = moment(this.Cbsdata.DeadlineTime).format('YYYY')
      let yue = moment(this.Cbsdata.DeadlineTime).format('MM')
      const ri = moment(this.Cbsdata.DeadlineTime).format('DD')
      const shi = moment(this.Cbsdata.DeadlineTime).format('HH')
      const fen = moment(this.Cbsdata.DeadlineTime).format('mm')
      const miao = moment(this.Cbsdata.DeadlineTime).format('ss')
      yue = Number(yue) + Number(this.DurationNum)
      this.NewTime = moment(
        new Date(nian, Number(yue - 1), ri, shi, fen, miao)
      ).format('YYYY-MM-DD HH:mm:ss')
    },
    // 续费询价
    inquiry () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'DiskIds.0': this.Cbsdata.DiskId,
        'DiskChargePrepaids.0.Period': this.DurationNum,
        ProjectId: this.Cbsdata.Placement.ProjectId
      }
      this.axios.post('cbs2/InquiryPriceRenewDisks', parms).then(data => {
        this.OriginalPrice = data.Response.DiskPrice
      })
    },
    // 取消
    close () {
      this.$emit('renewShow', false)
    },
    // 续费确定
    renew () {
      var parms = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        'DiskChargePrepaid.Period': this.DurationNum,
        DiskId: this.Cbsdata.DiskId,
        __fee__: this.OriginalPrice.OriginalPrice
      }
      this.axios.post('cbs2/RenewDisk', parms).then(data => {
        this.$emit('renewShow', false)
        console.log(data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.Cbs-renew {
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
  ul {
    li {
      display: flex;
      padding: 10px 0;
      p {
        width: 15%;
      }

      a {
        padding-left: 20px;
        cursor: pointer;
      }
      .block {
        width: 600px;
      }
    }
    .duration-style {
      display: flex;
      p {
        width: 15%;
      }
      div {
        width: 85%;
      }
    }
    .style-Price {
      color: #ff7a22;
      .font-size-span {
        font-size: 24px;
      }
      .color-span {
        padding-left: 10px;
        color: #a2a2a2;
        text-decoration: line-through;
      }
      span {
        font-size: 16px;
      }
    }
  }

  .Durstyle {
    display: inline;
  }
}
</style>
