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
            <el-checkbox
              label="flv"
              v-if="resource.SourceStreamFormat !== 'hls'"
              >flv</el-checkbox
            >
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
          <el-input
            v-model="resource.SourceServerAddress"
            :placeholder="$t('CSS.detailPlay.ipordomain')"
            size="small"
          ></el-input>
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
import { CSSErrorTips } from '../../components/CSSErrorTips'
import { isValidIPAddressNew } from '@/utils'

export default {
  props: {
    bandLimit: Object,
    playType: Number,
    resourceData: {
      type: Object,
      default () {
        return {}
      }
    }

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
    'resource.SourceStreamFormat' (n) {
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
    if (this.resourceData.Status === 1) {
      this.resource.Status = true
    } else if (this.resourceData.Status === 3) {
      this.resource.Status = false
    }
  },

  methods: {
    save () {
      const regYuMing = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
      const { resource } = this
      const { SourceServerType, SourceServerAddress, CdnStreamFormat, Status, SourceStreamFormat } = resource

      if (!CdnStreamFormat.length) {
        return void this.msg('請選擇CDN播放格式')
      }

      if (SourceServerType === 0) { // ip
        if (!isValidIPAddressNew(SourceServerAddress)) {
          return void this.msg('請輸入正確的IP')
        }
      } else { // 域名
        if (!regYuMing.test(SourceServerAddress)) {
          return void this.msg('請輸入正確的域名')
        }
      }

      let req = {
        DomainName: this.$route.query.Name,
        Version: '2018-08-01'
      }
      let url = CLOSE_SOURCE_STREAM // 关闭源站设置
      if (Status) { // 如果打开直接修改
        url = MODIFY_SOURCE_STREAM_INFO
        req = {
          ...req,
          'SourceServerAddress.0': SourceServerAddress,
          SourceServerType,
          SourceStreamFormat,
        }
        CdnStreamFormat.forEach((cdn, i) => {
          req[`CdnStreamFormat.${i}`] = cdn
        })
      }

      this.axios.post(url, req)
          .then(res => {
            if (res.Response.Error) {
              let ErrTips = {}
              let ErrOr = Object.assign(CSSErrorTips, ErrTips)

              this.$message({
                type: 'error',
                message: ErrOr[res.Response.Error.Code],
                showClose: true,
                duration: 0
              })

              this.$emit('handleClose', false)
            } else {
              this.msg('保存成功', 'success')
              this.$emit('success')
            }
          })
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
