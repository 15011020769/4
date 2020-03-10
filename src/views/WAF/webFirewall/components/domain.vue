<template>
  <div class="container">
    <el-row type="flex" class="col">
      <el-col :span="3">
        <label class="label">
          域名
          <el-tooltip
            class="item"
            effect="dark"
            :content="t('旗舰版支持泛域名', 'WAF.qjbzcfym')"
            placement="right"
          >
            <i class="el-icon-info"></i>
          </el-tooltip>
        </label>
      </el-col>
      <el-col>
        <el-input
          class="domin-input"
          :disabled="domain.DomainId !== undefined"
          v-model="domain.Domain"
        >
          <i
            v-if="notExists === 1"
            class="el-icon-circle-check el-input__icon"
            slot="suffix"
          />
          <i
            v-if="notExists === 2"
            class="el-icon-loading el-input__icon"
            slot="suffix"
          />
        </el-input>
        <span class="error">{{ error }}</span>
      </el-col>
    </el-row>
    <el-row type="flex" class="col">
      <el-col :span="3">
        <label class="label">代理情况</label>
      </el-col>
      <el-col>
        <el-radio-group v-model="domain.IsCdn">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
        <p class="tip">
          {{ t("是否已使用了高防、CDN、云加速等代理", "WAF.iscdn") }}？
        </p>
      </el-col>
    </el-row>
    <el-row type="flex" class="col">
      <el-col :span="3"> </el-col>
      <el-col>
        <el-button type="primary" size="small" @click="next">下一步</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { DESCRIBE_HOST_LIMIT } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
import { COMMON_ERROR } from '../../constants'

export default {
  props: {
    level: Number, // 套餐类型
    domain: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      error: '',
      notExists: 0 // 1不存在 2加载中 0 默认不显示
    }
  },
  watch: {
    'domain.Domain' () {
      this.error = ''
      this.notExists = 0
    }
  },
  methods: {
    // 保存按钮
    next () {
      if (this.notExists === 1 || this.domain.DomainId) {
        this.$emit('next')
        return
      }
      const domain = this.domain.Domain.trim()
      if (!domain) {
        this.error = '域名不能为空'
        return
      }
      // 旗舰版支持泛域名
      if (/^([*]\.)(([a-z0-9-_]+)*\.)+[a-z]{2,63}$/.test(domain) && this.level !== 4) {
        this.error = '当前版本不支持泛域名，请升级到旗舰版'
        return
      }
      if (/^([*]\.)(([a-z0-9-_]+)*\.)+[a-z]{2,63}$/.test(domain)) {
        this.error = '域名格式错误'
        return
      }
      if (!/^((?=[a-z0-9-_]{1,63}\.)(xn--)?[a-z0-9_]+(-[a-z0-9_]+)*\.)+[a-z]{2,63}$/.test(domain)) {
        this.error = '域名格式错误'
        return
      }
      this.notExists = 2
      this.axios.post(DESCRIBE_HOST_LIMIT, {
        Version: '2018-01-25',
        Domain: domain
      }).then(({ Response }) => {
        if (Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        } else {
          this.notExists = 1
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  margin-left: 20px;
}
.col {
  margin-top: 20px;
}
.domin-input {
  width: 200px;
}
.label {
  color: #888;
}
.tip {
  margin-top: 15px;
}
.error {
  color: red;
  margin-left: 10px;
}
</style>
