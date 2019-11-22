<!--  -->
<template>
  <div class="tabFour">
    <div class="table">
      <el-table :data="tableData" style="width: 100%">
        <template slot="empty">{{$t('CCN.CCN.tabs.tab1no')}}</template>
        <el-table-column prop="DestinationCidrBlock" :label="$t('CCN.CCN.tabs.tab4tr1')" width></el-table-column>
        <el-table-column prop="Enabled" :label="$t('CCN.CCN.tabs.tab4tr2') " width>
          <template slot-scope="scope">
            <div v-if="scope.row.Enabled == true" class="off_color">有效</div>
            <!-- <div v-if="scope.row.Enabled == 0" class="close_color">关闭</div> -->
            <div v-else>关闭</div>
          </template>
        </el-table-column>
        <el-table-column prop="InstanceId" :label="$t('CCN.CCN.tabs.tab4tr3')" width>
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text">
              {{ scope.row.InstanceId }}
            </el-button>
            <p class="edit">{{ scope.row.InstanceName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="InstanceRegion" :label="$t('CCN.CCN.tabs.tab4tr4')"></el-table-column>
        <el-table-column prop="UpdateTime" :label="$t('CCN.CCN.tabs.tab4tr5')" width></el-table-column>
        <el-table-column prop="operate" :label="$t('CCN.CCN.tabs.tab4tr6')" width>
          <template slot-scope="scope">
            <!-- <el-switch v-model="value1"></el-switch> -->
            <el-switch
              style="display: block;"
              v-model="scope.row.Enabled"
              @change="change(scope.row)"
              active-color="#13ce66"
              inactive-color="#888">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ccnId: '',
      visible2: false,
      value1: true,
      tableData: [{}] // 列表数据
    }
  },
  created () {
    console.log(this.$route.query)
    this.ccnId = this.$route.query.ccnId
    this.getData()
  },
  methods: {
    getData: function () {
      var params = {
        Version: '2017-03-12',
        Region: 'ap-taipei',
        CcnId: this.ccnId
      }
      // 查询-路由表
      this.$axios.post('vpc2/DescribeCcnRoutes', params).then(res => {
        console.log(res)
        this.tableData = res.Response.RouteSet
      })
    },
    change: function (route) {
      var params = {
        Version: '2017-03-12',
        Region: 'ap-taipei',
        CcnId: this.ccnId,
        'RouteIds.0': route.RouteId
      }
      console.log(route)
      if (route.Enabled) { // true启用
        this.$axios.post('vpc2/EnableCcnRoutes', params).then(res => {
          console.log(res)
        })
      } else { // false 禁用
        this.$axios.post('vpc2/DisableCcnRoutes', params).then(res => {
          console.log(res)
        })
      }
    }
  }
}
</script>
<style lang="scss">
.el-table {
  .cell {
    font-size: 12px;
    .el-button{
      font-size: 12px;
      padding: 0;
    }
  }
}
</style>
<style lang="scss" scoped>
.tabFour {
  .table {
    margin-top: 20px;
    min-height: 450px;
    background: #fff;
    .cell {
      font-size: 12px;
    }
    .close_color {
      color: #e54545;
    }
    .off_color {
      color: #0abf5b;
    }
  }
  .newDialog {
    span {
      color: #444;
    }
    .price {
      color: #ff7800;
      font-size: 24px;
    }
  }
  .dialog-footer {
    text-align: center;
    .el-button {
      height: 30px;
      line-height: 6px;
      border-radius: 0px;
    }
  }
}
</style>
