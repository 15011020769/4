<template>
  <div ref="player" class="player" id="player" v-loading="loading">
  </div>
</template>
<script>
import md5 from "js-md5";
import { DOMAIN_LIST, LIVE_DESCRIBE_LIVEPLAYAUTHKEY } from '@/constants'
import { generatePlayAddress } from '../utils'
export default {
  props: {
    stream: Object,
    visible: Boolean,
    domain: Object,
  },
  data() {
    return {
      loading: true,
      player: undefined,
    }
  },
  watch: {
    visible(n) {
      if (n) {
        this.loading = true
        this.init()
      } else {
        this.player && this.player.destroy()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      let url = `http://${this.domain.Name}/live/${this.stream.StreamName}.flv`
      this.axios
        .post(LIVE_DESCRIBE_LIVEPLAYAUTHKEY, {
          Version: "2018-08-01",
          DomainName: this.domain.Name
        })
        .then(res => {
          const playKey = res.Response.PlayAuthKeyInfo
          if (playKey.Enable === 1) {
            var r = (new Date).getTime() / 1e3
            var a = parseInt(r.toString()).toString(16).toUpperCase()
            var t = md5(playKey.AuthKey + this.stream.StreamName + a)
            url += `?txSecret=${t}&txTime=${a}`
          } 
          this.play(url)
          this.loading = false
        })
    },
    play(url) {
      this.$emit('update:url', url)
      var options = {
        flv: url,
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
            3: "影音解碼錯誤。",
            4: "當前系統環境不支持播放該影音格式。",
            5: "當前系統環境不支持播放該影音格式。",
            10: "請勿在 file 協議下使用播放器，可能會導致影音無法播放。",
            11: "使用參數有誤，請檢查播放器調用程式碼。",
            12: "請填寫影音播放地址。",
            13: "直播已結束，請稍後再來。",
            1001: "網路錯誤，請檢查網路配置或者播放鏈接是否正確。",
            1002: "獲取影音失敗，請檢查播放鏈接是否有效。",
            2032: "獲取影音失敗，請檢查播放鏈接是否有效。",
            2048: "無法載入影音文件，跨域訪問被拒絕。",
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