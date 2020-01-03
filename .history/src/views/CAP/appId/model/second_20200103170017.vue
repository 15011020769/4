<template>
  <div class="appidSecond">
    <el-row>
      <el-button type="primary">购买套餐包</el-button>
      <el-select v-model="value" placeholder="请选择" size="small">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          size="medium"
          v-on:change="selectOne"
        ></el-option>
      </el-select>
    </el-row>
    <div class="tableWrap">
      <div class="table">
        <!-- 表格 -->
        <template>
          <el-table :data="tableData" style="width: 100%;" height="450px"  v-loading="loading">
            <el-table-column prop="date" label="资源包类型"></el-table-column>
            <el-table-column prop="name" label="来源"></el-table-column>
            <el-table-column prop="address" label="总额(次)"></el-table-column>
            <el-table-column prop="date" label="已使用"></el-table-column>
            <el-table-column prop="name" label="获取时间"></el-table-column>
            <el-table-column prop="address" label="到期时间"></el-table-column>
          </el-table>
        </template>
        <!-- 分页 -->
        <div class="pagstyle" style="height:70px;">
          <span>共&nbsp;{{TotalCount}}&nbsp;项</span>
          <div class="pagestyle_right">
            <div>
              <span>每页显示行</span>
              <el-select v-model="value2" placeholder="10" style="width:64px" size="mini">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
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
        }
      ],
      loading:true,
      value: "",
      value2: "",
      tableData: [],
      TotalCount:'1',
      pagesize:1,
    };
  },
  mounted() {
    setInterval(()=>{
      this.loading=false;
    },2000)
  },
  methods: {
    selectOne(){
      console.log(this.value)
    },
    handleCurrentChange(){

    }
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
          border-radius: 0 !important;
        }
      }
    }
  }
  .tableWrap {
    margin-top: 20px;
    padding: 0px 20px;
    box-sizing: border-box;
    background: #fff;
    .table {
      .pagstyle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .pagestyle_right {
          display: flex;
          justify-content: flex-start;
          div{
            span{
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
}
</style>

