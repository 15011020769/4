<template>
  <div class="appidSecond"  v-loading="loading">
    <el-row>
      <el-button type="primary" @click="buyNew">购买套餐包</el-button>
      <el-select v-model="value" placeholder="请选择" size="small" @change="selectOne">
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
          <el-table :data="tableData.slice((currpage - 1) * pagesize, currpage * pagesize)" style="width: 100%;"   class="table_set">
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
            <el-pagination
              :page-size="pagesize"
              :pager-count="7"
              :page-sizes="[10, 20, 30, 40,50]"
              layout="sizes, prev, pager, next"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :total="TotalCount"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {GETALLAPPID_LIST} from '@/constants/CAP.js'
export default {
  data() {
    return {
      options: [
        {
          value: "可使用",
          label: "可使用"
        },
        {
          value: "已用完",
          label: "已用完"
        },
        {
          value: "已过期",
          label: "已过期"
        }
      ],
      loading:false,
      value: "可使用",
      tableData: [],
      //分页
      TotalCount:0,
      pagesize:10,
      currpage: 1,
    };
  },
  mounted() {
    // setInterval(()=>{
    //   this.loading=false;
    // },2000)
    // let params={
    //   "Action":"DescribeCaptchaUserAllAppId",
    //   "Version":"2019-07-22",
    // }
    // this.axios.post(GETALLAPPID_LIST,params).then(res=>{
    //   console.log(res)
    // })

  },
  methods: {
    // 选择第一项
    selectOne(val){
       console.log(val)
    },
     handleSizeChange(val) {
      console.log(`每頁 ${val} 條`);
    },
    // 改变页数
    handleCurrentChange(val){
      this.currpage = val;
    },
   
    //路由跳转
    buyNew(){
       this.$router.push({
        path: '/purchase'
      })
    }
  },
  watch:{
    // 监听表格数据变化改变loadding的值
    tableData:function(newVal){
      if(!newVal){
        // this.loading=false
      }else{
        // this.loading=true
      }
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
     .table_set{
        min-height: 450px !important;
      }
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

