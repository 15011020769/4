<!--
 * @Author: your name
 * @Date: 2020-02-20 15:34:58
 * @LastEditTime: 2020-02-20 16:28:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /new_product/src/views/WAF/botMan/component/editDialog.vue
 -->
<template>
  <el-dialog
    :visible="visible"
    :title="info.name"
    @close="onClose"
    width="470px"
  >
    <el-form 
      :rules="rules" 
      :model="formValue"
      label-width="160px"
      label-position="left"
      >
      <el-form-item label="动作" prop="action">
      <el-select style="width: 180px" v-model="formValue.action" placeholder="请选择">
        <el-option
          v-for="item in selectData"
          :key="item.value"
          :label="item.name"
          :value="item.value">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="惩罚时长（分钟)" prop="time">
        <div>
          <el-input v-model="formValue.time" style="width: 180px; font-size: 12px;" placeholder="请输入5~10080以内的整数" />
          <el-tooltip slot="append" effect="light" content="最短5分钟，最长1周。">
            <i style="margin-left: 10px;" class="el-icon-info" />
          </el-tooltip>
        </div>
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-button @click="onClick" type="primary">确定</el-button>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      formValue: {
        action: '',
        time: ''
      },
      rules: {
        action: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      selectData: [
          {
            name: '放行',
            value: 1
          },
          {
            name: '监控',
            value: 2
          },
          {
            name: '验证码',
            value: 3
          },
          {
            name: '拦截',
            value: 4
          },
        ]
    }
  },
  props: {
    visible: {
      default: false
    },
    info: {
      default: {}
    }
  },

  mounted() {
    console.log(this.visible);
  },

  methods: {
    onClick() {
      console.log(onclick);
    },

    onCancel() {
      this.$emit("update:visible",false);
      console.log(onCancel);
    },

    onClose() {
      this.$emit("update:visible",false);
    }
  }

}
</script>

<style lang="scss" scoped>

</style>