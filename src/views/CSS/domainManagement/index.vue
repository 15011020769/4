<template>
  <div class="domainManagement-wrap">
    <HeadCom title="域名管理"></HeadCom>
    <div class="wrap">
      <div class="domainTitle-wrap">
        <div class="title">
          <p>关于推流域名：直播已为您提供系统推流域名，您亦可添加自有已备案域名进行推流。</p>
          <p>关于播放域名：您需要添加自有已备案域名进行直播播放，更多域名管理使用方法参见域名管理和CNAME配置</p>
          <p>若您暂无域名，可通过腾讯云域名注册快速注册属于您的域名。</p>
        </div>
      </div>
      <div class="domainTitleBnt">
        <div class="bntWrap" style="flex:1">
          <el-button type="primary" @click="addDomin">添加域名</el-button>
          <el-button type="primary" @click="editTags">编辑标签</el-button>
        </div>

        <div class="input" style="width:300px;">
          <el-input v-model="tableDataName" placeholder="输入部分域名搜索" size="small" class="inputSearch" style="width:90%;">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="doFilter"></i>
          </el-input>
          <i class="el-icon-refresh"></i>
        </div>
      </div>
      <div class="domainTable">
        <div class="tableWrap">
          <el-table
            :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            ref="multipleTable"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            > 
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column prop="domin" label="域名" width>
              <template slot-scope="scope">
                <a href="#">{{scope.row.domin}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="cname" label="CNAME" width></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="startTime" label="开始时间"></el-table-column>
            <el-table-column prop="outTime" label="过期时间"></el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="scope">
                <el-button type="text" size="small">管理</el-button>
                <el-button type="text" size="small" @click="startBtn(scope.$index, scope.row)">启用</el-button>
                <el-button type="text" size="small" @click="stopBtn(scope.$index, scope.row)">禁用</el-button>
                <el-button
                  @click.native.prevent="deleteRow(scope.$index, scope.row)"
                  type="text"
                  size="small"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tabListPage">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalItems"
          ></el-pagination>
        </div>
      </div>
      <addModel :isShow="addModel" @closeAddModel="closeAddModel"/>
      <stopModel :isShow="stopDominArr" @closeStopDominModel="closeStopDominModel"/>
      <deleteModel :isShow="deleteDominArr" @closedeleteDominModel="closedeleteDominModel"/>
      <editTagsModel :isShow="editTagsModel" @closeEditTagsModel="closeEditTagsModel"/>
    </div>
  </div>
</template>

<script>
import HeadCom from "@/components/public/Head";
import addModel from './model/addModel'
import stopModel from './model/stopModel'
import deleteModel from './model/deleteModel'
import editTagsModel from './model/editTagsModel'
export default {
  components: {
    HeadCom,
    addModel:addModel,//添加域名弹框
    stopModel:stopModel,//禁用弹框
    deleteModel:deleteModel,//删除弹框
    editTagsModel:editTagsModel,//编辑标签
  },
  name: "domainManagement",
  data() {
    return {
      tableDataBegin: [
        {
          domin:'www.text.cn',
          cname:'www.txet.cn.lifbdj.fsdfkjb.fdks',
          type:'播放域名',
          status:'已启用',
          startTime:'2019-12-20 15：10:06',
          outTime:''
        }
      ],//表格数据
      tableDataName: "",//搜索框值
      tableDataEnd: [],//定义一个空数组
      currentPage: 1,//当前页数
      pageSize: 10,//每页长度
      totalItems: 0,//总数量
      filterTableDataEnd: [],//过滤之后的数组
      flag: false,//定义一个开关
      checkArr:[],//被选中选项
      addModel:false,//添加域名弹框
      stopModel:false,//禁用弹框
      stopDominArr:[],//禁用数组传值
      deleteDominArr:[],//删除域名数组传值
      deleteModel:false,//删除弹框
      editTagsModel:false,//编辑标签弹框
    };
  },
  mounted(){
    this.getData();
  },
  methods:{
    //checkbox框选择事件
    handleSelectionChange(val){
      console.log(val);
      this.checkArr=val;
    },
    // 获取数据
    getData() {
      // this.axios.get('/src/assets/demo.json', {}).then((res) => {
        // console.log(res.data.tableData);
        // this.tableDataBegin = res.data.tableData;
        this.allData = this.tableDataBegin;
        // 将数据的长度赋值给totalItems
        this.totalItems = this.tableDataBegin.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin[index]);
          }
        } else {
          this.tableDataEnd = this.tableDataBegin;
        }
      // })
    },
    // 搜索
    doFilter() {
      this.tableDataBegin = this.allData;
      this.tableDataEnd = []
        //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = []
      this.tableDataBegin.forEach((val, index) => {
        if (val.domin) {
          if (val.domin.indexOf(this.tableDataName) == 0 ) {
            this.filterTableDataEnd.push(val);
            this.tableDataBegin = this.filterTableDataEnd;
          } else {
            this.filterTableDataEnd.push();
            this.tableDataBegin = this.filterTableDataEnd;
          }
        };
      });
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1
      this.totalItems = this.filterTableDataEnd.length
        //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd);
      //页面初始化数据需要判断是否检索过
      this.flag = true;

    },
    // 分页开始
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage(this.tableDataEnd)
      } else {
        this.currentChangePage(this.filterTableDataEnd)
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataEnd = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from]);
        }
      }
    },
    //禁用按钮
    stopBtn(index,row){
      this.stopModel=true;
      this.stopDominArr.push(this.stopModel);
      this.stopDominArr.push(row.domin);
      // =[this.stopModel,row.domin]
    },
    //关闭禁用域名弹框
    closeStopDominModel(isShow){
      console.log(isShow)
      this.stopModel=isShow;
    },
    //删除按钮
    deleteRow(index,row){
      this.deleteModel=true;
      this.deleteDominArr.push(this.deleteModel);
      this.deleteDominArr.push(row.domin);
    },
    //关闭删除弹框
    closedeleteDominModel(isShow){
      this.deleteModel=isShow;
    },
    //编辑标签
    editTags(){
      if(this.checkArr.length==0){
        this.$message({
          showClose: true,
          message: '没有选择域名'
        });
        return false
      }else{
        this.editTagsModel=true;
      }
    },
    //关闭编辑标签弹框
    closeEditTagsModel(isShow){
      this.editTagsModel=isShow;
    },
    //添加域名
    addDomin(){
      this.addModel=true;
    },
    //关闭添加域名弹框
    closeAddModel(isShow){
      this.addModel=isShow;
    },
    //启用按钮
    startBtn(){

    }
  }
};
</script>

<style lang="scss" scoped>
.newClear:after {
  display: block;
  content: "";
  clear: both;
}
.domainManagement-wrap >>> .el-button {
  height: 30px;
  line-height: 30px;
  border-radius: 0;
  font-size: 12px;
  padding-top: 0;
}
.wrap {
  width: 100%;
  .domainTitle-wrap {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    .title {
      color: #003b80;
      padding: 10px 30px 10px 20px;
      border: 1px solid #97c7ff;
      border-radius: 2px;
      background: #e5f0ff;
      box-sizing: border-box;
      p {
        margin: 5px;
      }
    }
  }
  .domainTitleBnt {
    width: 100%;
    display: flex;
    padding: 0px 20px 0 20px;
    box-sizing: border-box;
  }
  .domainTable {
    padding: 20px 20px 0px 20px;
    box-sizing: border-box;
    width: 100%;
    .tableWrap {
      width: 100%;
      min-height: 450px;
      background: white;
      .Right-style {
        display: flex;
        justify-content: flex-end;

        .esach-inputL {
          width: 300px;
          margin-right: 20px;
        }
      }
      .page-box {
        padding: 20px;
        padding-right: 30px;
        box-sizing: border-box;
      }
    }
  }
  .el-icon-refresh {
    font-size: 20px;
  }
  .tabListPage{
    height:50px;
    padding-top:8px;
    border-top:1px solid #ddd;
    text-align:right;
    background-color:#fff;
  }
}
</style>