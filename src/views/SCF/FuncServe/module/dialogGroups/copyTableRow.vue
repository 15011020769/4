<template>
  <div class="copyTableRow">
    <el-dialog
      :visible.sync="copyDialog"
      width="45%"
      center
      :show-close="false">
      <div slot="title" class="title-wrap"><span style='font-weight: bolder;'>函数复制</span><i class="el-icon-close" @click="close(2)"></i></div>
      <span class='copytip'>提示：如果云函数配置了vpc，在跨地域复制时，不会将vpc配置也复制过去。</span>
      <div>
        <el-form :model="primaryData" :hide-required-asterisk= 'true' :rules="rules" :label-position="labelPosition" label-width="90px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属地域" class="formStyle" prop='area'>
                <el-select v-model="primaryData.area" placeholder="" size="mini">
                  <el-option
                    v-for="item in projectContent.addressList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="命名空间" class="formStyle" prop='space'>
                <el-select v-model="primaryData.space" placeholder="" size="mini">
                  <el-option
                    v-for="item in projectContent.space"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="函数名称" class="formStyle" prop='funcname'>
                <el-input v-model="primaryData.funcname" placeholder="请输入函数名称" size="mini"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="复制内容" prop='copy' class="formStyle">
                <el-checkbox v-model="primaryData.funcCode" disabled>函数代码</el-checkbox>
                <el-checkbox v-model="primaryData.funcSet">函数配置</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="14">
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="覆盖目标函数" class="formStyle" prop='target'>
                <el-checkbox v-model="primaryData.funcTarget"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="12">
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="描述" class="formStyle" prop='describe'>
                <el-input
                  type="textarea"
                  :rows="6"
                  placeholder="请输入函数的描述"
                  v-model="primaryData.textarea">
                </el-input>
                <span style="font-size: 12px; color: #bbb;">最大支持1000个英文字母、数字、空格、逗号、句号、中文</span>
              </el-form-item>
            </el-col>
            <el-col :span="4">
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="close(1)">提交</el-button>
        <el-button size="mini" @click="close(2)">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
  var validateName = (rule, value, callback) => {
      if (value) {
        if(this.primaryData.funcname=='1') {   //服务
          callback();
        }else {
          callback(new Error(rule.message));

        }
      }else {
        callback();
      }
    };
    return {
      rules: {
        funcname: [
          { required: true, message: '函数名称不能为空', trigger: 'blur' }
        ],
      },
      projectContent: {
        addressList: [{
          value: '1',
          label: '广州'
        }, {
          value: '2',
          label: '上海'
        }, {
          value: '3',
          label: '香港'
        }, {
          value: '4',
          label: '北京'
        }, {
          value: '5',
          label: '成都'
        }],
        space: [{
          value: '1',
          label: '广州'
        }],
      },
      labelPosition: 'left',
      primaryData: {
        area:'1',
        space: '1',  
        funcname: '', 
        target: '', 
        describe: '',
        funcCode: false,
        funcSet: false,
        funcTarget: false,
        textarea: ''
      }
    };
  },
  props: ["copyDialog"],
  computed: {
  },
  methods: {
    close(value) {
      this.$emit("copyClose",value);
    }
  }
};
</script>

<style scoped lang="scss">
  .title-wrap {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: bolder;
  }
  .title-wrap>i {
    font-size: 16px;
    font-weight: 900;
  }
  .el-icon-close {
    padding: 5px;
    color: #9c9c9c;
  }
  .el-icon-close:hover {
    background: #f2f2f2;
    cursor: pointer;
  }
  .copytip {
    font-size: 12px;
    padding: 10px 20px;
    display: block;
    background: #e5f0ff;
    color: #003b80;
    border: 1px solid #97c7ff;
  }
  .el-select {
    width: 120px;
  }
</style>
<style>
  .demo-ruleForm /deep/.el-form--label-left .el-form-item__label {
    font-size: 12px;
  }
  .formStyle /deep/.el-form-item__label {
    font-size: 12px;
  }
  .formStyle /deep/.el-checkbox__label {
    font-size: 12px;
  }
  .formStyle /deep/.el-textarea__inner {
    font-size: 12px;
    line-height: 16px;
    padding-right: 40px;
  }
</style>
