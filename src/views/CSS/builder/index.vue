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
          <el-select v-model="ruleForm.domain" placeholder="请选择域名">
            <el-option v-for="(item,index) in domainArr" :key="index" :label="item.Name" :value="item.Name"></el-option>
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
          <el-date-picker
            v-model="ruleForm.date"
            type="datetime"
            placeholder="选择过期时间">
          </el-date-picker>
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" size="small">生成地址</el-button>
          <span class="Adomain aExplain" @click="_aExplain">地址解析说明示例</span>
        </el-form-item>
      </el-form>
      <div class="result" v-show="txSecret && txTime">
        <h3>生成结果</h3><span>(根据上面设置项生成以下地址)</span>
        <div class="item">
          <div>
            <span>类型</span>
            <span>{{ruleForm.domainType === '0' ? '推流' : '播放'}}域名</span>
          </div>
          <div>
            <span>过期时间</span>
            <span>{{ruleForm.date}}</span>
          </div>
          <template v-if="ruleForm.domainType === '0'">
            <div>
              <span>推流地址</span>
              <span>rtmp://{{ruleForm.domain}}/{{ruleForm.AppName}}/{{ruleForm.StreamName}}?txSecret={{txSecret}}&txTime={{txTime}}</span>
            </div>
            <div>
              <span>OBS推流地址</span>
              <span>rtmp://{{ruleForm.domain}}/{{ruleForm.AppName}}/</span>
            </div>
            <div>
              <span>OBS推流名称</span>
              <span>{{ruleForm.StreamName}}?txSecret={{txSecret}}&txTime={{txTime}}</span>
            </div>
          </template>
          <template v-else>
            <div>
              <span>播放地址(RTMP)</span>
              <span>rtmp://{{ruleForm.domain}}/{{ruleForm.AppName}}/{{ruleForm.StreamName}}?txSecret={{txSecret}}&txTime={{txTime}}</span>
            </div>
            <div>
              <span>播放地址(FLV)</span>
              <span>rtmp://{{ruleForm.domain}}/{{ruleForm.AppName}}/{{ruleForm.StreamName}}.flv?txSecret={{txSecret}}&txTime={{txTime}}</span>
            </div>
            <div>
              <span>播放地址(HLS)</span>
              <span>rtmp://{{ruleForm.domain}}/{{ruleForm.AppName}}/{{ruleForm.StreamName}}.m38u?txSecret={{txSecret}}&txTime={{txTime}}</span>
            </div>
          </template>
        </div>
      </div>
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
  LIVE_DESCRIBELIVE_PUSHAUTHKEY,
  LIVE_DESCRIBE_LIVEPLAYAUTHKEY,
  DOMAIN_LIST
} from "@/constants";
import { toUTF8Array } from '@/utils'
import md5 from 'js-md5'
import moment from 'moment'
  export default {
    name: 'builder',
    data() {
      return {
        txSecret: '',
        txTime: '',
        ruleForm: {
          domainType: '0',
          domain: '',
          AppName: 'live',
          StreamName: '',
          date: '2020-01-07 23:59:59',
        },
        dialogVisible: false, //模态框
        domainArr: [], //域名列表
        rules: {
          domain: [{
            required: true,
            message: '请选择域名',
            // trigger: 'change'
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
        this.txSecret = ''
        this.timeHex = ''
        this.ruleForm.domain = ''
        const param = {
          Version: '2018-08-01',
          DomainStatus: '1',
          DomainType: this.ruleForm.domainType
        };
        // 获取表格数据
        this.axios.post(DOMAIN_LIST, param).then(data => {
          if (data.Response.Error == undefined) {
            this.domainArr = data.Response.DomainList
          } else {
            this.$message.error(data.Response.Error.Message);
          }
        });
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = LIVE_DESCRIBE_LIVEPLAYAUTHKEY
            let key = 'PlayAuthKeyInfo'
            let key1 = 'AuthKey'
            let timeHex
            if (this.ruleForm.domainType === '0') {
              url = LIVE_DESCRIBELIVE_PUSHAUTHKEY
              key = 'PushAuthKeyInfo'
              key1 = 'MasterAuthKey'
            }
            this.axios.post(url, {
              Version: "2018-08-01",
              DomainName: this.ruleForm.domain
            }).then(({ Response }) => {
              if (this.ruleForm.domainType === '0') {
                timeHex = moment(this.ruleForm.date).unix().toString(16).toUpperCase()
              } else {
                timeHex = ((+new Date(moment(this.ruleForm.date)) - 1e3 * Response[key].AuthDelta) / 1e3).toString(16).toUpperCase()
              }
              this.txSecret = md5(`${Response[key][key1]}${this.ruleForm.StreamName}${timeHex}`)
              this.txTime = timeHex
            })
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
.result {
  h3 {
    display: inline-block;
  }
  h3 + span {
    color: #bbb;
  }
  .item > div span {
    line-height: 32px;
    &:first-of-type {
      display: inline-block;
      width: 111px;
      font-size: 12px;
      color: #888;
    }
  }
}
</style>
