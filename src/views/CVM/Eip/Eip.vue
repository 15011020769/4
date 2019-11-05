<template>
  <div class="eip">
    <div class="Title">
      <div>
        <div class="eip-tit">
          <h2>弹性公网IP</h2>
        </div>
        <p> 弹性公网IP帮助文档</p>
      </div>
    </div>
    <div class="eip-City">
      <!-- 城市列表 -->
      <City :parm="parm"
        v-on:changeCity="changeCity"></City>
    </div>
    <div class="eip-operation">
      <div>
        <el-button size="small" type="primary" @click="applyObj.applyShow = true;">申请</el-button>
        <!-- <el-button size="small"> 申请指定IP </el-button>  -->
      </div>
      <div>
        <search :options="options"
          v-on:search="search"  class="btn-do"></search>
          <i class="el-icon-download"> </i>
      </div>
    </div>
    <div class="eip-table">
      <el-table ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="dataListLoading">
        <el-table-column label="ID/名称">
          <template slot-scope="scope">
              <p>{{scope.row.AddressId}}</p>
              <p v-if="scope.row.AddressName">{{scope.row.AddressName}}  <i class="el-icon-edit" @click="editObj.editShow = true;editObj.shotInfo = scope.row"></i> </p>
              <p v-if="!scope.row.AddressName">未命名  <i class="el-icon-edit" @click="editObj.editShow = true;editObj.shotInfo = scope.row"></i>  </p>
          </template>
        </el-table-column>
         <el-table-column prop=""
          label="监控"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p @click="charObj.divShow = true;charObj.charInfo = scope.row"> <i class="el-icon-edit"></i></p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="状态"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p :class="scope.row.AddressStatus === 'UNBIND'? 'red-c':'green-c'">{{scope.row.AddressStatus | eipState()}}</p>
          </template>
        </el-table-column>
        <el-table-column label="弹性IP地址"
          show-overflow-tooltip>
           <template slot-scope="scope">
              <p>{{scope.row.AddressIp}}</p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="计费模式"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <p class="red-c">按小时计费</p>
          </template>
        </el-table-column>
        <el-table-column prop="DiskId"
          label="绑定资源"
          show-overflow-tooltip>
          <template slot-scope="scope">
              <p v-if="scope.row.AddressStatus === 'UNBIND'">-</p>
              <p v-if="scope.row.NetworkInterfaceId !== 'undefined'">{{scope.row.NetworkInterfaceId}} </p>
              <p v-if="scope.row.InstanceId !== 'undefined'">{{scope.row.InstanceId}}</p>
          </template>
        </el-table-column>
        <el-table-column label="绑定资源类型"
           width="65">
          <template slot-scope="scope">
              <p v-if="scope.row.AddressStatus === 'UNBIND'">-</p>
              <p v-if="scope.row.AddressStatus === 'BIND'"></p>
          </template>
        </el-table-column>
        <el-table-column prop=""
          label="申请时间"
          show-overflow-tooltip>
           <template slot-scope="scope">
              <p>{{scope.row.CreatedTime}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作">
           <template slot-scope="scope">
              <div class="operation">
                <el-button v-if="scope.row.AddressStatus === 'UNBIND'" type="text" size="small"  @click="bindObj.bindShow = true;bindObj.bindInfo = scope.row">绑定</el-button>
                <el-button v-if="scope.row.AddressStatus === 'UNBIND'" type="text" size="small"  @click="eipObj.eipShow = true;eipObj.eipInfo = scope.row">释放</el-button>
                <el-button v-if="scope.row.AddressStatus === 'BIND' || scope.row.AddressStatus === 'BIND_ENI'" type="text" size="small" @click="unbindObj.unbindShow = true;unbindObj.unbindInfo = scope.row">解绑</el-button>
              </div>
            </template>
        </el-table-column>
      </el-table>
      <div class="eip-pag">
        <el-pagination @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>

      <release  v-if="eipObj.eipShow" :eipObj="eipObj"   @eipShowVal='eipShowVal'></release>
      <editname v-if="editObj.editShow" :editObj="editObj" @editShowVal='editShowVal'></editname>
      <unbind v-if="unbindObj.unbindShow" :unbindObj="unbindObj" @unbindShowVal='unbindShowVal'></unbind>
      <bind v-if="bindObj.bindShow" :bindObj="bindObj" @bindShowVal='bindShowVal'></bind>
      <apply v-if="applyObj.applyShow" :applyObj="applyObj" @applyShowVal='applyShowVal'></apply>
    </div>
    
    <!-- 监控 -->
    <char-div v-if="charObj.divShow" :charObj="charObj" @charShow ='charShow'></char-div>

  </div>
</template>
<script>
import qs from 'qs'
import release from './modal/release'
import editname from './modal/editname'
import unbind from './modal/unbind'
import bind from './modal/bind'
import apply from './modal/apply'
import charDiv from './modal/charDiv'
export default {
  data () {
    return {
      parm: 'FWQ', // 城市列表接口参数
      options: [ // 搜索字段
        {
          value: 'address-name',
          label: '名称'
        },
        {
          value: 'address-id',
          label: 'ID'
        },
        {
          value: 'address-ip',
          label: 'IP地址'
        }
      ],
      tableData: [], // 表格列表数据
      pageIndex: 1, // 当前页
      pageSize: 10, // 每页数
      totalPage: 0, // 表格数据数组长度
      dataListLoading: false,
      eipObj: {
        eipShow: false,
        eipInfo: {}
      },
      editObj: {
        editShow: false,
        shotInfo: {}
      },
      bindObj: {
        bindShow: false,
        bindInfo: {}
      },
      unbindObj: {
        unbindShow: false,
        unbindInfo: {}
      },
      applyObj: {
        applyShow: false,
        applyInfo: {}
      },
      charObj:{
        divShow:false,
        charInfo:{}
      }
      
    }
  },
  components: {
    release,
    editname,
    unbind,
    bind,
    apply,
    charDiv
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 列表加载
    getDataList () {
      this.dataListLoading = true
      var params = {
        Version: '2017-03-12',
        Region: this.$cookie.get('regionv2'),
        Offset: this.pageIndex * this.pageSize - this.pageSize,
        Limit: this.pageSize
      }
      this.axios.post('vpc2/DescribeAddresses', params).then(data => {
        this.tableData = data.Response.AddressSet
        this.totalPage = data.Response.TotalCount
        // console.log(this.tableData)
        this.dataListLoading = false
      })
    },
    // 城市切换
    changeCity (city) {
      this.dataListLoading = false
      this.getDataList()
    },
    // 搜索
    search (searchInput, searchSelect) {
      if (searchInput !== '' && searchSelect !== '') {
        this.dataListLoading = true
        // console.log(searchInput, searchSelect)
        var parms = {
          Version: '2017-03-12',
          Region: this.$cookie.get('regionv2'),
          Offset: this.pageIndex * this.pageSize - this.pageSize,
          Limit: this.pageSize,
          'Filters.0.Name': searchSelect,
          'Filters.0.Values.0': searchInput
        }
        this.axios.post('vpc2/DescribeAddresses', parms).then(data => {
          this.tableData = data.Response.AddressSet
          this.totalPage = data.Response.TotalCount
          this.dataListLoading = false
        })
      } else {
        this.getDataList()
      }
    },
    applyShowVal (val) {
      this.applyObj.applyShow = val
    },
    // 修改名字
    editShowVal (val) {
      this.editObj.editShow = val
    },
    // 释放
    eipShowVal (val) {
      this.eipObj.eipShow = val
    },
    // 解绑
    bindShowVal (val) {
      this.bindObj.bindShow = val
    },
    // 解绑
    unbindShowVal (val) {
      this.unbindObj.unbindShow = val
    },
    delClose () {
      this.eipVal.release = false
    },
    // 每页数
    sizeChangeHandle (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.pageIndex = 1
    },
    // 当前页
    currentChangeHandle (val) {
      console.log(`当前页: ${val}`)
      this.pageIndex = val
    },
    charShow(val){
      this.charObj.divShow = !this.charObj.divShow
    }
  }
}
</script>
<style lang="scss" scoped>
.eip {
  position: relative;
  .eip-tit{
    margin-left: 0px;
    ::v-deep .el-input__inner {
      border: 0;
    }
  }
  .eip-City{
    margin: 20px;
  }
  .eip-information {
    margin: 20px;
    line-height: 20px;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    p {
      padding-left: 20px;
      ul{
        padding-left: 25px;
        list-style: square;
      }
    }
  }
  .eip-operation {
    display: flex;
    justify-content: space-between;
    margin: 0 20px;
    .btn-do{
      float: left;
    }
    .el-icon-download{
      font-size: 18px;
      line-height: 28px;
      margin-left: 10px;
    }
  }
  .eip-table {
    margin: 20px;
    background: #fff;
    p,
    a {
      font-size: 10px;
    }
    ::v-deep .cell{
      white-space: nowrap;
    }
  }
  .eip-pag {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
  
}
</style>
