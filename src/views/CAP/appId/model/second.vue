<template>
  <div class="appidSecond"  v-loading="loading">
    <el-row>
      <el-button type="primary">购买套餐包</el-button>
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
            <div>
              <span>每页显示行</span>
              <el-select v-model="value2" placeholder="10" style="width:64px" size="mini" @change="selectShowRow">
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
      options2: [
        {
          value: "10",
          label: "10"
        },
        {
          value: "20",
          label: "20"
        },
        {
          value: "30",
          label: "30"
        },
        {
          value: "40",
          label: "40"
        },
        {
          value: "50",
          label: "50"
        }
      ],
      loading:false,
      value: "可使用",
      value2: "10",//默认展示行数
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
    // 改变页数
    handleCurrentChange(val){
      console.log(val)
      this.currpage = val;
    },
    // 选择展示行
    selectShowRow(val){
      console.log(val)  
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

