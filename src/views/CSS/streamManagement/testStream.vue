<template>
  <div ref="player" class="player" id="player" v-loading="loading">
  </div>
</template>
<script>
import { DOMAIN_LIST } from '@/constants'
export default {
  props: {
    stream: Object,
    visible: Boolean,
  },
  data() {
    return {
      loading: true,
      player: undefined,
    }
  },
  watch: {
    visible(n) {
      if (this.visible) {
      this.axios.post(DOMAIN_LIST, {
        Version: "2018-08-01",
        PageSize: 100, //分页大小，范围：10~100。默认10
        PageNum: 1
      })
        .then(({ Response }) => {
          const domain = Response.DomainList.find((domain, i) => i !==0 && domain.Status !== 0 && domain.BCName === 1)
          let domainName = '68922.liveplay.myqcloud.com'
          if (domain) {
            domainName = domain.Name
          }
          this.play(domainName)
        })
        .then(() => {
          this.loading = false
        })
    }
    }
  },
  mounted() {
    if (this.visible) {
      this.axios.post(DOMAIN_LIST, {
        Version: "2018-08-01",
        PageSize: 100, //分页大小，范围：10~100。默认10
        PageNum: 1
      })
        .then(({ Response }) => {
          const domain = Response.DomainList.find((domain, i) => i !==0 && domain.Status !== 0 && domain.BCName === 1)
          let domainName = '68922.liveplay.myqcloud.com'
          if (domain) {
            domainName = domain.Name
          }
          this.play(domainName)
        })
        .then(() => {
          this.loading = false
        })
    }
  },
  destroyed() {
    this.player && this.player.destroy()
  },
  methods: {
    play(domainName) {
      // TODO计算签名
      this.$emit('update:url', `http://${domainName}/live/${this.stream.StreamName}.flv`)
      var options = {
        flv: `http://${domainName}/live/${this.stream.StreamName}.flv`,
        autoplay: true,
        live: true,
        width: 800,
        height: 600,
        volume: 0.5,
        flash: false,
        flashUrl: '//imgcache.qq.com/open/qcloud/video/player/release/QCPlayer.swf',
        x5_player: true,
        h5_flv: true,
        wording: {
            1: "網路錯誤，請檢查網路配置或者播放鏈接是否正確。",
            2: "網路錯誤，請檢查網路配置或者播放鏈接是否正確。",
            3: "視頻解碼錯誤。",
            4: "當前系統環境不支持播放該視頻格式。",
            5: "當前系統環境不支持播放該視頻格式。",
            10: "請勿在 file 協議下使用播放器，可能會導致視頻無法播放。",
            11: "使用參數有誤，請檢查播放器調用代碼。",
            12: "請填寫視頻播放地址。",
            13: "直播已結束，請稍後再來。",
            1001: "網路錯誤，請檢查網路配置或者播放鏈接是否正確。",
            1002: "獲取視頻失敗，請檢查播放鏈接是否有效。",
            2032: "獲取視頻失敗，請檢查播放鏈接是否有效。",
            2048: "無法載入視頻文件，跨域訪問被拒絕。",
        },
      };
      this.player = new TcPlayer('player', options)
    }
  }
}
</script>
<style lang="scss" scoped>
.player {
  height: 620px;
}
</style>