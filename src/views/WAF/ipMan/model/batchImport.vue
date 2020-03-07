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
        <el-button type="primary" size="small">{{t('导入', 'WAF.dr')}}</el-button>
      </el-upload>
      <p class="imp-tip" v-if="tip === 'default'">{{t('点击按钮，选择文件。', 'WAF.djan')}}</p>
      <p class="imp-tip" v-if="tip === 'parse'" style="color: #FF9D00;">{{t('正在解析文件，请稍后。', 'WAF.zzjxsj')}}</p>
      <p class="imp-tip" v-if="tip === 'format'" style="color: #e1504a;">{{t('仅支持', 'WAF.jzc')}}.xlsx，.xls。</p>
      <p class="imp-tip" v-if="tip === 'contenterror'" style="color: #e1504a;">{{t('文件内容，必须包含类别，IP地址，截止时间三列', 'WAF.wjnr')}}</p>
      <p class="imp-tip" v-if="tip === 'timeerror'" style="color: #e1504a;">{{t('时间格式错误 或 截止时间大于', 'WAF.sjgscw')}}2033-12-30 23:59:59</p>
      <p class="imp-tip" v-if="tip === 'success'" style="color: #007e3b;">{{t('解析成功，您准备导入', 'WAF.jxcg')}}{{count}}{{t('条数据。请点击 “确认导入”，开始传输。', 'WAF.tjs')}}</p>
    </div>
    <div class="tip">
      <p>{{t('说明', 'WAF.sm')}}</p>
      <p>1.格式，{{t('仅支持', 'WAF.jzc')}}.xlsx，.xls。</p>
      <p>2.{{t('数量，目前只支持单个文件上传。', 'WAF.dr')}}</p>
      <p>3.{{t('内容，必须包含类别，IP地址，截止时间三列；具体可参考导出数据excel格式。', 'WAF.nrbxbh')}}</p>
      <p>4.{{t('截止时间，必须', 'WAF.jzsjbx')}}在2033/12/30 23:59:59之前，格式YYYY/MM/DD HH:MM:SS。</p>
    </div>
    <el-row type="flex" align="middle" justify="center">
      <el-button type="primary" size="small" @click="_import" :loading="loading" :disabled="tip !== 'success'">
        {{t('确认导入', 'WAF.qedt')}}
      </el-button>
      <el-button class="reset" size="small" :disabled="loading" @click="reset">{{t('重置', 'WAF.nrbxbh')}}</el-button>
    </el-row>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import moment from 'moment'
import { UPSERTIP_ACCESS_CONTROL } from '@/constants'
import { COMMON_ERROR } from '../../constants'
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
          !titles.includes(this.t('类别', 'WAF.lb'))
          || !titles.includes('IP地址')
          || !titles.includes(this.t('截止时间', 'WAF.jzsj'))
        ) {
          this.tip = 'contenterror'
          return
        }
        titles.forEach((t, i) => {
          switch(t) {
            case 'IP地址':
              infoIndex.ip = i
              break;
            case this.t('类别', 'WAF.lb'):
              infoIndex.action = i
              break;
            case this.t('截止时间', 'WAF.jzsj'):
              infoIndex.valid = i
              break;
            case this.t('备注', 'WAF.bz'):
              infoIndex.note = i
              break;
          }
        })
        this.add(data, infoIndex)
			}
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
          action: data[i][di.action] === this.t('白名单', 'WAF.bmd') ? 40 : 42,
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