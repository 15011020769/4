<template>
  <div class="Cam" style="width:100%;">
    <div class="container" style="width:100%;">
      <el-form :model="form" :rules="rules" size="mini" ref="form" label-width="100px" style="width:100%;">
        <el-form-item :label="$t('CAM.strategy.supplier')" prop="providerType">
          <el-col :span="10">
            <!-- <el-radio size="mini" v-model="form.providerType" label="SAML">SAML</el-radio> -->
            <span>SAML</span>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('CAM.strategy.supplierName')" prop="providerName">
          <el-col :span="10">
            <p>{{form.providerName}}</p>
            <!-- <el-input size="mini" ref="providerNameRules" v-model="form.providerName"></el-input> -->
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('CAM.userGroup.colRemark')" prop="remark">
          <el-col :span="10">
            <p>{{form.remark}}</p>
            <!-- <el-input size="mini" type="textarea" v-model="form.remark"></el-input> -->
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('CAM.strategy.dataFile')" prop="metadataDocument">
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
    form: Object
  },
  data() {
    return {
      rules: {}
    };
  },
  methods: {},
  created() {
    console.log(this.form)
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
