<template>
  <div class="content">
    <div>
      <el-button size="mini" v-model="primaryData.timeChecknow">实时</el-button>
      <span>
        <el-button v-model="primaryData.timecheckday" size="mini">近24小时</el-button>
      </span>
      <span>
        <el-button v-model="primaryData.timecheckweek" size="mini">近7天</el-button>
      </span>
      <el-date-picker
        size="mini"
        style="width:240px;"
        v-model="primaryData.valuetime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button size="mini" v-if="datatimeShow" style='margin-left:10px;' @click="datatimeShow=!datatimeShow">数据对比</el-button>
      <span v-if="!datatimeShow">
        <span style="font-size:12px;margin-left:10px;">对比</span>
        <el-date-picker
          size="mini"
          style="width:240px;"
          v-model="primaryData.valuetime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <span class="el-icon-close" @click="datatimeShow=!datatimeShow"></span>
      </span>
      <span style="font-size:12px;color:#888;margin-left:20px;">时间粒度：
      </span>
      <el-select v-model="primaryData.time" placeholder="" size="mini" style="width:100px;margin:0 5px;">
        <el-option
        v-for="item in timeList"
        :key="item.value"
        :label="item.label"
        :value="item.value">
        </el-option>
      </el-select>
      <span style="float: right;">
        <span class='refresh'>刷新</span>
      </span>
    </div>
    <div class="tablecontent">
      <span class="table-title"><i class="el-icon-warning"></i>注释：Max、Min和Avg数值统计为当前折线图内所有点的最大值、最小值和平均值</span>
      <span class='exportbutton'>导出数据</span>
      <el-table :data="projectInfo" max-height="500" row-style='height:30px' :header-cell-style='{"font-size":"12px","font-weight" : "bolder"}'>
        <el-table-column prop="funcName" label="" show-overflow-tooltip min-width="60">
          <template slot-scope="scope">
            <span style="font-size:12px;font-weight:bolder;">{{scope.row.funcName}}
              <el-popover
                placement="bottom-start"
                title=""
                width="200"
                trigger="hover"
                content="函数调用次数，按粒度（1分钟、5分钟）统计求和">
                <i class="el-icon-warning" slot="reference"></i>
              </el-popover>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="watch" label="" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="runtime" label="" show-overflow-tooltip min-width="40">
          <template slot-scope="scope">
            <span style="display: block;">Max</span>
            <span style="display: block;">-</span>            
          </template>
        </el-table-column>
        <el-table-column prop="describe" label="" show-overflow-tooltip min-width="40">
          <template slot-scope="scope">
            <span style="display: block;">Min</span>
            <span style="display: block;">-</span>            
          </template>
        </el-table-column>
        <el-table-column prop="tag" label="" show-overflow-tooltip min-width="40">
          <template slot-scope="scope">
            <span style="display: block;">Max</span>
            <span style="display: block;">-</span>            
          </template>
        </el-table-column>
        <el-table-column prop="id" label="" width="100">
          <template slot-scope="scope">
            <span class="buttonSet" @click="showList(scope.$index, scope.row)"><i class="el-icon-menu"></i></span>
            <span class="buttonSet" @click="showExport(scope.$index, scope.row)">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-s-unfold"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>导出图片</el-dropdown-item>
                  <el-dropdown-item>导出数据</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <monitorList :monitordialog="monitordialog" v-on:close="close"></monitorList>
  </div>
</template>

<script>
import monitorList from "./monitor/monitorList.vue";
export default {
  data() {
    return {
      primaryData: {
        valuetime: [],
        timeChecknow:'',
        timecheckday: '',
        timecheckweek: '',
        time: ''
      },
      timeList: [{
        value: '1',
        label: '1分钟'
      }, {
        value: '2',
        label: '5分钟'
      }],
      datatimeShow: true,
      projectInfo: [{
          funcName: '调用次数',
          watch: '无数据',
          runtime: '1',
          describe: '1',
          tag: '1',
          creatTime: '',
          updateTime: ''
        }, {
          funcName: '调用次数',
          watch: '无数据',
          runtime: '1',
          describe: '1',
          tag: '1',
          creatTime: '',
          updateTime: ''
        },{
          funcName: '调用次数',
          watch: '无数据',
          runtime: '1',
          describe: '1',
          tag: '1',
          creatTime: '',
          updateTime: ''
        },{
          funcName: '调用次数',
          watch: '无数据',
          runtime: '1',
          describe: '1',
          tag: '1',
          creatTime: '',
          updateTime: ''
        },{
          funcName: '调用次数',
          watch: '无数据',
          runtime: '1',
          describe: '1',
          tag: '1',
          creatTime: '',
          updateTime: ''
        },{
          funcName: '调用次数',
          watch: '无数据',
          runtime: '1',
          describe: '1',
          tag: '1',
          creatTime: '',
          updateTime: ''
        },{
          funcName: '调用次数',
          watch: '无数据',
          runtime: '1',
          describe: '1',
          tag: '1',
          creatTime: '',
          updateTime: ''
        }],
        monitordialog: false
    };
  },
  mounted() {
  },
  components: {
    monitorList
  },
  methods: {
    showList() {
      this.monitordialog = true;
    },
    showExport() {
      
    },
    close() {
      this.monitordialog = false;
    }
  }
};
</script>

<style scoped lang="scss">
  .el-icon-search:hover {
    cursor: pointer;
  }
  .content {
    margin: 20px 0;
    padding: 20px;
    background: #fff;
  }
  .left {
    width: 240px;
    min-height: 800px;
    float: left;
    border: 1px solid #ccc;
    border-top: none;
    border-left: none;
  }
  .right {
    margin-left: 260px;
    min-height: 800px;
  }
  .right-title {
    display:block;
    padding: 0 20px;
    line-height: 50px;
    background:#f2f2f2;
    color: #aaa;
    font-size: 12px;
  }
  .right-content {
    display: inline-block;
    margin-top: 20px;
    padding: 0 10px;
    width: 100%;
    min-height: 700px;
    background: #f2f2f2;
  }
  .el-icon-close {
    margin-left: 50px;
    cursor: pointer;
  }
  .refresh {
    font-size: 12px;
    color: #006eff;
    cursor: pointer;
  }
  .table-title {
    font-size: 12px;
    color: #888;
  }
  .tablecontent {
    margin-top: 20px;
  }
  .el-icon-warning {
    margin: 0 3px;
  }
  .buttonSet {
    font-size: 20px;
    padding: 2px;
    line-height: 20px;
  }
  .buttonSet:hover {
    background: #ccc;
    cursor: pointer;
  }
  .exportbutton {
    float:right;
    color:#006eff;
    font-size:12px;
  }
  .exportbutton:hover {
    border-bottom: 1px solid #006eff;
  }
  .el-icon-s-unfold {
    font-size: 20px;
  }
</style>
