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
            <el-option
              v-for="item in dominOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button-group class="btnGroup">
            <el-button :class="thisType=='1'?'addBgColor':''" @click="choseDate(1)">近1小时</el-button>
            <el-button :class="thisType=='2'?'addBgColor':''" @click="choseDate(2)">近6小时</el-button>
            <el-button :class="thisType=='3'?'addBgColor':''" @click="choseDate(3)">今天</el-button>
            <el-button :class="thisType=='4'?'addBgColor':''" @click="choseDate(4)">昨天</el-button>
            <el-button :class="thisType=='5'?'addBgColor':''" @click="choseDate(5)">近7天</el-button>
          </el-button-group>
          <el-date-picker
            v-model="timeValue"
            type="datetimerange"
            class="dataTime"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
        <div class="newClear"> 
          <el-select class="shortSelect" v-model="riskLevelVlaue" placeholder="请选择">
            <el-option
              v-for="item in riskLevelOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="shortSelect" v-model="actionVlaue" placeholder="请选择">
            <el-option
              v-for="item in actionOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="shortSelect" v-model="attackVlaue" placeholder="请选择">
            <el-option
              v-for="item in attackOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input class="inputIpt" v-model="celueId" placeholder="输入策略ID"></el-input>
          <el-input class="inputIpt" v-model="attackIP" placeholder="输入攻击源IP"></el-input>
          <el-button class="selectBtn">查询</el-button>
          <i class="el-icon-download"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      dominList:'',//域名下拉
      dominOptions:[
        {
          label:'www.baidu.cn89',
          value:'www.baidu.cn89',
        },
        {
          label:'www.baidu.cn',
          value:'www.baidu.cn'
        }
      ],
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
      attackOption:[
        {
          label:'全部攻击类型',
          value:'全部攻击类型'
        },
        {
          label:'SQL注入攻击',
          value:'SQL注入攻击'
        },
        {
          label:'XSS攻击',
          value:'XSS攻击'
        },
        {
          label:'命令注入攻击',
          value:'命令注入攻击'
        },
        {
          label:'LDAP注入攻击',
          value:'LDAP注入攻击'
        },
        {
          label:'SSI注入攻击',
          value:'SSI注入攻击'
        },
        {
          label:'XML注入攻击',
          value:'XML注入攻击'
        },
        {
          label:'WEB服务器漏洞攻击',
          value:'WEB服务器漏洞攻击'
        },
        {
          label:'WEB应用漏洞攻击',
          value:'WEB应用漏洞攻击'
        },
        {
          label:'路径跨域攻击',
          value:'路径跨域攻击'
        },
        {
          label:'核心文件非法访问',
          value:'核心文件非法访问'
        },
        {
          label:'文件上传攻击',
          value:'文件上传攻击'
        },
        {
          label:'木马后门攻击',
          value:'木马后门攻击'
        },
        {
          label:'CSRF攻击',
          value:'CSRF攻击'
        },
        {
          label:'恶意扫描',
          value:'恶意扫描'
        },
        {
          label:'自定义策略',
          value:'自定义策略'
        },
        {
          label:'地域封禁拦截',
          value:'地域封禁拦截'
        },
        {
          label:'信息防泄漏替换',
          value:'信息防泄漏替换'
        },
        {
          label:'AI引擎检出',
          value:'AI引擎检出'
        },
        {
          label:'IP黑名单',
          value:'IP黑名单'
        },
        {
          label:'CC策略拦截',
          value:'CC策略拦截'
        },
        {
          label:'Bot拦截',
          value:'Bot拦截'
        },
      ],
      celueId:'',//策略ID
      attackIP:'',//攻击源IP
    }
  },
  methods:{
    //时间选择按钮
    choseDate(thisType){
      this.thisType=thisType;
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
</style>