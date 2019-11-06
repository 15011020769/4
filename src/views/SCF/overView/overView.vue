<template>
  <div class="over-view">
    <div class="top-title">
      <span class="title-left">概览</span>
      <div class="title-right">
        <el-link href="" target="_blank">函数服务帮助文档<i class="el-icon-share"></i></el-link>
      </div>
    </div>
    <div class="box-content">
        <el-row class="grid-box" :model="info">
          <el-col :span="6">
            <div class="grid-content gird-contentFirst">
              <div class="funcNum">函数数量</div>
              <p style="height: 54px;">
                <el-tooltip class="item" effect="light" content="0" placement="right-end">
                  <span style="font-size: 35px;margin-right:3px;">{{info.numFunc}}</span>
                </el-tooltip>
                <span>个</span>
              </p>
              <div class="funcNumBottom">
                <span>异常函数</span>
                <span style="padding: 0 2px;">{{infoShow.numFunc}}</span>
                <span>个</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
              <div class="grid-content">
                <div class="funcNum">本月调用数</div>
                <p style="height: 54px;">
                  <el-tooltip class="item" effect="light" content="0" placement="right-end">
                    <span style="font-size: 35px;margin-right:3px;">{{info.numCall}}</span>
                  </el-tooltip>
                  <span>次</span>
                </p>
                <div class="funcNumBottom">
                  <span>昨日调用数</span>
                  <span style="padding: 0 2px;">{{infoShow.numCall}}</span>
                  <span>次</span>
                </div>
              </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <div class="funcNum">本月资源量</div>
              <p style="height: 54px;">
                <el-tooltip class="item" effect="light" content="0" placement="right-end">
                  <span style="font-size: 35px;margin-right:3px;">{{info.numSource}}</span>
                </el-tooltip>
                <span>GBs</span>
              </p>
              <div class="funcNumBottom">
                <span>昨日资源量</span>
                <span style="padding: 0 2px;">{{infoShow.numSource}}</span>
                <span>GBs</span>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content gird-contentlast">
              <div class="funcNum">本月出流数</div>
              <p style="height: 54px;">
                <el-tooltip class="item" effect="light" content="0" placement="right-end">
                  <span style="font-size: 35px;margin-right:3px;">{{info.numOutflow}}</span>
                </el-tooltip>
                <span>GB</span>
              </p>
              <div class="funcNumBottom">
                <span>昨日出流量</span>
                <span style="padding: 0 2px;">{{infoShow.numOutflow}}</span>
                <span>GB</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="user-count">
        <h3 class="count-title">使用统计</h3>
        <el-row class="count-menu">
          <el-col :span="6">
            <div>
              <template>
                <el-select v-model="value" placeholder="">
                  <el-option
                  v-for="item in addressList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </div>
          </el-col>
          <el-col :span="18">
            <div>
              <el-button-group>
                <el-button>实时</el-button>
                <el-button>近24小时</el-button>
                <el-button class="showSeveDay">近7天</el-button>
                <el-date-picker class="newDate"
                  v-model="value1"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-button-group>
              <span style="padding: 0 5px 0 20px;font-size: 12px;">粒度</span>
              <el-select v-model="value" placeholder="">
                <el-option
                v-for="item in timeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
        </el-row>
      </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      info: {
        numFunc: 0,
        numCall: 0,
        numSource: 0,
        numOutflow: 0
      },
      infoShow: {
        numFunc: 0,
        numCall: 0,
        numSource: 0,
        numOutflow: 0
      },
      addressList: [{
        value: '1',
        label: '广州'
      }, {
        value: '2',
        label: '上海'
      }, {
        value: '3',
        label: '香港'
      }, {
        value: '4',
        label: '北京'
      }, {
        value: '5',
        label: '成都'
      }],
      value: '1',
      value1: ['', ''],
      timeList: [{
        value: '1',
        label: '1分钟'
      }, {
        value: '2',
        label: '5分钟'
      }, {
        value: '3',
        label: '1小时'
      }, {
        value: '4',
        label: '1天'
      }]
    }
  },
  computed: {
  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
  .box-content {
    margin: 20px;
    background: #fff;
  }
  .user-count {
    margin: 0 20px;
    background: #fff;
  }
  .top-title {
    height: 50px;
    width: 100%;
    background-color: #fff;
  }
  .title-left {
    float: left;
    padding: 15px 20px;
    font-weight: bolder;
    font-size: 16px;
  }
  .title-right {
    float: right;
    padding-right: 20px;
    padding-top: 15px;
    font-size: 12px;
  }
  .grid-box {
    padding: 20px;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
    border-radius: 4px;
  }
  .grid-content {
    padding: 0 20px;
    border-right: 1px solid #ccc;
  }
  .gird-contentFirst {
    padding: 0;
  }
  .gird-contentlast {
    border-right: none;
  }
  .funcNum {
    margin-bottom: 15px;
    font-size: 12px;
    font-weight: bold;
  }
  .funcNumBottom {
    font-size: 12px;
  }
  .user-count {
    padding: 20px;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
    border-radius: 4px;
  }
  .count-title {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    font-weight: bolder;
  }
  .count-menu {
    margin-top: 20px;
  }
  .el-select {
    width: 120px;
  }
  .newDate{
    margin-left:10px;
  }
  .showSeveDay{
    border-radius: 0 4px 4px 0!important;
  }
</style>
