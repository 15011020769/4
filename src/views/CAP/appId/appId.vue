<template>
  <div>
    <div class="topOverView">
      <span>概览</span>
      <span>
        <a href="#">函数服务帮助文档</a>
      </span>
    </div>
    <div class="mainContainer">
      <div class="contentTop">
        <el-row>
          <el-col :span="6">
            <div class="modelList">
              <p>函数数量</p>
              <p>
                <span>{{topList.number}}</span>
                <span>个</span>
              </p>
              <p>异常函数{{topList.thirdNum}}个</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="modelList">
              <p>本月调用数</p>
              <p>
                <span>{{topList.number}}</span>
                <span>次</span>
              </p>
              <p>本月调用数{{topList.thirdNum}}次</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="modelList">
              <p>本月资源量</p>
              <p>
                <span>{{topList.number}}</span>
                <span>GBs</span>
              </p>
              <p>昨日资源量{{topList.thirdNum}}GBs</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="modelList">
              <p>本月出流量</p>
              <p>
                <span>{{topList.number}}</span>
                <span>GB</span>
              </p>
              <p>昨日出流量{{topList.thirdNum}}GB</p>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="modelchart">
        <h3>使用统计</h3>
        <div>
          <el-select v-model="value" placeholder="请选择" filterable>
            <el-option
              v-for="item in address"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      topList: {
        number: 0,
        thirdNum: 0
      },
      svalue: '',
      address: [
        {
          value: '1',
          label: '北京'
        },
        {
          value: '2',
          label: '北京'
        },
        {
          value: '3',
          label: '北京'
        },
        {
          value: '4',
          label: '北京'
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.topOverView {
  width: 100%;
  height: 52px;
  background-color: #fff;
  line-height: 52px;
  border-bottom: 1px solid #eee;
  padding: 0 20px;
  span:nth-child(1) {
    font-size: 18px;
    font-weight: bold;
    color: #000;
    float: left;
  }
  span:nth-child(2) {
    font-size: 14px;
    color: #888;
    float: right;
    a {
      color: #888;
    }
  }
}
.mainContainer {
  width: 100%;
  padding: 20px 100px;
  box-sizing: border-box;
}
.contentTop {
  padding: 20px 0;
  width: 100%;
  height: 150px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  div:nth-child(4) {
    div {
      border-right: 0;
    }
  }
}
.modelList {
  padding: 10px 20px;
  border-right: 1px solid #ccc;
  height: 110px;
  p:nth-child(1) {
    color: #000;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 15px;
  }
  p:nth-child(2) {
    margin-bottom: 8px;
    color: #000;
    span:nth-child(1) {
      font-size: 30px;
    }
  }
  p:nth-child(3) {
    color: #888;
  }
}
.modelchart {
  width: 100%;
  min-height: 500px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #eee;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  margin-top: 20px;
  padding: 20px;
  h3 {
    line-height: 28px;
  }
}
</style>
