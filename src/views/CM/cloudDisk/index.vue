<template>
  <div>
    <!-- 城市按钮 -->
    <div class="CVM-title">云硬盘</div>
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
          label="ID/名称">
          <template slot-scope="scope">
            <p>
              <a @click="jump(scope.row.storageId)"
                style="cursor:pointer;">{{scope.row.storageId}}</a>
            </p>
            <p>{{scope.row.storageName}}</p>
          </template>
        </el-table-column>

        <el-table-column prop=""
          label="监控">
          <template slot-scope="scope">
            <p style="font-size:26px;">
              <a @click="jump(scope.row.storageId)"
                style="cursor:pointer;">
                <i class="iconfont icon-jiankong"></i>
              </a>
            </p>

          </template>
        </el-table-column>

        <el-table-column prop=""
          label="状态">
          <template slot-scope="scope">
            <p style="color: #06c290">{{attached[scope.row.attached]}}</p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="容量">
          <template slot-scope="scope">
            <p>{{scope.row.storageSize}}GB</p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="可用区">
          <template slot-scope="scope">
            <p>{{zone[scope.row.zone]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop=""
          label="磁盘类型">
          <template slot-scope="scope">
            <p>{{storageType[scope.row.storageType]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop=""
          label="磁盘属性">
          <template slot-scope="scope">
            <p>{{diskType[scope.row.diskType]}}</p>
          </template>
        </el-table-column>

        <el-table-column prop=""
          label="已挂载云主机">
          <template slot-scope="scope">
            <p v-if="scope.row.uInstanceId"><a href="">{{scope.row.uInstanceId}}</a></p>
            <p v-if="!scope.row.uInstanceId">-</p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="计费模式">
          <template slot-scope="scope">
            <p>{{payMode[scope.row.payMode]}}</p>

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
          :total="TbaleData.length">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
import Cities from '@/components/Cities';
import { DISK_CITY, DISK_LIST } from '@/constants';
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
      // 列表数据处理
      attached: {
        0: '未挂载',
        1: '已挂载',
      }, // 状态
      zone: {
        'ap-guangzhou-1': '广州一区',
        'ap-guangzhou-2': '广州二区',
        'ap-guangzhou-3': '广州三区',
        'ap-guangzhou-4': '广州四区',
        'ap-shanghai-1': '上海一区',
        'ap-shanghai-2': '上海二区',
        'ap-shanghai-3': '上海三区',
        'ap-shanghai-4': '上海四区',
        'ap-beijing-1': '北京一区',
        'ap-beijing-2': '北京二区',
        'ap-beijing-3': '北京三区',
        'ap-beijing-4': '北京四区',
        'ap-chengdu-1': '成都一区',
        'ap-chengdu-2': '成都二区',
        'ap-chengdu-3': '成都三区',
        'ap-chengdu-4': '成都四区',
        'ap-xianggang-1': '香港一区',
        'ap-xianggang-2': '香港二区',
        'ap-xianggang-3': '香港三区',
        'ap-xianggang-4': '香港四区',
        'ap-chongqing-1': '重庆一区',
        'ap-chongqing-2': '重庆二区',
        'ap-chongqing-3': '重庆三区',
        'ap-chongqing-4': '重庆四区',
      }, // 可用区
      storageType: {
        cloudBasic: '普通云硬盘',
        cloudPremium: '高性能云硬盘',
        cloudSSD: 'SSD云硬盘',
      }, // 磁盘类型
      diskType: {
        root: '系统盘',
        data: '数据盘',
      }, // 磁盘属性
      payMode: {
        prePay: '包年包月',
        postPay: '按量计费',
      }, // 计费模式
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
      this.axios.post(DISK_LIST, param).then((data) => {
        this.TbaleData = data.storageSet;
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
        name: 'Diskdetails',
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
