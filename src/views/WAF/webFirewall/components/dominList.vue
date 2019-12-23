<template>
  <div>
    <div class="dominList">
      <div class="dominListTitle">
        域名列表
      </div>
      <div class="dominListBtn newClear">
        <el-button class="addDomin">添加域名</el-button>
        <el-button class="deleteBtn" @click="deleteTop">删除</el-button>
        <span>一级域名套餐已用完，<a @click="packageUpgradeModel">立即升级</a>；子域名套餐还剩余18个。</span>
        <span class="floatRight">
          <el-input placeholder="请输入域名" v-model="tableDataName" class="searchIpt"></el-input>
          <el-button class="el-icon-search" @click="doFilter"></el-button>
        </span>
      </div>
      <div class="tableList">
        <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)" @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column prop="domin" label="域名" width="">
            <template slot-scope="scope">
              <!-- <a href="#" @click="toProtectSet"> -->
                {{scope.row.domin}}
              <!-- </a> -->
            </template>
          </el-table-column>
          <el-table-column prop="proStatus" label="防护状态" width="">
            <template slot-scope="scope">
              <!-- <span href="#">{{scope.row.proStatus}}<i class="el-icon-info"></i></span> -->
              <el-tooltip content="您目前使用了高防、CDN、雲加速等代理" placement="right" effect="light">
                <el-button>{{scope.row.proStatus}}<i class="el-icon-info"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="vipAddress" label="VIP地址"></el-table-column>
          <el-table-column prop="useType" label="使用模式"></el-table-column>
          <el-table-column prop="resouIpAdd" label="回源IP地址">
            <template slot-scope="scope">
              <span>{{scope.row.resouIpAdd}}<a @click="lookResouseIp(scope.row.domin,scope.row.resouIpAdd)">查看</a></span>
            </template>
          </el-table-column>
          <el-table-column prop="logSwitch" label="访问日志开关">
            <template>
              <el-switch
                v-model="logSwitchValue"
                active-color="#006eff"
                inactive-color="#bbb">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="wafSwitch" label="WAF开关">
            <template>
              <el-switch
                v-model="wafSwitchValue"
                active-color="#006eff"
                inactive-color="#bbb">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="action" label="操作" width="250">
            <template slot-scope="scope">
              <el-popover
                placement="bottom"
                width="280"
                v-model="deleteVisible">
                <div class="prpoDialog">
                  <h1>确定删除此域名？</h1>
                  <p>删除后源站IP将会遭受恶意攻击的威胁。</p>
                </div>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="deleteVisible = false">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteVisibleSure(scope.$index)">确定</el-button>
                </div>
                <el-button slot="reference" style="color:#3E8EF7;">删除</el-button>
              </el-popover>
              <!-- <el-button type="text" size="small" @click="handelEdit(scope.$index, scope.row)">编辑</el-button> -->
              <!-- <el-button @click.native.prevent="toProtectSet(scope.$index, tableDataBegin)" type="text" size="small">防护配置</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="tabListPage">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalItems">
				</el-pagination>
			</div>
    </div>
    <resouseIpModel :isShow="resouseIpModel" @closeModel="closeModel"/>
    <packageUpgradeModel :isShow="packageUpModelShow" @packageUpModelClose="packageUpModelClose"/>
    <deleteDominModel :isShow="deleteModel" @closeDeleteModel="closeDeleteModel"/>
  </div>
</template>
<script>
import resouseIpModel from '../model/resouseIpModel'
import packageUpgradeModel from '../model/packageUpgradeModel'
import deleteDominModel from '../model/deleteDominModel'
export default {
  data(){
    return{
      tableDataBegin: [],//表格数据
      tableDataName: "",//搜索框绑定
      tableDataEnd: [],//定一个空数组
      currentPage: 1,//当前页
      pageSize: 10,//每页长度
      totalItems: 0,//总数量
      filterTableDataEnd: [],//过滤后的数组
      flag: false,//定义一个开关
      allData:[
        {
          domin:'123',
          proStatus:'123',
          vipAddress:'123',
          useType:'123',
          resouIpAdd:'123',
          logSwitch:'123',
          wafSwitch:'123'
        }
      ],//自己定义的假数据
      logSwitchValue:true,//访问日志开关
      wafSwitchValue:true,//WAF开关
      deleteVisible:false,//删除提示框
      resouseIpModel:false,//回源IP弹框
      packageUpModelShow:false,//弹框
      deleteDis:true,//删除
      deleteArr:[],//要删除的域名
      deleteModel:false,//删除弹框
    }
  },
  components:{
    resouseIpModel:resouseIpModel,
    packageUpgradeModel:packageUpgradeModel,//升级
    deleteDominModel:deleteDominModel,//删除域名
  },
  mounted(){
    this.getData()
  },
  methods:{
    //checkbox
    handleSelectionChange(val){
      console.log(val);
      this.deleteArr=val;
    },
    //删除
    deleteTop(){
      if(this.deleteArr.length==0){
        this.$message({
          dangerouslyUseHTMLString: true,
          message: '<strong>请选择要删除域名</strong>'
        });
        return false;
      }else{
        // console.log(11)
        this.deleteModel=true;
      }
    },
    //关闭删除弹框
    closeDeleteModel(isShow){
      this.deleteModel=isShow;
    },
    //获取数据
    getData() {
      // this.axios.get('', params).then((res) => {
        // console.log(res.data.tableData);
        // this.tableDataBegin = res.data.tableData;
        this.tableDataBegin = this.allData;
        console.log(this.tableDataBegin,this.allData)
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
    //删除确定按钮
    deleteVisibleSure(){

    },
    //查看回源IP
    lookResouseIp(scope){
      this.resouseIpModel=true;
    },
    //关闭查看弹框
    closeModel(isShow){
      this.resouseIpModel=isShow;
    },
    //点击编辑按钮
    handelEdit(){
      this.$router.push({
        name:'editDominList'
      })
    },
    //跳转防护配置页
    toProtectSet(){
      this.$router.push({
        name:'toProtectSet'
      })
    },
    //升级按钮
    packageUpgradeModel(){
      this.packageUpModelShow=true;
    },
    //升级弹框关闭按钮
    packageUpModelClose(isShow){
      this.packageUpModelShow=isShow;
    },
  }
}
</script>
<style lang="scss" scoped>
.newClear:after{
  display: inline-block;
  content:'';
  clear:both;
}
::v-deep button{
  border-radius: 0;
  height:30px;
  line-height: 30px;
  padding:0 16px;
  border:none;
  outline: none;
}
::v-deep input{
  height: 30px;
  line-height: 30px;
  border-radius: 0;
}
.dominList{
  width:100%;
  min-height:100px;
  background-color:#fff;
  margin-top:20px;
  box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
  padding: 20px;
  .dominListTitle{
    font-size:14px;
    color:#000;
    font-weight: 600;
    margin-bottom:20px;
  }
  .dominListBtn{
    margin-bottom:12px;
    .addDomin{
      background-color:#006eff;
      color:#fff;
    }
    .deleteBtn{
      border:1px solid #ddd;
      background-color:transparent;
      margin-right:12px;
    }
    .floatRight{
      float:right;
      width:400px;
      .searchIpt{
        width:300px;
        float:left;
        input{
          width:200px;
        }
      }
      .el-icon-search{
        border:1px solid #ddd;
      }
    }
  }
  .tableList{
    min-height: 450px;
    ::v-deep .el-table__header{
      ::v-deep tr{
        ::v-deep th:nth-child(7){
          text-align:center;
        }
        ::v-deep th:nth-child(8){
          text-align:center;
        }
        ::v-deep th:nth-child(9){
          text-align:center;
        }
      }
    }
  }
  .tabListPage{
    height:50px;
    border-top:1px solid #ddd;
    padding-top:8px;
    text-align:right;
  }
}
.el-icon-info{
  margin-left:10px;
}
::v-deep button.el-tooltip:hover{
  background: transparent;
  color:#606266;
}
.prpoDialog{
  text-align:center;
  h1{
    font-size:14px;
    font-weight: 600;
    color:#000;
    margin-top:16px;
  }
  p{
    margin:16px 0;
  }
}
::v-deep .el-popover{
  width:300px!important;
  height:136px!important;
}
</style>