<template>
  <div>
    <div class="funcdeploy">
      <el-form ref='primaryData' :model="primaryData" :hide-required-asterisk= 'true' :rules="rules" :label-position="labelPosition" label-width="90px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="函数名">
              <span>{{primaryData.funcname}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="18">
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="描述" prop='describe'>
              <el-input
                type="textarea"
                :rows="6"
                placeholder="请输入函数的描述"
                v-model="primaryData.textarea">
              </el-input>
              <span style="font-size: 12px; color: #bbb;">最大支持1000个英文字母、数字、空格、逗号、句号、中文</span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
          </el-col>
        </el-row> 
        <el-row style="margin-bottom: 20px;">
          <el-col :span="12">
            <span class="leftLocation">
              <span style="font-size: 12px;">运行角色</span>
              <i :class="['el-icon-warning-outline','tipshow']" style="position: relative;">
                <span class='tip'>运行角色用于在函数运行时获得操作相关资源的权限，用户将角色授予云函数服务，并与函数绑定后，在函数运行时，云函数服务将会使用此角色完成临时 SecretId、SecretKey、SesstionToken 的申请，并以环境变量的形式将相关内容传递到运行环境中。更多有关运行角色的详情，请见<a href="" target="_blank">[运行角色说明]。</a></span>
              </i>
            </span>
            <el-select v-model="primaryData.role" placeholder="" size="mini">
              <el-option
                v-for="item in projectContent.addressList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <i class="el-icon-refresh" style="margin-left: 5px;font-weight: bolder;" @mouseover="refresh"></i>
            <span class="explain">此角色将用于授权函数运行时操作其他资源的权限。您可以<a href="" target="_blank">新建角色</a>或对角色<a href="" target="_blank">修改权限</a></span>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row> 
        <el-row style="margin-bottom: 20px;">
          <el-col :span="12">
            <span class="leftLocation">
              <span style="font-size: 12px;">执行方法</span>
              <i class="el-icon-warning-outline"></i>
            </span>
            <el-input size="mini" style="width: 200px" :disabled="true" v-model="primaryData.methods"></el-input>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row> 
        <el-row style="margin-bottom: 20px;">
          <el-col :span="12">
            <span class="leftLocation">
              <span style="font-size: 12px;">提交方法</span>
              <i class="el-icon-warning-outline"></i>
            </span>
            <el-select v-model="primaryData.check" disabled placeholder="" size="mini">
              <el-option
                v-for="item in projectContent.typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div class="code-show">
              <div class="text"
                v-html="innerText"
                :contenteditable="canEdit"
                @input="changeText">
            </div>
            </div>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row> 
      </el-form>
    </div>
    <div>
      <el-button size="mini" @click="previousStep">上一步</el-button>
      <el-button type="primary" size="mini" @click="confirm">完成</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      labelPosition: 'left',
      primaryData: {
        funcname: 'dgffs122212',
        textarea: '',
        role: '2',
        methods: '2',
        check: '1'
      },
      projectContent: {
        addressList: [{
          value: '1',
          label: 'SCF_QcsRole'
        }, {
          value: '2',
          label: 'SCF默认运行角色'
        }],
        typeList: [{
          value: '1',
          label: '在线编辑'
        }]
      },
      canEdit: true,
      innerText: '',
    };
  },
  props: {
  },
  methods: {
    refresh() {

    },
    previousStep() {
      this.$emit("deployClose",close);
    },
    confirm() {
      this.$router.push('/detail')
    },
    changeText() {
    }
  }
};
</script>
<style scoped lang="scss">
  .funcdeploy {
    margin-bottom: 20px;
    border-bottom: 1px solid #f2f2f2;
  }
  .leftLocation {
    display: inline-block;
    width: 90px;
    color: #8f8f8f;
  }
  .el-icon-warning-outline {
    margin-left: 3px;
    font-weight: bolder;
  }
  .el-select {
    width: 160px;
  }
  .explain {
    display: block;
    margin-top: 5px;
    font-size: 12px;
    margin-left: 90px;
    color: #8f8f8f;
  }
  .code-show {
    width: 600px;
    height: 500px;
    margin: 20px 90px;
    overflow-y: scroll;
  }
  .text {
    height: 700px;
    background: #f2f2f2;
    width: 100%;
  }
  .tip {
    display: none;
    width: 400px;
    position: absolute;
    z-index: 11;
    background: #fff;
    font-size: 12px;
    padding: 12px;
    border: 1px solid #ccc;
    left: -40px;
    top: -100px;
  }
  .tipshow:hover span {
    display: inline-block;
  }
</style>
