<template>
  <div>
    <!-- 城市按钮 -->
    <div class="CVM-title">云数据库-Mysql</div>
    <Cities :cities="cities"
      class="city"
      :value.sync="selectedRegion"
      @changeCity="changeCity" />

    <!-- 搜索 -->
    <div class="Right-style">
      <el-input placeholder="请输入IP或主机名"
        v-model="search"
        size='small '
        class="input-with-select esach-inputL">
        <el-button slot="append"
          @click="btnsearch()"
          icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <!-- 表格 -->
    <div class="Table-SY">
      <el-table :data="ProTableData.slice((currpage - 1) * pagesize, currpage * pagesize)"
        height="550"
        style="width: 100%">
        <el-table-column prop=""
          label="实例名">
          <template slot-scope="scope">
            <p>
              <a @click="jump(scope.row.uInstanceId)"
                style="cursor:pointer;">{{scope.row.uInstanceId}}</a>
            </p>
            <p>{{scope.row.cdbInstanceName}}</p>
            {{ scope.row.InstanceName}}
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="磁盘使用空间">
          <template slot-scope="scope">
            <p>{{scope.row.real_capacity}}MB</p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="容量使用率">
          <template slot-scope="scope">
            <p>{{scope.row.volume_rate}}%</p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="总请求数">
          <template slot-scope="scope">
            <p>{{scope.row.queries}}次/秒</p>
          </template>
        </el-table-column>

        <el-table-column prop=""
          label="查询使用率">
          <template slot-scope="scope">
            <p>{{scope.row.query_rate}}%</p>
          </template>
        </el-table-column>

        <el-table-column prop=""
          label="慢查询数">
          <template slot-scope="scope">
            <p>{{scope.row.slow_queries}}次/分</p>
          </template>
        </el-table-column>

        <el-table-column prop="projectName"
          label="所属项目">
        </el-table-column>
      </el-table>
      <div class="Right-style pagstyle">
        <el-pagination @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5,10, 20, 30, 40,50]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="ProTableData.length">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import Cities from '@/components/CITY';
import { CVM_CITY, MYSQL_LIST, CVM_PROJECT } from '@/constants';
export default {
  data() {
    return {
      instanceStatus: {
        PENDING: '创建中',
        LAUNCH_FAILED: '创建失败',
        RUNNING: '运行中',
        STOPPED: '关机',
        STARTING: '开机中',
        STOPPING: '关机中',
        REBOOTING: '重启中',
        SHUTDOWN: '停止待销毁',
        TERMINATING: '销毁中',
      },
      cities: [],
      selectedRegion: 'ap-beijing', // 默认选中城市
      selectedCity: {}, // 切换城市
      search: '', // 搜索
      TbaleData: [], // 表格数据
      ProjectData: [], // 项目列表数据
      ProTableData: [], // 添加完项目列表的表格数据
      pagesize: 5, // 分页条数
      currpage: 1, // 当前页码
    };
  },
  created() {
    this.GetCity();
    this.GetTabularData();
    // this.GetProject();
  },
  watch: {
    // 监听城市变化----数据变化
    selectedRegion() {},
  },
  components: {
    Cities,
  },
  methods: {
    // 获取城市列表
    GetCity() {
      this.axios.get(CVM_CITY).then((data) => {
        this.cities = data.regionSet;
        this.selectedRegion = data.regionSet[0].region;
        this.selectedCity = data.regionSet[0];
        this.$cookie.set('regionv1', this.selectedCity.regionCode);
        this.$cookie.set('regionv2', this.selectedCity.region);
      });
    },
    // 切换城市
    changeCity(city) {
      this.selectedCity = city;
      this.$cookie.set('regionv1', city.regionCode);
      this.$cookie.set('regionv2', city.region);
      this.GetTabularData();
    },
    // 添加项目列表的表格数据
    GetTabularData() {
      const param = {
        Region: this.selectedRegion,
      };
      const paramS = {
        allList: 0,
      };
      // 获取表格数据
      this.axios
        .post(MYSQL_LIST, param)
        .then((data) => {
          this.TbaleData = data.data;
        })
        .then(() => {
          // 获取项目列表
          this.axios.post(CVM_PROJECT, paramS).then((data) => {
            this.ProjectData = data.data;

            for (let i = 0; i < this.TbaleData.length; i++) {
              for (let j = 0; j < this.ProjectData.length; j++) {
                if (
                  this.TbaleData[i].projectId == this.ProjectData[j].projectId
                ) {
                  this.TbaleData[i].projectName = this.ProjectData[
                    j
                  ].projectName;
                }
                if (this.TbaleData[i].projectId == 0) {
                  this.TbaleData[i].projectName = '默认项目';
                }
              }
            }
            this.ProTableData = this.TbaleData;
          });
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currpage = val;
    },
    jump(id) {
      this.$router.push({
        name: 'CMMysqldetails',
        query: {
          id,
        },
      });
    },
    // 搜索按钮
    btnsearch() {
      const search = this.search;
      if (search) {
        this.ProTableData = this.ProTableData.filter(product => Object.keys(product).some(
          key => String(product[key])
            .toLowerCase()
            .indexOf(search) > -1,
        ));
      } else {
        this.GetTabularData();
        this.ProTableData = this.ProTableData;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.CVM-title {
  background: #fff;
  line-height: 60px;
  font-weight: bold;
  padding-left: 20px;
}
.city {
  margin: 20px 20px 0 20px;
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
