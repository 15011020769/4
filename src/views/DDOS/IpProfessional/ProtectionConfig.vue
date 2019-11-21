<template>
  <div>
    <div class="statistReportTit">
      <div class="ReportTit newClear">
        <h3 class="ReportTitH3">防护配置</h3>
        <el-button class="ReportTitBtn" type="primary" @click="newBuy">新购</el-button>
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="DDoS攻击防护" name="first">
            <div class="mainContent">
              <div class="textAlignTop">
                <el-select placeholder="要过滤的标签" v-model="filterConrent">
                  <el-option label="IP" value="IP"></el-option>
                  <el-option label="ID" value="ID"></el-option>
                  <el-option label="服务包名称" value="serverBag"></el-option>
                </el-select>
                <el-input
                  v-model="tableDataName"
                  class="searchs"
                  placeholder="请输入要查询的内容"
                ></el-input>
                <el-button class="el-icon-search" @click="doFilter"></el-button>
              </div>
              <div class="mainTable">
                <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
                  <el-table-column prop="idOrName" label="ID/名称">
                    <template slot-scope="scope">
                      <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.idOrName}}</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="ip" label="IP"></el-table-column>
                  <el-table-column prop="origin" label="地区"></el-table-column>
                  <el-table-column prop="saveStatus" label="防护状态"></el-table-column>
                  <el-table-column prop="clean" label="清洗阈值"></el-table-column>
                  <el-table-column prop="saveGarden" label="防护等级"></el-table-column>
                  <el-table-column prop="BusinessScene" label="业务场景"></el-table-column>
                  <el-table-column prop="advanced" label="高级防护策略"></el-table-column>
                  <el-table-column prop="action" label="操作" width="180">
                    <template slot-scope="scope">
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
          </el-tab-pane>
          <el-tab-pane label="CC防护" name="second">
            <div class="mainContent">
              <el-input class="mainConListOneIpt" placeholder="请输入要查询的ID或名称"/>
            </div>
            <div class="mainContent"></div>
          </el-tab-pane>
          <el-tab-pane label="DDoS高级防护策略" name="third">
            <div class="mainContent">
              <div v-if="tableShow">
                <el-button type="primary" @click="addNewTactics">添加新策略</el-button>
                <el-table :data="tableDataBegin2">
                  <el-table-column prop="name" label="策略名称">
                    <template slot-scope="scope">
                      <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.name}}</a>
                    </template>
                  </el-table-column>
                  <el-table-column prop="resouseNum" label="绑定资源数量"></el-table-column>
                  <el-table-column prop="createTime" label="创建时间"></el-table-column>
                  <el-table-column prop="action" label="操作" width="180">
                    <template slot-scope="scope">
                      <el-button
                        @click="configListCon(scope.$index, scope.row)"
                        type="text"
                        size="small"
                      >配置</el-button>
                      <el-button
                        @click.native.prevent="deleteRow(scope.$index, scope.row)"
                        type="text"
                        size="small"
                      >删除</el-button>
                      <el-dialog
                        title="删除高级策略"
                        :visible.sync="dialogVisible"
                        width="30%"
                        :before-close="handleClose"
                      >
                        <h1 class="deleteTit"><i class="el-icon-warning"></i>确定删除该政策么？</h1>
                        <p class="deleteCont">删除策略后，该防护策略将从列表中永久删除，不可恢复。若您已开启UDP水印剥离开关，则策略会同步关闭UDP水印剥离开关。</p>
                        <p class="deleteCont">确定删除该条高级策略(erg)？</p>
                        <span slot="footer" class="dialog-footer">
                          <el-button @click="dialogVisible = false">取 消</el-button>
                          <el-button type="primary" @click="sureDelete()">确 定</el-button>
                        </span>
                      </el-dialog>
                      <el-button
                        @click="bindingResource(scope.$index, scope.row)"
                        type="text"
                        size="small"
                      >绑定资源</el-button>
                      <el-dialog
                        title="绑定资源"
                        :visible.sync="dialogVisible1"
                        width="40%"
                        :before-close="handleClose1"
                      >
                        <div style="text-align: center">
                          <el-transfer
                            style="text-align: left; display: inline-block"
                            v-model="valueThrou"
                            filterable
                            :left-default-checked="[2, 3]"
                            :right-default-checked="[1]"
                            :render-content="renderFunc"
                            :titles="['Source', 'Target']"
                            :button-texts="['到左边', '到右边']"
                            :format="{
                              noChecked: '${total}',
                              hasChecked: '${checked}/${total}'
                            }"
                            @change="handleChange"
                            :data="data">
                            <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
                            <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
                          </el-transfer>
                        </div>
                        
                        <span slot="footer" class="dialog-footer">
                          <el-button @click="dialogVisible1 = false">取 消</el-button>
                          <el-button type="primary" @click="bindingResourceSure()">确 定</el-button>
                        </span>
                      </el-dialog>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-if="!tableShow">
                <addNewTactics :isShow="tableShow" @closePage="closePageAdd"/>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import addNewTactics from './addNewTactics'
export default {
  data() {
    // const generateData = _ => {
    //   const data = [];
    //   for (let i = 1; i <= 15; i++) {
    //     data.push({
    //       key: i,
    //       label: `备选项 ${ i }`,
    //       disabled: i % 4 === 0
    //     });
    //   }
    //   return data;
    // };
    return {
      data: this.generateData(),
      valueThrou: [1],
      renderFunc(h, option) {
        return <span>{ option.key } </span>;
      },//穿梭框
      activeName:"first",
      filterConrent:"IP",
      tableDataBegin: [],
      tableDataBegin2:[],
      tableDataName: "",
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,
      multipleSelection: [],
      dialogVisible: false,
      dialogVisible1: false,//绑定资源弹框
      filterConrent:"",
      allData:[
        {
          idOrName:"1",
          resouseNum:"8",
          origin:"北京",
          saveStatus:"防护状态",
          clean:"清洗阈值",
          saveGarden:"防护等级",
          BusinessScene:"业务场景",
          advanced:"高级防护策略"
        }
      ],
      allData2:[
        {
          name:"1",
          resouseNum:"8",
          createTime:"2019-11-19 10:52:25"
        }
      ],
      tableShow:true,
      deleteIndex: "",
      deleteBegin: {},
      deleteIndex1: "",
      deleteBegin1: {},
      thisData:["1","2","3"]
    }
  },
  components:{
    addNewTactics:addNewTactics
  },
  mounted() {
    this.getData();
    this.getData2()
  },
  methods:{
    handleClick(){},
    getData() {
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      let params = {
        // Action: "ListFunctions",
        Version: "2018-04-16",
        Region: arr[1]
      };
      //this.$axios.post('', params).then(res => {
        // console.log(res.data.functions);
        //this.tableDataBegin = res.data.functions;
        this.tableDataBegin = this.allData;
        // 将数据的长度赋值给totalItems
        this.totalItems = this.tableDataBegin.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin[index]);
          }
        } else {
          this.tableDataEnd = this.tableDataBegin;
        }
      //});
    },
    getData2() {
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      let params = {
        // Action: "ListFunctions",
        Version: "2018-04-16",
        Region: arr[1]
      };
      //this.$axios.post('', params).then(res => {
        // console.log(res.data.functions);
        //this.tableDataBegin = res.data.functions;
        this.tableDataBegin2 = this.allData2;
        // 将数据的长度赋值给totalItems
        // this.totalItems = this.tableDataBegin.length;
        // if (this.totalItems > this.pageSize) {
        //   for (let index = 0; index < this.pageSize; index++) {
        //     this.tableDataEnd.push(this.tableDataBegin[index]);
        //   }
        // } else {
        //   this.tableDataEnd = this.tableDataBegin;
        // }
      //});
    },
    // 搜索
    doFilter() {
      console.log(this.filterConrent);
      this.tableDataBegin = this.allData;
      this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.tableDataBegin.forEach((val, index) => {
        if(this.filterConrent=="IP"){
          console.log(typeof(val.ip))
            if (val.ip==this.tableDataName) {
              this.filterTableDataEnd.push(val);
              this.tableDataBegin = this.filterTableDataEnd;
            } else {
              this.filterTableDataEnd.push();
              this.tableDataBegin = this.filterTableDataEnd;
            }
        }else if(this.filterConrent=="ID"||this.filterConrent=="serverBag"){
            if (val.idOrName==this.tableDataName) {
              this.filterTableDataEnd.push(val);
              this.tableDataBegin = this.filterTableDataEnd;
            } else {
              this.filterTableDataEnd.push();
              this.tableDataBegin = this.filterTableDataEnd;
            }
        }
      });
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.filterTableDataEnd.length;
      //渲染表格,根据值
      this.currentChangePage(this.filterTableDataEnd);

      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    openData() {},
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
    addNewTactics(){
      this.tableShow=false;
    },
    handleClose(){
      this.dialogVisible=false;
    },
    //绑定资源弹框关闭按钮
    handleClose1(){
      this.dialogVisible1=false;
    },
    //点击删除函数按钮
    deleteRow(index, dataBegin) {
      console.log(index, dataBegin);
      this.deleteIndex = index;
      this.deleteBegin = dataBegin;
      this.dialogVisible = true;
    },
    //删除函数的确定按钮，调用删除接口
    sureDelete() {
      let params = {
        Version: "2018-04-16",
        Region: "ap-taipei",
        FunctionName: this.deleteBegin.functionName
      };
      console.log(params.FunctionName);
      //this.$axios.post("", params).then(res => {
        //console.log(res);
        //console.log("成功");
        this.tableDataBegin.splice(this.deleteIndex, 1);
        this.totalItems -= 1;
        this.dialogVisible = false;
      //});
    },
    //点击表格操作配置按钮
    configListCon(configIndex,configCon){
      this.tableShow=false;
    },
    //绑定资源按钮
    bindingResource(bindingIndex,bindingCon){
      this.deleteIndex1 = bindingIndex;
      this.deleteBegin1 = bindingCon;
      this.dialogVisible1 = true;
    },
    //绑定资源弹框确定按钮
    bindingResourceSure(){
      this.dialogVisible1 = false;
    },
    //接收子组件的方法，并让子组件消失父组件显示
    closePageAdd(obj){
      console.log(obj)
      this.tableShow=true;
    },
    //穿梭框事件
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },
    generateData(){
      const data = [{key:"1"},{key:"2"}];
      // console.log(thisData)
      // for (let i =0; i < this.thisData.length; i++) {
      //   data.push(this.thisData[i]);
      // }
      return data;
    },
    //跳转新购页面
    newBuy(){
      this.$router.push({
        path: '/choose'
      })
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
    padding:0 20px;
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
  .textAlignTop{
    width:100%;
    text-align:right;
  }
}
.searchs{
  width:200px!important;
  margin-bottom:20px;
  input{
    width:200px;
  }
}
.mainConListOneIpt{
  width:200px;
  input{
    width:200px;
  }
}
.el-icon-warning{
  color:red;
  font-size:34px;
  margin-right:15px;
  vertical-align: middle;
}
.deleteTit{
  font-size:18px;
  color:#000;
  margin-bottom:12px;
}
.deleteCont{
  padding-left:50px;
}
</style>