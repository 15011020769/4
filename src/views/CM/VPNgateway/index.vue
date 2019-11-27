<template>
  <div>
    <!-- 城市按钮 -->
    <div class="CVM-title">VPN网关</div>
    <Cities :cities="cities"
      :value.sync="selectedRegion"
      @changeCity="changeCity"
      class="city" />

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
      <el-table :data="TbaleData"
        height="550"
        style="width: 100%">
        <el-table-column prop=""
          label="ID/主机名">
          <template slot-scope="scope">
            <p>
              <a @click="jump(scope.row.unVpnGwId)"
                style="cursor:pointer;">{{scope.row.unVpnGwId}}</a>
            </p>
            <p>{{scope.row.vpnGwName}}</p>
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
          label="状态">
          <template slot-scope="scope">
            <p style="color: #06c290"> 暂无数据</p>
          </template>
        </el-table-column>

        <el-table-column prop=""
          label="所属网络">
          <template slot-scope="scope">
            <a href="">{{scope.row.unVpcId}}</a>
            {{scope.row.vpcName}}
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
import Cities from '@/components/Cities';
import { DISK_CITY, VPN_LIST } from '@/constants';
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
      const param = {
        Region: this.selectedRegion,
        offset: this.pageIndex * this.pagesize - this.pagesize,
        limit: this.pagesize,
      };
      this.axios.post(VPN_LIST, param).then((data) => {
        this.totalCount = data.totalCount;
        this.TbaleData = data.data;
        // console.log(this.TbaleData);
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.GetTabularData();
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.GetTabularData();
    },
    jump(id) {
      this.$router.push({
        name: 'CMVPNdetails',
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
};
</script>

<style scoped lang="scss">
.CVM-title {
  background: #fff;
  line-height: 60px;
  font-weight: bold;
  padding-left: 20px;
  font-size: 16px;
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
