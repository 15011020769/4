<!--
 * @Author: T
 * @Date: 2020-01-03 11:13:24
 * @LastEditTime : 2020-01-03 15:32:16
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/CSS/transcoding/tab/configDetail.vue
 -->
<template>
  <div class="detail-wrap">
    <el-row type="flex" justify="space-between" align="middle">
      <h3>錄製配置</h3>
      <el-button type="text">編輯</el-button>
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
          <el-col :span="5">錄製文件類型</el-col>
          <el-col class="text-black">
            <el-table :data="this.tableData.filter(item => item.Enable > 0)">
              <el-table-column label="文件類型" prop="TemplateName" />
              <el-table-column label="單個錄製文件時長(分鐘)" prop="RecordInterval">
                <template slot-scope="scope">
                  {{scope.row | RecordInterval}}
                </template>
              </el-table-column>
              <el-table-column label="文件保存時長(天)" prop="StorageTime">
                <template slot-scope="scope">
                  {{scope.row | StorageTimeFilter}}
                </template>
              </el-table-column>
              <el-table-column label="續錄超時時長(秒)">
                <template slot-scope="scope">
                  {{scope.row | HlsSpecialParamFilter}}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
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
      tableData: []
    }
  },

  mounted() {

  },

  watch: {
    selectItem: {
      handler: function (newValue) {
        if (newValue) {
          this.tableData = TEMPLATE_TYPE.map(item => {
            const currentItem = { ...this.selectItem[item.paramName] }
            currentItem.TemplateName = item.TemplateName
            currentItem.HlsSpecialParam = newValue.HlsSpecialParam
            return currentItem
          })
        }
      }
    }
  },

  filters: {
    RecordInterval(item) {
      if (item.TemplateName === 'HLS') {
        return '无时长限制'
      }
      return item.RecordInterval / 60 //单位为分钟 
    },

    StorageTimeFilter(item) {
      if (item.StorageTime > 0) {
        return item.StorageTime / 60 / 24 // 单位为天
      }
      return '永久保存'
    },

    HlsSpecialParamFilter(item) {
      if (item.TemplateName === 'HLS') {
        return item.HlsSpecialParam.FlowContinueDuration
      }
      return '不支持续录'
    }
  }
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