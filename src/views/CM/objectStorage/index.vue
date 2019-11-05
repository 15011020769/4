<template>
  <div>
    <!-- 城市按钮 -->
    <div class="CVM-title">对象存储</div>

    <!-- 搜索 -->
    <div class="Right-style"
      style="margin-top:20px;">
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
      <el-table :data="TbaleData.slice((pageIndex - 1) * pagesize, pageIndex * pagesize)"
        height="550"
        style="width: 100%">
        <el-table-column prop=""
          label="Bucket名称">
          <template slot-scope="scope">
            <p>
              <a @click="jump(scope.row.Name)"
                style="cursor:pointer;">{{scope.row.Name}}</a>
            </p>
          </template>
        </el-table-column>

        <el-table-column prop=""
          label="监控">
          <template slot-scope="scope">
            <p style="font-size:26px;">
              <a @click="jump(scope.row.peeringConnectionId)"
                style="cursor:pointer;">
              <i class="iconfont icon-jiankong"></i>
              </a>
            </p>

          </template>
        </el-table-column>

        <el-table-column prop=""
          label="地域">
          <template slot-scope="scope">
            {{scope.row.RegionName}}
          </template>
        </el-table-column>

        <el-table-column prop=""
          label="创建时间">
          <template slot-scope="scope">
            {{scope.row.CreationDate | UpName()}}
          </template>
        </el-table-column>

      </el-table>
      <div class="Right-style pagstyle">
        <el-pagination @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 30, 40,50]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import moment from 'moment';
import Cities from '@/components/Cities';
import { DISK_CITY, OBJ_LIST, OBJ_CITY } from '@/constants';
export default {
  data() {
    return {
      cities: [],
      selectedRegion: '', // 默认选中城市
      selectedCity: {}, // 切换城市
      search: '', // 搜索
      TbaleData: [], // 表格数据
      pagesize: 10, // 分页条数
      pageIndex: 1, // 当前页码
      totalCount: '', // 条数
      // 列表数据处理
      DataTime: [],
    };
  },
  created() {
    this.GetCity();
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
      this.axios.get(`${DISK_CITY}?product=MONITOR`).then((data) => {
        this.cities = data.data;
        this.selectedRegion = data.data[0].Region;
        this.selectedCity = data.data[0];
        this.$cookie.set('regionv1', this.selectedCity.regionCode);
        this.$cookie.set('regionv2', this.selectedCity.Region);
        this.GetTabularData();
      });
    },
    // 切换城市
    changeCity(city) {
      this.selectedCity = city;
      this.$cookie.set('regionv1', city.regionCode);
      this.$cookie.set('regionv2', city.Region);
      this.GetTabularData();
    },
    // 获取表格数据
    GetTabularData() {
      this.axios
        .post(OBJ_LIST)
        .then((data) => {
          this.DataTime = data.regionSet;
        })
        .then(() => {
          this.axios.post(OBJ_CITY).then((data) => {
            this.totalCount = data.Buckets.Bucket.length;
            this.TbaleData = data.Buckets.Bucket;
            for (let i = 0; i < this.TbaleData.length; i++) {
              for (let j = 0; j < this.DataTime.length; j++) {
                if (this.DataTime[j].region === this.TbaleData[i].Location) {
                  this.TbaleData[i].RegionName = this.DataTime[j].regionName;
                }
              }
            }
          });
        });
    },
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
    },
    jump(id) {
      this.$router.push({
        name: 'CMobjdetails',
        query: {
          id,
        },
      });
    },
    // 搜索按钮
    btnsearch() {
      const search = this.search;
      if (search) {
        this.TbaleData = this.TbaleData.filter(product => Object.keys(product).some(
          key => String(product[key])
            .toLowerCase()
            .indexOf(search) > -1,
        ));
      } else {
        this.GetTabularData();
        this.TbaleData = this.TbaleData;
      }
    },
  },
  filters: {
    UpName(value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
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
