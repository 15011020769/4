<template>
  <div class="wrap">
    <div class="basicProtTit">
      <span>{{ $t("DDOS.basicProtection.jcfh") }}</span>
      <el-select v-model="selectedSubarea" placeholder class="codeOrigin">
        <el-option
          v-for="item in subareas"
          :key="item.subarea"
          :label="item.lable"
          :value="item.subarea"
        ></el-option>
      </el-select>
      <el-button>{{ region }}</el-button>
    </div>
    <div class="basicProtCon">
      <div class="newClear">
        <div class="basicProtConSearch newClear">
          <el-input
            :placeholder="$t('DDOS.basicProtection.qsrzjmip')"
            class="searchIpt"
            v-model="searchInputVal"
            @change="doFilter"
          />
          <el-button @click="doFilter" class="el-icon-search"></el-button>
        </div>
      </div>
      <div class="tableBasic">
        <div class="tableBasicCon">
          <el-table
            :data="
              tableDataBegin.slice(
                (currentPage - 1) * pageSize,
                currentPage * pageSize
              )
            "
            v-loading="loading"
            height="450"
          >
            <el-table-column
              prop="Name"
              :label="$t('DDOS.basicProtection.zjm')"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  v-if="selectedSubarea == 'cvm'"
                  @click="toDoDetail(scope.row)"
                  >{{ scope.row.InstanceName }}</el-button
                >
                <el-button
                  type="text"
                  v-else-if="selectedSubarea == 'clb'"
                  @click="toDoDetail(scope.row)"
                  >{{ scope.row.LoadBalancerName }}</el-button
                >
                <el-button
                  type="text"
                  v-else-if="selectedSubarea == 'nat'"
                  @click="toDoDetail(scope.row)"
                  >{{ scope.row.NatGatewayName }}</el-button
                >
              </template>
            </el-table-column>
            <el-table-column prop="IP" :label="$t('DDOS.basicProtection.bdip')">
              <template slot-scope="scope">
                <div v-if="selectedSubarea == 'cvm'">
                  <span
                    v-for="(item, index) in scope.row.PublicIpAddresses"
                    :key="index"
                    >{{ item }}</span
                  >
                </div>
                <div v-else-if="selectedSubarea == 'clb'">
                  <span
                    v-for="(item, index) in scope.row.LoadBalancerVips"
                    :key="index"
                    >{{ item }}</span
                  >
                </div>
                <div v-else-if="selectedSubarea == 'nat'">
                  <span
                    v-for="(item, index) in scope.row.PublicIpAddressSet"
                    :key="index"
                    >{{ item.PublicIpAddress }}</span
                  >
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="InstanceType"
              :label="$t('DDOS.basicProtection.zjlx')"
            >
              <span v-if="selectedSubarea == 'cvm'">{{
                $t("DDOS.basicProtection.yzj")
              }}</span>
              <span v-else-if="selectedSubarea == 'clb'">{{
                $t("DDOS.basicProtection.fzjh")
              }}</span>
              <span v-else-if="selectedSubarea == 'nat'">NAT</span>
              <span v-else-if="selectedSubarea == 'net'">{{
                $t("DDOS.basicProtection.hlw")
              }}</span>
            </el-table-column>
            <el-table-column
              prop="Status"
              :label="$t('DDOS.basicProtection.aqzt')"
            >
              <template slot-scope="scope">
                <div v-if="selectedSubarea == 'cvm'">
                  <span v-if="scope.row.InstanceState == 'PENDING'">{{
                    $t("DDOS.basicProtection.cjz")
                  }}</span>
                  <span
                    v-else-if="scope.row.InstanceState == 'LAUNCH_FAILED'"
                    >{{ $t("DDOS.basicProtection.cjsb") }}</span
                  >
                  <span v-else-if="scope.row.InstanceState == 'RUNNING'">{{
                    $t("DDOS.AssetList.Running")
                  }}</span>
                  <span v-else-if="scope.row.InstanceState == 'STOPPED'">{{
                    $t("DDOS.basicProtection.gj")
                  }}</span>
                  <span v-else-if="scope.row.InstanceState == 'STARTING'">{{
                    $t("DDOS.basicProtection.kjz")
                  }}</span>
                  <span v-else-if="scope.row.InstanceState == 'STOPPING'">{{
                    $t("DDOS.basicProtection.gjz")
                  }}</span>
                  <span v-else-if="scope.row.InstanceState == 'REBOOTING'">{{
                    $t("DDOS.basicProtection.cqz")
                  }}</span>
                  <span v-else-if="scope.row.InstanceState == 'SHUTDOWN'">{{
                    $t("DDOS.basicProtection.tzdxh")
                  }}</span>
                  <span v-else-if="scope.row.InstanceState == 'TERMINATING'">{{
                    $t("DDOS.basicProtection.xhz")
                  }}</span>
                </div>
                <div v-else-if="selectedSubarea == 'clb'">
                  <span v-if="scope.row.Status == '0'">{{
                    $t("DDOS.basicProtection.cjz")
                  }}</span>
                  <span v-else-if="scope.row.Status == '1'">{{
                    $t("DDOS.basicProtection.zcyx")
                  }}</span>
                </div>
                <div v-else-if="selectedSubarea == 'nat'">
                  <span v-if="scope.row.State == 'PENDING'">{{
                    $t("DDOS.basicProtection.scz")
                  }}</span>
                  <span v-else-if="scope.row.State == 'DELETING'">{{
                    $t("DDOS.basicProtection.del")
                  }}</span>
                  <span v-else-if="scope.row.State == 'AVAILABLE'">{{
                    $t("DDOS.AssetList.Running")
                  }}</span>
                  <span v-else-if="scope.row.State == 'UPDATING'">{{
                    $t("DDOS.basicProtection.sjz")
                  }}</span>
                  <span v-else-if="scope.row.State == 'FAILED'">{{
                    $t("DDOS.basicProtection.sb")
                  }}</span>
                </div>
              </template>
            </el-table-column>
            <!-- 操作：升级防护 跳转页面为BGP高防包，不涉及此功能 -->
          </el-table>
        </div>
        <div class="Right-style pagstyle">
          <span class="pagtotal"
            >共&nbsp;{{ totalItems }}&nbsp;{{
              $t("DDOS.UnsealCode.tiao")
            }}</span
          >
          <el-pagination
            :page-size="pageSize"
            :pager-count="7"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="totalItems"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { CVM_LIST, CLB_LIST, NAT_LIST, ALL_CITY, DESCRIBE_CHANNEL_DEVICE_RESOURCE } from '@/constants'
import { ErrorTips } from '@/components/ErrorTips'
export default {
  data () {
    return {
      loading: true,
      // 专区选择
      selectedSubarea: 'cvm',
      subareas: [
        { subarea: 'cvm', lable: '雲伺服器專區' },
        { subarea: 'clb', lable: '負載均衡專區' },
        { subarea: 'nat', lable: 'NAT伺服器專區' },
        { subarea: 'net', lable: '網際網路通道' }
      ],
      // 地域选择
      selectedCity: {},
      selectedRegion: localStorage.getItem('regionv2'),
      cities: [],
      // 实例列表
      tableDataBegin: [],
      // 搜索框输入值
      searchInputVal: '',
      // 过滤刷新列表过程中使用
      allData: [], // 存储全部实例列表
      tableDataEnd: [],
      filterTableDataEnd: [],
      str: '',
      strs: '',
      strss: '',
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      flag: false,
      region: '載入中...'
    }
  },
  created () {
    this.getCity()
    this.getData()
  },

  watch: {
    selectedSubarea: function () {
      this.getData()
    }
  },
  methods: {
    inpVal () {
      if (this.searchInputVal == '') {
        this.getData()
      }
    },
    getData () {
      this.currentPage = 1
      this.allData.splice(0, this.allData.length)
      if (this.selectedSubarea == 'cvm') {
        this.describeInstances()
      } else if (this.selectedSubarea == 'clb') {
        this.describeLoadBalancers()
      } else if (this.selectedSubarea == 'nat') {
        this.describeNatGateway()
      } else if (this.selectedSubarea == 'net') {
        // this.describeNetInstances()
        // this.$message("此服務功能暫未開通！");
        this.tableDataBegin = this.allData
        this.totalItems = 0
      }
    },
    describeNetInstances () {
      this.axios.post(DESCRIBE_CHANNEL_DEVICE_RESOURCE, {
        Version: '2018-07-09',
        BasicRegion: 'tpe',
        BasicBizType: 'channel'
      }).then(res => {
        console.log(res)
      })
    },
    describeInstances () {
    // 1.1.查询云服务器实例列表
      this.loading = true
      let params = {
        Version: '2017-03-12',
        Region: this.selectedRegion,
        Limit: 100
      }
      this.axios.post(CVM_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.allData = res.Response.InstanceSet
          this.tableDataBegin = res.Response.InstanceSet
          this.totalItems = res.Response.TotalCount
        } else {
          let ErrTips = {
            'InternalServerError': '操作內部錯誤',
            'InvalidFilter': '無效的過濾器',
            'InvalidFilterValue.LimitExceeded': 'Filter參數值數量超過限制',
            'InvalidHostId.Malformed': '無效CDH ID，指定的CDH ID格式錯誤',
            'InvalidInstanceId.Malformed': '無效實例ID，指定的實例ID格式錯誤',
            'InvalidParameter': '無效參數',
            'InvalidParameterValue': '無效參數值',
            'InvalidParameterValue.LimitExceeded': '參數值數量超過限制',
            'InvalidZone.MismatchRegion': '指定的zone不存在'
          }
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
        this.loading = false
      })
    },
    // 1.2.查询负载均衡实例列表
    describeLoadBalancers () {
      this.loading = true
      let params = {
        Version: '2018-03-17',
        Region: this.selectedRegion
      }
      this.axios.post(CLB_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.allData = res.Response.LoadBalancerSet
          this.tableDataBegin = res.Response.LoadBalancerSet
          this.totalItems = res.Response.TotalCount
        } else {
          let ErrTips = {
            'FailedOperation': '操作失敗',
            'InternalError': '必須包含開始時間和結束時間，且必須為整形時間戳（精確到秒）',
            'InvalidParameterValue.MaxResult': '內部錯誤',
            'InvalidParameter': '參數錯誤',
            'InvalidParameter.FormatError': '參數格式錯誤',
            'InvalidParameterValue': '參數取值錯誤',
            'InvalidParameterValue.InvalidFilter': 'Filter參數輸入錯誤',
            'InvalidParameterValue.Length': '參數長度錯誤',
            'UnauthorizedOperation': '未授權操作'
          }
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
        this.loading = false
      })
    },
    // 1.3.查询NAT网关/查询NET服务器专区实例列表
    describeNatGateway () {
      this.loading = true
      let params = {
        Version: '2017-03-12',
        Region: this.selectedRegion
      }
      this.axios.post(NAT_LIST, params).then(res => {
        if (res.Response.Error === undefined) {
          this.allData = res.Response.NatGatewaySet
          this.tableDataBegin = res.Response.NatGatewaySet
          this.totalItems = res.Response.TotalCount
        } else {
          let ErrTips = {}
          let ErrOr = Object.assign(ErrorTips, ErrTips)
          this.$message({
            message: ErrOr[res.Response.Error.Code],
            type: 'error',
            showClose: true,
            duration: 0
          })
        }
        this.loading = false
      })
    },
    // 搜索
    doFilter () {
      this.loading = true
      if (this.searchInputVal != null && this.searchInputVal != '') {
        // 每次手动将数据置空,因为会出现多次点击搜索情况
        this.tableDataBegin = new Array()
        this.filterTableDataEnd = new Array()
        var arr = []
        let cb
        switch (this.selectedSubarea) {
          case 'cvm':
            cb = item => {
              return item.InstanceName.includes(this.searchInputVal) ||
                    item.PrivateIpAddresses.includes(this.searchInputVal) ||
                    item.PublicIpAddresses.includes(this.searchInputVal)
            }
            break
          case 'clb':
            cb = item => {
              return item.LoadBalancerName.includes(this.searchInputVal) ||
                    item.LoadBalancerVips.includes(this.searchInputVal)
            }
            break
          case 'nat':
            cb = item => item.NatGatewayName.includes(this.searchInputVal)
            break
          // case 'cvm':
          //   break
        }
        this.tableDataBegin = this.allData.filter(cb)
        // this.allData.forEach((val, index) => {
        //   if (val.InstanceName.includes(this.searchInputVal)) {
        //     arr.push(val);
        //   }
        // });
        // this.tableDataBegin = arr;
      } else {
        // 如果没有输入搜素内容
        this.tableDataBegin = this.allData
      }

      // 页面数据改变重新统计数据数量和当前页
      this.currentPage = 1
      this.totalItems = this.tableDataBegin.length
      // 渲染表格,根据值
      this.currentChangePage(this.tableDataBegin)
      // 页面初始化数据需要判断是否检索过
      this.flag = true
      this.loading = false
    },
    // 获取城市列表
    getCity () {
      this.axios.get(ALL_CITY).then(data => {
        this.cities = data.data
        this.selectedRegion = data.data[0].Region
        this.selectedCity = data.data[0]
        this.$cookie.set('regionv2', this.selectedCity.Region)
        this.region = data.data[0].zone
      })
    },
    // 切换城市
    changeCity (city) {
      this.selectedCity = city
      this.$cookie.set('regionv2', city.Region)
      this.getData()
    },
    // 分页开始
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`);
      this.pageSize = val
      this.handleCurrentChange(this.currentPage)
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val
      // 需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd)
      } else {
        this.currentChangePage(this.filterTableDataEnd)
      }
    }, // 组件自带监控当前页码
    currentChangePage (list) {
      let from = (this.currentPage - 1) * this.pageSize
      let to = this.currentPage * this.pageSize
      this.tableDataEnd = []
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from])
        }
      }
    },
    // 跳转详情页
    toDoDetail (basicRow) {
      let insTemp = {}
      // 判断专区类型，转换传参对象
      if (this.selectedSubarea == 'cvm') {
        insTemp['Id'] = basicRow.InstanceId
        insTemp['Name'] = basicRow.InstanceName
        for (let i in basicRow.PublicIpAddresses) {
          insTemp['Ip.' + i] = basicRow.PublicIpAddresses[i]
        }
      } else if (this.selectedSubarea == 'clb') {
        insTemp['Id'] = basicRow.LoadBalancerId
        insTemp['Name'] = basicRow.LoadBalancerName
        for (let i in basicRow.LoadBalancerVips) {
          insTemp['Ip.' + i] = basicRow.LoadBalancerVips[i]
        }
      } else if (this.selectedSubarea == 'nat') {
        insTemp['Id'] = basicRow.NatGatewayId
        insTemp['Name'] = basicRow.NatGatewayName
        for (let i in basicRow.PublicIpAddressSet) {
          insTemp['Ip.' + i] = basicRow.PublicIpAddressSet[i].PublicIpAddress
        }
      }
      // 判断IP地址
      if ((insTemp['Ip.0'] == null) | (insTemp['Ip.0'] == '')) {
      } else {
        this.$router.push({
          path: '/basicProteDetail',
          query: {
            instance: JSON.stringify(insTemp)
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap >>> .el-button {
  height: 30px;
  padding-top: 0;
  font-size: 12px;
  border-radius: 0;
  line-height: 30px;
}
.Right-style {
  display: flex;
  justify-content: flex-end;

  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
.newClear:after {
  display: block;
  clear: both;
  content: "";
}
.basicProtTit {
  width: 100%;
  height: 52px;
  line-height: 52px;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  padding: 0 20px;
  span {
    font-size: 16px;
    font-weight: 600;
    margin-right: 38px;
  }
  .codeOrigin {
    border: 0;
    margin-right: 20px;
    ::v-deep input {
      border: 0;
      width: 150px;
    }
  }
  .taiwan {
    width: 100px;
    height: 30px;
    line-height: 30px;
    ::v-deep input {
      width: 100px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #006eff;
      color: #006eff;
      border-radius: 0;
    }
  }
}
.basicProtCon {
  width: 100%;
  padding: 20px;
  .basicProtConSearch {
    text-align: right;
    margin-bottom: 20px;
    float: right;
    .searchIpt {
      width: 300px;
      float: left;
      height: 30px;
      ::v-deep input {
        width: 100%;
        height: 30px;
        border-radius: 0;
        line-height: 30px;
      }
    }
    .el-icon-search {
      width: 50px;
      float: left;
      border-radius: 0;
      height: 30px;
      padding: 0;
      text-align: center;
      line-height: 30px;
    }
  }
  .tableBasic {
    background-color: #fff;
    .tableBasicCon {
      min-height: 450px;
    }
  }
}
.tabListPage {
  text-align: right;
  height: 50px;
  border-top: 1px solid #ddd;
  padding-top: 8px !important;
}
</style>
