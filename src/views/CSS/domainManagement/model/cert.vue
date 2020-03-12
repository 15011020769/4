<template>
  <el-form :model="form" ref="form" label-width="120px" v-loading="loading">
    <el-form-item prop="enable" label="HTTPS服务">
      <el-switch v-model="form.enable" />
    </el-form-item>
    <el-form-item prop="CertName" :label="$t('CSS.detailPlay.8')">
      <el-input v-model.trim="form.CertName" />
    </el-form-item>
    <el-form-item prop="HttpsCrt" :label="$t('CSS.detailPlay.14')">
      <el-input type="textarea" v-model.trim="form.HttpsCrt" />
    </el-form-item>
    <el-form-item prop="HttpsKey" :label="$t('CSS.detailPlay.15')">
      <el-input type="textarea" v-model.trim="form.HttpsKey" />
    </el-form-item>
    <el-form-item
      style="margin-bottom: 0;text-align: center;margin-left: -120px;"
    >
      <el-button size="small" type="primary" @click="save">保存</el-button>
      <el-button size="small" @click="$emit('update:visible', false)"
        >取消</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script>
import { CREATE_LIVE_CERT, MODIFY_LIVE_DOMAIN_CERT, MODIFY_LIVE_CERT, BIND_LIVE_DOMAIN_CERT } from '@/constants'
const error = {
  'InternalError': '內部錯誤',
  'InternalError.CrtDateNotLegal': '證書不合法。',
  'InternalError.CrtDateOverdue': '證書過期。',
  'InternalError.CrtKeyNotMatch': '證書Key不匹配。',
  'InternalError.DBError': 'DB執行錯誤。',
  'InternalError.InvalidInput': '參數檢校不通過。',
  'InternalError.SystemError': '系統內部錯誤。',
  'InternalError.CrtDateInUsing': '證書使用中',
  'InvalidParameter': '參數錯誤',
  'InvalidParameter.CloudCrtIdError': '騰訊雲證書託管ID錯誤。',
  'InvalidParameter.CrtDateNotLegal': '證書內容不合法。',
  'InvalidParameter.CrtOrKeyNotExist': '證書內容或者私鑰未提供。',
  'InvalidParameter.CrtDateOverdue': '證書過期',
  'InvalidParameter.CrtKeyNotMatch': '證書Key不匹配。',
  'InvalidParameter.CrtDateInUsing': '證書使用中',
  'InvalidParameterValue': '參數取值錯誤',
  'MissingParameter': '缺少參數錯誤',
}
export default {
  props: {
    cert: Object
  },
  data () {
    return {
      form: {
        ...this.cert,
        enable: this.cert && !!this.cert.Status || false
      },
      loading: false
    }
  },
  methods: {
    save () {
      const { CertName, HttpsCrt, HttpsKey } = this.form
      if (!CertName) {
        return void this.msg('请填写证书名称')
      }
      if (!HttpsCrt) {
        return void this.msg('请填写证书内容')
      }
      if (!HttpsKey) {
        return void this.msg('请填写私钥内容')
      }
      if (this.cert) {
        this.modifyCert()
      } else {
        this.createCert()
      }
      this.loading = true
    },
    createCert () {
      const { CertName, HttpsCrt, HttpsKey, enable } = this.form
      this.axios.post(CREATE_LIVE_CERT, {
        Version: '2018-08-01',
        CertType: 0,
        CertName,
        HttpsCrt,
        HttpsKey
      }).then(resp => {
        this.loading = false
        if (resp.Response.Error) {
          this.msg(error[resp.Response.Error.Code])
        } else {
          if (enable) {
            this.bindCert(resp.Response.CertId)
          } else {
            this.msg('保存成功', 'success')
            this.$emit('success')
          }
        }
      })
    },
    bindCert(certId) {
      this.axios.post(BIND_LIVE_DOMAIN_CERT, {
        Version: '2018-08-01',
        DomainName: this.$route.query.Name,
        CertId: certId,
        Status: Number(this.form.enable)
      }).then(() => {
          this.msg('保存成功', 'success')
          this.$emit('success')
        })
    },
    modifyCert () {
      const { CertName, HttpsCrt, HttpsKey, CertId, enable, Status } = this.form

      this.axios.post(MODIFY_LIVE_CERT, {
        Version: '2018-08-01',
        CertId,
        CertType: 0,
        CertName,
        HttpsCrt,
        HttpsKey
      }).then(resp => {
        this.loading = false
        if (resp.Response.Error) {
          this.msg(error[resp.Response.Error.Code])
        } else {
          if (Status !== !!enable) {
            this.modifyCertStatus()
          } else {
            this.msg('保存成功', 'success')
            this.$emit('success')
          }
        }
      })
    },
    modifyCertStatus (certId) {
      this.axios.post(MODIFY_LIVE_DOMAIN_CERT, {
        Version: '2018-08-01',
        DomainName: this.$route.query.Name,
        CertId: certId,
        Status: Number(this.form.enable)
      })
        .then(() => {
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
