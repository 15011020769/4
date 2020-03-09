<template>
  <div class="container">
    <div class="content">
      <el-row type="flex" :gutter="20" class="limit">
        <span style="display: inline-block; width: 200px;">
          {{ $t("CSS.detailPlay.sourceStationSetup") }}
        </span>
        <el-col>
          <el-switch v-model="resource.Status" />
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="20" class="limit">
        <span style="display: inline-block; width: 200px;">
          {{ $t("CSS.detailPlay.6") }}
        </span>
        <el-col>
          <el-select
            size="small"
            style="width: 210px"
            v-model="resource.SourceStreamFormat"
          >
            <el-option label="rtmp" value="rtmp"></el-option>
            <el-option label="flv" value="flv"></el-option>
            <el-option label="hls" value="hls"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="20" class="limit">
        <span style="display: inline-block; width: 200px;">
          {{ $t("CSS.detailPlay.7") }}
        </span>
        <el-col>
          <el-checkbox-group v-model="resource.CdnStreamFormat">
            <el-checkbox label="flv" v-if="resource.SourceStreamFormat !== 'hls'">flv</el-checkbox>
            <el-checkbox label="hls">hls</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>

      <el-row type="flex" :gutter="20" class="limit">
        <span style="display: inline-block; width: 200px;"
          >源站地址ip/domain</span
        >
        <el-col>
          <el-radio-group v-model="resource.SourceServerType">
            <el-radio :label="0">ip</el-radio>
            <el-radio :label="1">domain</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="20" class="limit">
        <span style="display: inline-block; width: 200px;">主源地址</span>
        <el-col>
          <el-input v-model="resource.SourceServerAddress" :placeholder="$t('CSS.detailPlay.ipordomain')" size="small"></el-input>
        </el-col>
      </el-row>
    </div>
    <el-row type="flex" justify="center" class="oper">
      <el-button size="small" type="primary" @click="save">保存</el-button>
      <el-button size="small" @click="handleClose">取消</el-button>
    </el-row>
  </div>
</template>
<script>
import { MODIFY_SOURCE_STREAM_INFO, CLOSE_SOURCE_STREAM } from '@/constants'

export default {
  props: {
    bandLimit: Object,
    playType: Number,
    resourceData: {
      type: Object,
      default() {
        return {}
      }
    }
    // Status:''
    // SourceStreamFormat1: this.SourceStreamFormat
  },
  data () {
    return {
      limit: '',
      enable: false,
      info: [],
      isSureIP: true,
      isSureYM: true,
      isSureCDN: true,
      isSureNULL: true,
      resource: {
        Status: false,
        SourceServerType: 0,
        CdnStreamFormat: [],
        SourceStreamFormat: 'rtmp'
      }
    }
  },
  watch: {
    'resource.SourceStreamFormat'(n) {
      if (n === 'hls' && this.resource.CdnStreamFormat.includes('flv')) {
        this.resource.CdnStreamFormat = this.resource.CdnStreamFormat.filter(f => f !== 'flv')
      }
    }
  },
  created () {
    if (this.resourceData.DomainName) {
      this.resource = JSON.parse(JSON.stringify(this.resourceData))
      this.resource.CdnStreamFormat = this.resource.CdnStreamFormat.split('|')
      this.resource.SourceServerAddress = this.resource.SourceServerAddress[0]
    }
  },

  methods: {
    save () {
      let req = {
        DomainName: this.$route.query.Name,
        Version: "2018-08-01",
      }
      let url = CLOSE_SOURCE_STREAM // 关闭源站设置
      if (this.resource.Status) { // 如果打开直接修改
        url = MODIFY_SOURCE_STREAM_INFO
        req = {
          ...req,
          'SourceServerAddress.0': this.resource.SourceServerAddress,
          SourceServerType: this.resource.SourceServerType,
          SourceStreamFormat: this.resource.SourceStreamFormat,
        }
        this.resource.CdnStreamFormat.forEach((cdn, i) => {
          req[`CdnStreamFormat.${i}`] = cdn
        })
      }

      let regIP = /^((([1-9][0-9])|([0-9])|((1[0-9][0-9])|(2[0-4][0-9])|(25[0-5])))\.){3}(([1-9][0-9])|([0-9])|((1[0-9][0-9])|(2[0-4][0-9])|(25[0-5])))$/
      let regYuMing = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/

      if (this.resource.SourceServerType == 0 && !regIP.test(this.resource.SourceServerAddress)) {
        this.msg('请输入ip', 'error')
        this.isSureIP = false
      } else {
        this.isSureIP = true
        if (this.resource.SourceServerType == 1 && !regYuMing.test(this.resource.SourceServerAddress)) {
          this.msg('请输入域名', 'error')
          this.isSureYM = false
        } else {
          this.isSureYM = true
          if (this.resource.CdnStreamFormat.length === 0) {
            this.msg('请选择CDN播放格式', 'error')
            this.isSureCDN = false
          } else {
            this.isSureCDN = true
            if (this.resource.SourceServerAddress === '') {
              this.msg('源站地址为空', 'error')
              this.isSureNULL = false
            } else {
              this.isSureNULL = true
            }
          }
        }
      }
      if (this.isSureIP && this.isSureYM && this.isSureCDN && this.isSureNULL) {
        this.axios.post(url, req)
          .then(res => {
            if (res.Response.Error) {
              this.msg('保存失败', 'error')
            } else {
              this.msg('保存成功', 'success')
              this.$emit('success')
            }
          })
      }
    },

    handleClose () {
      this.$emit('handleClose')
    },
    msg (msg, type = 'error') {
      this.$message({
        message: msg,
        type,
        showClose: true,
        duration: 0
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 20px;
  .limit {
    margin-left: 5px !important;
    margin-bottom: 15px;
  }
  .oper {
    margin-top: 20px;
  }
}
.sub-text {
  font-size: 12px;
  color: #888;
  vertical-align: middle;
}
</style>
