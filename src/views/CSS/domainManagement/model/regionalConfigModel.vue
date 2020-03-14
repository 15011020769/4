<template>
  <div class="container">
    <div class="content">
      <el-row type="flex" :gutter="20" class="limit">
        <span style="display: inline-block; width: 100px;">
          加速{{ $t("CSS.detailPlay.rgional") }}
        </span>
        <el-col>
          <el-select
            size="small"
            style="width: 210px"
            v-model="limit"
            @change="changeSlect"
          >
            <el-option :label="$t('CSS.detailPlay.11')" :value="1"></el-option>
            <el-option label="全球加速" :value="2"></el-option>
            <el-option :label="$t('CSS.detailPlay.12')" :value="3"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <p v-if="limitChangeQQ">
            <span style="color:red;padding-right:20px"
              ><i class="el-icon-warning"></i></span
            >{{ $t("CSS.detailPlay.16") }}
          </p>
          <p v-if="limitChangeGAT">
            <span style="color:red;padding-right:20px">
              <i class="el-icon-warning"></i>
            </span>
            {{ $t("CSS.detailPlay.17") }}
          </p>
          <p v-if="limitChange">
            <span style="color:red;padding-right:20px"
              ><i class="el-icon-warning"></i>
            </span>
            {{ $t("CSS.detailPlay.18") }}
          </p>
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
import { MODIFY_LIVE_PLAY_DOMAIN, MODIFY_LIVE_BAND_LIMIT } from '@/constants'

import { CSSErrorTips } from '../../components/CSSErrorTips'
export default {
  props: {
    bandLimit: Number

  },
  data () {
    return {
      limit: this.bandLimit,
      enable: false,
      info: [],
      limitChange: false,
      limitChangeQQ: false,
      limitChangeGAT: false
    }
  },
  watch: {
    bandLimit() {
      this.limit = this.bandLimit
    }
  },
  methods: {

    save () {
      let req = {
        Action: 'ModifyLivePlayDomain',
        Version: '2018-08-01',
        Region: '',
        DomainName: this.$route.query.Name,
        PlayType: this.limit
      }

      this.axios.post(MODIFY_LIVE_PLAY_DOMAIN, req)
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
            if (this.limitChange) {
              const reqParam = {
                Version: '2018-08-01',
                DomainName: this.$route.query.Name,
                BandLimitEnable: Number(this.enable),
                AbroadBandLimitEnable: 0, // 港澳台启用禁用
                AbroadBandLimitValue: 100, // 港澳台带宽
                DomesticBandLimitEnable: 0, // 国内
                DomesticBandLimitValue: 100,
                GlobalBandLimitEnable: 0, // 全球
                GlobalBandLimitValue: 100
              }
              this.axios.post(MODIFY_LIVE_BAND_LIMIT, reqParam)
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
            } else {
              this.msg('保存成功', 'success')
              this.$emit('success')
            }
          }
        })
    },

    msg (msg, type = 'error') {
      this.$message({
        message: msg,
        type,
        showClose: true,
        duration: 0
      })
    },
    handleClose () {
      this.$emit('handleClose')
    },
    changeSlect (val) {
      if (val === this.bandLimit) {
        this.limitChange = false
      } else {
        this.limitChange = true
      }
      if (val === 1) {
        this.limitChangeQQ = false
        this.limitChangeGAT = false
      }
      if (val === 2) {
        this.limitChangeQQ = true
        this.limitChangeGAT = false
      }
      if (val === 3) {
        this.limitChangeGAT = true
        this.limitChangeQQ = false
      }
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
    margin-top: 15px;
  }
}
.sub-text {
  font-size: 12px;
  color: #888;
  vertical-align: middle;
}
</style>
