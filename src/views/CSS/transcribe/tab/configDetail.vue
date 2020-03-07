<!--
 * @Author: T
 * @Date: 2020-01-03 11:13:24
 * @LastEditTime : 2020-01-10 10:51:50
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/CSS/transcoding/tab/configDetail.vue
 -->
<template>
  <div class="detail-wrap">
    <el-row type="flex" justify="space-between" align="middle">
      <h3>{{$t('CSS.transcribe.0')}}</h3>
      <el-button type="text" @click="onEdit">{{$t('CSS.transcribe.17')}}</el-button>
    </el-row>
    <ul class="content-box">
      <li>
        <el-row type="flex">
          <el-col :span="5">{{$t('CSS.transcribe.7')}}</el-col>
          <el-col class="text-black">{{ selectItem.TemplateName }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="5">{{$t('CSS.transcribe.8')}}</el-col>
          <el-col class="text-black">{{ selectItem.Description }}</el-col>
        </el-row>
      </li>
      <li>
        <el-row type="flex">
          <el-col :span="5">{{$t('CSS.transcribe.9')}}</el-col>
          <el-col class="text-black">
            <el-table :data="this.tableData.filter(item => item.Enable > 0)">
              <el-table-column :label="$t('CSS.transcribe.11')" prop="TemplateName" />
              <el-table-column :label="$t('CSS.transcribe.12')" prop="RecordInterval">
                <template slot-scope="scope">
                  {{scope.row | RecordInterval}}
                </template>
              </el-table-column>
              <el-table-column :label="$t('CSS.transcribe.13')" prop="StorageTime">
                <template slot-scope="scope">
                  {{scope.row | StorageTimeFilter}}
                </template>
              </el-table-column>
              <el-table-column :label="$t('CSS.transcribe.14')">
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
    this.tableData = TEMPLATE_TYPE.map(item => {
      const currentItem = { ...this.selectItem[item.paramName] }
      currentItem.TemplateName = item.TemplateName
      currentItem.HlsSpecialParam = this.selectItem.HlsSpecialParam
      return currentItem
    })
  },

  methods: {
    onEdit() {
      this.$emit('update:formShow', true)
    }
  },

  watch: {
    selectItem: {
      handler: function (newValue) {
        // console.log(newValue, 'newValue')
        if (Object.keys(newValue).length) {
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
        return '無時長限制'
      }
      return item.RecordInterval / 60 //单位为分钟 
    },

    StorageTimeFilter(item) {
      if (item.StorageTime > 0) {
        return item.StorageTime / 60 / 60 / 24 // 单位为天
      }
      return '永久保存'
    },

    HlsSpecialParamFilter(item) {
      if (item.TemplateName === 'HLS') {
        return item.HlsSpecialParam.FlowContinueDuration
      }
      return '不支持續錄'
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