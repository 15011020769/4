<template>
  <div>
    <div>
      <el-dialog
        title="添加黑白IP"
        :visible.sync="isShow"
        width="45%"
        :before-close="handleClose"
        >
        <div class="newClear">
          <div class="newClear newList">
            <p>{{t('类别', 'WAF.lb')}}</p>
            <p>
              <el-radio-group v-model="blackWhiteCh" :disabled="ipInfo.type === 'ipStatus'">
                <el-radio :label="42">{{t('黑名单', 'WAF.hmd')}}</el-radio>
                <el-radio :label="40">{{t('白名单', 'WAF.bmd')}}</el-radio>
              </el-radio-group>
            </p>
          </div>
          <div class="newClear newList">
            <p>IP地址</p>
            <p>
              <el-input :disabled="ipInfo.type === 'ipStatus'" type="textarea" v-model="ipAddress" />
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
        <span slot="footer" class="dialog-footer">
          <el-button :disabled="ipTest" type="primary" @click="addSure">添加</el-button>
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { UPSERTIP_ACCESS_CONTROL } from '@/constants'
import { flatObj, isValidIPAddressNew } from '@/utils'
import moment from 'moment'
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
      blackWhiteCh: 42,//黑白名单
      ipAddress:'',//ip地址
      datatime:'',//选择日期
      timeValue:'',//选择时间
      des:'',//备注
      ipTest: false, // ip输入格式是否正确
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
        this.ipAddress = n.Ip || n.ip
        this.blackWhiteCh = n.Action || 42
        this.des = n.Note || n.Name
        this.datatime = n.ValidTs ? moment(new Date(n.ValidTs*1000)) : moment().add(7, 'd')
        this.timeValue = n.ValidTs && moment(new Date(n.ValidTs*1000)).format('h:mm') || moment().endOf().format('YYYY-MM-DD 23:59:59')
        if (n.type === "ipStatus") {
          this.datatime = n.valid_ts ? moment(new Date(n.valid_ts*1000)) : ''
          this.timeValue = n.ts_version && moment(new Date(n.ts_version*1000)).format('h:mm')
        }
      },
      immediate: true
    }
  },
  methods:{
    //关闭按钮
    handleClose(){
      this.$emit("closeModel",false)
    },
    //确定按钮
    addSure(){
      if (this.ipAddress && this.ipAddress.trim()) {
        const param = {
          Version: '2018-01-25',
          Domain: this.ipInfo.Domain,
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
            this.$emit("closeModel", 'refresh')
          })
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
</style>