<template>
  <div class="newdFeeds-wrap" >
    <HeadCom :title="$t('MGC.tzgg')"></HeadCom>
    <div class="wrap">
      <div class="message-funRight">
          <div class="search">
            <el-input :placeholder="$t('MGC.qsrnr')" v-model="inputVal" clearable></el-input>
            <span>
              <i class="el-icon-search" @click="tableSearch"></i>
            </span>
          </div>
        </div>
      <div class="wrap-table" >
        <template>
          <el-table
            :data="tableData"
            style="width: 100%"
            height="450"
            v-loading="loading"
          >
          <el-table-column
        prop="id"
        type="index"
        header-align="center"
        align="center"
        width="80"
        label="序號"
      ></el-table-column>
            <el-table-column prop="title" :label="$t('MGC.bt')" width="160px">
                <template slot-scope="scope">
                   <el-link @click="detailsMesg(scope.row)" type="primary" class="edit">{{scope.row.title}}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="publishTime" :label="$t('MGC.fbsj')" width="200px"></el-table-column>
            <el-table-column prop="content" label="訊息内容">
            <template slot-scope="scope">
                  <p v-html="scope.row.content"></p>
                </template>
            </el-table-column>
            <el-table-column prop="publishStatus" :label="$t('MGC.zt')" fixed="right" width="100px">
            <template slot-scope="scope">
                  <p>{{'已发布'}}</p>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="50px">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="detailsMesg(scope.row)"
                  type="text"
                >查看</el-button>
              </template>
            </el-table-column> 
          </el-table>
        </template>
        <div class="Right-style pagstyle" style="height:70px;">
          <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;{{$t('MGC.tiao')}}</span>
           <el-select v-model="pagevalue" placeholder="请选择" size="mini" class="pageselect" @change='pagechange'>
            <el-option
              v-for="item in pageoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-pagination
            :page-size="pagesize"
            :pager-count="7"
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :total="TotalCount"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {NOTICE_LIST} from  '@/constants/MGC.js';
import HeadCom from "@/components/public/Head";
export default {
  components: {
    HeadCom
  },
  name: "newdFeeds",
  data() {
    return {
      inputVal:'',
      loading:true,
      TotalCount: 0, //分页
      pagesize: 10, //分页条数
      currpage: 1, //当前页码
      tableData: [], //表格数据
      dialogVisible:false,//删除弹框
      getData:[], //选中的数据
      MessageDialog:false,
      pageoptions:[{
          value: 10,
          label: '10條/頁'
        }, {
          value: 20,
          label: '20條/頁'
        }, {
          value: 30,
          label: '30條/頁'
        }, {
          value: 40,
          label: '40條/頁'
        }, {
          value: 50,
          label: '50條/頁'
        }],//分页
        pagevalue:10//分页
    };
  },
  created() {
    this.init();
  },
  methods: {
    //初始化表格数据
    init() {
       let uin = "100011921910"
       let Page = this.currpage //当前页码
       let Rp = this.pagesize  //条数
       this.axios.get(`${process.env.VUE_APP_adminUrl + NOTICE_LIST}`+'?uin='+uin+'&publishStatus=2'+'&page='+Page+'&limit='+Rp).then(res=>{
         console.log(res)
         this.tableData = res.page.list
         this.TotalCount = res.page.totalCount
         this.loading = false
       })
    },
    //分页
    pagechange(){
    this.pagesize=this.pagevalue;
    console.log(123)
    this.init()
    },
    tableSearch() {
       let uin = "100011921910"
       let Page = this.currpage //当前页码
       let Rp = this.pagesize  //条数
       let title = this.inputVal
       this.axios.get(`${process.env.VUE_APP_adminUrl + NOTICE_LIST}`+'?uin='+uin+'&publishStatus=2'+'&page='+Page+'&limit='+Rp+'&title='+title).then(res=>{
         console.log(res)
         this.tableData = res.page.list
         this.TotalCount = res.page.totalCount
       })
    },
    //跳转详情页
    detailsMesg(val){
      this.$router.push({
      path: "/newsdetils",
        query: {
          detailsDatas: val.id,
        }
      });
    },
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
      this.init();
    }
  }
};
</script>

<style lang="scss" scoped>
.edit{
  cursor: pointer; 
}
.pageselect{
      margin-left:20px;
      width:100px;
      margin-top:2px;
    }
     .message-funRight {
        width: 250px;
        display: flex;
        align-items: center;
        float: right;
        padding: 20px;
        .search {
          position: relative;
          width: 80%;
          span {
            height: 36px;
            width: 32px;
            align-items: center;
            justify-content: center;
            display: flex;
            position: absolute;
            top: 2px;
            right: -31px;
            background:#b7b3b3;
            cursor: pointer;
            i {
              font-size: 18px;
              font-weight: bold;
            }
          }
        }
      }
.newdFeeds-wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  font-size: 12px;
  padding-top: 0;
}
.wrap {
  width: 100%;
  .wrap-table {
    width: 100%;
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
  }
  .el-table{
    font-size:15px !important;
  }
}
.Right-style {
  display: flex;
  justify-content: flex-end;
}
.pagstyle {
  padding: 20px;
  width: 100%;
  background: white;
  .pagtotal {
    font-size: 13px;
    font-weight: 400;
    color: #565656;
    line-height: 32px;
  }
}
</style>