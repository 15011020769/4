<!--
 * @Author: T
 * @Date: 2020-01-03 11:13:24
 * @LastEditTime : 2020-01-06 17:16:51
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/CSS/transcoding/tab/configDetail.vue
 -->
<template>
  <div class="detail-wrap">
    <el-row type="flex" justify="space-between" align="middle">
      <h3>錄製配置</h3>
      <el-button type="text" @click="onEdit">編輯</el-button>
    </el-row>
    <ul class="content-box">
      <li>
        <el-row type="flex">
          <el-col :span="5">模板名稱</el-col>
          <el-col class="text-black">{{ selectItem.TemplateName }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="5">模板描述</el-col>
          <el-col class="text-black">{{ selectItem.Description }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="5">影音碼率(kbps)</el-col>
          <el-col class="text-black">{{ `${selectItem.VideoBitrate}kbps` }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="5">影音高度(px)</el-col>
          <el-col class="text-black">{{ `${selectItem.Height}px` }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="5">码率压缩比</el-col>
          <el-col class="text-black">{{ selectItem.Rotate }}</el-col>
        </el-row>
      </li>
    </ul>
  </div>
</template>

<script>
import { TEMPLATE_TYPE } from '../constance'
export default {
  name: 'configDetail',

  props: {
    selectItem: {
      type: Object
    }
  },

  data() {
    return {
    }
  },

  mounted() {
  },

  methods: {
    onEdit() {
      this.$emit('update:formShow', true)
    }
  },

}

</script>

<style lang="scss" scoped>
.detail-wrap {
  .text-black {
    color: black;
  }
  .content-box {
    > li {
      font-size: 12px;
      line-height: 1.5;
      color: #888;
      padding-right: 20px;
      padding: 6px;
    }
  }
}
</style>