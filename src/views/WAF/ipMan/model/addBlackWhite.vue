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
            <p>类别</p>
            <p>
              <el-radio-group v-model="blackWhiteCh" :disabled="ipInfo.type === 'ipStatus'">
                <el-radio :value="42" :label="42">黑名单</el-radio>
                <el-radio :value="40" :label="40">白名单</el-radio>
              </el-radio-group>
            </p>
          </div>
          <div class="newClear newList">
            <p>IP地址</p>
            <p>
              <el-input :disabled="ipInfo.type === 'ipStatus'" type="textarea" v-model="ipAddress" />
              <div class="err-tips" v-show="ipTest">IP格式输入有误</div>
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
                placeholder="选择日期">
              </el-date-picker>
              <el-time-select
                class="datatime"
                v-model="timeValue"
                :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }"
                placeholder="选择时间"
                >
              </el-time-select>
            </p>
          </div>
          <div class="newClear newList">
            <p>备注</p>
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
import { flatObj } from '@/utils'
import moment from 'moment'
export default {
  props:{
    isShow:{
      required:false,
      type:Boolean
    },
    ipInfo: {}
  },
  data(){
    return{
      blackWhiteCh: '42',//黑白名单
      ipAddress:'',//ip地址
      datatime:'',//选择日期
      timeValue:'',//选择时间
      des:'',//备注
      ipTest: false, // ip输入格式是否正确
    }
  },

  methods:{
    //关闭按钮
    handleClose(){
      this.$emit("closeModel",false)
    },
    //确定按钮
    addSure(){
      let valid_ts = moment(this.datatime).format('x')
      let timeArr = `${this.timeValue}`.split(':')
      const timeStamp = (timeArr[0] * 60 + timeArr[1]) * 60 * 1000
      valid_ts = Number(valid_ts) + Number(timeStamp)
      this.axios.post(UPSERTIP_ACCESS_CONTROL, ({
        Version: '2018-01-25',
        Domain: this.ipInfo.Domain,
        'Items.0': JSON.stringify({
          ip: this.ipAddress,
          action: this.blackWhiteCh,
          // valid_ts: this.ipInfo.ValidTs,
          source: this.blackWhiteCh,
          note: this.des,
          valid_ts: valid_ts / 1000
        }),
        Edition: 'clb-waf'
      })).then(data => {
        if (data.Response.Error) {
          let ErrOr = Object.assign(ErrorTips, COMMON_ERROR)
          this.$message({
            message: ErrOr[Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          })
        } else {
          this.$emit("closeModel", 'refresh')
        }
      })
    },
  },

  watch: {
    ipAddress(n) {
      let pattern = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
      this.ipTest = !pattern.test(n)
    },

    ipInfo(n) {
      this.ipAddress = n.Ip || n.ip
      this.blackWhiteCh = n.ActionType
      this.des = n.Note || n.name
      this.datatime = n.ValidTs ? moment(new Date(n.ValidTs*1000)) : ''
      this.timeValue = n.ValidTs && moment(new Date(n.ValidTs*1000)).format('h:mm')
      if (n.type === "ipStatus") {
        this.datatime = n.valid_ts ? moment(new Date(n.valid_ts*1000)) : ''
        this.timeValue = n.ts_version && moment(new Date(n.ts_version*1000)).format('h:mm')
      }
    }
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
  width:120px;
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