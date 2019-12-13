<template>
  <div>
    <div class="basicProtTit">
      <span>DDoS基础防护</span>
      <el-select v-model="selectedSubarea" placeholder="" class="codeOrigin">
        <el-option
          v-for="item in subareas"
          :key="item.subarea"
          :label="item.lable"
          :value="item.subarea">
        </el-option>
      </el-select>
      <el-select v-model="selectedRegion" placeholder="" class="taiwan"> 
        <el-option
          v-for="item in cities"
          :key="item.Region"
          :label="item.lable"
          :value="item.Region"
          @click="changeCity(item)">
        </el-option>
      </el-select>
    </div>
    <div class="basicProtCon">
      <div class="newClear">
        <div class="basicProtConSearch newClear">
          <el-input placeholder="请输入主机名/主机IP搜索" class="searchIpt" v-model="searchInputVal"/><el-button @click="doFilter" class="el-icon-search"></el-button>
        </div>
      </div>
      <div class="tableBasic">
        <div class="tableBasicCon">
          <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column prop="Name" label="主机名">
              <template slot-scope="scope">
                <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.Name}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="IP" label="绑定IP">
              <template slot-scope="scope">
                <div v-if="scope.row.Ip != undefined">{{scope.row.Ip}}</div>
                <div v-else>-</div>
              </template>
            </el-table-column>
            <el-table-column prop="InstanceType" label="主机类型">
              云主机
              <!-- <template slot-scope="scope">{{scope.row.InstanceType}}</template> -->
            </el-table-column>
            <el-table-column prop="Status" label="安全状态">
              <template slot-scope="scope">
                <div v-if="scope.row.Status == 'NORMAL' | scope.row.Status == '1'">正常</div>
                <div v-else-if="scope.row.Status == 'EXPIRED'">过期</div>
                <div v-else-if="scope.row.Status == 'PROTECTIVELY_ISOLATED'">被安全隔离</div>
                <div v-else-if="scope.row.Status == 'PENDING'">生产中</div>
                <div v-else-if="scope.row.Status == 'DELETING'">删除中</div>
                <div v-else-if="scope.row.Status == 'AVAILABLE'">运行中</div>
                <div v-else-if="scope.row.Status == 'UPDATING'">升级中</div>
                <div v-else-if="scope.row.Status == 'FAILED'">失败</div>
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
  </div>
</template>
<script>
import { CVM_INSTANCES, CLB_LIST, NAT_LIST, ALL_CITY } from '@/constants'
export default {
  data() {
    return {
      // 专区选择
      selectedSubarea: "cvm",
      subareas: [
        {subarea: 'cvm', lable: "云服务器专区"},
        {subarea: 'clb', lable: "负载均衡专区"},
        {subarea: 'nat', lable: "NAT服务器专区"},
        {subarea: 'net', lable: "互联网通道"},
      ],
      // 地域选择
      selectedCity: {},
      selectedRegion: 'ap-taipei',
      cities: [],
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
    }
  },
  created() {
    this.getCity();
    this.getData();
  },
  watch: {
    selectedSubarea: function() {
      this.getData();
    }
  },
  methods:{
    getData() {
      this.currentPage=1;
      this.allData.splice(0, this.allData.length)
      if(this.selectedSubarea == 'cvm') {
        this.describeInstances()
      } else if(this.selectedSubarea == 'clb') {
        this.describeLoadBalancers()
      } else if(this.selectedSubarea == 'nat') {
        this.describeNatGateway()
      } else if(this.selectedSubarea == 'net') {
        this.$message('此服务功能暂未实现！');
        this.tableDataBegin = this.allData
        this.totalItems = 0
      }
    },
    // 1.1.查询实例列表
    describeInstances() {
      let params = {
        Version: "2017-03-12",
        Region: this.selectedRegion,
      }
      this.axios.post(CVM_INSTANCES, params).then(res => {
        console.log(params, res)
        if (res.Response.Error == undefined) {
          for(let i in res.Response.InstanceSet) {
            let ins = {Id: '', Name: '', Ip: '', Status: ''}
            ins.Id = res.Response.InstanceSet[i].InstanceId
            ins.Name = res.Response.InstanceSet[i].InstanceName
            ins.Ip = res.Response.InstanceSet[i].PublicIpAddresses[0]
            ins.Status = res.Response.InstanceSet[i].RestrictState
            this.allData.push(ins)
          }
          this.tableDataBegin = this.allData;
          this.totalItems = this.tableDataBegin.length
        } else {
          this.$message.error(res.Response.Error.Message);
        }
      })
    },
    // 1.2.查询负载均衡实例列表
    describeLoadBalancers() {
      let params = {
        Version: "2018-03-17",
        Region: this.selectedRegion
      }
      this.axios.post(CLB_LIST, params).then(res => {
        if (res.Response.Error == undefined) {
          for(let i in res.Response.LoadBalancerSet) {
            let ins = {Id: '', Name: '', Ip: '', Status: ''}
            ins.Id = res.Response.LoadBalancerSet[i].LoadBalancerId
            ins.Name = res.Response.LoadBalancerSet[i].LoadBalancerName
            ins.Ip = res.Response.LoadBalancerSet[i].LoadBalancerVips[0]
            ins.Status = res.Response.LoadBalancerSet[i].Status
            this.allData.push(ins)
          }
          this.tableDataBegin = this.allData
          this.totalItems = this.tableDataBegin.length
        } else {
          this.$message.error(res.Response.Error.Message);
        }
      })
    },
    // 1.3.查询NAT网关/查询NET服务器专区实例列表
    describeNatGateway() {
      let params = {
        Version: "2017-03-12",
        Region: this.selectedRegion,
      }
      this.axios.post(NAT_LIST, params).then(res => {
        if (res.Response.Error == undefined) {
          for(let i in res.Response.NatGatewaySet) {
            let ins = {Id: '', Name: '', Ip: '', Status: ''}
            ins.Id = res.Response.NatGatewaySet[i].NatGatewayId
            ins.Name = res.Response.NatGatewaySet[i].NatGatewayName
            ins.Ip = res.Response.NatGatewaySet[i].PublicIpAddressSet[0].PublicIpAddress
            ins.Status = res.Response.NatGatewaySet[i].State
            this.allData.push(ins)
          }
          this.tableDataBegin = this.allData
          this.totalItems = this.tableDataBegin.length
        } else {
          this.$message.error(res.Response.Error.Message);
        }
      })
    },
    // 搜索
    doFilter() {
      if (this.searchInputVal != null && this.searchInputVal != ''){
        //每次手动将数据置空,因为会出现多次点击搜索情况
        this.tableDataBegin = new Array()
        this.filterTableDataEnd = new Array()
        this.allData.forEach((val, index) => {
          if (val.Name == this.searchInputVal) {
            this.filterTableDataEnd.push(val)
          } else if (arr.Ip == this.searchInputVal) {
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
    // 获取城市列表
    getCity() {
      this.axios.get(ALL_CITY).then(data => {
        this.cities = data.data;
        this.selectedRegion = data.data[0].Region;
        this.selectedCity = data.data[0];
        this.$cookie.set("regionv2", this.selectedCity.Region);
      });
    },
    // 切换城市
    changeCity(city) {
      this.selectedCity = city;
      this.$cookie.set("regionv2", city.Region);
      this.getData();
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
      this.$router.push({
        path: "/basicProteDetail",
        query: {
          instance: JSON.stringify(basicRow)
        }
      })
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
    border:0;
    input{
      border:0;
      width: 220px;
    }
  }
  .taibeiCheck{
    width:100px;
    height:30px;
    line-height:30px;
    input{
      width:100px;
      height:30px;
      line-height: 30px;
      border:1px solid #006eff;
      color:#006eff;
      border-radius: 0;
    }
  }
}
.basicProtCon{
  width:100%;
  padding:20px;
  .basicProtConSearch{
    text-align:right;
    margin-bottom:20px;
    float:right;
    .searchIpt{
      width:300px;
      float:left;
      height:30px;
      input{
        width:100%;
        height:30px;
        border-radius: 0;
        line-height: 30px;
      }
    }
    .el-icon-search{
      width:50px;
      float:left;
      border-radius: 0;
      height:30px;
      padding:0;
      text-align:center;
      line-height: 30px;
    }
  }
  .tableBasic{
    background-color:#fff;
    .tableBasicCon{
      min-height:450px;
    }
  }
}
.tabListPage{
  text-align:right;
  height:50px;
  border-top:1px solid #ddd;
  padding-top:8px!important;
}
.taiwan{
  width:150px;
  height:30px;
  div{
    width:150px;
    height:30px;
    input{
      width:100%;
      height:30px;
      line-height:30px;
      border-radius: 0;
    }
    .el-input__suffix{
      margin-right:-35px;
    }
  }
}
</style>