<template>
  <el-card>
    <el-row type="flex" align="middle" justify="space-between">
      <h3>{{ $t("CSS.detailPlay.TranscodingConfiguration") }}</h3>
      <el-button type="text" @click="edit">
        {{ $t("CSS.domainManagement.10") }}
      </el-button>
    </el-row>
    <el-table
      :data="temps"
      :empty-text="$t('CSS.detailPlay.notSetUp')"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column
        prop="TemplateName"
        :label="$t('CSS.domainManagement.14')"
      >
      </el-table-column>
      <el-table-column prop="TemplateId" label="模板ID" width="180">
      </el-table-column>
      <el-table-column :label="$t('CSS.detailPlay.encodingMode')" width="180">
        H.264
      </el-table-column>
      <el-table-column
        prop="VideoBitrate"
        :label="$t('CSS.detailPlay.bitRate')"
        width="180"
      >
      </el-table-column>
    </el-table>
    <el-dialog
      :title="$t('CSS.detailPlay.TranscodingConfiguration')"
      :visible.sync="visible"
      destroy-on-close
    >
      <transcode-config
        :selectedTemps="temps.map(temp => temp.TemplateId)"
        :visible.sync="visible"
        @success="init"
      />
    </el-dialog>
  </el-card>
</template>
<script>
import {
  DESCRIBE_LIVE_TRANSCODE_RULES,
  DESCRIBE_LIVE_TRANSCODE_TEMPLATE
} from '@/constants'
import TranscodeConfig from '../model/transcodeConfig'
export default {
  data () {
    return {
      temps: [],
      visible: false,
      loading: true
    }
  },
  components: {
    TranscodeConfig
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loading = true
      this.visible = false
      this.axios.post(DESCRIBE_LIVE_TRANSCODE_RULES, {
        Version: '2018-08-01'
      })
        .then(resp => {
          const tempIds = resp.Response.Rules
            .filter(rule => rule.DomainName === this.$route.query.Name)
            .map(rule =>
              this.axios.post(DESCRIBE_LIVE_TRANSCODE_TEMPLATE, {
                Version: '2018-08-01',
                TemplateId: rule.TemplateId
              })
            )
          this.getRules(tempIds)
        })
    },
    getRules (tempIds) {
      Promise.all(tempIds)
        .then(ress => {
          const temps = []
          ress.forEach(res => {
            temps.push(res.Response.Template)
          })
          this.temps = temps
          this.loading = false
        })
    },
    edit () {
      this.visible = true
    },
    save () {

    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 10px 20px;
}
</style>
