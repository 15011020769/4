<template>
  <el-form :model="form" label-width="120px">
    <el-form-item
      label="SESSION位置"
      prop="Source"
      required
    >
      <el-select v-model="form.Source">
        <el-option :value="GET">GET</el-option>
        <el-option :value="POST">POST</el-option>
        <el-option :value="COOKIE">COOKIE</el-option>
      </el-select>
    </el-form-item>
    <el-form-item
      label="匹配模式"
      prop="Category"
      required
    >
      <el-radio-group v-model="form.Category">
        <el-radio label="location">位置匹配</el-radio>
        <el-radio label="match">字符串匹配</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      label="SESSION标识"
      prop="KeyOrStartMat"
      required
    >
      <el-input v-model="form.KeyOrStartMat" placeholder="32个字符以内" class="mid-input" />
    </el-form-item>
    <el-form-item
      label="设置"
      prop=""
    >
      <template v-if="form.Category === 'location'">
        <el-input placeholder="请输入" v-model="form.StartOffset" class="mid-input">
          <template slot="prepend">开始位置：</template>
        </el-input><span class="sub-text"> 0-2048以内的整数</span>
        <br />
        <el-input placeholder="请输入" v-model="form.EndOffset" class="mid-input">
          <template slot="prepend">结束位置：</template>
        </el-input><span class="sub-text"> 1-2048以内的整数；且，最大只能提取128个字符。</span>
      </template>
      <template v-else>
        <el-input placeholder="请输入" v-model="form.EndMat" class="large-input">
          <template slot="prepend">结束标识：</template>
        </el-input><span class="sub-text"> 32个字符以内，不输入，默认字符结束位置</span>
      </template>
    </el-form-item>
    <el-form-item>
      <el-button type="text" slot="label" @click="showExplain=!showExplain">
        示例说明 
        <i class="el-icon-caret-top" v-if="showExplain" />
        <i class="el-icon-caret-bottom" v-else />
      </el-button>
      <el-row class="explain" v-show="showExplain">
        <p class="title">GET/POST示例：</p>
        <p>如果一条请求的完整参数内容为：key_a=124&key_b=456&key_c=789</p>
        <p>字符串匹配模式下，SESSION标识为<span>key_b=</span>，结束字符为&；则，匹配内容为456</p>
        <p>位置匹配模式下，SESSION标识为<span>key_b</span>，开始位置为0，结束位置2；则，匹配内容为456</p>
        <p class="title">COOKIE示例：</p>
        <p>如果一条请求的完整COOKIE内容为：cookie_1=123;cookie_2=456;cookie_3=789</p>
        <p>字符串匹配模式下，SESSION标识为<span>cookie_2=</span>，结束字符为;；则，匹配内容为456</p>
        <p>位置匹配模式下，SESSION标识为<span>cookie_2</span> ，开始位置为0，结束位置2；则，匹配内容为456</p>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">设置</el-button>
      <el-button @click="close">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips"
import { COMMON_ERROR } from '../../constants'

export default {
  props: {
    session: Object
  },
  data() {
    return {
      form: {},
      showExplain: false
    }
  },
  methods: {
    onSubmit() {

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
</style>