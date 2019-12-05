<template>
  <div>
    <div class="basicProtTit">
      <span>DDoS基础防护</span>
      <el-select v-model="codeOrigin" placeholder="" class="codeOrigin">
        <el-option label="云服务器专区" value="codeOrigin1"></el-option>
      </el-select>
      <el-select v-model="taibei" placeholder=""  class="codeOrigin">
        <el-option label="中国台北" value="taibei"></el-option>
      </el-select>
    </div>
    <div class="basicProtCon">
      <div class="basicProtConSearch">
        <el-input placeholder="请输入主机名/主机IP搜索" class="searchIpt" v-model="searchInputVal"/><el-button @click="doFilter" class="el-icon-search"></el-button>
      </div>
      <div>
        <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
          <el-table-column prop="InstanceName" label="主机名">
            <template slot-scope="scope">
              <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.InstanceName}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="IP" label="绑定IP">
            <template slot-scope="scope">
              <div v-if="scope.row.PublicIpAddresses != undefined">
                {{scope.row.PublicIpAddresses[0]}}
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column prop="InstanceType" label="主机类型">
            云主机
            <!-- <template slot-scope="scope">{{scope.row.InstanceType}}</template> -->
          </el-table-column>
          <el-table-column prop="RestrictState" label="安全状态">
            <template slot-scope="scope">
              <div v-if="scope.row.RestrictState == 'NORMAL'">正常</div>
              <div v-else-if="scope.row.RestrictState == 'EXPIRED'">过期</div>
              <div v-else-if="scope.row.RestrictState == 'PROTECTIVELY_ISOLATED'">被安全隔离</div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="" label="操作" width="180">
              <el-button
                type="text"
                size="small"
                @click="buyBgp"
              >升级防护</el-button>
          </el-table-column> -->
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
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { CVM_INSTANCES } from '@/constants'
export default {
  data() {
    return {
      codeOrigin:"云服务器专区",
      taibei:"中国台北",
      // 实例列表
      tableDataBegin: [],
      // 搜索框输入值
      searchInputVal: '',
      // 过滤刷新列表过程中使用
      allData: [],  // 存储全部实例列表
      tableDataEnd: [],
      filterTableDataEnd: [],
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      
      flag: false,
      dialogVisible:false,
    }
  },
  created() {
    this.getData();
  },
  methods:{
    getData() {
      this.describeInstances()
    },
    // 1.1.查询实例列表
    describeInstances() {
      let params = {
        Version: "2017-03-12",
        Region: 'ap-taipei'
      }
      this.axios.post(CVM_INSTANCES, params).then(res => {
        console.log(res)
        this.tableDataBegin = res.Response.InstanceSet
        this.allData = res.Response.InstanceSet
        this.totalItems = res.Response.TotalCount
      })
    },
    // 搜索
    doFilter() {
      // console.log(this.searchInputVal)
      if (this.searchInputVal != null && this.searchInputVal != ''){
        //每次手动将数据置空,因为会出现多次点击搜索情况
        this.tableDataBegin = new Array()
        this.filterTableDataEnd = new Array()
        this.allData.forEach((val, index) => {
          let arr = val.PublicIpAddresses
          if (val.InstanceName == this.searchInputVal) {
            this.filterTableDataEnd.push(val)
          } else if (arr != undefined && arr.indexOf(this.searchInputVal) > -1) {
            this.filterTableDataEnd.push(val)
          }
        })
        this.tableDataBegin = this.filterTableDataEnd
      } else {// 如果没有输入搜素内容
        this.tableDataBegin = this.allData
      }
      
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.tableDataBegin.length;
      //渲染表格,根据值
      this.currentChangePage(this.tableDataBegin);
      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    // 升级防护
    // buyBgp() {
    //   console.log('升级防护')
    // },
    
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
    //跳转详情页
    toDoDetail(basicIndex,basicRow){
      // console.log(basicIndex, basicRow)
      if(basicRow.PublicIpAddresses != undefined){
        this.$router.push({
          path: "/basicProteDetail",
          query: {
            instance: basicRow
          }
        });
      }
    }
  }
}
</script>
<style lang="scss">
.newClear:after{
  display: block;
  clear: both;
  content: "";
}
.basicProtTit{
  width:100%;
  height:52px;
  line-height:52px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
  padding:0 20px;
  span{
    font-size:16px;
    font-weight:600;
    margin-right:38px;
  }
  .codeOrigin{
    margin-right:38px;
    border:0;
    input{
      border:0;
    }
  }
}
.basicProtCon{
  width:100%;
  padding:20px;
  .basicProtConSearch{
    text-align:right;
    margin-bottom:20px;
    .searchIpt{
      width:300px;
    }
  }
}
.tabListPage{
  text-align:right
}
</style>