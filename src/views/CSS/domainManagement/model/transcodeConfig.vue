<template>
  <el-row v-loading="loading">
    <p>模板选择（如需添加新模板，请前往【 <el-button type="text">功能模板</el-button>】中进行设置）</p>
    <el-table ref="table" :data="temps" empty-text="未设置">
      <el-table-column type="selection" />
      <el-table-column prop="TemplateName" label="模板名称">
      </el-table-column>
      <el-table-column prop="TemplateId" label="模板ID" width="180">
      </el-table-column>
      <el-table-column label="编码方式" width="180">
        H.264
      </el-table-column>
      <el-table-column prop="VideoBitrate" label="码率" width="180">
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center" style="margin-top: 15px;">
      <el-button size="small" type="primary" @click="save">保存</el-button>
      <el-button size="small" @click="$emit('update:visible', false)">取消</el-button>
    </el-row>
  </el-row>
</template>
<script>
import {
  GET_TRANSCODE_TEMPLATE,
  DELETE_LIVE_TRANSCODE_RULE,
  CREATE_LIVE_TRANSCODE_RULE,
} from '@/constants'
export default {
  props: {
    selectedTemps: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      temps: [],
      loading: true,
    }
  },
  mounted() {
    this.axios.post(GET_TRANSCODE_TEMPLATE, {
      Version: '2018-08-01'
    })
      .then(resp => {
        this.temps = resp.Response.Templates
        this.$nextTick(() => {
          if (this.selectedTemps.length) {
            this.temps.forEach(row => {
              if (this.selectedTemps.includes(row.TemplateId)) {
                this.$refs.table.toggleRowSelection(row, true)
              }
            })
            this.loading = false
          }
        })
      })
  },
  methods: {
    async save() {
      this.loading = true
      await Promise.all(
              this.selectedTemps.map(tempId => 
                this.axios.post(DELETE_LIVE_TRANSCODE_RULE, {
                  "Version": "2018-08-01",
                  "DomainName": this.$route.query.Name,
                  "AppName": "",
                  "StreamName": "",
                  "TemplateId": tempId
                })
              )
            )
      await Promise.all(
              this.$refs.table.selection
                .map(temp => 
                  this.axios.post(CREATE_LIVE_TRANSCODE_RULE, {
                    "Version": "2018-08-01",
                    "DomainName": this.$route.query.Name,
                    "AppName": "",
                    "StreamName": "",
                    TemplateId: temp.TemplateId
                  })
                )
              )
      this.loading = false
      this.$emit('success')
    }
  }
}
</script>