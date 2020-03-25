<template>
  <div class="product-wrap">
    <Header title="產品事件"></Header>
    <div class="product-main">
      <!-- <div class="explain" style="margin-bottom:20px;">
        <p>
          事件中心概述，產品事件與平台事件區別
          <a>點擊了解</a>
        </p>
      </div> -->
      <div class="box">
        <div class="table_top"> 
          <div class="type_data">
            <TimeDropDown :TimeArr='TimeArr' :classsvalue="values" :Datecontrol='Datecontrol' :Graincontrol='Graincontrol' :Difference="Difference"
      v-on:switchData="GetDat" />
          </div>
          <div class="writeput">
            <!-- 搜索 -->
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
            <!-- <i class="el-icon-setting" @click="dialog"></i>
            <i class="el-icon-download"></i> -->
          </div>
        </div>
        <div class="table_head">
          <div class="table_head_left">
            <div :class="OverViewBgcolor === 1 ? 'error hoverBgcolor' : 'error'" @click="overViewClick('Type',1,true)">
              <p>異常事件</p>
              <p>
                <span>{{unNormalEventAmount}}</span>个
              </p>
            </div>
            <div :class="OverViewBgcolor === 2 ? 'noerror hoverBgcolor' : 'noerror'" @click="overViewClick('Status',2,true)">
              <p>未恢復異常事件</p>
              <p style="color:red">
                <span>{{unRecoverAmount}}</span>个
              </p>
            </div>
            <div :class="OverViewBgcolor === 3 ? 'nopageerror hoverBgcolor' : 'nopageerror'" @click="overViewClick('IsAlarmConfig',3,true)">
              <p>未配置告警異常事件</p>
              <p>
                <span>{{unConfigAlarmAmount}}</span>个
              </p>
            </div>
          </div>
          <div class="table_head_right">
            <div :class="OverViewBgcolor === 4 ? 'pages hoverBgcolor' : 'pages'" @click="overViewClick('Type',4,true)">
              <p>狀態變更</p>
              <p>
                <span>{{statusChangeAmount}}</span>个
              </p>
            </div>
          </div>
        </div>
        <div class="table">
          <el-table :data="tableData" v-loading="loadShow" style="width: 100%" height="450" :empty-text="$t('CVM.clBload.zwsj')">
            <el-table-column prop="EventCName" label="事件" width="90"></el-table-column>
            <el-table-column prop label="類型" width="100">
              <template slot-scope="scope">
                <p>{{scope.row.Type === 'abnormal' ? '異常事件' : '状态变更'}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="ProductCName" label="產品類型" width="90"></el-table-column>
            <el-table-column prop label="地域" width="90">
              <template slot-scope="scope">
                <p>{{scope.row.Region === 'tpe' ? '台灣台北' : ''}}</p>
              </template>
            </el-table-column>
            <el-table-column prop label="影響對象" width="205">
              <template slot-scope="scope">
                <p>{{scope.row.InstanceId}}</p>
                <p>{{scope.row.InstanceName}}</p>
              </template>
            </el-table-column>
            <el-table-column prop label="對象詳情" width="220">
              <template slot-scope="scope">
                <div v-for="(items,index) in scope.row.Dimensions" :key="index">
                  <p><span>{{items.Name}}：</span>{{items.Value}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop label="狀態" width="50">
              <template slot-scope="scope">
                <p>{{scope.row.Status == "recover" ? "已恢復" : scope.row.Status == "alarm" ? "未恢復" : "-"}}</p>
              </template>
            </el-table-column>
            <el-table-column prop label="開始時間" width="132">
              <template slot-scope="scope">
                  <p>{{getConvDate(scope.row.StartTime)}}</p>
              </template>
            </el-table-column>
            <el-table-column prop label="更新時間" width="132">
              <template slot-scope="scope">
                  <p>{{getConvDate(scope.row.UpdateTime)}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="alarm" label="告警配置" width="132">
              <template slot-scope="scope">
                  <p><span>{{scope.row.IsAlarmConfig == 1 ? '已配置' : '未配置'}}</span>
                  <span class="New_Configuration"><a @click="jump(scope.row.InstanceId)">新增配置</a></span></p>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="Right-style pagstyle">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next"
                :total="TotalCount"
              ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <Dialog :dialogVisible="dialogVisible" @cancel="cancel" @save="save" />
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import TimeDropDown from '@/components/public/TimeDropDown';
import Dialog from "./custom/custom";
import SEARCH from "@/components/public/SEARCH";
import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import { PRODUCT_EVENT_LIST } from "@/constants";

export default {
  name: "product",
  data() {
    return {
      // 概览
      OverViewBgcolorTrigger: false,
      OverViewBgcolor: 0,
      statusChangeAmount: 0, // 状态变更
      unConfigAlarmAmount: 0, // 未配置异常事件
      unNormalEventAmount: 0, // 异常事件
      unRecoverAmount: 0, // 未恢复异常事件

      activeName: "first",
      // 时间控件
      Datecontrol: true,
      Graincontrol: false,
      Difference: 'D',
      values: 13,

      dialogVisible: false, //弹框
      searchInput: "", //搜索框的值
      searchOptions: [
          {
            value: "InstanceId.0",
            label: "影響對象ID"
          },
          // {
          //   value: "EventName.0",
          //   label: "事件名"
          // },
          // {
          //   value: "Status.0",
          //   label: "告警配置状态"
          // },
          // {
          //   value: "Type.0",
          //   label: "事件类型"
          // },
      ],
      searchValue: "", //inp输入的值

      loadShow: true, // 加载是否显示
      tableData: [],
      StartTime: "", //起始时间
      EndTime: "", //结束时间
      //分页
      TotalCount: 0, //总条数
      pageSize: 10, // 分页条数
      pageIndex: 0, // 当前页码
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
      }
    
  },
  components: {
    Header,
    Dialog,
    TimeDropDown,
    SEARCH
  },

  methods: {
    // 获取时间戳
    GetDat(data) {
        let StartTIme = new Date(data[1].StartTIme);
        let EndTIme = new Date(data[1].EndTIme);

        this.StartTime = StartTIme.getTime()/1000;
        this.EndTime = EndTIme.getTime()/1000;
        this.getProductList();
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
    getProductList(events) {
      let types = typeof data;
      this.loadShow = true; //加载
      const params = {
        Region: localStorage.getItem("regionv2"),
        Version: "2018-07-24",
        Module: "monitor",
        Limit: this.pageSize,
        Offset: this.pageIndex,
        StartTime: this.StartTime,
        EndTime: this.EndTime,
      };
     if (this.searchInput !== "" && this.searchValue !== "") {
        params[this.searchValue] =  this.searchInput
     }
     switch (events) {
            case 1: 
            console.log(events)
             params['Type.0'] = "abnormal";
              break;
            case 2: 
            console.log(events)
              params['Status.0'] = "alarm";
              break;
            case 3: 
            console.log(events)
              params['IsAlarmConfig'] = 0;
              break;
            case 4: 
            console.log(events)
              params['Type.0'] = "status_change";
              break;
          }
     
      //  monitor2/DescribeProductEventList   //接口
      // console.log(JSON.stringify(params));
      this.axios.post(PRODUCT_EVENT_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.tableData = res.Response.Events; //列表数据
          this.TotalCount = res.Response.Total;
          this.loadShow = false; //取消加载
          this.showNameSpaceModal = false;
          
          this.statusChangeAmount = res.Response.OverView.StatusChangeAmount; // 状态变更
          this.unConfigAlarmAmount = res.Response.OverView.UnConfigAlarmAmount; // 未配置异常事件
          this.unNormalEventAmount = res.Response.OverView.UnNormalEventAmount; // 异常事件
          this.unRecoverAmount = res.Response.OverView.UnRecoverAmount; // 未恢复异常事件
          
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
    },
    // 分页
    handleCurrentChange(val) {
      this.pageIndex = val - 1;
      this.getProductList();
      this.pageIndex += 1;
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.getProductList();
    },
    //弹框
    dialog() {
      this.dialogVisible = true;
    },
    cancel() {
      this.dialogVisible = false;
    },
    save() {
      this.dialogVisible = false;
    },
    // 概览
    overViewClick (events,num,Trigger) {
        if (this.OverViewBgcolor != num) {
          this.OverViewBgcolor = num;
          this.getProductList(this.OverViewBgcolor);
        }else {
          switch (this.OverViewBgcolor) {
            case 1: 
              this.OverViewBgcolorTrigger= !Trigger;
              break;
            case 2: 
              this.OverViewBgcolorTrigger= !Trigger;
              break;
            case 3: 
              this.OverViewBgcolorTrigger= !Trigger;
              break;
            case 4: 
              this.OverViewBgcolorTrigger= !Trigger;
              break;
          }
          if (!this.OverViewBgcolorTrigger) {
            this.OverViewBgcolor = 0;
            this.getProductList(this.OverViewBgcolor);
          }
        }       
    },
    
    //导出表格
      exportExcel() {
        return '';
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
      jump(id) {
        this.$router.push({
          name: "strategy",
          query: {
            id
          }
        });
      }
    
  }
}
</script>

<style lang="scss" scoped>
.product-wrap >>> .el-button,
.product-wrap >>> .el-input__inner {
  height: 30px; 
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.writeput {
  width: 240px;
  display: flex;
}
.product-wrap > header {
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
.product-main {
  padding: 20px;
}
.box {
  width: 100%;
  .table_top {
    width: 100%;
    margin: 15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: auto;
    .icons {
      display: flex;
      font-size: 16px;
      align-items: center;
    }
    
    .type_data {
      margin-top: 0px;
    }
  }
  .table_head {
    width: 100%;
    padding: 20px;
    background: white;
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 20px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.32);
    span {
      font-size: 30px;
    }
    .table_head_left {
      flex: 4;
      border: 1px solid #ccc;
      display: flex;
      padding: 10px;
      .error {
        flex: 3;
        // background: #97c7ff;
        margin: 10px;
        padding: 10px;
        padding-bottom: 20px;
        border-right: 1px solid #ccc;
      }
      .noerror {
        margin: 10px;
        padding: 10px;
        padding-bottom: 20px;
        flex: 3;
      }
      .nopageerror {
        margin: 10px;
        padding: 10px;
        padding-bottom: 20px;
        flex: 4;
      }
      .error:hover {
         background: rgb(242, 242, 242);
         cursor: pointer;
      }
      .noerror:hover {
         background: rgb(242, 242, 242);
         cursor: pointer;
      }
      .nopageerror:hover {
         background: rgb(242, 242, 242);
         cursor: pointer;
      }
    }
    .table_head_right {
      margin-left: 20px;
      flex: 2;
      border: 1px solid #ccc;
      .pages {
        margin: 20px 20px;
        padding: 10px;
      }
      .pages:hover {
         background: rgb(242, 242, 242);
         cursor: pointer;
      }
    }
    
  }
  .table {
    width: 100%;
    background: white;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.32);
    .New_Configuration :hover{
      cursor: pointer;
    }
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
.icons i {
  font-size: 19px;
  display: inline-block;
  margin: 0 5px;
}
.hoverBgcolor {
      background: rgb(242, 242, 242);
}
</style>  