<template>
  <div class="warnings-wrap">
    <!-- 头部 -->
    <div class="back-hd flex">
      <h2 style="padding-top:3px;">告警设置</h2>
      <div style="width:20px"></div>
      <div style="padding-top:6px;">地域</div> 
      &nbsp; <City :Cityvalue.sync="selectedRegion" :cities="cities" class="city" @changeCity="changeCity"></City>
      <div style="width:20px"></div>
      <div style="padding-top:6px;">集群</div> 
      &nbsp;
      <el-select size="mini" v-model="value" placeholder="请选择"
      style="margin-bottom:5px;">
        <el-option
          v-for="item in options"
          :key="item.ClusterId"
          :value="item.ClusterId"
          :label="item.ClusterId+'('+item.ClusterName+')'">
        </el-option>
      </el-select>
    </div>
    <div class="app-tke-fe-content__inner">
      <!-- 搜索框与新建，删除 -->
      <div class="flex">
        <div class="font" style="flex:1;padding-top:20px;">
          <router-link :to="'/warningCreate'">
            <button class="data-card-hd">新建</button>
          </router-link>
          <button class="data-card-hd data-card-hd-del" style="margin-left:8px;">删除</button>
        </div>
        <div style="position: relative;">
          <input type="search" placeholder="请输入集群名称" class="search">
          <button class="el-icon-search ip-btn"></button>
        </div>
      </div>
      <!-- 内容 -->
          <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="告警策略名称"
            width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="策略类型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="address"
            label="触发条件"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="name"
            label="告警渠道"
            width="120">
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作"
            show-overflow-tooltip>
               <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData)"
                    type="text"
                    size="small">
                    删除
                  </el-button>
                      <el-button
                    @click.native.prevent="deleteRow(scope.$index, tableData)"
                    type="text"
                    size="small">
                    复制
                  </el-button>
                </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  TKE_COLONY_LIST,
  TKE_WARNING_GETCOLONY,
  ALL_CITY
} from "@/constants";
import City from '@/components/public/CITY'
export default {
  name:'warnings',
  components: {
    City
  },
  data() {
    return {
      length: 1,
      pageSize: 20,
      pageIndex: 0,
      options: [],
      cities: [],
      selectedRegion: '',
      selectedCity: '',
      select: '',
      value: '',
      listData: [],
      multipleSelection: [],
      funllscreenLoading:false,
      tableData: []
    }
  },
  created() {
    this.getColony()
    this.GetCity()

  },
  methods:{
    // 获取集群列表
    getColony () { 
      const param = {
        Version: "2018-05-25"
      }
      this.axios.post(TKE_COLONY_LIST, param).then(res => {
        if (res.Error == undefined) {
          console.log(res)
          this.options = res.Response.Clusters
          this.value = res.Response.Clusters[0].ClusterId
          console.log(this.value)
          this.getWarningListItem()
        } else {
          this.$message({
              message: ErrorTips[res.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
          })
        }
      })
    },
    getWarningListItem () { 
      const param = {
        ClusterInstanceId: this.value,
        Limit: 20,
        Offset: 0,
        Version: "2018-05-25"
      }
      this.axios.post(TKE_WARNING_GETCOLONY, param).then(res => {
        if (res.Error == undefined) {
          console.log(res)
        } else {
          this.$message({
              message: ErrorTips[res.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
          })
        }
      })
    },
    
    GetCity () {
      this.axios.get(ALL_CITY).then(data => {
        console.log(data.data)
        this.cities = data.data
        this.selectedRegion = data.data[0].Region
        this.selectedCity = data.data[0]
        this.$cookie.set('regionv2', this.selectedCity.Region)
      })
    },
    changeCity (city) {
      this.selectedCity = city
      this.$cookie.set('regionv2', city.Region)
    },
  }
}
</script>

<style lang="scss" scoped>
.pt20 {
  padding-top: 20px;
}
.pt12 {
  padding-top: 12px;
}
.pt6 {
  padding-top: 6px;
}
.app-tke-fe-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  vertical-align: middle;
  outline: none;
  -webkit-appearance: none;
  border: 1px solid #bbb;
  background-color: #fff;
  margin:0 10px 0 10px;
}
.ep-data-card-main {
  padding: 20px 0 20px 0;
  border-bottom: 1px solid #cccccc;
}
.data-card-hd {
  height: 30px;
  min-width: 24px;
  padding: 0 20px;
  background-color: #006eff;
  color: #fff;
  border: 1px solid #006eff;
  line-height: 30px;
  text-align: center;
  display: inline-block;
  cursor: pointer;
  outline: 0 none;
  box-sizing: border-box;
  text-decoration: none;
  font-size: 12px;
  vertical-align: middle;
  white-space: nowrap;
}
.data-card-hd-del {
  border-color: #ddd;
  background-color: #fff;
  color: #bbb;
  cursor: not-allowed;
}
.init {
  padding: 0;
  margin: 0;
}
.hd-button {
  width: 80px;
  height: 22px;
}
.back-hd {
  width: 100%;
  height: 51px;
  background: white;
  padding:12px 15px 15px 15px;
  border-bottom: 1px solid #cccccc;
  font-size: 12px;
}
.flex {
  display: flex;
}
.event-persistence {
  padding: 20px 20px 10px 20px;
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.1);
}
.app-tke-fe-content__inner {
  max-width: 1360px;
  margin:0 auto;
  font-size: 0;
  margin-bottom: 50px;
  padding:20px;
}
.search {
  width: 200px;
  height: 30px;
  margin: 20px 0 10px 0;
  font-size: 12px;
  padding-left: 5px;
  border: 1px solid #cccccc;
}
.ip-btn {
  font-size: 12px;
  width: 30px;
  height: 30px;
  background: none;
  border:none;
  position: absolute;
  z-index: 1;
  top: 20px;
  right: 0px;
}
.font {
  font-size: 12px;
}
.hide {
  display: none;
}
.show {
  display: block;
}
</style>