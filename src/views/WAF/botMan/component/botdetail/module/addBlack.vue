<template>
  <div>
    <div class="newClear">
      <div class="topTip" v-if="tipShow">
        <p style="width: 99%">{{t('加黑IP后，您可前往【IP管理-IP黑白名单】檢視', 'WAF.jhiph')}}</p>
        <span class="el-icon-close" @click="closeTip"></span>
      </div>
       <div class="newClear newList">
        <p>{{t('生效范围', 'WAF.sxfw')}}<i class="required">*</i></p>
        <p>
          <el-radio-group v-model="currentDomain" :disabled="ipInfo.type === 'ipStatus'">
            <el-radio :label="1">{{t('当前域名', 'WAF.dqym')}}</el-radio>
            <el-radio :label="2">全局</el-radio>
            
          </el-radio-group>
        </p>
      </div>
      <div class="newClear newList">
        <p>IP<i class="required">*</i></p>
        <p>
          <el-input disabled v-model="ipAddress" />
          <div class="err-tips" v-show="ipTest">{{t('IP格式输入有误', 'WAF.ipgsyw')}}</div>
        </p>
      </div>
      <div class="newClear newList">
        <p>截止日期<i class="required">*</i></p>
        <p>
          <el-date-picker
            class="datatime"
            v-model="datatime"
            type="date"
            format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
          <el-time-picker
            class="datatime"
            v-model="timeValue"
          >
          </el-time-picker>
        </p>
      </div>
      <div class="newClear newList">
        <p>{{t('备注', 'WAF.bz')}}</p>
        <p>
          <el-input class="des" v-model="des"></el-input>
        </p>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button :disabled="ipTest || loading" type="primary" @click="addSure">
        <template v-if="ipInfo.bj">保存</template>
        <template v-else>添加</template>
      </el-button>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </div>
</template>
<script>
import { UPSERTIP_ACCESS_CONTROL } from '@/constants'
import { flatObj, isValidIPAddressNew } from '@/utils'
import moment from 'moment'
import { COMMON_ERROR } from '../../../../constants'
export default {
  props:{
    isShow:{
      required: false,
      type: Boolean
    },
    ipInfo: Object
  },
  data(){
    return{
      loading: false,
      blackWhiteCh: 42,//黑白名单
      currentDomain: 1,
      ipAddress:'',//ip地址
      datatime:'',//选择日期
      timeValue:'',//选择时间
      des:'',//备注
      ipTest: false, // ip输入格式是否正确
      tipShow: true,
    }
  },
  computed: {
    domainV() {
      if(this.currentDomain == 1) {
        return this.Domain
      } else {
        return "global"
      }
    }
  },
  watch: {
    ipAddress(n) {
      if (n) {
        n = n.trim()
        const ips = n.split('\n')
        for (let i = 0; i < ips.length; i += 1) {
          if (!isValidIPAddressNew(ips[i])) {
            this.ipTest = true
            return
          }
        }
      }
      this.ipTest = false
    },
    ipInfo: {
      handler(n) {
        Object.keys(n).forEach(key => {
          this[key] = n[key]
        })
      },
      immediate: true
    }
  },
  methods:{
     //关闭提示文字
    closeTip() {
      this.tipShow = false;
    },
    handleClose() {
      this.$emit('update:isShow', false)
    },
    //确定按钮
    addSure(){
      if (this.ipAddress && this.ipAddress.trim()) {
        this.loading = true
        const param = {
          Version: '2018-01-25',
          Domain: this.domainV,
          Edition: 'clb-waf'
        }
        this.ipAddress.split('\n').forEach((ip, i) => {
          param[`Items.${i}`] = JSON.stringify({
            ip,
            action: this.blackWhiteCh,
            source: this.blackWhiteCh,
            note: this.des,
            valid_ts: Number(moment(`${moment(this.datatime).format('YYYY-MM-DD')} ${moment(this.timeValue).format('HH:mm:ss')}`).format('X'))
          })
        })
        this.axios.post(UPSERTIP_ACCESS_CONTROL, param)
        .then(resp => {
          this.generalRespHandler(resp, () => {
            this.$emit("success")
          }, COMMON_ERROR, this.t('添加IP黑名单成功，您可以前往IP管理模块檢視。', 'WAF.tjipcg'))
        })
        .then(() => {
          this.loading = false
        })
      } else {
        this.ipTest = true
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.newClear:after{
  display: block;
  content:'';
  clear:both;
}
::v-deep .el-dialog__title{
  font-size:14px;
  color:#000;
  font-weight: 600;
}
::v-deep .el-dialog__footer{
  text-align:center;
}
::v-deep textarea{
  width:60%;
  height:100px;
  border-radius: 0;
  resize: none;
}
::v-deep .el-input {
  width: 320px;
}
.newList{
  margin-bottom:20px;
  p:nth-child(1){
    font-size:12px;
    color:#999;
    float:left;
    width:80px;
    .required{
      color:red;
    }
  }
  p:nth-child(2){
    font-size:12px;
    color:#000;
    float:left;
    width:calc(100% - 80px);
  }
}
.datatime{
  width: 150px;
  margin-right:16px;
  ::v-deep .el-input__icon{
    line-height: 26px;
  }
}
.des{
  width:60%;
}
.err-tips {
  font-size: 10px;
  color: #e1504a;
  width: 100px;
  padding-top: 5px;
  margin-left: 80px;
}
.topTip {
    font-size: 12px;
    line-height: inherit;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    margin-bottom: 20px;
    position: relative;
    p {
      line-height: 20px;
    }
    .el-icon-close {
      position: absolute;
      font-size: 18px;
      top: 10px;
      margin-left: 10px;
      right: 20px;
    }
  }
</style>