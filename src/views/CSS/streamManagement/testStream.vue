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
            1: "网络错误，请检查网络配置或者播放链接是否正确。",
            2: "网络错误，请检查网络配置或者播放链接是否正确。",
            3: "视频解码错误。",
            4: "当前系统环境不支持播放该视频格式。",
            5: "当前系统环境不支持播放该视频格式。",
            10: "请勿在 file 协议下使用播放器，可能会导致视频无法播放。",
            11: "使用参数有误，请检查播放器调用代码。",
            12: "请填写视频播放地址。",
            13: "直播已结束，请稍后再来。",
            1001: "网络错误，请检查网络配置或者播放链接是否正确。",
            1002: "获取视频失败，请检查播放链接是否有效。",
            2032: "获取视频失败，请检查播放链接是否有效。",
            2048: "无法加载视频文件，跨域访问被拒绝。",
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