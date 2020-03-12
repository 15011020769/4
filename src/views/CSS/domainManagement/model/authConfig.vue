<template>
  <el-form :model="form" ref="form" label-width="120px" v-loading="loading">
    <el-form-item
      prop="enable"
      label="播放鉴权"
    >
      <el-switch v-model="form.enable" />
    </el-form-item>
    <el-form-item
      prop="AuthKey"
      label="主KEY"
    >
      <el-input v-model.trim="form.AuthKey" @input="v => form.AuthKey=v.replace(/[^a-zA-Z\d]/g, '')" />
      <span class="sub-text">仅支持大写字母，小写字母和数字，最大长度256位。</span>
    </el-form-item>
    <el-form-item
      prop="AuthBackKey"
      label="备KEY"
    >
      <el-input v-model.trim="form.AuthBackKey" @input="v => form.AuthBackKey=v.replace(/[^a-zA-Z\d]/g, '')" />
      <span class="sub-text">仅支持大写字母，小写字母和数字，最大长度256位。</span>
    </el-form-item>
    <el-form-item
      prop="AuthDelta"
      label="有效时间(秒)"
    >
      <el-input v-model.trim="form.AuthDelta" @input="v => form.AuthDelta=v.replace(/[^\d]/g, '')" />
      <span class="sub-text">仅支持整数</span>
    </el-form-item>
    <el-form-item>
      <el-button size="small" type="primary" @click="save">保存</el-button>
      <el-button size="small" @click="$emit('update:visible', false)">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { MODIFY_LIVE_PLAY_AUTH_KEY } from '@/constants'
export default {
  props: {
    authKeyInfo: Object
  },
  data() {
    return {
      form: {
        
      },
      loading: false,
    }
  },
  watch: {
    authKeyInfo: {
      handler(){
        this.form = {
          ...this.authKeyInfo,
          enable: !!this.authKeyInfo.Enable
        }
      },
      immediate: true
    }
  },
  methods: {
    save() {
      if (!/^[a-zA-Z0-9]{1,256}$/.test(this.form.AuthKey)) {
        return void this.msg('主KEY不符合输入规则')
      } 
      if (this.form.AuthBackKey && !/^[a-zA-Z0-9]{1,256}$/.test(this.form.AuthBackKey)) {
        return void this.msg('备KEY不符合输入规则')
      }
      const delta = Number(this.form.AuthDelta)
      if (
        Math.ceil(delta) !== delta 
        || Math.abs(delta) !== delta 
        || isNaN(Number(delta))
        || delta === 0
      ) {
        return void this.msg('有效时间请输入大于0的整型数字')
      }
      this.loading = true
      this.axios.post(MODIFY_LIVE_PLAY_AUTH_KEY, {
        Version: '2018-08-01',
        DomainName: this.$route.query.Name,
        Enable: Number(this.form.enable),
        AuthKey: this.form.AuthKey,
        AuthDelta: this.form.AuthDelta,
        AuthBackKey: this.form.AuthBackKey,
      }).then(resp => {
        const error = {
          'InternalError': '内部错误',
          'InternalError.PlayDomainNoRecord':	'播放域名不存在。',
          'InvalidParameter':	'参数错误',
          'InvalidParameterValue':	'参数取值错误',
          'MissingParameter':	'缺少参数错误',
        }
        this.loading = false
        if (resp.Response.Error) {
          this.msg(error[resp.Response.Error.Code])
        } else {
          this.msg('操作成功', 'success')
          this.$emit('success')
        }
      })
    },
    msg(msg, type = 'error') {
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
.sub-text {
  font-size: 12px;
  color: #888;
  vertical-align: middle;
}
</style>