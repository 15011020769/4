<template>
  <el-form :model="form" ref="form" label-width="120px">
    <el-form-item
      label="SESSION位置"
      prop="Source"
      required
    >
      <el-select v-model="form.Source">
        <el-option value="get" label="GET"></el-option>
        <el-option value="post" label="POST"></el-option>
        <el-option value="cookie" label="COOKIE"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="匹配模式"
      prop="Category"
      required
    >
      <el-radio-group v-model="form.Category">
        <el-radio label="location">位置匹配</el-radio>
        <el-radio label="match">{{t('字符串', 'WAF.zfc')}}匹配</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      :label="`SESSION${t('标识', 'WAF.bs')}`"
      prop="KeyOrStartMat"
      :rules="[{
        required: true, message: t('标识不能为空', 'WAF.bsbnwk'),
      }, {
        max: 32, message: `32${t('个字符以内', 'WAF.gzyyn')}`,
      }]"
    >
      <el-input v-model="form.KeyOrStartMat" :placeholder="`32${t('个字符以内', 'WAF.gzyyn')}`" class="mid-input" />
    </el-form-item>
    <el-form-item
      :label="t('设置', 'WAF.sz')"
      required
    >
      <template v-if="form.Category === 'location'">
         <el-form-item
          prop="StartOffset"
          :rules="[{
            required: true, message: t('开始位置不能为空', 'WAF.kswzbnwk'),
          }, {
            validator: validatorStartOffset()
          }]"
         >
          <el-input :placeholder="t('请输入', 'WAF.qsr')" v-model="form.StartOffset" class="mid-input">
            <template slot="prepend">{{t('开始', 'WAF.ks')}}位置：</template>
          </el-input><span class="sub-text"> 0-2048{{t('以内的整数', 'WAF.yndzs')}}</span>
         </el-form-item>
        <el-form-item
          prop="EndOffset"
          :rules="[{
            required: true, message: t('结束位置不能为空', 'WAF.jwwzbnwk'),
          }, {
            validator: validatorEndOffset()
          }]"
         >
          <el-input :placeholder="t('请输入', 'WAF.qsr')" v-model="form.EndOffset" class="mid-input">
            <template slot="prepend">{{t('结束', 'WAF.end')}}位置：</template>
          </el-input><span class="sub-text"> 1-2048{{t('以内的整数', 'WAF.yndzs')}}；{{t('且，最大只能提取128个字符', 'WAF.qzdzntq')}}。</span>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item
          prop="EndMat"
          :rules="[{
            max: 32, message: `32${t('个字符以内', 'WAF.gzyyn')}`,
          }]"
         >
        <el-input placeholder="请输入" v-model="form.EndMat" class="large-input">
          <template slot="prepend">{{t('结束', 'WAF.end')}}{{t('标识', 'WAF.bs')}}：</template>
        </el-input><span class="sub-text"> {{t('32个字符以内，不输入，默认字符结束位置', 'WAF.gzyynbsr')}}</span>
        </el-form-item>
      </template>
    </el-form-item>
    <el-form-item>
      <el-button type="text" slot="label" @click="showExplain=!showExplain">
        {{t('示例说明', 'WAF.slsm')}} 
        <i class="el-icon-caret-top" v-if="showExplain" />
        <i class="el-icon-caret-bottom" v-else />
      </el-button>
      <el-row class="explain" v-show="showExplain">
        <p class="title">GET/POST示例：</p>
        <p>{{t('如果一条请求的完整参数内容为', 'WAF.rgytqqdwzcs')}}：key_a=124&key_b=456&key_c=789</p>
        <p>{{t('字符串', 'WAF.zfc')}}匹配模式下，SESSION{{t('标识为', 'WAF.bsw')}}<span>key_b=</span>，{{t('结束字符为', 'WAF.jszyw')}}&；{{t('则，匹配内容为', 'WAF.zppnrw')}}456</p>
        <p>位置匹配模式下，SESSION{{t('标识为', 'WAF.bsw')}}<span>key_b</span>，{{t('开始位置为', 'WAF.kswzw')}}0，{{t('结束', 'WAF.end')}}位置2；{{t('则，匹配内容为', 'WAF.zppnrw')}}456</p>
        <p class="title">COOKIE示例：</p>
        <p>{{t('如果一条请求的完整COOKIE内容为', 'WAF.rgthqqdwzcknrw')}}：cookie_1=123;cookie_2=456;cookie_3=789</p>
        <p>{{t('字符串', 'WAF.zfc')}}匹配模式下，SESSION{{t('标识为', 'WAF.bsw')}}<span>cookie_2=</span>，{{t('结束字符为', 'WAF.jszyw')}};；{{t('则，匹配内容为', 'WAF.zppnrw')}}456</p>
        <p>位置匹配模式下，SESSION{{t('标识为', 'WAF.bsw')}}<span>cookie_2</span> ，{{t('开始位置为', 'WAF.kswzw')}}0，{{t('结束', 'WAF.end')}}位置2；{{t('则，匹配内容为', 'WAF.zppnrw')}}456</p>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">{{t('设置', 'WAF.sz')}}</el-button>
      <el-button @click="close">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips"
import { COMMON_ERROR } from '../../constants'
import { UPSERT_SESSION } from '@/constants'

export default {
  props: {
    domain: Object,
    session: Object
  },
  data() {
    return {
      form: {},
      showExplain: false
    }
  },
  watch: {
    session: {
      handler(n) {
        if (n) {
          const session = JSON.parse(JSON.stringify(n))
          if (session.Category === 'location') {
            session.EndMat = ''
          } else {
            session.StartOffset = ''
            session.EndOffset = ''
          }
          this.form = session
        } else {
          this.form = {
            Source: 'get',
            Category: 'location'
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    validatorStartOffset() {
      var warpper = (rule, value, callback) => {
        if (!/^\d+$/.test(value)) {
          this.form.StartOffset = value.replace(/[^0-9]/ig,"")
        }
        if (Number(value) > 2048) {
          this.form.StartOffset = value.slice(0, -1)
        }
        if (this.form.EndOffset && Number(value) > Number(this.form.EndOffset)) {
          return callback(this.t('开始位置不能大于结束位置', 'WAF.kswzbndyjswz'))
        }
        if (this.form.EndOffset && Number(this.form.EndOffset) - Number(value) > 127) {
          return callback(this.t('最大只能提取128个字符', 'WAF.zdzntq'))
        }
        this.$refs.form.clearValidate('EndOffset')
        callback()
      }
      return warpper
    },
    validatorEndOffset() {
      var warpper = (rule, value, callback) => {
        if (!/^\d+$/.test(value)) {
          this.form.EndOffset = value.replace(/[^0-9]/ig,"")
        }
        if (Number(value) > 2048) {
          this.form.EndOffset = value.slice(0, -1)
        }
        if (this.form.StartOffset && Number(value) < Number(this.form.StartOffset)) {
          return callback(this.t('结束位置不能小于开始位置', 'WAF.jswzbnxykswz'))
        }
        if (this.form.StartOffset && Number(value) - Number(this.form.StartOffset) > 127) {
          return callback(this.t('最大只能提取128个字符', 'WAF.zdzntq'))
        }
        this.$refs.form.clearValidate('StartOffset')
        callback()
      }
      return warpper
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const param = {
            Version: '2018-01-25',
            Domain: this.domain.Domain,
            Source: this.form.Source,
            Category: this.form.Category,
            KeyOrStartMat: this.form.KeyOrStartMat,
            EndMat: this.form.EndMat,
            StartOffset: this.form.StartOffset,
            EndOffset: this.form.EndOffset,
            Edition: 'clb-waf',
          }
          if (this.form.Category === 'location') {
            param.EndMat = 'none'
            param.StartOffset = this.form.StartOffset
            param.EndOffset = this.form.EndOffset
          } else {
            param.StartOffset = -1
            param.EndOffset = -1
            param.EndMat = this.form.EndMat
          }
          this.axios.post(UPSERT_SESSION, param).then(resp => {
            this.generalRespHandler(resp, () => {
              this.$emit('onSuccess')
              this.$emit('update:visible', false)
            })
          })
        }
      })
    },
    close() {
      this.$emit('update:visible', false)
    },
  }
}
</script>
<style lang="scss" scoped>
.mid-input {
  width: 220px;
}
.large-input {
  width: 300px;
}
::v-deep .el-input-group__prepend {
  padding: 0 5px;
}
.sub-text {
  font-size: 12px;
  color: #888;
}
.explain {
  p {
    color: #bbb;
    line-height: 20px;
    font-size: 12px;
    &.title {
      color: #000;
      margin-top: 15px;
    }
    span {
      color: #FF9D00;
    }
  }
}
::v-deep .el-form-item .el-form-item {
  margin-bottom: 22px;
}
</style>