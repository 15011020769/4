<template>
  <div>
    <div class="basicinfo">
      <h1 class="newClear">鉴权配置<a @click="editSet">编辑</a></h1>
      <div class="newClear">
        <div class="newClear newList">
          <p>推流鉴权</p>
          <p>开启</p>
        </div>
        <div class="newClear newList">
          <p>主KEY</p>
          <p>f5ad1c36d3cb7d48fe43e72d5dc028c4</p>
        </div>
        <div class="newClear newList">
          <p>备KEY</p>
          <p></p>
        </div>
      </div>
      <editSet :isShow="editSetModel" @closeModel="closeModel"/>
    </div>
    <div class="basicinfo">
      <h1 class="newClear">推流地址生成器</h1>
      <div class="bgGray">
        <div class="newClear newList1">
          <p>推流防盗链Key <i class="el-icon-info"></i></p>
          <p>f5ad1c36d3cb7d48fe43e72d5dc028c4</p>
        </div>
        <div class="newClear newList1">
          <p>推流回调地址</p>
          <p>--</p>
        </div>
        <div class="newClear newList1">
          <p>推流域名</p>
          <p>68922.livepush.myqcloud.com</p>
        </div>
      </div>
      <div class="dateOut">
        <span class="spanBlod">过期时间</span>
        <el-date-picker class="dataDateTime"
          v-model="dataDateTime"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
        <el-time-picker
          v-model="dateValue" class="dateValue"
          :picker-options="{
            selectableRange: '18:30:00 - 20:30:00'
          }"
          placeholder="任意时间点">
        </el-time-picker>
        <span class="spanBlod">StreamName </span>
        <el-input placeholder="仅支持英文字母、数字和符号" v-model="streamName" class="streamName"></el-input>
        <el-button>生成堆流地址</el-button>
      </div>
      <div class="newClear ">
        <span class="leftCon">推流地址</span>
        <span class="rightCon"><i class="el-icon-info"></i>尚无推流地址，请点击【生成推流地址】</span>
      </div>
    </div>
    <div class="basicinfo">
      <h1 class="newClear">推流地址示例代码</h1>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="php" name="first">
          <div class="greyContent">

          </div>
        </el-tab-pane>
        <el-tab-pane label="Java" name="second">
          <div class="greyContent">

          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import editSet from '../model/editSet'
export default {
  data(){
    return{
      editSetModel:false,//编辑弹框
      dataDateTime:'',//过期时间月份
      dateValue:new Date(2016, 9, 10, 18, 40),//时间
      streamName:'',//streamName
      activeName:'first',//tab
    }
  },
  components:{
    editSet:editSet
  },
  methods:{
    //编辑
    editSet(){
      this.editSetModel=true;
    },
    //关闭
    closeModel(isShow){
      this.editSetModel=isShow;
    },
    //tab
    handleClick(){
      
    }
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  display:block;
  content:'';
  clear:both;
}
::v-deep input{
  height:30px;
  border-radius: 0;
  width:100%;
}
::v-deep button{
  height: 30px;
  padding:0 20px;
  line-height: 30px;
  color:#fff;
  background-color:#006eff;
  border-radius: 0;
  border:1px solid #006eff;
}
.bgGray{
  background-color:#f2f2f2;
  width:100%;
  padding:20px;
  margin-bottom:20px;
  .newList1{
    margin-bottom:30px;
    p:nth-child(1){
      font-size:12px;
      color:#999;
      float:left;
      width:120px;
    }
    p:nth-child(2){
      font-size:12px;
      color:#000;
      float:left;
      width:calc(100% - 120px);
    }
  }
}
.basicinfo{
  width:100%;
  min-height:100px;
  background-color:#fff;
  border:1px solid #ddd;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  padding: 20px;
  margin-bottom:20px;
  h1{
    font-size:14px;
    font-weight: 600;
    color:#000;
    margin-bottom:30px;
    a{
      float:right;
      font-size:12px;
      font-weight: 100;
    }
  }
  .newList{
    margin-bottom:30px;
    p:nth-child(1){
      font-size:12px;
      color:#999;
      float:left;
      width:70px;
    }
    p:nth-child(2){
      font-size:12px;
      color:#000;
      float:left;
      width:calc(100% - 70px);
    }
  }
}
.dateOut{
  padding-bottom:20px;
  border-bottom:1px solid #ddd;
  margin-bottom:20px;
  .spanBlod{
    font-size: 12px;
    color: #888;
    font-weight: 600;
  }
}
.dataDateTime{
  width:110px;
  margin:0 20px 0 12px;
  font-size:12px;
  ::v-deep .el-input__icon{
    line-height: 34px;
  }
}
.dateValue{
  width:100px;
  margin-right:20px;
}
.streamName{
  width:200px;
  margin:0 30px 0 0;
  font-size:12px;
}
.leftCon{
  display:inline-block;
  width:70px;
  font-size: 12px;
  color:#999;
}
.rightCon{
  display:inline-block;
  width:calc(100% - 70px);
  font-size: 12px;
  color:#999;
}
.greyContent{
  width:100%;
  height:285px;
  overflow-y: auto;
  background-color:#f5f2f0;
  border-radius: 4px;
}
</style>