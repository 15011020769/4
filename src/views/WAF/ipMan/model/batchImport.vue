<template>
  <div class="container">
    <div type="flex" align="middle" justify="center" class="import-wrap">
      <el-upload
        class="import-btn"
        action=""
        accept=".xlsx,.xls"
        :show-file-list="false"
        :on-change="fileChange"
        :auto-upload="false"
      >
        <el-button type="primary" size="small">导入</el-button>
      </el-upload>
      <p class="imp-tip" v-if="tip === 'default'">点击按钮，选择文件。</p>
      <p class="imp-tip" v-if="tip === 'parse'" style="color: #FF9D00;">正在解析文件，请稍后。</p>
      <p class="imp-tip" v-if="tip === 'format'" style="color: #e1504a;">仅支持.xlsx，.xls。</p>
      <p class="imp-tip" v-if="tip === 'contenterror'" style="color: #e1504a;">文件内容，必须包含类别，IP地址，截止时间三列</p>
      <p class="imp-tip" v-if="tip === 'timeerror'" style="color: #e1504a;">时间格式错误 或 截止时间大于2033-12-30 23:59:59</p>
      <p class="imp-tip" v-if="tip === 'success'" style="color: #007e3b;">解析成功，您准备导入{{count}}条数据。请点击 “确认导入”，开始传输。</p>
    </div>
    <div class="tip">
      <p>说明</p>
      <p>1.格式，仅支持.xlsx，.xls。</p>
      <p>2.数量，目前只支持单个文件上传。</p>
      <p>3.内容，必须包含类别，IP地址，截止时间三列；具体可参考导出数据excel格式。</p>
      <p>4.截止时间，必须在2033/12/30 23:59:59之前，格式YYYY/MM/DD HH:MM:SS。</p>
    </div>
    <el-row type="flex" align="middle" justify="center">
      <el-button type="primary" size="small" @click="_import" :loading="loading" :disabled="tip !== 'success'">确认导入</el-button>
      <el-button class="reset" size="small" :disabled="loading" @click="reset">重置</el-button>
    </el-row>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import moment from 'moment'
import { UPSERTIP_ACCESS_CONTROL } from '@/constants'
import { COMMON_ERROR } from '../../constants'
const titles = ['类别',	'截止时间',	'备注',	'IP地址',]
export default {
  props: {
    domain: String,
    onSuccess: Function,
  },
  data() {
    return {
      tip: 'default',
      count: 0,
      Items: undefined,
      loading: false,
    }
  },
  methods: {
    reset() {
      this.onSuccess()
      this.tip = 'default'
    },
    fileChange(file) {
      this.tip = 'parse'
      if (!file.name.endsWith('xlsx') && !file.name.endsWith('xls')) {
        this.tip = 'format'
        return false
      }
      const reader = new FileReader();
			reader.onload = (e) => {
				/* Parse data */
				const bstr = e.target.result;
				const wb = XLSX.read(bstr, {type:'binary'});
				/* Get first worksheet */
				const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
				/* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, {header:1});
        const titles = data.shift() // 删除第一行表头
        const infoIndex = {}
        if (
          !titles.includes('类别')
          || !titles.includes('IP地址')
          || !titles.includes('截止时间')
        ) {
          this.tip = 'contenterror'
          return
        }
        titles.forEach((t, i) => {
          switch(t) {
            case 'IP地址':
              infoIndex.ip = i
              break;
            case '类别':
              infoIndex.action = i
              break;
            case '截止时间':
              infoIndex.valid = i
              break;
            case '备注':
              infoIndex.note = i
              break;
          }
        })
        this.add(data, infoIndex)
			};
			reader.readAsBinaryString(file.raw);
    },
    add(data, di) {
      let flag = true
      const Items = {}
      for (let i = 0; i < data.length; i += 1) {
        if (!moment(data[i][di.valid]).isValid() || moment().isAfter(moment('2033-12-30 23:59:59'))) {
          this.tip = 'timeerror'
          flag = false
          break
        }
        Items[`Items.${i}`] = JSON.stringify({
          ip: data[i][di.ip],
          action: data[i][di.action] === '白名单' ? 40 : 42,
          source: 'custom',
          note: data[i][di.note],
          valid_ts: Number(moment(data[i][di.valid], 'YYYY/MM/DD HH:mm:ss').format('X'))
        })
      }
      if (flag) {
        this.count = data.length
        this.tip = 'success'
        this.Items = Items
      }
    },
    _import() {
      this.loading = true
      const param = {
        Version: '2018-01-25',
        Domain: this.domain,
        Edition: 'clb-waf',
        ...this.Items
      }
      this.axios.post(UPSERTIP_ACCESS_CONTROL, param)
      .then(resp => {
        this.generalRespHandler(resp, this.onSuccess, COMMON_ERROR, this.t('导入成功', 'WAF.drcg'))
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.import-wrap {
  padding: 20px 0 15px 0;
  border: 2px dashed #bbb;
}
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