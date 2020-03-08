<template>
  <div class='container-min' v-loading="loadShow">
    <el-card class="card1">
      <h4 class="title-text">基本信息</h4>
      <el-form class="form" label-position='left' label-width="120px" size="mini">
        <el-form-item label="模板名称" class="form-item">
          <div class="item-text">
            {{infoData.groupName}}
            <i class="el-icon-edit"></i>
          </div>
        </el-form-item>
        <el-form-item label="策略类型">
          <div class="item-text">最后修改时间</div>
        </el-form-item>
        <el-form-item label="最后修改人">
          <div class="item-text">{{infoData.lastEditUin}}</div>
        </el-form-item>
        <el-form-item label="最后修改时间">
          <div class="item-text">{{upTime(infoData.updateTime)}}</div>
        </el-form-item>
        <el-form-item label="备注">
          <div class="item-text">
            <span>{{infoData.remark}}</span>
            <i class="el-icon-edit"></i>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="card2">
      <h4 class="title-text">告警触发条件 <span>编辑</span></h4>
      <p class="text-color1">指标告警(任意)</p>
      <p class="text-color2" v-for="(it,i) in infoData.conditions" :key="i">
        {{ `${it.metricShowName}>${it.calcValue}${it.unit},持续${it.continueTime}秒,按${it.calcType}天重复告警` }}
      </p>
      <p class="text-color1">事件告警</p>
      <p class="text-color2" v-for="(it,i) in infoData.eventConditions" :key="i">
        {{ `${it.eventShowName},不重复告警` }}
      </p>
    </el-card>
    <el-card class="card3">
      <h4 class="title-text">关联告警策略</h4>
      <el-table border>
        <el-table-column label="策略名称"></el-table-column>
        <el-table-column label="所属项目"></el-table-column>
        <el-table-column label="已启用/实例数"></el-table-column>
        <el-table-column label="告警渠道"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { GET_TEMPLATE_LIST, GET_GROUP_LIST } from '@/constants/CM-yhs.js'
import Loading from '@/components/public/Loading'
import { ErrorTips } from '@/components/ErrorTips.js' // 公共错误码
import moment from 'moment'
export default {
  name: 'templateInfo',
  data () {
    return {
      loadShow: false, // 加载显示
      infoData: {}, // 详情信息
      id: ''// 模板id
    }
  },
  components: {
    Loading
  },
  created () {
    this.id = this.$route.query.groupId
    this.getDetailInfo()
    this.getPolicyGroupList()
  },
  methods: {
    async getDetailInfo () {
      this.loadShow = true
      let params = {
        groupId: this.id,
        lang: 'zh'
      }
      await this.axios.post(GET_TEMPLATE_LIST, params).then(res => {
        if (res.codeDesc === 'Success') {
          this.loadShow = false
          let msg = res.data.templateGroupList
          if (msg.length) {
            this.infoData = msg[0]
          }
          // console.log(msg)
        } else {
          this.loadShow = false
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 获取策略组列表
    async getPolicyGroupList () {
      this.loadShow = true
      let params = {
        conditionTempGroupId: this.id,
        lang: 'zh',
        like: '',
        limit: 20,
        offset: 0
      }
      await this.axios.post(GET_GROUP_LIST, params).then(res => {
        if (res.codeDesc === 'Success') {
          this.loadShow = false
          console.log(res)
        } else {
          this.loadShow = false
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
      })
    },
    // 格式化时间
    upTime (value) {
      return moment(value).format('YYYY/MM/DD HH :mm:ss')
    }
  }
}
</script>

<style lang='scss'>
.card1{
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 20px;
  .form{
    .form-item{
      font-size: 12px;
      color: #888;
    }
    .el-form-item__label{
      font-size: 12px;
      color: #888;
    }
}
}
.form{
  .form-item{
    font-size: 12px;
    color: #888;
  }
  .el-form-item__label{
    font-size: 12px;
    color: #888;
  }
}
.title-text{
    font-size: 14px;
    font-weight: 700;
    color: #000;
    margin-bottom: 20px;
}
.card2{
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 20px;
  .title-text{
    span{
      font-size: 14px;
      color:#006eff;
    }
  }
  .text-color1{
    font-size: 12px;
    color: #888;
    margin-bottom: 10px;
  }
  .text-color2{
    font-size: 12px;
    color: #444;
    margin-bottom: 10px;
  }
}
// .card3{
//   // margin: 20px;
// }
.item-text{
  font-size: 12px;
  color: #444;
}

</style>
