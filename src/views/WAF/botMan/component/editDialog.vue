<!--
 * @Author: your name
 * @Date: 2020-02-20 15:34:58
 * @LastEditTime: 2020-02-20 16:28:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/editDialog.vue
 -->
<template>
    <el-form 
      :model="formValue"
      label-width="140px"
      label-position="right"
      ref="form"
    >
      <el-form-item :label="t('动作', 'WAF.dz')" prop="action" required>
      <el-select style="width: 180px" v-model="formValue.action">
        <el-option
          v-for="item in UCB_ACTION_ARR"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item
        :label="t('惩罚时长（分钟)', 'WAF.cfscfz')"
        prop="validTime"
        v-if="formValue.action === UCB_ACTION.攔截 || formValue.action === UCB_ACTION.驗證碼"
        :rules="[
          { required: true, message: t('请输入5~10080以内的整数', 'WAF.qsr51zs') },
          {
            validator: isValidTime()
          }
        ]"
      >
        <div>
          <el-input v-model="formValue.validTime" style="width: 180px; font-size: 12px;" :placeholder="t('请输入5~10080以内的整数', 'WAF.qsr51zs')" />
          <el-tooltip slot="append" effect="light" :content="t('最短5分钟，最长1周', 'WAF.zdfzzc')">
            <i style="margin-left: 10px;" class="el-icon-info" />
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item style="margin-bottom: 0;">
        <span class="tip">{{t('策略优先级按照动作类型匹配生效，优先级为：放行＞监控＞验证码＞拦截，动作相同添加时间越晚优先级越高', 'WAF.clsxazdzcdx')}}</span>
      </el-form-item>
      <el-form-item style="margin-bottom: 0;">
        <el-button :loading="loading" @click="onClick" type="primary" size="small">{{t('确定', 'WAF.qd')}}</el-button>
        <el-button :disabled="loading" @click="$emit('update:visible', false)" size="small">取消</el-button>
      </el-form-item>
  </el-form>
</template>

<script>
import { UCB_ACTION_ARR, UCB_ACTION, COMMON_ERROR } from '../../constants'
import { MODIFY_BOT_UCB_PREINSTALL_RULE } from '@/constants'
export default {
  data() {
    return {
      UCB_ACTION_ARR,
      UCB_ACTION,
      loading: false,
      formValue: {
        action: '',
        validTime: ''
      },
    }
  },
  props: {
    visible: {
      default: false
    },
    info: {
      default: {}
    },
    iptDomain: String,
    category: String,
  },
  watch: {
    info: {
      handler() {
        console.log(this.info)
        this.formValue = {
          ...this.info
        }
      },
      immediate: true
    }
  },
  methods: {
    isValidTime() {
      var warpper = (rule, value, callback) => {
        if (value >= 5 && value <= 10080) {
          return callback()
        }
        callback(this.t('请输入5~10080以内的整数', 'WAF.qsr51zs'))
      }
      return warpper
    },
    onClick() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.axios.post(MODIFY_BOT_UCB_PREINSTALL_RULE, {
            Version: '2018-01-25',
            Domain: this.iptDomain,
            Category: this.category === 'xy' ? 1 : 2,
            Name: this.info.name,
            Status: this.info.on_off,
            Operate: this.formValue.action,
            ValidTime: this.formValue.validTime,
          }).then(resp => {
            this.generalRespHandler(resp, () => {
              this.$emit('success')
            }, COMMON_ERROR, `${this.t('编辑', 'WAF.bj')}成功`)
          }).then(() => {
            this.loading = false
          })
        }
      })
    },
  }

}
</script>

<style lang="scss" scoped>
.tip {
  font-size: 12px;
  color: #bbb;
  display: inline-block;
  line-height: 20px;
}
</style>