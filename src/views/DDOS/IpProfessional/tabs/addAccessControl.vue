<template>
  <div id="addAccessControl">
    <div class="ccProtectPartThree">
      <div class="partThreeTop newClear">
        <el-button class="addAccessBtn" @click="addAccessModel">{{$t('DDOS.Proteccon_figura.Add_access')}}</el-button>
        <span class="topTipAdd">{{$t('DDOS.Proteccon_figura.add_access')}}</span>
        <span class="floatRightSearch">
          <el-input class="searchIpt" placeholder="请输入要查找的策略名称" v-model="tableDataName"></el-input><el-button @click="doFilter" class="el-icon-search"></el-button>
        </span>
      </div>
      <div class="tableList">
        <div class="tableConControl">
          <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%;margin: 18px 0 20px;">
            <el-table-column prop="accessName" :label="$t('DDOS.Proteccon_figura.Policy_name')" width="">
            </el-table-column>
            <el-table-column prop="protocol" :label="$t('DDOS.Proteccon_figura.Agreement')" width="">
            </el-table-column>
            <el-table-column prop="protentIp" :label="$t('DDOS.Proteccon_figura.Protection_IP')">
            </el-table-column>
            <el-table-column prop="doMin" label="域名">
            </el-table-column>
            <el-table-column prop="MatchCondition" :label="$t('DDOS.Proteccon_figura.Matching_condition')">
            </el-table-column>
            <el-table-column prop="MatchAction" :label="$t('DDOS.Proteccon_figura.Matching_action')">
            </el-table-column>
            <el-table-column prop="createTime" :label="$t('DDOS.Proteccon_figura.Creation_time')">
            </el-table-column>
            <el-table-column prop="nowState" :label="$t('DDOS.Proteccon_figura.Current_state')">
            </el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="scope">
                <!-- <el-button type="text" size="small">查看</el-button>
                <el-button type="text" size="small" @click="handelEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button @click.native.prevent="deleteRow(scope.$index, tableDataBegin)" type="text" size="small" style="color: red;">移除</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tabListPage">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalItems">
          </el-pagination>
			  </div>
      </div>
    </div>
    <addAccessModel :isShow="addAccessContModel" @closeDialogModel="closeDialogModel" @addAccessContSure="addAccessContSure"/>
  </div>
</template>
<script>
import addAccessModel from '../model/addAccessContModel'
export default {
  data(){
    return{
      tableDataBegin: [],//表格数据
      tableDataName: "",//搜索框内容
      tableDataEnd: [],//定义一个数组
      currentPage: 1,//当前页
      pageSize: 10,//每页长度
      totalItems: 0,//总数
      filterTableDataEnd: [],//过滤后的数组
      addAccessContModel:false,//添加访问控制策略弹框
      flag: false,
      allData:[
        {
          accessName:'11',
          protocol:'11',
          protentIp:'11',
          doMin:'111',
          MatchCondition:'111',
          MatchAction:'111',
          createTime:'111',
          nowState:'111'
        }
      ]
    }
  },
  components:{
    addAccessModel:addAccessModel
  },
  // computed:{
  //   getData1(){
  //     console.log(this.allData)
  //     return this.allData
  //   }
  // },
  mounted(){
    this.getData();
    console.log(this.allData)
  },
  methods:{
    // 获取数据
    getData() {
      
    },
    // 搜索
    doFilter() {
      this.tableDataBegin = this.allData;
      // if (this.tableDataName == "") {
      // this.$message.warning("查询条件不能为空！");
      // return;
      // }
      this.tableDataEnd = []
        //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = []
      this.tableDataBegin.forEach((val, index) => {
        if (val.name, val.type) {
          if (val.name.indexOf(this.tableDataName) == 0 && val.type.indexOf(this.value) == 0) {
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
    //添加访问控制策略弹框
    addAccessModel(){
      this.addAccessContModel=true;
    },
    //添加访问控制策略弹框关闭按钮
    closeDialogModel(isShow){
      this.addAccessContModel=isShow;
    },
    //添加访问控制策略确定按钮
    addAccessContSure(isShow){
      this.addAccessContModel=isShow;
    }
  }
}
</script>
<style lang="scss">
#addAccessControl{
  .ccProtectPartThree{
    margin-top:10px;
    .addAccessBtn{
      height:30px;
      border-radius: 0;
      background-color:#006eff;
      color:#fff;
      margin-right:35px;
      padding:0 12px;
      line-height:30px;
    }
    .topTipAdd{
      font-size:14px;
      color:#8f9297;
    }
    .floatRightSearch{
      float:right;
      .searchIpt{
        float:left;
        width:180px;
        input{
          width:180px;
          font-size:12px;
        }
      }
      button{
        height:30px;
        line-height:30px;
        padding:0 12px;
        border-radius: 0;
        float:left;
        :hover{
          background-color:transparent;
        }
      }
    }
    .tableList{
      width:100%;
      background-color:#fff;
      border:1px solid #ddd;
      box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
      margin-bottom:20px;
      margin-top:12px;
      .tableConControl{
        min-height:450px;
      }
      .tabListPage{
        height:50px;
        border-top:1px solid #ddd;
        padding-top:8px;
      }
    }
  }
}
</style>