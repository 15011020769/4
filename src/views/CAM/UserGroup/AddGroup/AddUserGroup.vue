<template>
  <div class="Cam">
    <div class="container">
      <el-form :model="addModel" :rules="rules" ref="addModel">
        <el-form-item :label="$t('CAM.userGroup.colNmae')" prop="groupName" label-width="100px">
          <el-input size="mini" ref="groupNameRules" v-model="addModel.groupName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('CAM.userGroup.colRemark')" prop="remark" label-width="100px">
          <el-input size="mini" type="textarea" v-model="addModel.remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      addModel: Object
    },
    data() {
      return {
        rules: {
          groupName: [
            { required: true, message: '请输入用户组名称', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
    }
  }
</script>
<style lang="scss" scoped>
  .Cam {
  .container {
    width:100%;
    background: #fff;
    padding:20px;
 
    .el-input{
      width: 20%;
    }
    .el-textarea{
      width: 30%;
    }
  }

}
</style>