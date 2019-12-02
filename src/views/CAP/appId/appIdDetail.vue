<template>
  <div>
    <div class="appIdTit">
      <div class="topTit newClear">
        <span>
          <i class="el-icon-back" @click="returnBack"></i>验证码-详情
        </span>
        <span>
          <a href="#">
            验证码服务使用帮助
            <i class="el-icon-share"></i>
          </a>
        </span>
      </div>
      <div class="appIdListCon">
        <el-tabs class="allTabs" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="验证数据" name="first">
            <div class="allConListMain">
              <div class="allConList allConListOne">
                <el-row>
                  <el-col :span="4">
                    <div class="modelList">
                      <p>昨日恶意占比</p>
                      <p>---</p>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="modelList">
                      <p>昨日请求量</p>
                      <p>---</p>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="modelList">
                      <p>昨日验证量</p>
                      <p>---</p>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="modelList">
                      <p>昨日通过量</p>
                      <p>---</p>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="modelList">
                      <p>昨日恶意拦截量</p>
                      <p>---</p>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="modelList">
                      <p>昨日票据校验量</p>
                      <p>---</p>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div class="allConList allConListTwo">
                <div class="allConListTit newClear">
                  <div class="allConListTitLeft">验证通过与拦截</div>
                  <div class="allConListTitRight">
                    <div class="block">
                      <el-date-picker
                        v-model="value1"
                        type="daterange"
                        align="right"
                        unlink-panels
                        @change="changeTime1"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions1"
                      ></el-date-picker>
                    </div>
                  </div>
                </div>
                <div id="echartsShow1"></div>
              </div>
              <div class="allConList allConListThree">
                <div class="allConListTit newClear">
                  <div class="allConListTitLeft">拦截情况 (%)</div>
                  <div class="allConListTitRight">
                    <div class="block">
                      <el-date-picker
                        v-model="value2"
                        type="daterange"
                        align="right"
                        unlink-panels
                        @change="changeTime2"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions2"
                      ></el-date-picker>
                    </div>
                  </div>
                </div>
                <div id="echartsShow2"></div>
              </div>
              <div class="allConList allConListFour">
                <div class="allConListTit newClear">
                  <div class="allConListTitLeft">验证码加载耗时 (秒)</div>
                  <div class="allConListTitRight">
                    <div class="block">
                      <el-date-picker
                        v-model="value3"
                        type="daterange"
                        align="right"
                        unlink-panels
                        @change="changeTime3"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions3"
                      ></el-date-picker>
                    </div>
                  </div>
                </div>
                <div id="echartsShow3"></div>
              </div>
              <div class="allConList allConListFive">
                <div class="allConListTit newClear">
                  <div class="allConListTitLeft">一次通过平均尝试次数 (次)</div>
                  <div class="allConListTitRight">
                    <div class="block">
                      <el-date-picker
                        v-model="value4"
                        type="daterange"
                        align="right"
                        unlink-panels
                        @change="changeTime4"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions4"
                      ></el-date-picker>
                    </div>
                  </div>
                </div>
                <div id="echartsShow4"></div>
              </div>
              <div class="allConList allConListSix">
                <div class="allConListTit newClear">
                  <div class="allConListTitLeft">一次通过尝试次数分布</div>
                  <div class="allConListTitRight">
                    <div class="block">
                      <el-date-picker
                        v-model="value5"
                        type="daterange"
                        align="right"
                        unlink-panels
                        @change="changeTime5"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions5"
                      ></el-date-picker>
                    </div>
                  </div>
                </div>
                <div id="echartsShow5"></div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="外观配置" name="second">
            <div class="allConListMain">
              <div class="outLookSet">
                <p class="outLookSetTit">基础外观<span>(修改验证码主题色、语言等，让验证码与你的网站更加融洽)</span></p>
                <div class="outLookSetCon newClear">
                  <div class="outLookSetConLeft">
                    <el-form :model="changeColor" label-width="130px">
                      <el-form-item label="主题色" class="labelLeft">
                        <p class="newClear">
                          <span class="demonstration">{{changeColor.color1}}</span>
                          <el-color-picker  class="demonstration" v-model="changeColor.color1"></el-color-picker>
                          <el-button  class="demonstration" @click="changeColor.color1='#409EFF'" type="primary">重置</el-button>
                        </p>
                        <p class="tipContent">最大支持1000个英文字母、数字、空格、逗号、句号、中文</p>
                      </el-form-item>
                      <el-form-item label="默认语言" class="labelLeft">
                        <el-select v-model="changeColor.langu" class="decsIptSelect" readonly="readonly"  placeholder="简体验证码">
                          <el-option label="自适应" value="value1"></el-option>
                          <el-option label="简体验证码" value="value2"></el-option>
                          <el-option label="繁体验证码" value="value3"></el-option>
                          <el-option label="英文验证码" value="value4"></el-option>
                        </el-select>
                        <p class="tipContent">验证码提示文案的语言，目前VTT类型只支持简体中文</p>
                      </el-form-item>
                    </el-form>
                    <el-button type="primary" @click="saveNow">立即保存</el-button>
                  </div>
                  <div class="outLookSetConRight">

                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="安全配置" name="third">
            <div class="allConListMain"></div>
          </el-tab-pane>
          <el-tab-pane label="基础配置" name="fouth">
            <div class="allConListMain"></div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      activeName: "first",
      pickerOptions1: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近15天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pickerOptions2: {
        shortcuts: [
          {
            text: "近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近15天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pickerOptions3: {
        shortcuts: [
          {
            text: "近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近15天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pickerOptions4: {
        shortcuts: [
          {
            text: "近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近15天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      pickerOptions5: {
        shortcuts: [
          {
            text: "近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近15天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "近30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value1: "",
      value2: "",
      value3: "",
      value4: "",
      value5: "",
      chart: "",
      changeColor:{
        color1:"#409EFF",
        langu:""
      }
    };
  },
  mounted(){
    this.initChart("echartsShow1");
    this.initChart("echartsShow2");
    this.initChart("echartsShow3");
    this.initChart("echartsShow4");
    this.initChart("echartsShow5");
  },
  methods: {
    handleClick(tab, event) {
      //console.log(tab, event);
    },
    returnBack() {
      this.$router.push({
        path: "/appId"
      });
    },
    //选择时间 1
    changeTime1() {
      console.log(this.value1);
    },
    changeTime2() {
      console.log(this.value2);
    },
    changeTime3() {
      console.log(this.value3);
    },
    changeTime4() {
      console.log(this.value4);
    },
    changeTime5() {
      console.log(this.value5);
    },
    initChart(chartId) {
      this.chart = echarts.init(document.getElementById(chartId));
      // 把配置和数据放这里
      this.chart.setOption({
          color: ['#3398DB'],
          tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' 
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis: [{
              type: 'category',
              data: ['1', '2', '3', '4', '5', '6', '7'],
              axisTick: {
                  alignWithLabel: true
              }
          }],
          yAxis: [{
              type: 'value'
          }],
          series: [{
              name: '直接访问',
              type: 'line',
              barWidth: '60%',
              data: [50, 100, 120, 200, 300, 60, 70]
          }]
      })
    },
    saveNow(){}
  }
};
</script>
<style lang="scss">
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
.appIdTit {
  width: 100%;
  padding: 20px 20px 0;
  background-color: #fff;
  height: 90px;
  .topTit {
    span:nth-child(1) {
      float: left;
      font-size: 16px;
      font-weight: 600;
    }
    span:nth-child(2) {
      float: right;
    }
  }
}
.el-icon-back {
  margin-right: 12px;
}
.allTabs {
  margin-top: 13px;
  .allConListMain {
    padding: 8px 0;
    .allConList {
      background-color: #fff;
      -webkit-box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      margin-bottom: 20px;
    }
    .allConListOne {
      height: 136px;
      .modelList {
        padding: 32px;
        p:nth-child(1) {
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 30px;
        }
        p:nth-child(2) {
          font-weight: 100;
          font-size: 26px;
        }
      }
    }
    .allConListTwo,
    .allConListThree,
    .allConListFour,
    .allConListFive,
    .allConListSix {
      height: 500px;
      padding: 20px;
      .allConListTit {
        .allConListTitLeft {
          float: left;
          font-size: 14px;
          color: #515a6e;
        }
        .allConListTitRight {
          float: right;
        }
      }
    }
  }
}
#echartsShow1,#echartsShow2,#echartsShow3,#echartsShow4,#echartsShow5{
  width:100%;
  height:400px;
}
.outLookSet{
  width:100%;
  height:428px;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  padding:20px;
  .outLookSetTit{
    font-size:14px;
    font-weight: 600;
    span{
      font-size:12px;
      color:#888;
      font-weight: 100;
    }
  }
}
.outLookSetCon{
  height:100%;
  width:100%;
  .outLookSetConLeft{
    float:left;
    width:50%;
    border-right:1px solid #eaeaea;
    height:92%;
    padding:66px 150px 0;
    .labelLeft label{
      text-align:left;
    }
    .demonstration{
      float:left;
      margin-right:10px;
    }
    .tipContent{
      font-size:12px;
    }
  }
  .outLookSetConRight{
    float:right;
    width:50%;
    height:92%;
  }
}

</style>