<!--
 * @Author: T
 * @Date: 2020-01-03 11:13:24
 * @LastEditTime : 2020-01-08 10:25:17
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/CSS/transcoding/tab/configDetail.vue
 -->
<template>
  <div class="detail-wrap">
    <el-row type="flex" justify="space-between" align="middle">
      <h3>回調配置</h3>
      <el-button type="text" @click="onEdit">編輯</el-button>
    </el-row>
    <ul class="content-box">
      <li>
        <el-row type="flex">
          <el-col :span="7">範本名稱</el-col>
          <el-col class="text-black">{{ selectItem.TemplateName }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="7">範本描述</el-col>
          <el-col class="text-black">{{ selectItem.Description }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="7">回調金鑰</el-col>
          <el-col class="text-black">{{ selectItem.CallbackKey }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="7">推流回調</el-col>
          <el-col class="text-black">{{ selectItem.StreamBeginNotifyUrl }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="7">斷流回調</el-col>
          <el-col class="text-black">{{ selectItem.StreamEndNotifyUrl }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="7">錄製回調</el-col>
          <el-col class="text-black">{{ selectItem.RecordNotifyUrl }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="7">截圖回調</el-col>
          <el-col class="text-black">{{ selectItem.SnapshotNotifyUrl }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="7">鑑黃回調</el-col>
          <el-col class="text-black">{{ selectItem.PornCensorshipNotifyUrl }}</el-col>
        </el-row>
      </li>
    </ul>
  </div>
</template>

<script>
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
