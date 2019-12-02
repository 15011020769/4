<template>
  <div style="height:300px;">
    <el-dialog title="请选择需要生成密钥的项目" :visible.sync="dialogVisible" :before-close="handleClose" width="70%"> 
      <el-form ref="addModel" label-width="100px">
        <el-col :span="12">
          <el-radio-group v-model="addModel" size="mini">
            <el-radio label="1" border>默认项目</el-radio>
            <el-radio label="2" border>东华云计算有限公司</el-radio>
            <el-radio label="3" border>taifuyun</el-radio>
            <el-radio label="4" border>test</el-radio>
          </el-radio-group>
        </el-col>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      addModel: String,
      dialogVisible: Boolean
    },
    data() {
      return {
        addModel: Object
      };
    },
    methods: {
      handleClose() {
        this.dialogVisible = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .Cam {
  .container {
    width:96%;
    height:200px;
    min-height: 200px;
    margin:10px auto 0;
    background: #fff;
    padding:20px;
    padding-right: 50%;
    p.title,p.explain{
      text-align: center;
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }
    p.explain {
      font-size: 12px;
      color:#ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }
  }

}
</style>