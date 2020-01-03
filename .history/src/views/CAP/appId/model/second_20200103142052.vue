<template>
  <div class="appidSecond">
    <el-row>
      <el-button type="primary">购买套餐包</el-button>
      <el-select v-model="value" placeholder="请选择"  size="small">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          size="medium"
        ></el-option>
      </el-select>
    </el-row>
      <div class="tableWrap">
        <div class="table">
          <!-- 表格 -->
          <template>
            <el-table :data="tableData" style="width: 100%;" height="450px">
              <el-table-column prop="date" label="资源包类型"></el-table-column>
              <el-table-column prop="name" label="来源"></el-table-column>
              <el-table-column prop="address" label="总额(次)"></el-table-column>
              <el-table-column prop="date" label="已使用"></el-table-column>
              <el-table-column prop="name" label="获取时间"></el-table-column>
              <el-table-column prop="address" label="到期时间"></el-table-column>
            </el-table>
          </template>
          <!-- 分页 -->
          <div class="Right-style pagstyle" style="height:70px;">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;项</span>
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
 
</template>
<script>

export default {
  data() {
    return {
      options: [
        {
          value: "1",
          label: "可使用"
        },
        {
          value: "2",
          label: "已用完"
        },
        {
          value: "3",
          label: "已过期"
        }
      ],
      options2: [
        {
          value: "1",
          label: "10"
        },
        {
          value: "2",
          label: "20"
        },
        {
          value: "3",
          label: "30"
        },
        {
          value: "4",
          label: "40"
        },
        {
          value: "5",
          label: "50"
        },
      ],
      value: "",
      value2:'',
      tableData: [],
    };
  },
  mounted() {
   
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
/* css */
.appidSecond {
  box-sizing: border-box;
  padding: 20px;
  .el-row {
    .el-button--primary {
      margin-right: 10px;
      height: 30px;
      line-height: 28px;
      min-width: 21px;
      padding: 0 15px;
      font-size: 12px;
      border-radius: 0;
      border: 1px solid #006eff;
      background-color: #006eff;
    }
    .el-select {
      width: 100px;
      font-size: 12px;
      .el-input {
        .el-input__inner {
          height: 30px !important;
          border-radius: 0 !important;
        }
      }
    }
  }
  .el-table {
    margin-top: 20px;
  }
  .page_bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px;
    height: 56.5px;
    background: #fff;
    .page_bottom_right{
      .el-select{
        width: 50px;
        .el-input{
          input{
            border: none !important;
            padding: 0px 5px !important;
          }
        }
      }
    }
  }
}
</style>

