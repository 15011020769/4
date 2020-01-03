<template>
  <div class="product-wrap">
    <Header title="平台事件">
      <!-- <p>产品事件</p> -->
    </Header>
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
            <TimeX v-on:switchData="GetDat" :classsvalue="value"></TimeX>
          </div>
          <div class="writeput">
              <input type="text">
          </div>
          <div class="icons">
                <i class="el-icon-setting"></i>
                <i class="el-icon-download"></i>
          </div>
        </div>
        <div class="table">
          <el-table :data="tableData" style="width: 100%" height="450">
            <el-table-column prop="date" label="事件" width="200"></el-table-column>
            <el-table-column prop="type" label="类型" width="100"></el-table-column>
            <el-table-column prop="producttype" label="产品类型" width="90"></el-table-column>
            <el-table-column prop="region" label="地域" width="100"></el-table-column>
            <el-table-column prop="influence" label="影响对象" width="105"></el-table-column>
            <el-table-column prop="objdetail" label="对象详情" width="117"></el-table-column>
            <el-table-column prop="state" label="状态" width="60"></el-table-column>
            <el-table-column prop="starttime" label="开始时间" width="90"></el-table-column>
            <el-table-column prop="updatatime" label="更新时间" width="90"></el-table-column>
            <el-table-column prop="alarm" label="告警配置"></el-table-column>
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
  </div>
</template>

<script>
import Header from "@/components/public/Head";
import TimeX from "@/components/public/TimeN";

export default {
  name: "product",
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
    TimeX
  }
};
</script>

<style lang="scss" scoped>
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
  .table_top{
    width:100%;
    margin:15px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
      .icons {
        display: flex;
        font-size: 16px;
        align-items: center;
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