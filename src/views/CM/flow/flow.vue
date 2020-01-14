<template>
  <div class="history-wrap">
    <div class="head">
      <Header title="流量监控" />
      <el-tabs v-model="activeName">
        <el-tab-pane label="外网出带宽" name="first">
          <div class="history-main">
            <div class="box">
              <div class="table-top">
                <div class="table_top_head">
                  <div style>
                    <XTimeX v-on:switchData="GetDat" :classsvalue="value"></XTimeX>
                  </div>
                  <div class="contrast">
                    <el-button @click="contrast">数据对比</el-button>
                    <!-- <span><span>对比</span><span>&times;</span></p> -->
                  </div>

                  <div class="export">
                    <a @click="exportData" style="margin-right:10px;">导出数据</a>
                    <a @click="exportImg">导出图片</a>
                  </div>
                </div>
                <h3>外网出带宽</h3>
                <div class="echarts" style="width:100%">
                  <!-- <Ecarts/> -->
                </div>
              </div>
              <h3>报表详情</h3>
              <div class="table">
                <el-table
                  :data="tableData"
                  style="width: 100%"
                  height="450"
                  :default-sort="{prop: 'date', order: 'descending'}"
                >
                  <el-table-column prop="address" label="时间" sortable></el-table-column>
                  <el-table-column prop="address" label="外出带宽"></el-table-column>
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import XTimeX from "@/components/public/TimeN";
// import Ecarts from "@/components/public/echars-line"
export default {
  name: "history",
  data() {
    return {
      activeName: "first",
      value: 1,
      dialogVisible: false, //购买短信弹出框
      input: "", //搜索框的值
      tableData: [],
      //分页
      TotalCount: 0, //总条数
      pagesize: 10, // 分页条数
      currpage: 1 // 当前页码
    };
  },
  components: {
    Header,
    XTimeX
    // Ecarts
  },
  created() {},
  methods: {
    //获取数据
    GetDat(data) {
      // console.log(data);
    },
    //取消
    // cancel() {
    //   this.dialogVisible = false;
    // },
    // //确定
    // save() {
    //   this.dialogVisible = false;
    // },
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
    },
    contrast() {
      //数据对比
      alert("对比");
    },
    exportData() {
      //导出数据
      alert("导出数据");
    },
    exportImg() {
      //导出图片
      alert("导出图片");
    }
  }
};
</script>

<style lang="scss" scoped>
.history-wrap >>> .header {
  border: 0;
  margin-bottom: -8px;
}
.history-wrap >>> a:hover {
  border-bottom: 1px solid #006eff;
}
.history-wrap >>> .el-tabs__header {
  margin: 0;
  padding: 0 20px;
  box-sizing: border-box;
}
.history-wrap >>> .el-button,
.history-wrap >>> .el-input__inner {
  height: 30px;
  border-radius: 0;
  padding-top: 0;
  line-height: 30px;
  font-size: 12px;
}
.history-wrap {
  .head {
    background: white;
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
  a {
    color: #006eff;
    cursor: pointer;
  }
  .cursor {
    cursor: pointer;
  }
  .history-main {
    padding: 20px;
    box-sizing: border-box;
    background: #f2f2f2;

    .icons {
      display: flex;
      align-items: center;

      i {
        font-size: 15px;
        color: #666;
        margin-left: 5px;
        cursor: pointer;
        padding: 5px;
        box-sizing: border-box;
      }
      i:hover {
        background: #f2f2f2;
      }
    }

    .box {
      background: white;
      padding: 20px;
      padding-bottom: 0;
      box-sizing: border-box;
    }
    .table-top {
      border: 1px solid #ccc;
      height: 450px;
      margin-bottom: 10px;
      .table_top_head {
        width: 100%;
        display: flex;
        align-items: center;
        .contrast {
          margin: 23px 10px 0 10px;
          display: flex;
          cursor: pointer;
          span.del {
            font-size: 16px;
          }
        }
        .export {
          margin-top: 22px;
          margin-left: 15px;
        }
      }
      h3 {
        margin: 20px;
      }
      .echarts {
        border: 1px solid #ccc;
        width: 100%;
        height: 340px;
      }
    }
  }
}
</style>