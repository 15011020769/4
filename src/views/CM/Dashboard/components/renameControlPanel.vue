<template>
   <el-dialog :title="$t('CVM.Dashboard.cmmjkmb')" :visible.sync="show" @close="close">
      <el-form :model="form">
        <el-form-item :label="$t('CVM.Dashboard.mcheng')" label-width="120px">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">{{$t('CVM.Dashboard.qd')}}</el-button>
      </div>
   </el-dialog>
</template>
<script>
import {
  ErrorTips
} from "@/components/ErrorTips"; //公共错误码
export default {
  data() {
    return {
        form: {
            name: ''
        },
        show: false,
    }
  },
  props: {
    name: {
      default: false,
      type: String
    }
  },
  methods: {
    cancel() {
      
    },
    save() { // 确定按钮

    },
    close() { // 关闭

    }
  }
}
</script>
<style lang="sass" scoped>

</style>