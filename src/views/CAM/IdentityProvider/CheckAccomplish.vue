<template>
    <div class="Cam">
        <div class="container">      
            <el-form :model="addModel" :rules="rules" size="mini" ref="addModel" label-width="100px">
                <el-form-item label="供应商类型" prop="providerType" >
                    <el-col :span="10">
                        <el-radio size="mini" v-model="addModel.providerType" label="SAML">SAML</el-radio>
                    </el-col>
                </el-form-item>
                <el-form-item label="供应商名称" prop="providerName" >
                    <el-col :span="10">
                        <p>{{addModel.providerName}}</p>
                        <!-- <el-input size="mini" ref="providerNameRules" v-model="addModel.providerName"></el-input> -->
                    </el-col>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-col :span="10">
                        <p>{{addModel.remark}}</p>
                        <!-- <el-input size="mini" type="textarea" v-model="addModel.remark"></el-input> -->
                    </el-col>
                </el-form-item>
                <el-form-item label="元数据文档" prop="metadataDocument">
                    <el-col :span="10">
                        <p>{{addModel.metadataDocument}}</p>
                        <!-- <el-input size="mini" v-model="addModel.metadataDocument"></el-input> -->
                    </el-col>
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
        // policiesSelectedData: []
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
    // margin:0 auto;
    background: #fff;
    padding:20px;
    p.title,p.explain{
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
    .container-mar{
      margin: 0;
    }
  }

}
</style>