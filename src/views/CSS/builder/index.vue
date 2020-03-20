<template>
  <div class="builder-wrap">
    <div>
      <Header :backShow="false" title="地址生成器" />
    </div>
    <div class="content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('CSS.builder.0')" prop="domain">
          <el-select
            v-model="ruleForm.domainType"
            :placeholder="$t('CSS.builder.7')"
            @change="Getdomain"
          >
            <el-option label="推流域名" value="0"></el-option>
            <el-option label="播放域名" value="1"></el-option>
          </el-select>
          <el-select v-model="ruleForm.domain" :placeholder="$t('CSS.builder.13')">
            <el-option
              v-for="(item,index) in domainArr"
              :key="index"
              :label="item.Name"
              :value="item.Name"
            ></el-option>
          </el-select>
          <p>
            {{$t('CSS.builder.1')}}
            <span @click="_adddomain" class="Adomain">{{$t('CSS.builder.2')}}</span>
          </p>
        </el-form-item>
        <el-form-item label="AppName" prop="AppName">
          <el-input v-model="ruleForm.AppName" class="inputstyle"></el-input>
          <p>{{$t('CSS.builder.3')}}</p>
        </el-form-item>

        <el-form-item label="StreamName" prop="StreamName">
          <el-input v-model="ruleForm.StreamName" class="inputstyle"></el-input>
          <p>{{$t('CSS.builder.4')}}</p>
        </el-form-item>
        <el-form-item :label="$t('CSS.builder.5')" prop="date">
          <el-date-picker
            v-model="ruleForm.date"
            type="datetime"
            :placeholder="$t('CSS.builder.8')"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            size="small"
            :loading="loading"
          >生成地址</el-button>
          <span class="Adomain aExplain" @click="_aExplain">{{$t('CSS.builder.6')}}</span>
        </el-form-item>
      </el-form>
      <div class="result" v-if="generated">
        <h3>生成结果</h3>
        <span>({{$t('CSS.builder.9')}})</span>
        <div class="item">
          <div>
            <span>{{$t('CSS.builder.11')}}</span>
            <span>{{ruleForm.domainType === '0' ? '推流' : '播放'}}域名</span>
          </div>
          <div>
            <span>{{$t('CSS.builder.5')}}</span>
            <span>{{ this.datestring }}</span>
          </div>
          <template v-if="ruleForm.domainType === '0'">
            <div>
              <span>推流地址</span>
              <span>rtmp://{{ruleForm.domain}}/{{ruleForm.AppName}}/{{ruleForm.StreamName}}{{suffix}} <i class="el-icon-copy-document" v-clipboard:success="onCopy" v-clipboard:copy="`rtmp://${ruleForm.domain}/${ruleForm.AppName}/${ruleForm.StreamName}${suffix}`" />
                </span>
            </div>
            <div>
              <span>OBS推流地址</span>
              <span>rtmp://{{ruleForm.domain}}/{{ruleForm.AppName}}/ <i class="el-icon-copy-document" v-clipboard:success="onCopy" v-clipboard:copy="`rtmp://${ruleForm.domain}/${ruleForm.AppName}/`" /></span>
            </div>
            <div>
              <span>{{$t('CSS.builder.12')}}</span>
              <span>{{ruleForm.StreamName}}{{suffix}} <i class="el-icon-copy-document" v-clipboard:success="onCopy" v-clipboard:copy="`${ruleForm.StreamName}${suffix}`" />
                </span>
            </div>
          </template>
          <template v-else>
            <div v-for="(url, index) in playUrls" :key="url.name">
              <span>{{ url.name }}</span>
              <span>{{ url.value }} <i class="el-icon-copy-document" v-clipboard:success="onCopy" v-clipboard:copy="url.value" /></span>
              <p class="tip">{{ url.tip }}</p>
            </div>
            <!-- <div> -->
          </template>
        </div>
      </div>
    </div>
    <el-dialog :title="$t('CSS.builder.14')" :visible.sync="dialogVisible" width="850px">
      <img width="800px" src="~@/assets/CSS_Assets/images/url-description.png" />
    </el-dialog>
  </div>
</template>

<script>
import Header from '@/components/public/Head'
import {
  LIVE_DESCRIBELIVE_PUSHAUTHKEY,
  LIVE_DESCRIBE_LIVEPLAYAUTHKEY,
  DOMAIN_LIST
} from '@/constants'
import { toUTF8Array } from '@/utils'
import md5 from 'js-md5'
import moment from 'moment'
import { ErrorTips } from '@/components/ErrorTips'
import { CSSErrorTips } from '../components/CSSErrorTips'
import { generatePlayAddress } from '../utils'
export default {
  name: 'builder',
  data () {
    return {
      playUrls: [],
      keyInfo: {},
      generated: false,
      suffix: '',
      ruleForm: {
        domainType: '0',
        domain: '',
        AppName: 'live',
        StreamName: '',
        date: new Date(moment().endOf('d'))
      },
      loading: false,
      dialogVisible: false, // 模态框
      domainArr: [], // 域名列表
      rules: {
        domain: [
          {
            required: true,
            message: '請選擇域名'
            // trigger: 'change'
          }
        ],
        AppName: [
          {
            required: true,
            message: '請输入AppName',
            trigger: 'blur'
          },
          {
            pattern: /^[\u0000-\u00FF]*$/g,
            message: '僅支持英文字母、數字和符號'
          }
        ],
        StreamName: [
          {
            required: true,
            message: '請输入StreamName',
            trigger: 'blur'
          },
          {
            pattern: /^[\u0000-\u00FF]*$/g,
            message: '僅支持英文字母、數字和符號'
          }
        ],
        date: [
          {
            type: 'date',
            required: true,
            message: '請選擇過期時間',
            trigger: 'change'
          }
        ]
      }
    }
  },
  components: {
    Header
  },
  computed: {
    datestring: function () {
      return moment(this.ruleForm.date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  created () {
    this.Getdomain()
  },
  beforeRouteLeave (to, from, next) {
    this.generated = false
    next()
  },
  methods: {
    onCopy() {
      this.$message({
        message: '複製成功',
        type: 'success',
        showClose: true,
        duration: 0
      })
    },
    Getdomain () {
      this.txSecret = ''
      this.timeHex = ''
      this.ruleForm.domain = ''
      const param = {
        Version: '2018-08-01',
        DomainStatus: '1',
        DomainType: this.ruleForm.domainType
      }
      // 获取表格数据
      this.axios.post(DOMAIN_LIST, param).then(data => {
        if (data.Response.Error == undefined) {
          this.domainArr = data.Response.DomainList
        } else {
          this.$message.error(data.Response.Error.Message)
        }
      })
    },

    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          let url = LIVE_DESCRIBE_LIVEPLAYAUTHKEY
          let key = 'PlayAuthKeyInfo'
          let key1 = 'AuthKey'
          let timeHex
          if (this.ruleForm.domainType === '0') {
            url = LIVE_DESCRIBELIVE_PUSHAUTHKEY
            key = 'PushAuthKeyInfo'
            key1 = 'MasterAuthKey'
          }
          this.axios
            .post(url, {
              Version: '2018-08-01',
              DomainName: this.ruleForm.domain
            })
            .then(res => {
              if (res.Response.Error !== undefined) {
                let ErrOr = Object.assign(ErrorTips, CSSErrorTips)
                this.$message({
                  message: ErrOr[res.Response.Error.Code],
                  type: 'error',
                  showClose: true,
                  duration: 0
                })
                return
              }

              let Response = res.Response[key]
              this.keyInfo = Response
              this.generated = true
              this.loading = false
              this.suffix = ''
              if (this.ruleForm.domainType === '0') {
                if (Response.Enable === 1) {
                  const timeHex = moment(this.ruleForm.date)
                    .unix()
                    .toString(16)
                    .toUpperCase()
                  const txSecret = md5(
                    `${Response[key1]}${this.ruleForm.StreamName}${timeHex}`
                  )
                  this.suffix = `?txSecret=${txSecret}&txTime=${timeHex}`
                }
              } else {
                const urls = generatePlayAddress(this.ruleForm.domain, this.ruleForm.AppName, this.ruleForm.StreamName, new Date(moment(this.ruleForm.date).format('YYYY/MM/DD HH:mm:ss')), Response)
                this.playUrls = urls
              }
            })
        }
      })
    },

    _aExplain () {
      this.dialogVisible = true
    },
    _adddomain () {
      this.$router.push({
        name: 'domainManagement'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.builder-wrap {
  .content {
    margin: 20px;
    padding: 20px;
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);

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
.tip {
  color: #888;
}
.el-icon-copy-document {
  cursor: pointer;
}
</style>
