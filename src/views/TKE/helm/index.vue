<template>
  <div class="helm-wrap">
    <HeadCom title="Helm应用">
      <slot>
        <div class="head-address">
          <City :Cityvalue.sync="selectedRegion" :cities="cities" class="city" @changeCity="changeCity"></City>
          <div class="head-cluster">
            <span style="font-size:12px;">集群</span>
            <el-select v-model="value" slot="prepend" placeholder="请选择" size="mini" style="width:100px">
              <el-option v-for="item in options"
                        :key="item.ClusterId"
                        :label="item.ClusterName"
                        :value="item.ClusterId">
              </el-option>
            </el-select>
          </div>
        </div>
      </slot>
    </HeadCom>
    <div class="wrap">
      <div class="wrap-bnt">
        <el-button type="primary" plain size="small" @click="jump()">新建</el-button>
      </div>
      <!-- <div class="helm-titleWrap">
        <div class="helm-titleBox">
          <p>Helm应用管理仅支持kubernetes 1.8以上版本的集群。</p>
        </div>
      </div> -->
      <div class="helm-table">
        <template>
          <el-table :data="tableData" style="width: 100%" height="450">
            <el-table-column label="应用名" max-width="10%"></el-table-column>
            <el-table-column label="状态" max-width="10%"></el-table-column>
            <el-table-column label="版本号" max-width="15%"></el-table-column>
            <el-table-column label="创建时间" max-width="15%"></el-table-column>
            <el-table-column label="Chart仓库" max-width="15%"></el-table-column>
            <el-table-column label="Chart命名空间" max-width="15%"></el-table-column>
            <el-table-column label="Chart版本" max-width="10%"></el-table-column>
            <el-table-column label="操作" max-width="10%"></el-table-column>
          </el-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import HeadCom from '@/components/public/Head'
import City from '@/components/public/CITY'
import {
  ALL_CITY,TKE_COLONY_LIST,TKE_DELETE_POLICIES
} from '@/constants'
export default {
  name: 'helm',
  components: {
    HeadCom,
    City
  },
  data () {
    return {
      tableData: [],
      cities: [],
      selectedRegion: '',
      selectedCity: '',
      select: '',
      options:[],
      value:''
    }
  },
  created () {
    this.GetCity()
    this.getColony()
  },
  methods: {
    getColony () { // 获取集群数据
      const param = {
        Version: "2018-05-25"
      }
      this.axios.post(TKE_COLONY_LIST, param).then(res => {
        if (res.Error == undefined) {
          console.log(res)
          this.options = res.Response.Clusters
          this.value = res.Response.Clusters[0].ClusterId
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
      // this.GetTabularData()
    },
    jump () {
      this.$router.push({
        name: 'helmCreate',
        query: {
          id: 1
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  .wrap-bnt {
    width: 100%;
    padding: 20px 0 20px 20px;
    box-sizing: border-box;
    button {
      height: 30px;
      padding: 0 20px;
      background-color: #006eff;
      color: #fff;
      border: 1px solid #006eff;
      line-height: 30px;
      text-align: center;
      outline: 0 none;
      box-sizing: border-box;
      text-decoration: none;
      font-size: 12px;
    }
  }
  .helm-titleWrap {
    width: 100%;
    padding: 0px 20px 20px 20px;
    box-sizing: border-box;
    .helm-titleBox {
      color: #c07400;
      padding: 10px 30px 10px 20px;
      border: 1px solid #ffd18b;
      border-radius: 2px;
      background: #fff4e3;
      box-sizing: border-box;
    }
  }
  .helm-table {
    width: 100%;
    padding: 0px 20px 0 20px;
    box-sizing: border-box;
  }
}
.head-address{
  margin-top:10px;
  margin-left:20px;
  width: 250px;
  display: flex;
  justify-content: space-between;
  .head-cluster{
    display: flex;
    justify-content: space-between;
    width: 140px;
  }
}
</style>
