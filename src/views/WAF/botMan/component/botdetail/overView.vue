<template>
  <div class="main_overview">
    <div class="firstShow">
      <h3>
          <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
          请求次数统计
          <span style="color:#bbb;">(%)</span>
        </h3>
    </div>
    <el-row class="secondShow">
      <el-col :span="12">
        <h3 class="topfont">
          <!-- {{t('访问类型占比', 'WAF.fwlxzb')}} -->
          BOT 动作占比
          <span style="color:#bbb;">(%)</span>
        </h3>
        <el-row class="empty" v-if="seriesPieType.length == 0 ? true : false">暂无数据</el-row>
        <EPie
          :series="seriesPieType"
          :color="colorPie"
          :legendText="legendTextPieType"
          v-else
        />
        </el-col>
        <el-col :span="12">
        <h3 class="topfont">
          <!-- {{t('攻击类型占比', 'WAF.gjlxzb')}} -->
          BOT 类型占比
          <span style="color:#bbb;">(%)</span>
        </h3>
        <el-row class="empty" v-if="seriesPieAction.length == 0 ? true : false">暂无数据</el-row>
        <EPie
          :series="seriesPieAction"
          :color="colorPie"
          :legendText="legendTextPieAction"
          v-else
        />
      </el-col>
    </el-row>
    <div class="thirdShow">

    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
    DESCRIBE_BOT_TYPE_STAT,
    DESCRIBE_BOT_ACTION_STAT
  } from '@/constants'
import EPie from '../../../saveOverView/components/pie'
import ELine from '../../../saveOverView/components/line'
export default {
  data () {
    return {
      seriesPieType: [],
      seriesPieAction: [],
      colorPie: ['#2277da', '#e54545', '#ff9d00', '#f5736e'],
      legendTextPieType: ['公开类型', '未知类型', '用户自定义类型'],
      legendTextPieAction: ['验证码', '拦截', '监控', '重定向'],
    }
  },
  props: {
    domin: {
      type: String,
      default: "tfc.dhycloud.com"
    },
    times: {
      type: Array,
      defaule: () => []
    }
  },
  components: {
    EPie,
    ELine
  },
  watch: {
    times() {
      this.getBotType()
      this.getBotAction()
    },
    domin() {
      // this.getBotType()
      // this.getBotAction()
    }
  },
  mounted() {
    this.getBotType()
    this.getBotAction()
  },
  methods: {
    // 获取Bot_V2 Bot类别统计
    getBotType() {
     const params = {
        Version: "2018-01-25",
        StartTs: moment(this.times[0]).utc().valueOf(),
        EndTs: moment(this.times[1]).utc().valueOf(),
        Domain: this.domin,
      }
      this.axios.post(DESCRIBE_BOT_TYPE_STAT, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.$set(this.seriesPieType, 0, {value: Response.TCB, name: '公开类型'})
          this.$set(this.seriesPieType, 1, {value: Response.UB, name: '未知类型'})
          this.$set(this.seriesPieType, 2, {value: Response.UCB, name: '用户自定义类型'})
        })
      })
    },
    // Bot_V2 获取bot动作统计
    getBotAction() {
     const params = {
        Version: "2018-01-25",
        StartTs: moment(this.times[0]).utc().valueOf(),
        EndTs: moment(this.times[1]).utc().valueOf(),
        Domain: this.domin,
      }
      this.axios.post(DESCRIBE_BOT_ACTION_STAT, params).then((resp) => {
        this.generalRespHandler(resp, (Response) => {
          this.$set(this.seriesPieAction, 0, {value: Response.Captcha, name: '验证码'})
          this.$set(this.seriesPieAction, 1, {value: Response.Intercept, name: '拦截'})
          this.$set(this.seriesPieAction, 2, {value: Response.Monitor, name: '监控'})
          this.$set(this.seriesPieAction, 3, {value: Response.Redirect, name: '重定向'})
        })
      })
    },
  }
}

</script>
<style lang='scss' scoped>
::v-deep .el-col-12:nth-child(1) {
  height: 100%;
  border-right: 1px solid #e5e5e5;
}
.main_overview {
  margin-top: 30px;
  .firstShow {
    padding: 20px;
    width: 100%;
    height: 375px;
    background: #fff;
    box-sizing: border-box;
  }
  .secondShow {
    width: 100%;
    height: 258px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    .topfont{
      padding-left: 20px;
    }
    .empty {
      height: 200px;
      width: 100%;
      line-height: 200px;
      text-align: center;
      font-weight: bold
    }
  }
  .thirdShow {
    width: 100%;
    height: 658px;
    padding: 20px 0;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    margin-top: 20px;
    .topfont{
      padding-left: 20px;
    }
    .empty {
      height: 200px;
      width: 100%;
      line-height: 200px;
      text-align: center;
      font-weight: bold
    }
  }
}
</style>
