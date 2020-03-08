<template>
  <div class="product-wrap">
    <Header title="产品事件"></Header>
    <div class="product-main">
      <div class="explain" style="margin-bottom:20px;">
        <p>
          事件中心概述，产品事件与平台事件区别
          <a>点击了解</a>
        </p>
      </div>
      <div class="box">
        <div class="table_top"> 
          <div class="type_data">
            <TimeDropDown :TimeArr='TimeArr' :classsvalue="value" :Datecontrol='true' :Graincontrol='false' :Difference="'D'"
      v-on:switchData="GetDat" />
          </div>
          <div class="writeput">
            <el-input v-model="searchinput" size="small" placeholder="请输入实例组名搜索"></el-input>
            <el-button icon="el-icon-search" size="small" style="margin-left:-1px;"></el-button>
          </div>
          <div class="icons">
            <i class="el-icon-setting" @click="dialog"></i>
            <i class="el-icon-download"></i>
          </div>
        </div>
        <div class="table_head">
          <div class="table_head_left">
            <div class="error">
              <p>异常事件</p>
              <p>
                <span>202</span>个
              </p>
            </div>
            <div class="noerror">
              <p>未恢复异常事件</p>
              <p style="color:red">
                <span>27</span>个
              </p>
            </div>
            <div class="nopageerror">
              <p>未配置告警异常事件</p>
              <p>
                <span>139</span>个
              </p>
            </div>
          </div>
          <div class="table_head_right">
            <div class="pages">
              <p>状态变更</p>
              <p>
                <span>0</span>个
              </p>
            </div>
          </div>
        </div>
        <div class="table">
          <el-table :data="tableData" v-loading="loadShow" style="width: 100%" height="450">
            <el-table-column prop="EventCName" label="事件" width="100"></el-table-column>
            <el-table-column prop="Type" label="类型" width="100"></el-table-column>
            <el-table-column prop="ProductCName" label="产品类型" width="90"></el-table-column>
            <el-table-column prop="Region" label="地域" width="100"></el-table-column>
            <el-table-column prop label="影响对象" width="205">
              <template slot-scope="scope">
                <p>{{scope.row.InstanceId}}</p>
                <p>{{scope.row.InstanceName}}</p>
              </template>
            </el-table-column>
            <el-table-column prop label="对象详情" width="200">
              <template slot-scope="scope">
                <div v-for="item in scope.row.Dimensions">
                  <p><span>{{item.Name}}：</span>{{item.Value}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="Status" label="状态" width="70"></el-table-column>
            <el-table-column prop label="开始时间" width="90">
              <template slot-scope="scope">
                  <p>{{getConvDate(scope.row.StartTime)}}</p>
              </template>
            </el-table-column>
            <el-table-column prop label="更新时间" width="90">
              <template slot-scope="scope">
                  <p>{{getConvDate(scope.row.UpdateTime)}}</p>
              </template>
            </el-table-column>
            <el-table-column prop="alarm" label="告警配置">
              <template slot-scope>
                  <p><span>未配置</span> <a href="#">新增配置</a></p>
              </template>
            </el-table-column>
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
    <Dialog :dialogVisible="dialogVisible" @cancel="cancel" @save="save" />
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import TimeDropDown from '@/components/public/TimeDropDown';
import Dialog from "./custom/custom";

import Loading from "@/components/public/Loading";
import { ErrorTips } from "@/components/ErrorTips.js"; //公共错误码
import { PRODUCT_EVENT_LIST } from "@/constants";

export default {
  name: "product",
  data() {
    return {
      activeName: "first",
      value: 13,
      dialogVisible: false, //弹框
      searchinput: "", //搜索框的值
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
      }
    
  },
  components: {
    Header,
    Dialog,
    TimeDropDown
  },
  
  mounted() {
    this.getProductList();
  },
  methods: {
    // 获取时间戳
    GetDat(data) {
        let StartTIme = new Date(data[1].StartTIme)
        let EndTIme = new Date(data[1].EndTIme)

        this.StartTime = StartTIme.getTime()/1000;
        this.EndTime = EndTIme.getTime()/1000;
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
    getProductList(data) {
      this.loadShow = true; //加载
      const params = {
        Region: localStorage.getItem("regionv2"),
        Version: "2018-07-24",
        Module: "monitor",
        StartTime: this.StartTime,
        EndTime: this.EndTime
      };

            //  monitor2/DescribeProductEventList   //接口
      console.log(JSON.stringify(params));
      this.axios.post(PRODUCT_EVENT_LIST, params).then(res => {
        

        if (res.Response.Error === undefined) {
          this.tableData = res.Response.Events
          console.log(this.tableData);
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
    },
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
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
    }
  }
};
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
    }
    .table_head_right {
      margin-left: 20px;
      flex: 2;
      border: 1px solid #ccc;
      .pages {
        margin: 20px 20px;
        padding: 10px;
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
.icons i {
  font-size: 19px;
  display: inline-block;
  margin: 0 5px;
}
</style>  