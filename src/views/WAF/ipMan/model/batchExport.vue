<template>
  <div class="container">
    <div type="flex" align="middle" justify="center" class="import-wrap">
      <el-row type="flex" align="middle">
        <span style="color: #888; font-size: 12px; width: 40px; display: inline-block;">进度：</span>
        <el-col>
        <el-progress :percentage="(progress/count)*100" :show-text="false"></el-progress>
        </el-col>
      </el-row>
        <p class="imp-tip">{{progress}}/{{count}}</p>
    </div>
    <div class="tip">
      <p>说明</p>
      <p>1. 数量量大的时候，导出可能比较慢，请耐心等待。</p>
      <p>2. 最多导出10000条数据。</p>
    </div>
    <el-row type="flex" align="middle" justify="center">
      <el-button type="primary" size="small" @click="_export" :loading="loading">开始导出</el-button>
      <el-button class="reset" size="small" :disabled="loading" @click="cancel">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import moment from 'moment'
import { DESCRIBE_ACCESS_CONTROL } from '@/constants'
import { COMMON_ERROR } from '../../constants'

export default {
  props: {
    domain: String,
    param: Object,
    count: 0,
  },
  data() {
    return {
      loading: false,
      progress: 0,
    }
  },
  methods: {
    cancel() {
      this.$emit('update:visible', false)
    },
    _export() {
      const i = Math.ceil(this.count/600)
      const ps = []
      let data = [["IP地址", "类别", "来源", "更新时间", "截止时间", "备注"]]
      for (let j = 0; j < i; j += 1) {
        ps.push(this.axios.post(DESCRIBE_ACCESS_CONTROL, {
          ...this.param,
          Limit: 600,
          OffSet: j * 600,
        }))
      }
      Promise.all(ps)
      .then(resp => {
        resp.forEach(({ Response }) => {
          Response.Data.Res.forEach(item => {
            const { Ip, ActionType, Source, TsVersion, ValidTs, Note } = item
            data.push([
              Ip,
              ActionType === 42 ? '黑名单' : '白名单',
              Source === 'custom' ? '自定义' : Source,
              TsVersion ? moment(TsVersion).format('YYYY/MM/DD HH:mm:ss') : '',
              moment(ValidTs * 1000).format('YYYY/MM/DD HH:mm:ss'),
              Note
            ])
            this.progress += 1
          })
        })
        const ws = XLSX.utils.aoa_to_sheet(data) // 导出的数据
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "ip_list")
        /* generate file and send to client */
        XLSX.writeFile(wb, `ip_list_${moment().format('x')}.xlsx`)
        this.$emit('update:visible', false)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.imp-tip {
  color: #444;
  font-size: 12px;
  margin-top: 10px;
}
.tip {
  margin: 15px 0;
  color: #bbb;
  font-size: 12px;
  p:not(:first-of-type) {
    text-indent: 25px;
  }
}
.reset {
  margin-left: 15px;
}
</style>