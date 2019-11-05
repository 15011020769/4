<template>
  <div class="newfunction">
    <div class="top-title">
      <i class="el-icon-back" @click="handleBack"></i>
      <span>新建函数</span>
    </div>
    <div class="contentBox">
      <div class="contentSlider">
        <div class="sliderOne">       
          <span  :class="['circle',step==1?'st1':'st2']">
            <span v-if='step==1' class="number">1</span>
            <span v-else :class="['el-icon-check','number']"></span>
          </span>
          <span :class="['slidetitle',step==1?'st7':'']">基础信息</span>
        </div>
        <div class="sliderCenter">
          <i class="el-icon-arrow-right"></i>
        </div>
        <div class="sliderTwo">
          <span :class="['circle',step==1?'st3':'st4']">
            <span :class="['number',step==1?'st5':'']">2</span>
          </span>
          <span :class="['slidetitle',step==1?'st6':'st8']">函数配置</span>
        </div>
      </div>
      <div v-if="step==1">
        <div :class="['formContent',order==1?'formContentFirst':'']">
          <el-form ref='primaryData' :model="primaryData" :hide-required-asterisk= 'true' :rules="rules" :label-position="labelPosition" label-width="90px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="创建方式" class="formStyle" prop='area'>
                  <span :class="['headtitle',order==1?'headtitlecheck':'']" @click="choose(1)">
                    <span >模板函数</span>
                    <span>使用示例代码模板创建函数</span>
                  </span>
                  <span :class="['headtitle',order==2?'headtitlecheck':'']" @click="choose(2)">
                    <span >模板函数</span>
                    <span>使用示例代码模板创建函数</span>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="函数名称" class="formStyle" prop='funcname'>
                  <el-input v-model="primaryData.funcname" placeholder="请输入函数名称" size="mini" style="width:200px;"></el-input>
                  <span style="color: #888;display:block;font-size:12px;">最长60个字符，字母开头，支持 a-z，A-Z，0-9，-，_，且需要以数字或字母结尾</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
              </el-col>
            </el-row>
            <div v-if="order==1">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="模板搜索" prop='copy' class="formStyle">
                    <el-select v-model="primaryData.search" placeholder="" size="mini">
                      <el-option
                        v-for="item in searchList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-input v-model="primaryData.searchmessage" suffix-icon="el-icon-search" placeholder="搜索模板" size="mini" style="width: 200px;margin-left: 10px;"></el-input>                
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
              </el-row>
              <div class="detailCotent">
                <ul style="overflow: hidden;">
                  <li v-for="(item,index) in process" :key="index" :class="['detailbox',checkNum==index?'detail-check':'']"   @click="checkDetail(index)" @mouseover="hoverDetail(index)" @mouseout="outDetail">
                    <span>{{item.chakan}}</span>
                    <span v-show="hoverStatus==index" class="seedetail">查看详情</span>
                    <div style="margin-top: 15px;">
                      <span class="detail-title">语言</span>
                      <span class="detail-message"><i class="el-icon-help">{{item.language}}</i></span>
                    </div>
                    <div style="margin-top: 15px;">
                      <span class="detail-title">描述</span>
                      <span class="detail-message">{{item.describe}}</span>
                    </div>
                    <div style="margin-top: 15px;">
                      <span class="detail-title">标签</span>
                      <span class="detail-message-tip">
                        <span v-for="(item,index) in process[index].tips" :key="index">
                          {{item.label}}
                        </span>
                      </span>
                    </div>
                    <div style="margin-top: 15px;">
                      <span class="detail-title">部署</span>
                      <span class="detail-message"><span>{{item.bushu}}</span>次</span>
                    </div>
                  </li>
                </ul>
                <div class="pages page-wrap wrap-end" style='margin:10px 20px 0 0;float: right;'>
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageInfo.pageNum"
                    :page-sizes="[6, 8, 12, 15]"
                    :page-size="pageInfo.pageSize"
                    layout="sizes, prev, pager, next, jumper"
                    :total="pageInfo.totalRecord">
                  </el-pagination>
                </div>
              </div>
            </div>
            <div v-if="order==2">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="运行环境" class="formStyle">
                    <el-select v-model="primaryData.environment" placeholder="" size="mini" style="width:120px;">
                      <el-option
                        v-for="item in environmentList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>               
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
        <div style="margin-top: 20px;">
          <el-button type="primary" size="mini" @click="nextStep">下一步</el-button>
        </div>
      </div>
      <funcdeploy v-if="step==2" v-on:deployClose="deployClose"></funcdeploy>
    </div>
  </div>
</template>
<script>
import funcdeploy from "./funcdeploy.vue";
export default {
  data() {
    return {
      rules: {
        funcname: [
          { required: true, message: '函数名称不能为空', trigger: 'blur' }
        ],
      },
      step: 1,
      primaryData: {
        area:'1',
        space: '1',  
        funcname: '', 
        search: '1',
        searchmessage: '',
        environment: ''
      },
      searchList: [{
        value: '1',
        label: '全部语言'
      }, {
        value: '2',
        label: 'pathon2.7'
      }, {
        value: '3',
        label: 'pathon3.6'
      }, {
        value: '4',
        label: 'Nodejs.6.10'
      }, {
        value: '5',
        label: 'Nodejs.8.9'
      }, {
        value: '6',
        label: 'Php.5.6'
      }, {
        value: '7',
        label: 'Nodejs.7.2'
      }, {
        value: '8',
        label: 'Java.8'
      }, {
        value: '9',
        label: 'Golang 1'
      }],
      space: [{
        value: '1',
        label: '广州'
      }],
      order: 1,
      process: [{
        chakan: 'helloWorld',
        language:'Python2.7', 
        describe: 'helloworld 空白模板函数',
        tips: [{
          value: "1",
          label: "dfgdds"
        }, {
          value: "2",
          label: "gglrg"
        }], 
        bushu: '12234'
      },{
        chakan: 'helloWorld',
        language:'Python2.7', 
        describe: 'helloworld 空白模板函数',
        tips: [{
          value: "1",
          label: "dfgdds"
        }, {
          value: "2",
          label: "gglrg"
        }], 
        bushu: '12234'
      },{
        chakan: 'helloWorld',
        language:'Python2.7', 
        describe: 'helloworld 空白模板函数',
        tips: [{
          value: "1",
          label: "dfgdds"
        }, {
          value: "2",
          label: "gglrg"
        }], 
        bushu: '12234'
      },{
        chakan: 'helloWorld',
        language:'Python2.7', 
        describe: 'helloworld 空白模板函数',
        tips: [{
          value: "1",
          label: "dfgdds"
        }, {
          value: "2",
          label: "gglrg"
        }], 
        bushu: '12234'
      },{
        chakan: 'helloWorld',
        language:'Python2.7', 
        describe: 'helloworld 空白模板函数',
        tips: [{
          value: "1",
          label: "dfgdds"
        }, {
          value: "2",
          label: "gglrg"
        }], 
        bushu: '12234'
      },{
        chakan: 'helloWorld',
        language:'Python2.7', 
        describe: 'helloworld 空白模板函数',
        tips: [{
          value: "1",
          label: "dfgdds"
        }, {
          value: "2",
          label: "gglrg"
        }], 
        bushu: '12234'
      }],
      checkNum: 0,
      hoverStatus:null,
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
        totalRecord: 10
      },
      environmentList: [{
        value: "1",
        label: "dfgdds"
      },{
        value: "1",
        label: "dfgdds"
      },{
        value: "1",
        label: "dfgdds"
      }]
    };
  },
  components: {
    funcdeploy
  },
  computed: {
  },
  methods: {
    handleBack() {
      this.$router.push('/scffuncServe');
    },
    choose(order) {
      this.order = order;
    },
    checkDetail(val) {
      this.checkNum = val;
    },
    hoverDetail(value) {
      this.hoverStatus = value;
    },
    outDetail() {
      this.hoverStatus = null;
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val;
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNum = val;
    },
    nextStep() {
      // this.$refs['primaryData'].validate((valid) => {
      //   if(valid) {
      //     this.step = 2;
      //   }else {
      //     return false;
      //   }
      // });
      this.step = 2;
    },
    deployClose() {
      this.step = 1;
    }
  },
};
</script>

<style scoped lang="scss">
  .top-title {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    background-color: #fff;
    font-weight: bolder;
  }

  .el-icon-back {
    font-size: 20px;
    margin-right: 30px;
    padding: 2px;
    color: #006eff;
  }
  .el-icon-back:hover {
    background: #eee;
  }
  .contentBox {
    margin: 20px;
    padding: 20px;
    background: #fff;
  }
  .contentSlider {
    border-bottom: 1px solid #ccc;
    padding-bottom: 20px;
  }
  .sliderOne {
    display: inline-block;
    position:relative;
  }
  .sliderCenter {
    position: absolute;
    display: inline-block;
  }
  .sliderTwo {
    display: inline-block;
    position: absolute;
    margin-left: 120px;
  }
  .circle {
    border-radius: 50%;    
    height: 25px;    
    width: 25px;    
    display: inline-block;    
    
    vertical-align: top;
  }
  .number {
    display: block;    
    color: #fff;    
    height: 25px;    
    line-height: 25px;    
    text-align: center;
    font-size: 12px;
    font-weight: bolder;
  }
  .el-icon-arrow-right {
    font-size: 24px;
    margin: 0 40px;
    color: #ddd;
  }
  .slidetitle {
    display: inline-block;
    margin-left: 20px;
    font-size: 12px;
  }
  .st1 {
    background: #006eff;
  }
  .st2 {
    border: 1px solid #006eff;
  }
  .st3 {
    border: 1px solid #ccc;
  }
  .st4 {
    background: #006eff;  
  }
  .st5 {
    color: #ccc;
  }
  .st6 {
    color: #ccc;
  }
  .st7 {
    font-weight: bolder;
  }
  .st8 {
    font-weight: bolder;
  }
  .el-icon-check {
    color: #006eff;
    font-weight: bolder;
  }
  .headtitle {
    display: inline-block;
    width: 200px;
    padding: 20px 10px 10px;
    border: 1px solid #ccc;    
    background: #fff;
  }
  .headtitlecheck {
    border: 1px solid #006eff; 
  }
  .headtitle:hover {
    border: 1px solid #006eff;
  }
  .headtitle span {
    display: block;
    height: 20px;
    line-height: 20px;
  }
  .headtitle span:nth-child(2) {
    color: #aaa;
  }
  .el-select {
    width: 100px;
  }
  .formContent {
    margin-top: 20px;
    
    border-bottom: 1px solid #e5e5e5;
  }
  .formContentFirst {
    padding-bottom: 80px;
  }
  .detailCotent {
    margin-left: 90px;
  }
  .detailbox {
    float: left;
    width: 27%;
    padding: 20px 20px 35px;
    border: 1px solid #ccc;
    margin-right: 15px;
    margin-bottom: 10px;
    font-size: 12px;
  }
  .detailbox:hover {
    background: #f2f2f2;
    cursor: pointer;
  }
  .detail-check {
    border:1px solid #006eff;
  }
  .detail-title {
    padding-right: 40px;
    font-size: 12px;
    color: #888;
  }
  .detail-message-tip span{
    padding:0 5px 5px;
    background: #e5e5e5;
    margin-right: 5px;
  }
  .detail-message-tip span:hover{
    background: #d9d9d9;
  }
  .seedetail {
    margin-left: 10px;
    color: #006eff;
  }
  .seedetail:hover {
    border-bottom: 1px solid #006eff;
  }
</style>
<style>
  .formStyle /deep/.el-form-item__label {
    font-size: 12px;
  }
  .formStyle /deep/.el-checkbox__label {
    font-size: 12px;
  }
</style>
