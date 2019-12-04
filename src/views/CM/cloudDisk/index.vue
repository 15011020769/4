<template>
  <div class="CM-wrap">
    <Loading :show="loadShow" />
    <!-- 城市按钮 -->
    <div class="CVM-title">云硬盘</div>
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
        <el-table-column prop="" label="ID/名称">
          <template slot-scope="scope">
            <p>
              <a @click="jump(scope.row.DiskId)" style="cursor:pointer;">{{scope.row.DiskId}}</a>
            </p>
            {{ scope.row.DiskName}}
          </template>
        </el-table-column>
        <el-table-column prop="" label="监控">
          <template slot-scope="scope">
            <a @click="jump(scope.row.DiskId)" style="cursor:pointer;"><i class="el-icon-share"></i></a>
            
          </template>
        </el-table-column>
        <el-table-column prop="" label="大小(GB)">
          <template slot-scope="scope">
            {{scope.row.DiskSize}}
          </template>
        </el-table-column>

        <el-table-column prop="" label="硬盘类型">
          <template slot-scope="scope">
            <p>{{DiskType[scope.row.DiskType]}}</p>
            <p>{{DiskUsage[scope.row.DiskUsage]}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="" label="关联云主机ID/名称">
          <template slot-scope="scope">
            <p>{{scope.row.InstanceId}}</p>

          </template>
        </el-table-column>
        <!-- <el-table-column label="健康状态">
          <template slot-scope="scope">

          </template>
        </el-table-column> -->

<!-- 
        <el-table-column label="告警策略数">
          <template slot-scope="scope">

          </template>
        </el-table-column> -->
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
  import Loading from "@/components/public/Loading";
  import {
    ALL_CITY,
    DISK_LIST,
    ALL_PROJECT
  } from '@/constants';
  export default {
    data() {
      return {
        loadShow: false,
        searchOptions: [{
          value: 'disk-usage',
          label: '云盘类型'
        }, {
          value: 'disk-id',
          label: '云硬盘ID'
        }, {
          value: 'disk-name',
          label: '云盘名称'
        }],
        searchValue: '',
        DiskUsage: {
          SYSTEM_DISK: '系统盘',
          DATA_DISK: '数据盘'
        },
        cities: [],
        selectedRegion: 'ap-taipei', // 默认选中城市
        selectedCity: {}, // 切换城市
        DiskType: {
          CLOUD_BASIC: '普通云硬盘',
          CLOUD_PREMIUM: '高性能云硬盘',
          CLOUD_SSD: 'SSD云硬盘'
        },
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
      SEARCH,
      Loading
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
          Version: '2017-03-12',
          Offset: this.currpage * this.pagesize - this.pagesize,
          Limit: this.pagesize,
        };
        if (this.searchValue !== '' && this.searchInput !== '') {
          param['Filters.0.Name'] = this.searchValue
          param['Filters.0.Values.0'] = this.searchInput

        }
        const paramS = {
          allList: 0,
        };
        // 获取表格数据
        this.axios
          .post(DISK_LIST, param)
          .then((data) => {
            if (data.Response.Error == undefined) {
              this.TbaleData = data.Response.DiskSet;
              this.loadShow = false;
            } else {
              this.$message.error(data.Response.Error.Message);
            }
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
      jump(id) {
        this.$router.push({
          name: 'Diskdetails',
          query: {
            id,
          },
        });
      }
    },
  };

</script>
<style scoped lang="scss">
.CM-wrap{
  width: 100%;
  height: 100%;
}
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
