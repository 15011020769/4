<template>
  <div class="container">
    <div class="content">
      <el-row type="flex" :gutter="20" class="limit">
        <span style="display: inline-block; width: 100px;">加速区域</span>
        <el-col>
          <el-select size="small" style="width: 210px" v-model="limit">
            <el-option label="中国大陆" :value="1"></el-option>
            <el-option label="全球加速" :value="2"></el-option>
            <el-option label="中国港澳台地区及海外地区" :value="3"></el-option>
          </el-select>
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
import { MODIFY_LIVE_PLAY_DOMAIN } from '@/constants'

export default {
  props: {
    bandLimit: Object,
    playType: Number
  },
  data () {
    return {
      limit: this.bandLimit,
      enable: false,
      info: []
    }
  },
  watch: {
    enable (n) {
      if (!n) {
        this.info = []
      }
    }
  },

  methods: {

    save () {
      let req = {
        Action: 'ModifyLivePlayDomain',
        Version: '2018-08-01',
        Region: '',
        DomainName: 'taiwan.cn',
        PlayType: this.limit
      }

      this.axios.post(MODIFY_LIVE_PLAY_DOMAIN, req)
        .then(res => {
          this.msg('保存成功', 'success')
          this.$emit('success')
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
    margin-top: 100px;
  }
}
.sub-text {
  font-size: 12px;
  color: #888;
  vertical-align: middle;
}
</style>
