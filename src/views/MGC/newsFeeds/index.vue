<template>
  <div class="newdFeeds-wrap">
    <HeadCom title="通知公告"></HeadCom>
    <div class="wrap">
      <div class="wrap-button">
        <!-- <el-button type="primary" @click="removePeol">移除接收人</el-button> -->
      
            <el-button @click="removePeol">删除</el-button>
            <el-button>标记为已读</el-button>
            <el-button>全部标记为已读</el-button>
        
      </div>
      <div class="wrap-table">
        <template>
          <el-table
            :data="tableData"
            style="width: 100%"
            height="450"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="消息类型" width="180">
                <template slot-scope="scope">
                   <el-link @click="detailsMesg(scope.row)" type="primary">{{scope.row.title}}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="content" label="站内信" width="180"></el-table-column>
            <el-table-column label="邮件">-</el-table-column>
            <el-table-column label="短信" width="180">-</el-table-column>
            <el-table-column label="微信" width="180">-</el-table-column>
            <el-table-column label="企业微信">-</el-table-column>
            <el-table-column label="语音" width="180">-</el-table-column>
            <el-table-column label="接收人" width="180">-</el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, tableData)"
                  type="text"
                  size="small"
                >移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <div class="Right-style pagstyle" style="height:70px;">
          <span class="pagtotal">共&nbsp;{{TotalCount}}&nbsp;条</span>
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
    <!-- 删除对话框 -->
      <el-dialog
  title="批量删除"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>删除后将无法恢复，您确定要删除吗？</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmDel">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
export default {
  components: {
    HeadCom
  },
  name: "newdFeeds",
  data() {
    return {
      TotalCount: 0, //分页
      pagesize: 10, //分页条数
      currpage: 1, //当前页码
      tableData: [], //表格数据
      dialogVisible:false,//删除弹框
      getData:[] //选中的数据
    };
  },
  created() {
    this.init();
  },
  methods: {
    //初始化表格数据
    init() {
      let params = {
        searchForm: this.tableData,
        limit: this.pagesize,
        page: this.currpage
      };
      this.axios
        .post(
          `${process.env.VUE_APP_adminUrl}` + "/taifucloud/notice/owner/list",
          params
        )
        .then(res => {
          this.tableData = res.data.list;
          this.TotalCount = res.data.totalCount;
        });
    },
    //批量删除
    removePeol(){
      if(this.getData.length != 0){
          this.dialogVisible = true
      }else{
         this.$message("请选择数据")
      }
    },
    //删除按钮
    confirmDel(){
      console.log(1)
    },
    //跳转详情页
    detailsMesg(val){
      this.$router.push({
      path: "/newsdetils",
        query: {
          detailsData: val.id
        }
      });
    },
    //表格选框
    handleSelectionChange(val) {
       this.getData = val
    },
    //分页
    handleCurrentChange(val) {
      this.currpage = val;
      this.init();
    },
    //关闭删除弹框
    handleClose(){
      this.dialogVisible = false
    }
  }
};
</script>

<style lang="scss" scoped>
.newdFeeds-wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  font-size: 12px;
  padding-top: 0;
}
.wrap {
  width: 100%;
  .wrap-button {
    width: 100%;
    padding: 20px 0px 20px 20px;
    box-sizing: border-box;
  }
  .wrap-table {
    width: 100%;
    padding: 0px 20px 0 20px;
    box-sizing: border-box;
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