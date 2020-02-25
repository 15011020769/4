<template>
  <div>
    <div class="wrapper">
      <div class="topDateIpt">
        <div class="newClear listTop">
          <el-select
            v-model="dominList"
            filterable
            allow-create
            class="dominList"
            default-first-option>
            <el-option value="all">ALL</el-option>
            <el-option
              v-for="item in dominOptions"
              :key="item.DomainId"
              :label="item.Domain"
              :value="item.DomainId">
            </el-option>
          </el-select>
          <el-button-group class="btnGroup">
            <el-button :class="thisType=='1'?'addBgColor':''" @click="choseDate(1)">近1小{{t('时', 'WAF.hour')}}</el-button>
            <el-button :class="thisType=='2'?'addBgColor':''" @click="choseDate(2)">近6小{{t('时', 'WAF.hour')}}</el-button>
            <el-button :class="thisType=='3'?'addBgColor':''" @click="choseDate(3)">今天</el-button>
            <el-button :class="thisType=='4'?'addBgColor':''" @click="choseDate(4)">昨天</el-button>
            <el-button :class="thisType=='5'?'addBgColor':''" @click="choseDate(5)">近7天</el-button>
          </el-button-group>
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            class="dataTime"
            range-separator="至"
            :start-placeholder="t('开始日期', 'WAF.ksrq')"
            :end-placeholder="t('结束日期', 'WAF.jsrq')">
          </el-date-picker>
        </div>
        <div class="newClear"> 
          <el-select class="shortSelect" v-model="riskLevelVlaue" placeholder="请选择">
            <el-option>{{t('全部风险等级', 'WAF.qbfxdj')}}</el-option>
            <el-option
              v-for="item in riskLevelOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="shortSelect" v-model="actionVlaue" placeholder="请选择">
            <el-option>{{t('全部执行动作', 'WAF.qbzxdz')}}</el-option>
            <el-option
              v-for="item in actionOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="shortSelect" v-model="attackVlaue" placeholder="请选择">
            <el-option>{{t('全部攻击类型', 'WAF.qbgjlx')}}</el-option>
            <el-option
              v-for="item in attackOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input class="inputIpt" v-model="celueId" :placeholder="t('输入策略ID', 'WAF.srclid')"></el-input>
          <el-input class="inputIpt" v-model="attackIP" :placeholder="t('输入攻击源IP', 'WAF.srgjyip')"></el-input>
          <el-button class="selectBtn" @click="queryLogs">{{t('查询', 'WAF.js')}}</el-button>
          <i class="el-icon-download" @click="createDownTask"></i>
        </div>
      </div>
      <div class="tableCon">
        <div class="topSet newClear">
          <i class="el-icon-setting"></i>
        </div>
        <div class="tableMian">
          <el-table :data="tableDataBegin" :empty-text="t('暂无数据', 'WAF.zwsj')">
            <el-table-column prop="num" :label="t('序号', 'WAF.xh')" width=""></el-table-column>
            <el-table-column prop="attackUrl" :label="t('被攻击网址', 'WAF.bgjwz')" width=""></el-table-column>
            <el-table-column prop="AttackIP" :label="t('攻击源IP', 'WAF.gjyip')"></el-table-column>
            <el-table-column prop="attackType" :label="t('攻击类型', 'WAF.gjlx')"></el-table-column>
            <el-table-column prop="methedId" label="策略ID"></el-table-column>
            <el-table-column prop="methedName" :label="t('策略名称', 'WAF.clmc')"></el-table-column>
            <el-table-column prop="attackCon" :label="t('攻击内容', 'WAF.gjlr')"></el-table-column>
            <el-table-column prop="attackTime" :label="t('攻击时间', 'WAF.gjsj')"></el-table-column>
            <el-table-column prop="actionRun" :label="t('执行动作', 'WAF.zxdz')"></el-table-column>
            <el-table-column prop="gardenW" :label="t('风险等级', 'WAF.fxdj')"></el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="">
                <el-button type="text" size="small">{{t('详情', 'WAF.xq')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <createDownTaskModel :isShow="createDownTaskModel" @closeCreateTaskModel="closeCreateTaskModel"/>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import createDownTaskModel from '../model/createDownTaskModel'
import { ATTACK_TYPE } from '../../constants'
import { DESCRIBE_HOSTS, DESCRIBE_ACCESS_LOGS } from '@/constants'

export default {
  data(){
    return{
      dominList:'',//域名下拉
      dominOptions:[],
      thisType:'1',//默认时间选择
      timeValue:'',//时间选择
      riskLevelVlaue:'',//风险等级
      riskLevelOption:[
        {
          label:'全部风险等级',
          value:'全部风险等级'
        },
        {
          label:'高危',
          value:'高危'
        },
        {
          label:'中危',
          value:'中危'
        },
        {
          label:'低危',
          value:'低危'
        }
      ],
      actionVlaue:'',//执行动作
      actionOption:[
        {
          label:'全部执行动作',
          value:'全部执行动作'
        },
        {
          label:'观察',
          value:'观察'
        },
        {
          label:'拦截',
          value:'拦截'
        }
      ],
      attackVlaue:'',//注入攻击类型
      attackOption:ATTACK_TYPE,
      celueId:'',//策略ID
      attackIP:'',//攻击源IP
      tableDataBegin:[],
      createDownTaskModel:false,//创建下载任务弹框
      Context: '',
    }
  },
  components:{
    createDownTaskModel,
  },
  mounted() {
    this.queryLogs()
    this.axios.post(DESCRIBE_HOSTS, {
      Version: '2018-01-25',
    }).then(resp => {
      this.generalRespHandler(resp, ({ HostList }) => {
        this.dominOptions = HostList
      })
    })
  },
  methods:{
    queryLogs() {
      const { Context } = this
      this.axios.post(DESCRIBE_ACCESS_LOGS, {
        Version: '2018-01-25',
        Count: 20,
        FromTime: '2020-02-20 00:00:00',
        ToTime: '2020-02-20 23:59:59',
        Context, 
      }).then(resp => {
        console.log(resp)
        // this.generalRespHandler(resp, ({ HostList }) => {
        //   this.dominOptions = HostList
        // })
      })
    },
    //时间选择按钮
    choseDate(thisType){
      this.thisType=thisType;
      var ipt1 = document.querySelector(".dataTime input:nth-child(2)");
      var ipt2 = document.querySelector(".dataTime input:nth-child(4)");
      const end = new Date();
      const start = new Date();
      if (thisType == "1") {
        start.setTime(start.getTime() - 3600 * 1000);
      } else if (thisType == "2") {
        start.setTime(start.getTime() - 3600 * 1000 * 6);
      } else if (thisType == "3") {
        start.setTime(start.getTime() - 3600 * 1000 * 24);
      }else if (thisType == "4") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
        end.setTime(end.getTime() - 3600 * 1000 * 24);
      }else if (thisType == "5") {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      }
      ipt1.value = moment(start).format("YYYY-MM-DD HH:mm:ss");
      ipt2.value = moment(end).format("YYYY-MM-DD HH:mm:ss");
      this.startTime = moment(start).format("YYYY-MM-DD HH:mm:ss");
      this.endTime = moment(end).format("YYYY-MM-DD HH:mm:ss");
    },
    //创建下载任务
    createDownTask(){
      this.createDownTaskModel=true;
    },
    //关闭下载任务弹框
    closeCreateTaskModel(isShow){
      this.createDownTaskModel=false;
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  content:'';
  clear:both;
  display:block;
}
::v-deep input{
  height:30px;
  line-height:30px;
  border-radius: 0;
}
::v-deep button{
  height:30px;
  line-height:30px;
  padding:0 20px;
  border-radius: 0;
}
.wrapper{
  width:100%;
}
.topDateIpt{
  width:100%;
  height:120px;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  padding:20px;
  border:1px solid #ddd;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  .listTop{
    margin-bottom:20px;
  }
}
.dominList{
  float:left;
  margin-right:10px;
}
.addBgColor{
  color:#fff;
  background-color:#006eff;
}
.btnGroup{
  float:left;
}
.dataTime{
  height:30px;
  line-height: 30px;
  border-radius: 0;
  float:left;
  margin-left:10px;
  ::v-deep .el-input__icon{
    line-height: 26px;
  }
  ::v-deep .el-range-separator{
    line-height: 26px;
    width:7%;
  }
}
.shortSelect{
  width:120px;
  font-size:12px;
  margin-right:10px;
  ::v-deep input{
    font-size:12px;
  }
}
.inputIpt{
  width:178px;
  margin-right:10px;
}
::v-deep button.selectBtn{
  background-color:#006eff;
  color:#fff;
}
.el-icon-download{
  float:right;
  font-size:20px;
}
.tableCon{
  width:100%;
  min-height:200px;
  background-color:#fff;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  padding: 20px 0;
  margin:20px 0;
  border:1px solid #ddd;
}
.topSet{
  text-align:right;
  padding-bottom:20px;
  padding-right:20px;
  border-bottom:1px solid #ddd;
  .el-icon-setting{
    font-size:18px;
    float:right;
  }
}
.tableMian{
  min-height: 450px;
}
</style>