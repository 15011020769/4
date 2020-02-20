<template>
  <div>
    <div class="topHeader">
      <span>IP查询</span>
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
        <p>在这里，您可以将一个或多个IP加入黑/白名单，实现精准的访问控制。需要注意的是：黑白名单的优先级仅低于WAF自定义放行策略，高于其他检测逻辑。</p>
        <p>IP黑白名单优先级：全局白名单 > 域名白名单 > 域名黑名单 > 全局黑名单</p>
        <span class="el-icon-close" @click="closeTip"></span>
      </div>
      <div class="filterCon">
        <div>
          <span>类别：</span>
          <el-select class="select" v-model="typeCheck">
            <el-option label="全部" value="all"></el-option>
            <el-option label="黑名单" value="black"></el-option>
            <el-option label="白名单" value="white"></el-option>
          </el-select>
          <span>来源：</span>
          <el-select class="select" v-model="resouseC">
            <el-option label="全部" value="all"></el-option>
            <el-option label="CC" value="cc"></el-option>
            <el-option label="BOT" value="bot"></el-option>
            <el-option label="自定义" value="self"></el-option>
          </el-select>
          <el-input placeholder="输入IP" class="iptIP" v-model="iptIP" :disabled="!arrowShow"></el-input>
          <span class="topFilter" @click="isShowTop">
            高级筛选
            <i v-if="arrowShow" class="el-icon-caret-bottom"></i>
            <i v-if="!arrowShow" class="el-icon-caret-top"></i>
          </span>
        </div>
        <div v-if="!arrowShow" class="timeCon newClear">
          <span class="floatLeft">创建时间：</span>
          <el-button-group class="floatLeft">
            <el-button size="mini">最近1小时</el-button>
            <el-button size="mini">最近1天</el-button>
            <el-button size="mini">最近7天</el-button>
          </el-button-group>
          <el-date-picker
            size="mini"
            class="floatLeft timePick"
            v-model="timeValue1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <el-checkbox class="floatLeft checkBo" v-model="timeOut" label="有效截止日期:" name="time"></el-checkbox>
          <el-date-picker
            size="mini"
            class="floatLeft timePick"
            v-model="timeValue2"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </div>
        <div>
          <el-button size="mini" class="lookSearch">查询</el-button>
        </div>
      </div>
      <div class="tableList">
        <div class="tableListBtn newClear">
          <el-button class="addBW" size="mini" @click="addBW">添加黑白名单</el-button>
          <el-button class="allDelete" size="mini">批量删除</el-button>
          <el-upload
            class="import-btn"
            action=""
            :show-file-list="false"
            :on-change="fileChange"
          >
            <el-button size="mini" type="primary">导入数据</el-button>
          </el-upload>
          <el-button class="exportFilter" @click="exportFile" size="mini">导出全部筛选结果</el-button>
        </div>
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
            <el-table-column prop="resourse" label="来源"></el-table-column>
            <el-table-column prop="ipAddress" label="IP地址"></el-table-column>
            <el-table-column prop="type" label="类别"></el-table-column>
            <el-table-column prop="updata" label="更新时间"></el-table-column>
            <el-table-column prop="stopTime" label="截止时间"></el-table-column>
            <el-table-column prop="descrip" label="备注"></el-table-column>
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
import XLSX from 'xlsx'
const make_cols = refstr => Array(XLSX.utils.decode_range(refstr).e.c + 1).fill(0).map((x,i) => ({name:XLSX.utils.encode_col(i), key:i}));

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
      data: []
    };
  },
  components:{
    addBWmodel:addBWmodel
  },
  mounted() {
    this.getData();
  },
  methods: {
    fileChange(file) {
      const reader = new FileReader();
			reader.onload = (e) => {
				/* Parse data */
				const bstr = e.target.result;
				const wb = XLSX.read(bstr, {type:'binary'});
				/* Get first worksheet */
				const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
				/* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, {header:1});
        data.splice(0, 1) // 删除第一行表头
				/* Update state */
				this.data = data; // 导入的数据
			};
			reader.readAsBinaryString(file.raw);
    },
    exportFile() {
      /* convert state to workbook */
      this.data.unshift(["IP地址", "类别", "来源", "更新时间", "截止时间", "备注"])
			const ws = XLSX.utils.aoa_to_sheet(this.data); // 导出的数据
			const wb = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(wb, ws, "ip_list");
			/* generate file and send to client */
			XLSX.writeFile(wb, "ip_list.xlsx");
		},
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
  }
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
      top: 20px;
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
.import-btn {
  display: inline-block;
  margin-left: 10px;
}
</style>
