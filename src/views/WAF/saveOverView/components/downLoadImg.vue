<template>
  <el-dialog
    title="生成报表"
    width="40%"
    :visible.sync="dialogDownloadVisible"
    :before-close='cancel'
  >
    <p v-show="isImgMessage" class="message_img">{{imgMessage}}</p>
      <span class="label_img">图片格式</span>
      <el-select v-model="imgFormat" placeholder="请选择" @change="changeFormat">
        <el-option label="请选择" value=""></el-option>
        <el-option label="PNG" value="png"></el-option>
        <el-option label="JPEG" value="jpeg"></el-option>
      </el-select>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveImg" :disabled="isDisabled">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "downLoadImg",
  data() {
    return {
      imgFormat: "",
      imgMessage: "正在生成图片，请稍等...",
      isImgMessage: false,
      isDisabled: true,
    };
  },
  mounted() {
   
  },
  props: {
    dialogDownloadVisible: {
      type: Boolean
    },
  },
  methods: {
    changeFormat(val){
      this.isImgMessage = true
      this.isDisabled = true
      this.imgMessage = "正在生成图片，请稍等..."
      if (val !== "") {
        setTimeout(() => {
          this.imgMessage = `生成成功，格式为 ${this.imgFormat.toUpperCase()} ，请保存。`
          this.isDisabled = false
        }, 1500)
      }
      if (val == "") {
        this.isImgMessage = false
        this.isDisabled = true
      }
    },
    saveImg() {
      this.$emit('imgSaveMethod',this.imgFormat);
    },
    cancel() {
      // this.$parent.onCancel()
      this.$emit('onCancel');
    }
  }
};

</script>
<style lang="scss" scoped>
  .message_img {
    color: #007e3b;
    border: 1px solid #9ce4bc;
    background-color: #e6f8ee;
    padding: 10px 30px 10px 20px;
    margin-bottom: 20px;
  }
  .label_img {
    display: inline-block;
    padding-right: 20px;
  }
</style>