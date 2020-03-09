<template>
  <div class="platform-wrap">
    <Header title="平台事件">
    </Header>
    <div class="platform-main">
      <div class="explain" style="margin-bottom:20px;">
        <p>
          事件中心概述，平台事件與平台事件區別
          <a>點擊了解</a>
        </p>
      </div>
      <div class="box">
        <div class="table_top">
          <div class="type_data">
            <TimeDropDown :TimeArr='TimeArr' :classsvalue="value" :Datecontrol='true' :Graincontrol='false' :Difference="'D'"
      v-on:switchData="GetDat" />
          </div>
          <div class="writeput">
            <SEARCH
              :isSHows = "true"
             :searchOptions="searchOptions"
             :searchValue="searchValue" 
             :searchInput="searchInput" 
              @changeValue="changeValue"
              @changeinput="changeinput" 
              @clicksearch="clicksearch" 
              @exportExcel="exportExcel">
            </SEARCH>
              
          </div>
          <div class="icons">
                <i class="el-icon-setting" @click="dialog"></i>
                <i class="el-icon-download"></i>
          </div>
        </div>
        <div class="table">
          <el-table :data="tableData" style="width: 100%" height="450">
            <el-table-column prop="BusinessTypeDesc" label="事件" class="el-icon-info"></el-table-column>
            <el-table-column prop label="地域" >
              <template slot-scope="scope">
                <p>{{scope.row.Region === 'tpe' ? '中國台北' : ''}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="EventStatus" label="狀態" ></el-table-column>
            <el-table-column prop label="影響對象" >
              <template slot-scope="scope">
                <p>{{scope.row.AffectResource}}</p>
              </template>
            </el-table-column>
            <el-table-column prop label="開始時間" >
              <template slot-scope="scope">
                  <p>{{getConvDate(scope.row.OccurTime)}}</p>
              </template>
            </el-table-column>
            <el-table-column prop label="更新時間" >
              <template slot-scope="scope">
                  <p>{{getConvDate(scope.row.UpdateTime)}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="AccidentTypeDesc" label="事件類型"></el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t("CVM.strip")}}</span>
            <el-pagination
              :page-size="pagesize"
              :pager-count="7"
              layout="prev, pager, next"
              @current-change="handleCurrentChange"
              :total="TotalCount"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <Dialog :dialogVisible="dialogVisible" @cancel="cancel" @save="save"/>
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import TimeDropDown from '@/components/public/TimeDropDown';
import Dialog from "./custom/custom";
import SEARCH from "@/components/public/SEARCH";
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import { PLATFORM_EVENT_LIST } from "@/constants";
export default {
  name: "platform",
  data() {
    return {
      activeName: "first",
      value: 13,
      dialogVisible: false, //弹出框

      searchInput: "", //搜索框的值
      searchOptions: [],
      searchValue: "", //inp输入的值

      loadShow: true, // 加载是否显示
      tableData: [],
      StartTime: "", //起始时间
      EndTime: "", //结束时间
      //分页
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      TimeArr: [
          
          {
            name: '近7天',
            Time: 'Nearly_7_days',
            TimeGranularity: [{
                value: "3600",
                label: "1小時"
              },
              {
                value: "86400",
                label: "1天"
              }
            ]
          },
           {
            name: '近30天',
            Time: 'Nearly_30_days',
          },
        ]
    };
  },
  components: {
    Header,
    TimeDropDown,
    Dialog,
    SEARCH
  },
  methods: {
    // 获取时间戳
    GetDat(data) {
        
        let StartTIme = new Date(data[1].StartTIme)
        let EndTIme = new Date(data[1].EndTIme)

        this.StartTime = StartTIme.getTime()/1000;
        this.EndTime = EndTIme.getTime()/1000;
        this.GetPlatformList()
      },
      // 将时间戳转为日期格式
    getConvDate(data){
        var _data = data;
          _data = data*1000
        const time = new Date(_data);    
        const Y = time.getFullYear();
        const Mon = time.getMonth() + 1;
        const Day = time.getDate();
        const H = time.getHours();
        const Min = time.getMinutes();
        const S = time.getSeconds();
          return `${Y}-${Mon}-${Day} ${H}:${Min}:${S}`
      },
   //获取数据
    GetPlatformList(data) {
      this.loadShow = true; //加载
      const params = {
        Region: localStorage.getItem('regionv2'),
        Version: "2018-07-24",
        Offset: this.currpage * this.pagesize - this.pagesize,
        Module: "monitor",
        StartTime: this.StartTime,
        EndTime: this.EndTime
      };
      if (this.searchValue !== "" && this.searchInput !== "") {
          param["Filters.0.Name"] = this.searchValue;
          param["Filters.0.Values.0"] = this.searchInput;
        }
      //  monitor2/DescribeAccidentEventList   //接口
    
      console.log(JSON.stringify(params));
      this.axios.post(PLATFORM_EVENT_LIST, params).then(res => {
        console.log(res);
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.Alarms; //列表数据

          this.TotalCount = res.Response.Total;
          this.loadShow = false; //取消加载
          this.showNameSpaceModal = false;
        } else {
          this.loadShow = false;
          let ErrTips = {};
          let ErrOr = Object.assign(ErrorTips, ErrTips);
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: "error",
            showClose: true,
            duration: 0
          });
        }
      });
      // console.log(data);
    },
     //分页
    handleCurrentChange(val) {
      this.currpage = val;
      this.GetPlatformList();
    },
     //弹框
    dialog(){
      this.dialogVisible = true;
      console.log(this.dialogVisible)
    },
    cancel(){
      this.dialogVisible = false;
    },
    save(){
      this.dialogVisible = false;
    },

    //选择搜索条件
      changeValue(val) {
        this.searchValue = val;
      },
      changeinput(val) {
        this.searchInput = val;
        if (this.searchInput === "") {
          this.currpage = 1;
          this.getProductList();
        }
      },
      clicksearch(val) {
        this.currpage = 1;
        this.searchInput = val;
        if (this.searchInput !== "" && this.searchValue !== "") {
          this.getProductList();
        } else {
          this.$message.error("請輸入正確搜索信息");
        }
      },
    //导出表格
      exportExcel() {
        return '';
      }
  },
};
</script>

<style lang="scss" scoped>
.platform-wrap >>> .el-button,
.platform-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.writeput{
   width: 240px;
        display: flex;
}

.platform-wrap > header {
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 17px 20px;
  p:first-child {
    font-size: 16px;
    font-weight: 600;
    a {
      color: #000;
    }
  }
}
.platform-main {
  padding: 20px;
}
.box {
  width: 100%;
  .table_top{
    width:100%;
    margin:15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
      .icons {
        display: flex;
        font-size: 17px;
        align-items: center;
        >i{
          display: inline-block;
          margin:0 10px;
        }
        :hover{
          cursor: pointer;
        }
      }
     
  }
  
  .table {
    width: 100%;
    background: white;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.32);
  }
}
.explain {
  padding: 10px 30px 10px 20px;
  vertical-align: middle;
  color: #003b80;
  border: 1px solid #97c7ff;
  background: #e5f0ff;
  p {
    font-size: 11px;
    line-height: 18px;
  }
}
.Right-style {
  display: flex;
  justify-content: flex-end;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  padding: 20px;

  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
</style>  