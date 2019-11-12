<template>
  <div>
   <div class="appIdTit">
     <div class="topTit newClear">
       <span>APPID列表</span>
       <span><a href="#">验证码服务使用帮助<i class="el-icon-share"></i></a></span>
     </div>
     <div class="appIdListCon">
       <el-tabs class="allTabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="APPID列表" name="first">
          <div class="allConListMain">
            <div class="allButton">
              <el-button type="primary" @click="dialogVisible1=true">新建验证</el-button>
              <el-dialog
                  title="新建验证"
                  :visible.sync="dialogVisible1"
                  width="30%"
                  :before-close="handleClose1"
                >
                  <el-form class="exportModel" ref="form" :model="verification" label-width="110px">
                    <el-form-item label="验证名称">
                      <el-input v-model="verification.name"></el-input>
                    </el-form-item>
                    <el-form-item label="验证所属域名">
                      <el-input v-model="verification.domainName"></el-input>
                    </el-form-item>
                    <el-form-item label="验证场景">
                      <el-select v-model="verification.scenes" placeholder="请选择您的验证场景">
                        <el-option label="账号场景(登陆、注册等)" value="value1"></el-option>
                        <el-option label="短信场景(短信/邮箱验证码)" value="value2"></el-option>
                        <el-option label="活动场景(秒杀、领券等)" value="value3"></el-option>
                        <el-option label="其他场景(评论、投票等)" value="value4"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible1 = false">取 消</el-button>
                    <el-button type="primary" @click="verificationSure()">确 定</el-button>
                  </span>
                </el-dialog>
              <el-button  @click="dialogVisible2=true">导入原有验证</el-button>
              <el-dialog
                  title="导入原有的验证场景"
                  :visible.sync="dialogVisible2"
                  width="30%"
                  :before-close="handleClose2"
                >
                  <el-form class="exportModel" ref="form" :model="VerificatScen" label-width="160px">
                    <el-form-item label="验证场景APPID (必填)">
                      <el-input v-model="VerificatScen.appId"></el-input>
                    </el-form-item>
                    <el-form-item label="验证场景SecretKey (必填)">
                      <el-input v-model="VerificatScen.secretKey"></el-input>
                    </el-form-item>
                    <el-form-item label="007账号关联UIN (选填)">
                      <el-input v-model="VerificatScen.changeUin"></el-input>
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible2 = false">取 消</el-button>
                    <el-button type="primary" @click="exportSure()">确 定</el-button>
                  </span>
                </el-dialog>
              <el-button>领取免费包</el-button>
            </div>
             <div class="mainTable">
              <el-table :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
                <el-table-column prop="appName" label="名称">
                  
                </el-table-column>
                <el-table-column prop="yesNumber" label="昨日恶意占比"></el-table-column>
                <el-table-column prop="yesRequest" label="昨日请求量"></el-table-column>
                <el-table-column prop="yesRegis" label="昨日验证量"></el-table-column>
                <el-table-column prop="yesStop" label="昨日恶意拦截量"></el-table-column>
                <el-table-column prop="appAction" label="操作" width="180">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="lookDetail(scope.$index, scope.row)">查看详情</el-button>
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
        <el-tab-pane label="套餐包管理" name="second">
          <div class="allConListMain">
            <div class="allButton">
              <el-button type="primary">购买套餐包</el-button>
              <el-select v-model="useable" palceholder="可使用">
                <el-option label="可使用" value="useable1"></el-option>
                <el-option label="已用完" value="useable2"></el-option>
                <el-option label="已过期" value="useable3"></el-option>
              </el-select>
            </div>
            <div>
              <div class="mainTable">
                <el-table :data="tableDataBegin1.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)">
                  <el-table-column prop="resourceType" label="资源包类型"></el-table-column>
                  <el-table-column prop="source" label="来源"></el-table-column>
                  <el-table-column prop="allTotal" label="总额（次）"></el-table-column>
                  <el-table-column prop="allUsed" label="已使用"></el-table-column>
                  <el-table-column prop="getTime" label="获取时间"></el-table-column>
                  <el-table-column prop="expireDate" label="到期时间"></el-table-column>
                </el-table>
              </div>
              <div class="tabListPage">
                <el-pagination
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
                  :current-page="currentPage1"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalItems1"
                ></el-pagination>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
     </div>
   </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first',
      pageSize:10,
      currentPage:1,
      totalItems:0,
      pageSize1:10,
      currentPage1:1,
      totalItems1:0,
      tableDataEnd:[],
      tableDataEnd1:[],
      tableDataBegin:[
        {
          appName:"1",
          yesNumber:"1",
          yesRequest:"1",
          yesRegis:"1",
          yesStop:"1"
        }
      ],
      tableDataBegin1:[
        // {
        //   resourceType:"1",
        //   source:"1",
        //   allTotal:"1",
        //   allUsed:"1",
        //   getTime:"1",
        //   expireDate:"1"
        // }
      ],
      verification:{
        name:"",
        domainName:"",//域名
        scenes:""//场景
      },
      VerificatScen:{
        appId:"",
        secretKey:"",
        changeUin:""
      },//验证场景
      dialogVisible1:false,
      dialogVisible2:false,
      useable:"",
      filterTableDataEnd:[],
      filterTableDataEnd1:[]
    }
  },
  methods:{
    handleClick(tab, event) {
      //console.log(tab, event);
    },
    //查看详情
    lookDetail(newIndex,newRow){
      this.$router.push({
        path: "/appIdDetail",
        query:{
					msg:this.tableDataBegin[newIndex].appName
				}
      });
    },
    //分页
    getData() {
      var cookies = document.cookie;
      var list = cookies.split(";");
      for (var i = 0; i < list.length; i++) {
        var arr = list[i].split("=");
      }
      console.log(arr[1]);
      let params = {
        // Action: "ListFunctions",
        Version: "2018-04-16",
        Region: arr[1]
      };
      //this.$axios.post('scf/ListFunctions', params).then(res => {
      //console.log(res.data);
      //this.tableDataBegin = res.data.dataTable;
      //this.allData = this.tableDataBegin;
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
    //选择每页条数
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    //点击当前页数按键
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
    //点击左右
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
    handleSizeChange1(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize1 = val;
      this.handleCurrentChange1(this.currentPage1);
    },
    //点击当前页数按键
    handleCurrentChange1(val) {
      console.log(`当前页: ${val}`);
      this.currentPage1 = val;
      //需要判断是否检索
      if (!this.flag) {
        this.currentChangePage1(this.tableDataEnd1);
      } else {
        this.currentChangePage(this.filterTableDataEnd1);
      }
    }, //组件自带监控当前页码
    //点击左右
    currentChangePage1(list) {
      let from = (this.currentPage1 - 1) * this.pageSize1;
      let to = this.currentPage1 * this.pageSize1;
      this.tableDataEnd1 = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd1.push(list[from]);
        }
      }
    },
    handleClose1(){
      this.dialogVisible1=false;
    },
    handleClose2(){
      this.dialogVisible2=false;
    },
    //验证弹框确定按钮
    verificationSure(){},
    //导入原有验证场景按钮
    exportSure(){}
  }
}
</script>

<style lang="scss">
.newClear:after{
  clear:both;
  display:block;
  content:"";
}
.appIdTit{
  width:100%;
  padding:20px 20px 0;
  background-color:#fff;
  height:90px;
  .topTit{
    span:nth-child(1){
      float:left;
      font-size:16px;
      font-weight:600;
    }
    span:nth-child(2){
      float:right;
    }
  }
}
.allTabs{
  margin-top:13px;
  .allConListMain{
    padding:0;
    .allButton{
      button{
        margin-right:20px;
      }
    }
    .mainTable{
      margin-top:12px;
    }
    .tabListPage{
      text-align:right;
    }
  }
}
.exportModel{
  .el-form-item{
    label.el-form-item__label{
      color:#888;
      font-size:12px;
    }
  }
  
}
</style>
