<template>
  <div>
    <div class="topHeader">
      <span>IP封堵状态</span>
      <el-select
        v-model="ipSearch"
        filterable
        allow-create
        default-first-option
        placeholder="请选择文章标签"
      >
        <el-option
          v-for="item in ipSearchOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="wrapper">
      <div class="topTip" v-if="tipShow">
        <p>这里可以查看到正在封堵状态中的IP记录/这里可以查看动态生成的IP封堵记录，例如CC，BOT，自定义人机识别等</p>
        <span class="el-icon-close" @click="closeTip"></span>
      </div>
      <div class="filterCon">
        <div>
          <span>类型: </span>
          <el-select class="select" v-model="typeCheck" style="margin-left: 52px;">
            <el-option v-for="item in IP_STATUS_TYPE_ARR" :label="item.name" :value="item.value" />
          </el-select>
        </div>
        <!-- <div class="timeCon newClear"> -->
        <div class="timeCon" style="display: flex">
          <div>
            <span class="floatLeft">记录创建时间：</span>
            <el-button-group class="floatLeft">
              <el-button :disabled="disabledIp" size="mini">最近1小时</el-button>
              <el-button :disabled="disabledIp" size="mini">最近1天</el-button>
              <el-button :disabled="disabledIp" size="mini">最近7天</el-button>
            </el-button-group>
            <el-date-picker
              size="mini"
              class="floatLeft timePick"
              v-model="timeValue1"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled="disabledIp"
            />
          </div>
          <div style="flex: 1">
            <el-checkbox :disabled="disabledIp" class="floatLeft checkBo" v-model="timeOut" label="有效截止日期:" name="time"></el-checkbox>
            <el-date-picker
              size="mini"
              class="floatLeft timePick"
              v-model="timeValue2"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled="disabledIp"
            ></el-date-picker>
           </div>
        </div>
        <div >
          <span>触发策略：</span>
          <el-input :disabled="disabledIp" style="width: 180px; margin-left: 23px" />
          <el-tooltip class="tooltip" effect="dark" content="如果您想查询“智能CC”的封堵状态，请输入auto_cc" placement="right">
            <i class="el-icon-info" style="margin-left: 10px;" />
          </el-tooltip>
        </div>
        <div style="margin-top: 20px;">
          <span>IP地址：</span>
          <el-input v-model="searchIp" style="width: 180px; margin-left: 36px" />
          <div class="err-tips" v-show="ipTest">IP格式输入有误</div>
        </div>
        <div>
          <el-button size="mini" class="lookSearch">查询</el-button>
        </div>
      </div>
      <div class="tableList">
        <div class="tableCon">
          <el-table
            ref="multipleTable"
            :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            tooltip-effect="dark"
            style="width: 100%" v-loading="loadShow"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="num" label="序号">
              <template slot-scope="scope">{{ scope.$index+1}}</template>
            </el-table-column>
            <!-- <el-table-column prop="resourse" label="来源"></el-table-column> -->
            <el-table-column prop="type" label="类别"></el-table-column>
            <el-table-column prop="ipAddress" label="IP地址"></el-table-column>
            <el-table-column prop="updata" label="策略名称"></el-table-column>
            <el-table-column prop="stopTime" label="动作"></el-table-column>
            <el-table-column prop="descrip" label="创建时间"></el-table-column>
            <el-table-column prop="descrip" label="有效截止时间"></el-table-column>
            <el-table-column prop="action" label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="mini">编辑</el-button>
                <el-button type="text" size="mini">加白</el-button>
                <el-button type="text" size="mini">加黑</el-button>
                <el-popover
                  placement="bottom"
                  width="220"
                  v-model="visible">
                  <div class="deleteCon" style="text-align:center;">
                    <h1 style="font-size:14px;font-weight: 600;margin-bottom:16px;">确认删除该记录？</h1>
                    <p style="font-size:12px;color:#333;margin-bottom:16px;">删除IP：{{scope.row.ipAddress}}</p>
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button type="primary" size="mini" @click="visible = false">删除</el-button>
                    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                  </div>
                  <el-button slot="reference" size="mini" type="text" style="margin-left:10px;">删除</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tabListPage">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
          ></el-pagination>
        </div>
      </div>
    </div>
    <addBWmodel :isShow="addBWmodel"/>
  </div>
</template>

<script>
import addBWmodel from './model/addBWmodel'
import { DESCRIBE_ACCESS_CONTROL } from '@/constants'
import { IP_STATUS_TYPE_ARR } from '../constants'
export default {
  data() {
    return {
      ipSearch: "", //ip查询下拉
      ipSearchOptions: [
        {
          value: "www.bai.com",
          label: "www.bai.com"
        }
      ],
      IP_STATUS_TYPE_ARR, //类型下拉选项
      tipShow: true, //提示文字
      resouseC: "", //来源
      typeCheck: "", //类别
      iptIP: "", //输入IP
      arrowShow: true, //箭头显示
      flag: true,
      timeValue1: "", //创建时间
      timeOut: false, //有效截止日期
      timeValue2: "", //有效截止日期
      multipleSelection: [], //tableCheck
      tableDataBegin: [],
      allData: [{
        resourse:'自定义',
        ipAddress:'10.1.1.23',
        type:'黑名单',
        updata:'2019-12-25 13:52:03',
        stopTime:'2020-01-01 23:59:59',
        descrip:'123'
      }],//自定义数据
      tableDataBegin: [],//表格数据
      tableDataEnd: [],
      currentPage: 1,//当前页
      pageSize: 10,//每页长度
      totalItems: 0,//总长度
      filterTableDataEnd: [],
      flag: false,//定义一个开关
      loadShow:false,//加载
      visible: false,//删除弹框
      addBWmodel:false,//添加黑白IP弹框
      ipTest: false, // ip输入格式是否正确
      searchIp: '', //输入的IP地址
      disabledIp: false // 如果有输入ip地址，则禁用别的按钮
    };
  },
  components:{
    addBWmodel:addBWmodel
  },
  mounted() {
    this.getData();
    console.log(IP_STATUS_TYPE_ARR);
  },
  methods: {
    //关闭提示文字
    closeTip() {
      this.tipShow = false;
    },
    //点击查看详情
    isShowTop() {
      if (this.flag) {
        this.arrowShow = false;
        this.flag = true;
      } else {
        this.arrowShow = true;
        this.flag = false;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取数据
    getData() {
      this.loadShow=true;
      // this.axios.get('', {}).then((res) => {
      // console.log(res.data.tableData);
      // this.tableDataBegin = res.data.tableData;
      // this.tableDataBegin = this.allData;
      // 将数据的长度赋值给totalItems
      // this.totalItems = this.tableDataBegin.length;
      // if (this.totalItems > this.pageSize) {
      //   for (let index = 0; index < this.pageSize; index++) {
      //     this.tableDataEnd.push(this.tableDataBegin[index]);
      //   }
      // } else {
      //   this.tableDataEnd = this.tableDataBegin;
      // }
      // this.loadShow=false;
      // })
      let params = {
        Version: '2018-01-25',
        Domain: 'tfc.dhycloud.com',
        Count: 10
      }
      this.axios.post(DESCRIBE_ACCESS_CONTROL, params).then(data => {
        this.loadShow = false;
        console.log(data)
      })
    },
    // 分页开始
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },
    //添加黑白名单按钮
    addBW(){
      this.addBWmodel=true;
    }
  },
  watch: {
    searchIp(n) {
      let pattern = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g
      this.ipTest = !pattern.test(n)
      if(n) {
        this.disabledIp = true
      } else {
        this.disabledIp = false
      }
    }
  },
};
</script>
<style lang='scss' scoped>
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
.topHeader {
  width: 100%;
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 20px;
  line-height: 50px;
  span {
    font-size: 16px;
    font-weight: 600;
    color: #000;
    margin-right: 20px;
  }
}
::v-deep input {
  height: 30px;
  border-radius: 0;
}
::v-deep button {
  border-radius: 0;
}
.wrapper {
  width: 100%;
  padding: 20px;
  .topTip {
    font-size: 12px;
    line-height: inherit;
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    margin-bottom: 20px;
    position: relative;
    p {
      line-height: 20px;
    }
    .el-icon-close {
      position: absolute;
      font-size: 18px;
      top: 10px;
      // transform: translateY(-50%);
      right: 20px;
    }
  }
  .filterCon {
    background-color: #fff;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    padding: 20px;
    margin-bottom: 20px;
    .select {
      width: 140px;
      margin-right: 15px;
    }
    .iptIP {
      width: 200px;
    }
    .topFilter {
      color: #006eff;
      font-size: 14px;
      margin-left: 10px;
    }
    .timeCon {
      margin-top: 20px;
      line-height: 30px;
    }
    .lookSearch {
      color: #fff;
      background-color: #006eff;
      margin-top: 20px;
    }
    .floatLeft {
      float: left;
    }
    .timePick {
      width: 320px;
      margin-right: 100px;
      ::v-deep .el-range-separator {
        width: 7%;
      }
    }
    .checkBo {
      margin-right: 10px;
    }
    .err-tips {
      font-size: 10px;
      color: #e1504a;
      width: 100px;
      padding-top: 5px;
    }
  }
  .tableList {
    .tableListBtn {
      margin-bottom: 12px;
      .addBW {
        background-color: #006eff;
        color: #fff;
      }
      .exportFilter {
        background-color: #006eff;
        color: #fff;
        float: right;
      }
    }
    .tableCon {
      min-height: 450px;
      background-color: #fff;
    }
  }
  .tabListPage{
    height:50px;
    border-top:1px solid #ddd;
    padding-top:8px;
    text-align:right;
    background-color:#fff;
  }
}
</style>
