<template>
  <div class="Task">

    <!-- 标题 -->
    <div class="Title">
      <div>
        <div class="Task-tit">
          <h2>任务列表</h2>
        </div>
      </div>
    </div>

    <div class="Task-operation">
      <city :parm="parm" @changeCity="changeCity" class="region-btn"></city>
    </div>

    <!-- 搜索 -->
    <div class="tools-div">
      <div class="time-div">
        <date-picker @getDatePicker="getDatePicker"></date-picker>
      </div>
      <!-- 搜索本接口暂不支持 -->
      <!-- <search class="search-1" :options="options" v-on:search="search"></search> -->
    </div>

    <!-- 表格 -->
    <div class="Task-table">
      <el-table ref="multipleTable" v-loading="tableLoading" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="任务ID" prop="JobId">
        </el-table-column>
        <el-table-column label="任务类型">
          <template slot-scope="scope">
            <p>{{ scope.row.Type | taskType}}</p>
          </template>
        </el-table-column>
        <el-table-column label="所属地域">
          <template slot-scope="scope">
            <p>{{ $cookie.get('regionv2') | RegionAllfilter }}</p>
          </template>
        </el-table-column>
        <el-table-column label="任务执行进度">
          <template slot-scope="scope">
            <el-progress v-if="scope.row.Progress === 100" :percentage="scope.row.Progress" status="success"></el-progress>
            <el-progress v-else :percentage="scope.row.Progress" status="warning"></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="任务执行状态">
          <template slot-scope="scope">
            <p class="color-1">{{ scope.row.Status | taskStatus}}</p>
          </template>
        </el-table-column>
        <el-table-column label="任务开始时间" prop="StartTime">
        </el-table-column>
        <el-table-column label="任务结束时间" prop="EndTime">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="ope-div">
              <span @click="detailObj.detailShow = true; detailObj.detailInfo = scope.row">查看详情</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="Task-pag">
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>

    <detail v-if="detailObj.detailShow" :detailObj="detailObj" @detailShowFun="detailShowFun"></detail>

  </div>
</template>
<script>
import Detail from './Dialog/Detail'
export default {
  data() {
    return {
      parm: 'MYSQL',
      options: [
        // 搜索下拉数组
        {
          value: "AsyncRequestId",
          label: "请求 ID"
        }
      ],
      searchName: "", // 搜索类型的名字
      searchVal: "", // 搜索类型的值
      tableData: [], // 表格列表数据
      tableLoading: false, // 表格加载动画
      currentPage: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度
      detailObj: {  // 查看详情
        detailShow: false,
        detailInfo: {}
      },
      datePicker: ''    // 时间控件选中的值
    };
  },
  components: {
    Detail
  },
  mounted() {
    this.getDataList();

  },
  methods: {
    // 获取Task列表
    getDataList() {
      this.tableLoading = true;
      var params = {
        Version: "2017-03-20",
        Region: this.$cookie.get("regionv2"),
        Offset: (this.currentPage - 1) * this.pageSize,
        Limit: this.pageSize
      };
      if (this.datePicker !== '') {
        params.StartTimeBegin = this.datePicker[0]
        params.StartTimeEnd = this.datePicker[1]
      }
      // if (this.searchName === "AsyncRequestId") {
      //   params.AsyncRequestId = this.searchVal
      // }

      this.axios
        .post("cdb2/DescribeTasks", params)
        .then(data => {
          this.tableLoading = false;
          this.tableData = data.Response.Items;
          this.totalPage = data.Response.TotalCount;
        });
    },

    // 点击城市函数
    changeCity(val) {
      this.getDataList();
    },

    // 得到选中的时间
    getDatePicker(val) {
      this.datePicker = val
      this.getDataList();
    },

    // 搜索
    search(searchInput, searchSelect) {
      this.searchName = searchSelect;
      this.searchVal = searchInput;
      this.getDataList();
    },

    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getDataList();
    },

    // 当前页
    currentChangeHandle(val) {
      this.currentPage = val;
      this.getDataList();
    },

    // 查看详情模态框
    detailShowFun(val) {
      this.detailObj.detailShow = val
    }
  },
  filters: {
    // 任务类型过滤
    taskType: function (value) {
      let type = {
        '2': 'SQL操作',
        '3': '数据导入',
        '5': '参数设置',
        '6': '初始化',
        '7': '重启',
        '8': '开启GTID',
        '9': '只读实例升级',
        '10': '数据库回档',
        '11': '主实例升级',
        '12': '删除库表',
        '13': '切换为主实例'
      }
      return type[value]
    },

    // 任务执行进度过滤
    taskStatus: function (value) {
      let status = {
        '0': '运行中',
        '2': '执行成功',
        '3': '执行失败',
        '4': '已中止',
        '5': '已删除',
        '6': '正在中止'
      }
      return status[value]
    }
  }
};
</script>

<style lang="scss" scoped>
.Task {
  .Task-tit {
    margin-left: 0px;
    ::v-deep .el-input__inner {
      border: 0;
    }
  }
  .Task-operation {
    margin: 20px 20px 5px 20px;
  }

  .tools-div {
    margin: 5px 20px;
    height: 32px;
    .time-div {
      float: left;
    }
    .search-1 {
      float: right;
    }
  }
  .Task-table {
    margin: 5px 20px 20px 20px;
    background: #fff;

    .color-1 {
      color: #0abf5b;
    }
    .ope-div {
      span:not(:first-child) {
        margin-left: 8px;
      }
      span {
        color: #217cf3;
        cursor: pointer;
      }
    }
  }
  .Task-pag {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
