<template>
  <div class="Cam">
    <div class="container">
      <el-form :model="addModel" :rules="rules" ref="addModel" label-width="100px">
        <el-form-item label="用户组名称" prop="groupName" >
          <el-input ref="groupNameRules" v-model="addModel.groupName"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="addModel.remark"></el-input>
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