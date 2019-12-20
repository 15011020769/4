<template>
  <div class="builder-wrap">
    <div>
      <Header :backShow="false" title="地址生成器" />
    </div>
    <div class="content">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="生成类型与域名" prop="domain">
          <el-select v-model="ruleForm.domainType" placeholder="请选择域名类型" @change="Getdomain">
            <el-option label="推流域名" value="0"></el-option>
            <el-option label="播放域名" value="1"></el-option>
          </el-select>
          <el-select v-model="ruleForm.domain" placeholder="请选择域名" v-for="(item,index) in domainArr" :key="index">
            <el-option :label="item.name" :value="item.TargetDomain"></el-option>
          </el-select>
          <p>选择推流域名，则生成推流地址；选择播放域名，则生成播放地址。如无可选域名，<span @click="_adddomain" class="Adomain">请添加域名</span></p>
        </el-form-item>
        <el-form-item label="AppName" prop="AppName">
          <el-input v-model="ruleForm.AppName" class="inputstyle"></el-input>
          <p>默认为live，仅支持英文字母、数字和符号</p>
        </el-form-item>

        <el-form-item label="StreamName" prop="StreamName">
          <el-input v-model="ruleForm.StreamName" class="inputstyle"></el-input>
          <p>仅支持英文字母、数字和符号</p>
        </el-form-item>
        <el-form-item label="过期时间" prop="date">
          <el-date-picker type="date" placeholder="选择过期时间" v-model="ruleForm.date">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" size="small">生成地址</el-button>
          <span class="Adomain aExplain" @click="_aExplain">地址解析说明示例</span>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="地址解析说明示例" :visible.sync="dialogVisible" width="850px">
      <img width="800px"
        src="https://imgcache.qq.com/open_proj/proj_qcloud_v2/mc_2014/video/console/v1/css/img/lvb/url-description.png">
    </el-dialog>
  </div>
</template>

<script>
  import Header from "@/components/public/Head";

  import {
    DOMAIN_LIST
  } from "@/constants";
  export default {
    name: 'builder',
    data() {
      return {
        ruleForm: {
          domainType: '0',
          domain: '',
          AppName: 'live',
          StreamName: '',
          date: '',
        },
        dialogVisible: false, //模态框
        domainArr: [{ //接口无数据，假数据
          name: 'abc.com',
          TargetDomain: 'abc.com.liveplay.myqcloud.com'
        }], //域名列表
        rules: {
          domain: [{
            required: true,
            message: '请选择域名',
            trigger: 'change'
          }],
          AppName: [{
              required: true,
              message: '请输入AppName',
              trigger: 'blur'
            },
            {
              pattern: /^[0-9a-zA-Z]*$/g,
              message: '仅支持英文字母、数字和符号'
            }
          ],
          StreamName: [{
              required: true,
              message: '请输入StreamName',
              trigger: 'blur'
            },
            {
              pattern: /^[0-9a-zA-Z]*$/g,
              message: '仅支持英文字母、数字和符号'
            }
          ],
          date: [{
            type: 'date',
            required: true,
            message: '请选择过期时间',
            trigger: 'change'
          }],

        }
      }
    },
    components: {
      Header,
    },
    created() {
      this.Getdomain()
    },
    methods: {
      Getdomain() {
        const param = {
          Region: this.Region,
          Version: '2018-08-01',
          DomainStatus: '1',
          DomainType: this.ruleForm.domainType
        };
        // 获取表格数据
        this.axios.post(DOMAIN_LIST, param).then(data => {
          if (data.Response.Error == undefined) {
            // this.domainArr = data.Response.DomainList
            console.log(this.domainArr)
          } else {
            this.$message.error(data.Response.Error.Message);
          }
        });
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.ruleForm)
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      _aExplain() {
        this.dialogVisible = true
      },
      _adddomain() {
        this.$router.push({
          name: 'domainManagement'
        })
      }
    },
  }

</script>

<style lang="scss" scoped>
  .builder-wrap {
    .content {
      margin: 20px;
      padding: 20px;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, .2);

      box-sizing: border-box;

      ::v-deep .el-input__inner {
        height: 32px !important;

      }

      .inputstyle {
        width: 400px !important;
      }

      .Adomain {
        color: blue;
        cursor: pointer;
      }

      .aExplain {
        padding-left: 20px;
      }
    }
  }

</style>
