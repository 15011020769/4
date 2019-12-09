<template>
  <div class="Cam">
    <div class="container">
      <el-form :model="form" :rules="rules" size="mini" ref="form" label-width="100px">
        <el-form-item label="供应商类型" prop="providerType">
          <el-col :span="10">
            <el-radio size="mini" v-model="form.providerType" label="SAML">SAML</el-radio>
          </el-col>
        </el-form-item>
        <el-form-item label="供应商名称" prop="providerName">
          <el-col :span="10">
            <p>{{form.providerName}}</p>
            <!-- <el-input size="mini" ref="providerNameRules" v-model="form.providerName"></el-input> -->
          </el-col>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-col :span="10">
            <p>{{form.remark}}</p>
            <!-- <el-input size="mini" type="textarea" v-model="form.remark"></el-input> -->
          </el-col>
        </el-form-item>
        <el-form-item label="元数据文档" prop="metadataDocument">
          <el-col :span="10">
            <p>{{form.metadataDocument}}</p>
            <!-- <el-input size="mini" v-model="form.metadataDocument"></el-input> -->
          </el-col>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { GET_SAML } from "@/constants";
export default {
  props: {
    name: String
  },
  data() {
    return {
      rules: {},
      form: {
        providerType: "",
        providerName: "",
        remark: "",
        metadataDocument: ""
      }
    };
  },
  methods: {},
  created() {
    const params = {
      Version: "2019-01-16",
      Name: this.name
    };
    this.axios.post(GET_SAML, params).then(res => {
      console.log(res);
    });
  }
};
</script>
<style lang="scss" scoped>
.Cam {
  .container {
    width: 96%;
    // margin:0 auto;
    background: #fff;
    padding: 20px;
    p.title,
    p.explain {
      line-height: 20px;
      font-size: 16px;
      color: #000;
      font-weight: 700;
    }
    p.explain {
      font-size: 12px;
      color: #ccc;
      margin-top: 10px;
      line-height: 16px;
      color: #666;
    }
    .container-mar {
      margin: 0;
    }
  }
}
</style>