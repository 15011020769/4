<template>
  <div class="Addto">
    <el-dialog title="添加域名" :visible.sync="AddDialogVisible" :close-on-click-modal='false'
      :close-on-press-escape='false' :before-close="AddhandleCancel">

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="域名" prop="domain" size='mini'>
          <el-input v-model="ruleForm.domain" placeholder="请填写域名，如www.test.com" width='100px'></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="ruleForm.type" placeholder="请选择活动区域">
            <el-option label="推流域名" value="0"></el-option>
            <el-option label="播放域名" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加速区域	" prop="type" v-if="this.ruleForm.type=='1'">
          <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
            <el-option label="中国大陆" value="1"></el-option>
            <el-option label="全球加速" value="2"></el-option>
            <el-option label="中国港澳台地区及海外地区" value="3"></el-option>
          </el-select>


          <p v-if="this.ruleForm.region!='1'">
            您正申请开通中国港澳台地区及海外地区直播加速，中国大陆的请求将无法解析，请知悉。
          </p>
        </el-form-item>





        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="AddhandleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import {
    ADD_DOMAIN
  } from "@/constants";
  export default {
    name: "Addto",
    props: {
      AddDialogVisible: {
        required: false,
        type: Boolean
      },
    },
    data() {
      return {
        ruleForm: {
          domain: '',
          type: '0',
          region: '1'
        },
        rules: {
          type: [{
            required: true,
            message: '请选择域名类型',
            trigger: 'change'
          }],
          domain: [{
            required: true,
            message: '请填写域名',
            trigger: 'blur'
          }]
        }
      }
    },
    watch: {

    },
    methods: {
      AddhandleCancel() {
        this.$emit('AddhandleCancel', false)
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.ruleForm)
            const param = {
              Version: '2018-08-01',
              DomainName: this.ruleForm.domain,
              DomainType: this.ruleForm.type,
              IsDelayLive: '1'
            };
            if (this.ruleForm.type == '1') {
              param['PlayType'] = this.ruleForm.region
            }
            // 获取表格数据
            this.axios.post(ADD_DOMAIN, param).then(data => {
              if (data.Response.Error == undefined) {
                this.$message({
                  message: '添加域名成功',
                  type: 'success'
                });
                this.$emit('AddhandleCancel', false)
              } else {
                this.$message.error(data.Response.Error.Message);
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
  }

</script>
<style lang="scss" scope>
  .el-input__inner {
    width: 200px !important;
    height: 32px !important;
  }

</style>
