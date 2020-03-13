<template>
  <div class="DockerHub-wrap">
    <HeadCom title="公有镜像">
      <slot>
        <div class="head-address">
          <City :Cityvalue.sync="selectedRegion" :cities="cities" class="city" @changeCity="changeCity"></City>
        </div>
      </slot>
    </HeadCom>
    <div class="body">
      <div class="room">
        <div class="room-top">
          <div class="context-center">
            <div>
              <el-input placeholder="请输入名称" v-model="input" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" class="btn-search" @click="getSearch()"></el-button>
              </el-input>
            </div>
          </div>
        </div>
        <div class="room-bottom">
          <el-table
            :data="tableData"
            style="width: 100%"
            height="450"
            v-loading="loadShow"
          >
            <!-- 自定义样式 -->
            <el-table-column  align="center" min-width="5%" prop='isUserFavor'>
              <template slot-scope="scope">
                <el-tooltip class="item" effect="light" :content="scope.row.isUserFavor?'取消收藏':'收藏'" placement="left" >
                  <i :class="[scope.row.isUserFavor?'el-icon-star-on icon-color':'el-icon-star-off']" @click="handleClick(scope.row)" ></i>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column  align="center" min-width="10%">
              <template>
                
              </template>
            </el-table-column>
            <el-table-column prop="reponame" label="名称" min-width="20%">
              <template slot-scope="scope">
                <p>
                  <a style="cursor:pointer;" @click="jump(scope.row)">{{scope.row.reponame}}</a>
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="isQcloudOfficial" label="类型" min-width="20%">
              <template slot-scope="scope">
                {{scope.row.isQcloudOfficial|isQcloudOfficials}}
              </template>
            </el-table-column>
            <el-table-column prop="favorCount" label="收藏量" min-width="20%"></el-table-column>
            <el-table-column prop="pullCount" label="下载量" min-width="20%" sortable></el-table-column>
          </el-table>
          <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;页</span>
            <el-pagination
              :page-size="pagesize"
              layout="prev, pager, next"
              :current-page.sync="currpage"
              @current-change="handleCurrentChange"
              :total="TotalCount"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ErrorTips } from "@/components/ErrorTips";
import HeadCom from '@/components/public/Head'
import City from '@/components/public/CITY'
import { TKE_GET_REPOSITORY_LIST, TKE_DELETE_FAVOR, TKE_ADD_FAVOR,ALL_CITY } from '@/constants'
export default {
  name: 'totalMirror',
  components: {
    HeadCom,
    City
  },
  data () {
    return {
      input: '',
      tableData: [],
      TotalCount: 0, // 总条数
      pagesize: 10, // 分页条数
      currpage: 1, // 当前页码
      loadShow: true,
      multipleSelection: '',
      favor: '',
      cities: [],
      selectedRegion: '',
      selectedCity: '',
      select: ''
    }
  },
  created () {
    this.GetRepositoryList()
    this.GetCity()
  },
  watch:{
    input(val){
      if(val === ""){
        this.getSearch()
      }
    }
  },
  methods: {
    handleClick (row) {
      if (row.isUserFavor) {
        this.DeleteFavor(row)
      } else {
        this.AddFavor(row)
      }
    },
    // 分页
    handleCurrentChange (val) {
      this.currpage = val
      this.loadShow = true
      this.GetRepositoryList()
      console.log(val)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      console.log(this.multipleSelection)
    },
    getSearch () {
      this.loadShow = true
      this.GetRepositoryList()
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
    jump (row) {
      this.$router.push({
        name: 'totalMirrorDetailVersion',
        query: {
          id: row.reponame
        }
      })
    },
    // 获取共有镜像列表
    GetRepositoryList () {
      const param = {
        reponame: this.input,
        order: 'asc',
        offset: 10 * (this.currpage - 1),
        limit: this.pagesize
      }
      this.axios.post(TKE_GET_REPOSITORY_LIST, param).then(res => {
        console.log(res)
        if (res.code === 0 && res.Error == undefined) {
          this.tableData = res.data.repoInfo
          this.TotalCount = res.data.totalCount
          this.favor = res.data.repoInfo.isUserFavor
          this.loadShow = false
        } else {
          console.log(1)
          this.$message({
              message: ErrorTips[res.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
          })
        }
      })
    },
    // 取消收藏
    DeleteFavor (row) {
      const param = {
        reponame: row.reponame,
        repotype: row.repotype
      }
      this.axios.post(TKE_DELETE_FAVOR, param).then(res => {
        if (res.code === 0 && res.Error == undefined) {
          this.loadShow = true
          this.GetRepositoryList()
        } 
        // else {
        //   this.$message({
        //       message: ErrorTips[res.codeDesc],
        //       type: "error",
        //       showClose: true,
        //       duration: 0
        //   })
        // }
      })
    },
    // 添加收藏
    AddFavor (row) {
      const param = {
        reponame: row.reponame,
        repotype: row.repotype
      }
      this.axios.post(TKE_ADD_FAVOR, param).then(res => {
        if (res.code === 0 && res.Error == undefined) {
          this.loadShow = true
          this.GetRepositoryList()
        } 
        // else {
        //   console.log(2)
        //   this.$message({
        //       message: ErrorTips[res.codeDesc],
        //       type: "error",
        //       showClose: true,
        //       duration: 0
        //   })
        // }
      })
    }
  },
  filters: {
    isQcloudOfficials: function (val) {
      if (val) {
        return 'Tencent官方'
      } else {
        return '用户公开'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.body {
  position: relative;
}
.room {
  height: auto;
  padding:20px;
}
.room-top {
  height: 30px;
  display:flex;
  justify-content:center;
  margin-top:30px;
  .context-center{
    height: 100px;
    width: 480px;
    font-size: 14px;
  }
}
.room-bottom {
  background: white;
  margin-top:100px;
}
.top-left {
  height: 30px;
  display: flex;
  justify-content: space-between;
}
.top-right {
  height: 30px;
  display: flex;
  justify-content: space-between;
}
.botton-size {
  text-align: center;
  margin-right: 10px;
  height: 30px;
}
.search-input {
  width: 180px;
  height: 28px;
}
.room-center {
  margin-top: 20px;
  .explain {
    padding: 10px 30px 10px 20px;
    vertical-align: middle;
    color: #003b80;
    border: 1px solid #97c7ff;
    background: #e5f0ff;
    p {
      font-size: 11px;
      line-height: 18px;
    }
  }
}
.Right-style {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  .esach-inputL {
    width: 300px;
    margin-right: 20px;
  }
}
.pagstyle {
  padding: 20px;

  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
i{
  cursor: pointer;
}
// .el-icon-star-off{
//   color: #97c7ff
// }
.el-icon-download{
  font-size: 15px;
  color: #666;
  margin-left: 5px;
  cursor: pointer;
  padding: 5px;
  box-sizing: border-box;
  &:hover {
    background: #f2f2f2;
  }
}
.box {
    width: 400px;
    .top {
      text-align: center;
    }
    .left {
      float: left;
      width: 60px;
    }
    .right {
      float: right;
      width: 60px;
    }
    .bottom {
      clear: both;
      text-align: center;
    }
    .item {
      margin: 4px;
    }
    .left .el-tooltip__popper,
    .right .el-tooltip__popper {
      padding: 8px 10px;
    }
  }
  .btn-search{
    background:#2177D9!important;
    color:#fff!important;
  }
  .icon-color{
    color:#006eff;
  }
  .head-address{
    margin-top:10px;
    margin-left:20px;
    width: 250px;
    display: flex;
    justify-content: space-between;   
  }
</style>
