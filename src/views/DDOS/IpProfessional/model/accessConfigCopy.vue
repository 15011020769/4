<template>
<!-- 接入配置-复制 添加转发规则 -->
  <div>
    <div>
      <el-dialog class="dialogModel" :title="$t('DDOS.AccesstoCon.addAcc')" :visible.sync="getIsShow" width="30%"
        :before-close="handleClose">
        <div class="createRulesForm">
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.AccesstoCon.businessDoma')}}</span>
            <span class="ruleListIpt">
              <el-input v-model="EnidData.RuleName"></el-input>
              <p>{{$t('DDOS.accessCopy.accessCopyTitle')}}</p>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.accessCopy.ForwardingPro')}}</span>
            <span class="ruleListIpt">
              <el-select
                class="forwardHttp"
                v-model="EnidData.Protocol"
              >
                <el-option
                  v-for="(item, index) in protocolList"
                  :label="item.pro"
                  :value="item.pro"
                  :key="index"
                ></el-option>
              </el-select>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.accessCopy.ForwardingExcit')}}</span>
            <span class="ruleListIpt">
              <el-input v-model="EnidData.VirtualPort"></el-input>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">源站端口</span>
            <span class="ruleListIpt">
              <el-input v-model="EnidData.SourcePort"></el-input>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">回源方式</span>
            <span class="ruleListIpt">
              <el-button-group>
                <el-button class="BackResouse" @click="BackResouse(2)"
                  :style="EnidData.SourceType==2?'color:#006eff;border:1px solid #006eff':''">IP回源</el-button>
                <el-button class="BackResouse" @click="BackResouse(1)"
                  :style="EnidData.SourceType==1?'color:#006eff;border:1px solid #006eff':''">域名回源</el-button>
              </el-button-group>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{$t('DDOS.AccesstoCon.LoadBalancing')}}</span>
            <span class="ruleListIpt">
              <el-button class="BackResouse" :style="EnidData.LbType==1?'color:#006eff;border:1px solid #006eff':''">
                {{$t('DDOS.accessCopy.WeightedPoll')}}</el-button>
            </span>
          </div>
          <div class="ruleList newClear">
            <span class="ruleListLabel">{{EnidData.SourceType==1?'源站域名':$t('DDOS.accessCopy.SourceIp')}}</span>
            <span class="ruleListIpt">
              <el-input type="textarea" class="resoureStation" v-model="textData" @input="textDataChange" />
              <p>{{EnidData.SourceType==1?$t('DDOS.accessCopy.domainTitle'):$t('DDOS.accessCopy.SoutceTitle')}}</p>
            </span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="copySure">{{$t('DDOS.accessCopy.domainSure')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { L4RULES_CREATE } from '@/constants';
import { ErrorTips } from "@/components/ErrorTips";

export default {
  //子页面调用L4转发规则的方法
  inject: ['describleL4Rules'],
  props: {
    isShow4: Boolean,
    resourceId: String,
  },
  data() {
    return {
      dialogVisible: '', //弹框状态
      protocolList: [{pro: 'TCP'}, {pro: 'UDP'}],
      EnidData: '', //获取某一条数据
      textData: '',
      checkflg: true, //textData是否通过校验
    }
  },
  computed: {
    getIsShow() {
      this.dialogVisible = this.isShow4
      return this.isShow4
    },
    getResourceId() {
      return this.resourceId
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
      this.$emit("closeCopyModel", this.dialogVisible)
    },
    init(scopeRow) {
      this.textData = '';
      if (scopeRow.SourceType == 1) { //域名
        for (let i = 0; i < scopeRow.SourceList.length; i++) {
          this.textData = this.textData.concat(scopeRow.SourceList[i].Source + '\n')
        }
      } else if (scopeRow.SourceType == 2) { //IP
        for (let i = 0; i < scopeRow.SourceList.length; i++) {
          this.textData = this.textData.concat(scopeRow.SourceList[i].Source + '\ ' + scopeRow.SourceList[i].Weight + '\n')
        }
      }
      this.EnidData = JSON.parse(JSON.stringify(scopeRow));
      this.EnidData.SourceType = 2;
    },
    // 1.1复制确定按钮
    copySure() {
      let params = {
        Version: '2018-07-09',
        Region: localStorage.getItem("regionv2"),
        Business: 'net',
        Id: this.getResourceId,
        'Rules.0.RuleName': this.EnidData.RuleName,
        'Rules.0.Protocol': this.EnidData.Protocol,
        'Rules.0.VirtualPort': this.EnidData.VirtualPort,
        'Rules.0.SourcePort': this.EnidData.SourcePort,
        'Rules.0.SourceType': this.EnidData.SourceType,
        'Rules.0.LbType': this.EnidData.LbType,
        'Rules.0.KeepTime': this.EnidData.KeepTime,
        'Rules.0.KeepEnable': this.EnidData.KeepEnable,
      }

      let arr = this.textData.split(/[\s\n]/);
      if (this.EnidData.SourceType == 1) { //域名
        for (let i = 0; i < arr.length; i++) {
          params['Rules.0.SourceList.' + i + '.Source'] = arr[i];
          params['Rules.0.SourceList.' + i + '.Weight'] = 0;
        }
      } else if (this.EnidData.SourceType == 2) { //IP
        for (let i = 0; i < arr.length/2; i++) {
          params['Rules.0.SourceList.' + i + '.Source'] = arr[i*2];
          params['Rules.0.SourceList.' + i + '.Weight'] = arr[i*2+1];
        }
      }
      this.axios.post(L4RULES_CREATE, params).then(res => {
        // console.log(params)
        if (res.Response.Error === undefined) {
          this.$message({
            showClose: true,
            message: '复制成功',
            type: 'success'
          });
          this.dialogVisible = false;
          this.$emit("closeCopyModel", this.dialogVisible)
          this.describleL4Rules();
        } else {
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      })
    },
    //回源方式点击按钮
    BackResouse(thisType) {
      this.EnidData.SourceType = thisType;
      if(thisType=="2"){
        this.protocolList = [{pro: 'TCP'}, {pro: 'UDP'}];
      }else if(thisType=="1"){
        this.EnidData.Protocol = 'TCP';
        this.protocolList = [{pro: 'TCP'}];
      }
    },
    //值改变调用校验方法
    textDataChange() {
      let arr = this.textData.split(/[\s\n]/);
      var regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      var regNUM = /(^[1-9]\d*$)/;

      // console.log(arr)
      if(this.EnidData.SourceType=="2"){//IP回源
        for(let i=0; i<arr.length/2; i++) {
          if(!regIP.test(arr[i*2]) || !regNUM.test(arr[i*2 + 1])) {
            this.checkflg = false;
          }
        }
      }else if(this.EnidData.SourceType=="1"){//域名回源
        // for(let i=0; i<arr.length; i++) {
        //   params['Rules.0.SourceList.'+i+'.Source'] = arr[i]
        // }
      }

    }
  }
}

</script>
