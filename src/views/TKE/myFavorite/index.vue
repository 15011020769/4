<template>
  <div class="myFavorite-wrap">
    <HeadCom title="我的收藏"></HeadCom>
    <div class="body">
      <div class="room">
        <div class="room-top">
          <div class="top-left">
            <el-button :disabled="this.multipleSelection.length?false:true" size="mini" class="botton-size" @click="disFavor()">取消收藏</el-button>
          </div>
          <div class="top-right">
              <el-input v-model.trim="input" :placeholder="$t('TKE.myMirror.qsrjxmc')" size="mini" ></el-input>
              <el-button icon="el-icon-search" size="mini" style="margin-left:-1px;height:28px;" :plain="true" @click="getSearch()"></el-button>
              <i class="el-icon-download" @click="exportExcel()"></i>
          </div>
        </div>
        <div class="room-bottom">
          <el-table
            id="exportTable"
            :data="tableData"
            style="width: 100%"
            height="450"
            @selection-change="handleSelectionChange"
            v-loading="loadShow"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="reponame" :label="$t('TKE.overview.mc')">
               <template slot-scope="scope">
                 <p>
                   <a style="cursor:pointer;" @click="jump(scope.row)">{{scope.row.reponame}}</a>
                 </p>
              </template>
            </el-table-column>
            <el-table-column prop="public" :label="$t('TKE.overview.lx')">
              <template slot-scope="scope">
                 {{scope.row.public | publics}}
              </template>
            </el-table-column>
            <el-table-column prop="regionId" label="地域">
              <template>
                港澳台地区(台灣台北)
              </template>
            </el-table-column>
            <el-table-column prop="favorCount" label="收藏量"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">取消收藏</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="Right-style pagstyle">
            <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t('TKE.overview.tiao')}}</span>
            <el-pagination
              :page-size="pagesize"
              layout="sizes,prev, pager, next"
              @current-change="handleCurrentChange"
              @size-change="handleSizeChange"
              :total="TotalCount"
              :current-page.sync="currpage"
              :page-sizes="[10, 20, 50, 100]"
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
import XLSX from "xlsx";
 import FileSaver from "file-saver";
import { TKE_GETFAVOR, TKE_DELETE_BATCHDELETEFAVOR, TKE_DELETE_FAVOR } from '@/constants'
export default {
  name: 'myFavorite',
  components: {
    HeadCom
  },
  data () {
    return {
      input: '',
      tableData: [],
      TotalCount: 0, // 总条数
      pagesize: 10, // 分页条数
      currpage: 0, // 当前页码
      multipleSelection: [],
      loadShow: true,
    }
  },
  watch:{
    input(value){
      if(value === ""){
        this.getSearch()
      }
    }
  },
  created () {
    this.GetFavor()
  },

  methods: {
    handleClick (row) {
      this.DeleteFavor(row)
    },
    // 分页
    handleCurrentChange (val) {
      this.currpage = val - 1;
      this.loadShow = true
      this.GetFavor();
      this.currpage+=1
    },
    // 整体分页
    handleSizeChange(val){
      this.currpage = 0;
      this.pagesize = val
      this.loadShow = true
      this.GetFavor()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getSearch () {
      let version =  /^[a-z0-9-_.]+$/
      if(version.test(this.input) || this.input == ""){
        this.currpage = 0
        this.loadShow = true
        this.GetFavor()
      } else {
        this.$message({
              message: this.$t('TKE.myMirror.mydqsrdjxmc'),
              type: "warning",
              showClose: true,
              duration: 0
          })
      }
    },
    disFavor () {
      var obj = {}
      for (var i = 0; i < this.multipleSelection.length; i++) {
        obj['favors.' + i + '.reponame'] = this.multipleSelection[i].reponame
        obj['favors.' + i + '.repotype'] = this.multipleSelection[i].repotype
        obj['favors.' + i + '.regionId'] = this.multipleSelection[i].regionId
      }
      this.BatchDeleteFavor(obj)
    },
    // 获取我的收藏列表
    GetFavor () {
      const param = {
        reponame: this.input,
        offset: this.pagesize * this.currpage,
        limit: this.pagesize
      }
      this.axios.post(TKE_GETFAVOR, param).then(res => {
        if (res.code === 0 && res.Error == undefined){
          this.tableData = res.data.repoInfo
          this.TotalCount = res.data.totalCount
          // this.regionId = res.data.regionId
          this.loadShow = false
        } else {
          this.$message({
              message: ErrorTips[res.data.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
          })
          this.loadShow = false
        }
      })
    },
    // 取消全选收藏
    BatchDeleteFavor (obj) {
      const param = obj
      this.axios.post(TKE_DELETE_BATCHDELETEFAVOR, param).then(res => {
        if (res.code == 0 && res.Error == undefined) {
          this.currpage = 0
          this.loadShow = true
          this.GetFavor()
          this.$message({
            message: "取消收藏成功",
            type: "success",
            showClose: true,
            duration: 0
        })
        } else {
           this.$message({
              message: ErrorTips[res.data.codeDesc],
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
          this.currpage = 0
          this.loadShow = true
          this.GetFavor()
          this.$message({
            message: "取消收藏成功",
            type: "success",
            showClose: true,
            duration: 0
        })
        } else {
           this.$message({
              message: ErrorTips[res.data.codeDesc],
              type: "error",
              showClose: true,
              duration: 0
          })
        }
      })
    },
    //导出表格
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector("#exportTable"));
      /* get binary string as output */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: "application/octet-stream"
          }),
          'ccs'+ ".xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
    // 路由跳转
     jump (row) {
      if(row.public){
        this.$router.push({
          name: 'DockerHubDetailDetail',
          query: {
            id: row.reponame
          }
        })
      }
      else {
        this.$router.push({
          name: 'totalMirrorDetailInfo',
          query: {
            id: row.reponame
          }
        })
      }
    },
  },
  // 路由跳转

  filters: {
    publics: function (val) {
      if (val == 1) {
        return 'Docker Hub'
      } else {
        return '用戶公開'
      }
    },
    regionIds:function(val){
        if(val == 39){
          return '港澳台地区(台灣台北)'
        } else {
          return '-'
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
  padding:20px;
}
.room-top {
  height: 30px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.room-bottom {
  background: white;
}
.top-left {
  height: 30px;
  display: flex;
  justify-content: space-between;
}
.top-right {
  width:240px;
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
i {
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
</style>
