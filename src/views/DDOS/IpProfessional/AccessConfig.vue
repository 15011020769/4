<template>
  <div>
    <div class="statistReportTit">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">接入配置</h3>
        <el-button class="ReportTitBtn" type="primary" @click="newBuy">新购</el-button>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="非网站业务" name="first">
            <div class="mainContent">
              <el-select class="ddosAttackSelect1" v-model="assestSech" @change="assestSechChange" filterable placeholder="请输入要查询的ID或名称">
                <el-option :label="assestSech" :value="assestSech"></el-option>
              </el-select>
            </div>
            <div class="mainContent">
              <div class="topCreateSelect">
                <el-button class="newCreate" @click="newCreate">新建</el-button>
                <el-select class="ddosAttackSelect1 ddosAttackSelect2" v-model="allImport">
                  <el-option label="导入转发规则" value="1"></el-option>
                  <el-option label="导入会话保持/健康检查" value="2" :disabled="true"></el-option>
                </el-select>
                <el-select class="ddosAttackSelect1 ddosAttackSelect2" v-model="allExport">
                  <el-option label="导出转发规则" value="1"></el-option>
                  <el-option label="导出会话保持/健康检查" value="2" :disabled="true"></el-option>
                </el-select>
                <el-button class="allDeleteBtn" :disabled="true">批量删除</el-button>
              </div>
              <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)" ref="multipleTable" @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="attackTime" label="业务域名"></el-table-column>
                  <el-table-column prop="durnTime" label="转发协议/端口"></el-table-column>
                  <el-table-column prop="attackType" label="源站端口"></el-table-column>
                  <el-table-column prop="attackStatus" label="源站IP/域名"></el-table-column>
                  <el-table-column prop="attackStatus" label="负载均衡方式"></el-table-column>
                  <el-table-column prop="attackStatus" label="健康检查"></el-table-column>
                  <el-table-column prop="attackStatus" label="会话保持"></el-table-column>
                  <el-table-column prop="attackStatus" label="水印剥离状态"></el-table-column>
                  <el-table-column prop="attackAction" label="操作" width="180">
                    <template slot-scope="">
                      <el-button
                        type="text"
                        size="small"
                      >操作</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="tabListPage">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalItems"
                  >
                  </el-pagination>
                </div>
                <p class="pContent">配置规则总数为 60 ，已用 0 ，可用 60</p>
            </div>
            <!-- 新建规则弹框 -->
            <newAddRules :isShow="dialogVisible" @addRulesSure="addRulesSure" @closeModel="closeModel"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import newAddRules from './newAddRules'
export default {
  data() {
    return {
      activeName:"first",//tab
      assestSech:'',//输入要查询的ID或名称
      tableDataBegin: [],//table绑定数据
      tableDataEnd: [],
      currentPage: 1,//当前页
      pageSize: 10,//每页长度
      totalItems: 0,//总长度
      flag: false,
      multipleTable:[],//table ref属性
      allImport:'批量导入',//批量导入
      allExport:'批量导出',//批量导出
      dialogVisible:false,//新建规则弹框
    }
  },
  components:{
    newAddRules:newAddRules
  },
  mounted() {
    
  },
  methods:{
    handleClick(){},
    //跳转新购页面
    newBuy(){
      this.$router.push({
        path: '/choose'
      })
    },
    //请输入要查询的ID或名称
    assestSechChange(){},
    //分页开始
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
        this.currentChangePage(this.tableDataEnd);
      } else {
        this.currentChangePage(this.filterTableDataEnd);
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
    //table checkbox相关事件
    handleSelectionChange(val){
      this.multipleTable=val;
    },
    //新建按钮弹框
    newCreate(){
      this.dialogVisible=true;
    },
    //新建规则弹框确定按钮
    addRulesSure(isShowFalse){
      console.log(isShowFalse)
      this.dialogVisible=isShowFalse
    },
    //弹框关闭按钮
    closeModel(isShowFalse){
      this.dialogVisible=isShowFalse
    }
  }
}
</script>
<style lang="scss">
.newClear{
  content:"";
  display: block;
  clear:both;
}
.statistReportTit{
  width:100%;
  height:84px;
  background-color:#fff;
  border-bottom:1px solid #ddd;
  padding:12px 20px 0;
  .ReportTitH3{
    float:left;
    font-size:16px;
    font-weight:600;
  }
  .ReportTitBtn{
    float:right;
    height:32px;
    line-height: 32px;
    padding:0;
  }
}
.mainContent{
  width:100%;
  min-height:100px;
  background-color:#fff;
  padding:20px;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  border:1px solid #ddd;
  margin-bottom:20px;
  .mainConListOneIpt{
    width:200px;
    input{
      width:200px;
    }
  }
}
button.newCreate{
  background-color:#006eff;
  color:#fff;
  border-radius: 0;
  padding:0;
  width:56px;
  height:30px;
  text-align: center;
  line-height: 30px;
  outline: none;
  margin-right:10px;
}
.ddosAttackSelect2{
  width:100px!important;
  div{
    width:100px!important;
    input{
      width:100px!important;
      font-size:12px;
    }
  }
}
button.allDeleteBtn{
  width:80px;
  border:1px solid #ddd;
  border-radius: 0;
  height:30px;
  text-align:center;
  line-height: 30px;
  padding:0;
}
.pContent{
  font-size:12px;
  color:#999;
}
</style>