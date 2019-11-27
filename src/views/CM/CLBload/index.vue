<template>
  <div>
    <!-- 城市按钮 -->
    <div class="CVM-title">负载均衡CLB</div>
    <div class="tool">
      <Cities :cities="cities" class="city" :Cityvalue.sync="selectedRegion" @changeCity="changeCity" />
      <!-- 搜索 -->
      <SEARCH :searchOptions='searchOptions' :searchValue="searchValue" @changeValue="changeValue"
        :searchInput='searchInput' @changeinput='changeinput' @clicksearch='clicksearch'></SEARCH>
    </div>
    <!-- 表格 -->
    <div class="Table-SY">
      <el-table :data="TbaleData.slice((currpage - 1) * pagesize, currpage * pagesize)" height="550"
        style="width: 100%">
        <el-table-column prop="" label="ID/主机名 " width="120">
          <template slot-scope="scope">
            <p v-for="i in scope.row.LoadBalancerVips">
              <a @click="jump(scope.row.LoadBalancerId,i)" style="cursor:pointer;">{{scope.row.LoadBalancerId}}</a>
            </p>
            {{ scope.row.LoadBalancerName}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="监控" width="80">
          <template slot-scope="scope">
            <i class="el-icon-share"></i>
          </template>
        </el-table-column>
        <el-table-column prop="" label="状态">
          <template slot-scope="scope">
            <p :class="scope.row.Status=='1'?'green':'orange'">
              {{instanceStatus[scope.row.Status]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop="" label="VIP">
          <template slot-scope="scope">
            <p v-for="i in scope.row.LoadBalancerVips">
              {{i}}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="" label="网络类型">
          <template slot-scope="scope">
            {{LoadBalancerType[scope.row.LoadBalancerType]}}
          </template>
        </el-table-column>

        <el-table-column prop="VpcId" label="所属网络">
        </el-table-column>
        <el-table-column prop="CreateTime" label="创建时间">
        </el-table-column>

      </el-table>
      <div class="Right-style pagstyle">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :page-sizes="[20, 30, 40,50,100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
          :total="TbaleData.length">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import Cities from '@/components/public/CITY';
  import SEARCH from '@/components/public/SEARCH';
  import {
    ALL_CITY,
    CLB_LIST,
    ALL_PROJECT
  } from '@/constants';
  export default {
    data() {
      return {
        searchOptions: [{
          value: 'LoadBalancerIds.0',
          label: '实例ID'
        }],
        searchValue: '',
        instanceStatus: {
          0: '创建中',
          1: '正常',
        },
        LoadBalancerType: {
          OPEN: '公网',
          INTERNAL: '内网',
        },
        cities: [],
        selectedRegion: 'ap-taipei', // 默认选中城市
        selectedCity: {}, // 切换城市
        searchInput: '',
        TbaleData: [], // 表格数据
        pagesize: 20, // 分页条数
        currpage: 1, // 当前页码
      };
    },
    created() {
      this.GetCity();
      this.GetTabularData();
    },
    components: {
      Cities,
      SEARCH
    },
    methods: {
      // 获取城市列表
      GetCity() {
        this.axios.get(ALL_CITY).then((data) => {
          this.cities = data.data;
          this.selectedRegion = data.data[0].Region;
          this.selectedCity = data.data[0];
          this.$cookie.set('regionv2', this.selectedCity.Region);
        });
      },
      // 切换城市
      changeCity(city) {
        this.selectedCity = city;
        this.$cookie.set('regionv2', city.Region);
        this.GetTabularData();
      },
      //选择搜索条件
      changeValue(val) {
        this.searchValue = val
      },
      changeinput(val) {
        this.searchInput = val
        if (this.searchInput === '') {
          this.GetTabularData()
        }
      },
      clicksearch(val) {
        this.searchInput = val
        if (this.searchInput !== '' && this.searchValue !== '') {
          this.GetTabularData()
        } else {
          this.$message.error('请输入正确搜索信息');
        }

      },
      // 添加项目列表的表格数据
      GetTabularData() {
        const param = {
          Region: this.selectedRegion,
          Version: '2018-03-17',
          Offset: this.currpage * this.pagesize - this.pagesize,
          Limit: this.pagesize,
        };
        if (this.searchValue !== '' && this.searchInput !== '') {
          param[this.searchValue] = this.searchInput
        }
        const paramS = {
          allList: 0,
        };
        // 获取表格数据
        this.axios
          .post(CLB_LIST, param)
          .then((data) => {
            console.log(data)
            if (data.Response.Error == undefined) {
              this.TbaleData = data.Response.LoadBalancerSet;
            } else {
              this.$message.error(data.Response.Error.Message);
            }
            console.log(this.TbaleData)
          })
      },
      handleSizeChange(val) {
        this.pagesize = val
        this.currpage = 1
        this.GetTabularData()
      },
      handleCurrentChange(val) {
        this.currpage = val;
        this.GetTabularData()
      },
      jump(id, vip) {
        this.$router.push({
          name: 'CLBloaddetails',
          query: {
            id,
            vip
          },
        });
      }
    },
  };

</script>

<style scoped lang="scss">
  .green {
    color: green
  }

  .red {
    color: red
  }

  .orange {
    color: orange
  }

  .tool {
    display: flex;
    justify-content: space-between;
    margin: 20px 20px 0 20px;
  }

  .CVM-title {
    background: #fff;
    line-height: 60px;
    font-weight: bold;
    padding-left: 20px;
    font-size: 16px;
  }

  .Right-style {
    display: flex;
    justify-content: flex-end;

    .esach-inputL {
      width: 300px;
      margin-right: 20px;
    }
  }

  .Table-SY {
    background: #fff;
    margin: 20px;
  }

  .pagstyle {
    padding: 20px;
  }

</style>
