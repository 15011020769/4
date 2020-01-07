<!--
 * @Author: T
 * @Date: 2020-01-03 11:13:24
 * @LastEditTime : 2020-01-07 17:09:03
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
          <el-col :span="7">模板名稱</el-col>
          <el-col class="text-black">{{ selectItem.TemplateName }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="7">模板描述</el-col>
          <el-col class="text-black">{{ selectItem.Description }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="7">截圖間隔</el-col>
          <el-col class="text-black">{{ `${selectItem.SnapshotInterval} s` }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="7">啟用智能鑒黃</el-col>
          <el-col class="text-black">{{ selectItem.PornFlag ? '已啟用' : '未啟用' }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="7">存儲位置CosAppid</el-col>
          <el-col class="text-black">{{ selectItem.CosAppId }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="7">存儲位置CosRegion</el-col>
          <el-col class="text-black">{{ selectItem.CosRegion }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="7">存儲位置CosBucket</el-col>
          <el-col class="text-black">{{ selectItem.CosBucket }}</el-col>
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