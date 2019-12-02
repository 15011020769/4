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
                  <el-option v-for="(item, index) in options1" :label="item.label" :value="item.value" :key="index"></el-option>
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
                  <el-table-column prop="Record.Id" label="ID/名称">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='Id'">{{item.Value}}</div>
                        <!-- <a v-if="item.Key=='Id'" href="#" @click="toDetail(scope.$index, scope.row)">{{item.Value}}</a> -->
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Record.GroupIpList" label="IP">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='GroupIpList'">{{item.Value}}</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="origin" label="地区">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='Id'">-</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Record.DefendStatus" label="防护状态">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='DefendStatus' && item.Value == '1'">开启</div>
                        <div v-else-if="item.Key=='DefendStatus' && item.Value != '1'">-</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="Record.DdosThreshold" label="清洗阈值">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='DdosThreshold'">{{item.Value}}Mps</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="saveGarden" label="防护等级">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='Id'">-</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="BusinessScene" label="业务场景">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='Id'">-</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="advanced" label="高级防护策略">
                    <template slot-scope="scope">
                      <div v-for="(item, index) in scope.row.Record" :key="index">
                        <div v-if="item.Key=='Id'">-</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="action" label="操作" width="180">
                    <template slot-scope="scope">
                      <el-button
                        @click="changeRow(scope.$index, scope.row)"
                        type="text"
                        size="small"
                      >修改</el-button>
                    </template>
                  </el-table-column>
                  <el-dialog
                    title="DDoS防护配置"
                    :visible.sync="changeModel"
                    width="40%"
                    :append-to-body="true"
                    :before-close="changeClose"
                  >
                    <div class="modelCenterCon">
                      <p>
                        <span class="modelSpan1">防护状态</span>
                        <span>
                          <el-switch
                            v-model="servicePack.DefendStatus"
                            active-color="#006eff"
                            inactive-color="#999">
                          </el-switch>
                        </span>
                      </p>
                      <p>
                        <span class="modelSpan1">清洗阈值<i class="el-icon-info"></i></span>
                        <span>
                          <el-select v-model="servicePack.DdosThreshold" class="setSelect">
                            <el-option v-for="(item, index) in cleanNumOption" :label="item.label" :value="item.value" :key="index"></el-option>
                          </el-select>
                        </span>
                      </p>
                      <p>
                        <span class="modelSpan1">防护等级<i class="el-icon-info"></i></span>
                        <span>
                          <a class="gardenChoose" :class="saveGarden==1?'seceltGarden':''" @click="clickGarden(1,'宽松')">宽松</a>
                          <a class="gardenChoose" :class="saveGarden==2?'seceltGarden':''" @click="clickGarden(2,'正常')">正常</a>
                          <a class="gardenChoose" :class="saveGarden==3?'seceltGarden':''" @click="clickGarden(3,'严格')">严格</a>
                        </span>
                        <el-dialog
                          title="确认切换到严格模式？"
                          :visible.sync="changeModelTip3"
                          width="30%"
                          :append-to-body="true"
                          :before-close="changeCloseTip3"
                        >
                          <p>严格模式可能会影响业务，建议仅在正常模式透传攻击包影响业务时才使用。如果严格模式仍然无法解决透传影响业务的问题，请联系售后技术支持定制策略。</p>
                          <span slot="footer" class="dialog-footer">
                            <el-button @click="changeCloseTip3">取 消</el-button>
                            <el-button type="primary" @click="changeSureTip3()">确 定</el-button>
                          </span>
                        </el-dialog>
                        <el-dialog
                          title="确认切换到正常模式？"
                          :visible.sync="changeModelTip2"
                          width="30%"
                          :append-to-body="true"
                          :before-close="changeCloseTip2"
                        >
                          <p>默认清洗模式，清洗策略不松不紧。</p>
                          <span slot="footer" class="dialog-footer">
                            <el-button @click="changeCloseTip2">取 消</el-button>
                            <el-button type="primary" @click="changeSureTip2()">确 定</el-button>
                          </span>
                        </el-dialog>
                        <el-dialog
                          title="确认切换到宽松模式？"
                          :visible.sync="changeModelTip1"
                          width="30%"
                          :append-to-body="true"
                          :before-close="changeCloseTip1"
                        >
                          <p>宽松模式在遇到复杂攻击时可能会存在攻击透传，建议仅在正常模式存在误杀影响业务时使用。如果宽松模式仍然无法解决误杀问题，请联系售后技术支持进行策略定制。</p>
                          <span slot="footer" class="dialog-footer">
                            <el-button @click="changeCloseTip2">取 消</el-button>
                            <el-button type="primary" @click="changeSureTip1()">确 定</el-button>
                          </span>
                        </el-dialog>

                      </p>
                      <p>
                        <span class="modelSpan1">高级策略</span>
                        <span>
                          <el-select v-model="topFun" class="setSelect">
                            <el-option label="无" value="no"></el-option>
                            <el-option label="erg" value="erg"></el-option>
                          </el-select>
                        </span>
                      </p>
                      <p>
                        <span class="modelSpan1">DDoS共计告警阈值</span>
                        <span>
                          <el-select v-model="ddosWarning" class="setSelect" @change="selectChange1">
                            <el-option label="未设置" value="no"></el-option>
                            <el-option label="入流量宽带" value="erg"></el-option>
                            <el-option label="清洗流量" value="erg"></el-option>
                          </el-select>
                          <span v-if="iptNummbps"><el-input v-model="iptmbpsText" class="intMbps"></el-input> Mbps</span>
                        </span>
                      </p>
                    </div>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="changeModelBtn">取 消</el-button>
                      <el-button type="primary" @click="changeSure()">确 定</el-button>
                    </span>
                  </el-dialog>
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
                      <a href="#" @click="toDetail(scope.$index, scope.row)">{{scope.row.name}}</a>
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
    return {
      tableDataBegin: [],//DDoS攻击防护列表
      changeModel: false,//修改框
      options1: [
        {label: 'IP', value: 'IP'},
        {label: 'ID', value: 'ID'},
        {label: '服务包名称', value: 'serverBag'}
      ],
      tableDataName: '',
      tableDataTemp: [],
      tableDataTemp2: [],
      //修改框数据绑定
      servicePack: {
        DefendStatus:'',
        DdosThreshold: '',
      },
      cleanNumOption:[
        {label:'默认', value:'0'},
        {label:'60Mbps', value:'60'},
        {label:'80Mbps', value:'80'},
        {label:'100Mbps', value:'100'},
        {label:'150Mbps', value:'150'},
        {label:'200Mbps', value:'0'},
        {label:'250Mbps', value:'0'},
        {label:'60Mbps', value:'0'},
        {label:'300Mbps', value:'0'},
        {label:'400Mbps', value:'0'},
        {label:'500Mbps', value:'0'},
        {label:'700Mbps', value:'0'},
        {label:'1000Mbps', value:'0'}
      ],
      saveGarden:1,//防护等级
      saveGardenText:'宽松',
      topFun:'erg',//高级策略
      ddosWarning:'清洗流量',//攻告警阈值
      iptNummbps:false,//告警阈值输入框隐藏
      iptmbpsText:'1000',
      saveStatus:true,//防护状态
      cleanNum:'100Mbps',//清洗阈值

      data: this.generateData(),
      valueThrou: [1],
      renderFunc(h, option) {
        return <span>{ option.key } </span>;
      },//穿梭框
      activeName:"first",
      filterConrent:"IP",
      tableDataBegin2:[],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      flag: false,
      multipleSelection: [],
      dialogVisible: false,
      dialogVisible1: false,//绑定资源弹框
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
      thisData:["1","2","3"],
      changeModelTip1:false,//修改模式提示弹框
      changeModelTip2:false,
      changeModelTip3:false,
    }
  },
  components:{
    addNewTactics:addNewTactics
  },
  created() {
    this.getData();
  },
  methods:{
    getData() {
      this.describeResourceList()
      this.describeDDoSPolicy()
    },
    getDataCC() {

    },
    // 1.1.获取资源列表
    describeResourceList() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
      }
      this.$axios.post('dayu2/DescribeResourceList', params).then(res => {
        console.log(res)
        this.tableDataBegin = res.Response.ServicePacks
      })
    },
    // 1.2.获取DDoS高级策略
    describeDDoSPolicy() {
      let params = {
        Version: '2018-07-09',
        Business: 'net',
      }
      this.$axios.post('dayu2/DescribeDDoSPolicy', params).then(res => {
        console.log(res)
      })
    },
    // 2.2.

    // 修改
    changeRow(changeIndex,changeRow){
      this.changeModel=true;
      console.log(changeIndex, changeRow);
      for (let i in changeRow.Record) {
        switch (changeRow.Record[i].Key) {
          case 'DefendStatus':
            if (changeRow.Record[i].Value == '1') {
              this.servicePack.DefendStatus = true
            } else if (changeRow.Record[i].Value == '0') {
              this.servicePack.DefendStatus = false
            }
            break;
          case 'DdosThreshold':
            this.servicePack.DdosThreshold = changeRow.Record[i].Value
            break;
        }
      }
      console.log(this.servicePack)
      // if(changeRow.DefendStatus=='开启'){
      //   this.DefendStatus=true
      // }else{
      //   this.DefendStatus=false;
      // }
      // this.cleanNum=changeRow.clean;
      // if(changeRow.saveGarden=='正常模式'){
      //   this.saveGardenText='正常';
      //   this.saveGarden=2;
      // }else if(changeRow.saveGarden=='宽松模式'){
      //   this.saveGardenText='宽松';
      //   this.saveGarden=1;
      // }else if(changeRow.saveGarden=='严格模式'){
      //   this.saveGardenText='严格';
      //   this.saveGarden=3;
      // }
      // this.topFun=changeRow.advanced;
      // //共计告警阈值
      // if(this.ddosWarning=='未设置'){
      //   this.iptNummbps=false;
      // }else{
      //   this.iptNummbps=true;;
      // }
      //this.ddosWarning=changeRow
    },
    // 搜索
    doFilter() {
      console.log(this.filterConrent, this.tableDataName);
      this.describeResourceList()
      if(this.tableDataName != '') {
        this.tableDataTemp = []
        this.tableDataBegin.forEach((val, index) => {
          if (this.filterConrent=="IP") {
            val.Record.forEach((val2, index) => {
              if (val2.Key == 'GroupIpList' && val2.Value == this.tableDataName) {
                this.tableDataTemp.push(val)
              }
            })
          } else if (this.filterConrent=="ID"||this.filterConrent=="serverBag") {
            val.Record.forEach((val2, index) => {
              if (val2.Key == 'Id' && val2.Value == this.tableDataName) {
                this.tableDataTemp.push(val)
              }
            })
          }
        })
        setTimeout(() => {
          this.tableDataBegin.splice(0, this.tableDataBegin.length)
          this.tableDataBegin = this.tableDataTemp
        }, 1000);
      }
      //页面数据改变重新统计数据数量和当前页
      this.currentPage = 1;
      this.totalItems = this.tableDataBegin.length;
      //渲染表格,根据值
      this.currentChangePage(this.tableDataBegin);
      //页面初始化数据需要判断是否检索过
      this.flag = true;
    },
    // Tab页面切换
    handleClick(tab, event) {
      console.log(tab)
      // this.describeResourceList() //获取资源列表的接口单独调用（因为日期变更不需要调用此接口）
      if(tab.name == 'first') { //DDOS攻击防护
        this.getData()
      } else if(tab.name == 'second') { //CC防护
        this.getDataCC()
      } else if(tab.name == 'third') {  //DDOS高级防护策略
        // this.getDataService()
      }
    },

    toDetail() {},
    //修改框关闭按钮
    changeClose(){
      this.changeModel=false;
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
        this.currentChangePage(this.tableDataTemp);
      } else {
        this.currentChangePage(this.tableDataTemp2);
      }
    }, //组件自带监控当前页码
    currentChangePage(list) {
      let from = (this.currentPage - 1) * this.pageSize;
      let to = this.currentPage * this.pageSize;
      this.tableDataTemp = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataTemp.push(list[from]);
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
    },
    selectChange1(){
      if(this.ddosWarning=='未设置'){
        this.iptNummbps=false;
      }else{
        this.iptNummbps=true;;
      }
    },
    //修改确定按钮
    changeSure(){
      console.log(this.servicePack)
      this.changeModel=false;
    },
    //选择防护等级
    clickGarden(typeNum,type){
      //this.saveGarden=typeNum;
      //this.saveGardenText=type;
      this.changeModel=false;
      if(typeNum==3){
        this.changeModelTip3=true;
      }else if(typeNum==2){
        this.changeModelTip2=true;
      }else if(typeNum==1){
        this.changeModelTip1=true;
      }
    },
    changeCloseTip1(){
      this.changeModelTip1=false;
      this.changeModel=true;
    },
    changeCloseTip2(){
      this.changeModelTip2=false;
      this.changeModel=true;
    },
    changeCloseTip3(){
      this.changeModelTip3=false;
      this.changeModel=true;
    },
    changeSureTip1(){
      this.saveGarden=1;
      this.saveGardenText='宽松'
      this.changeModelTip1=false;
      this.changeModel=true;
    },
    changeSureTip2(){
      this.saveGarden=2;
      this.saveGardenText='正常'
      this.changeModelTip2=false;
      this.changeModel=true;
    },
    changeSureTip3(){
      this.saveGarden=3;
      this.saveGardenText='严格'
      this.changeModelTip3=false;
      this.changeModel=true;
    },
    changeModelBtn(){
      this.changeModel=false;
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
.modelCenterCon{
  p{
    margin-bottom:15px;
    span:nth-child(1).modelSpan1{
      display: inline-block;
      font-size:12px;
      color:#888;
      width:126px;
      i{
        margin-left:6px;
      }
    }
    span:nth-child(2){
      .gardenChoose{
        padding:0 20px;
        color:#000;
        font-size:12px;
        
      }
      .seceltGarden{
        color:#006eff !important;
      }
    }
  }
}
.setSelect{
  width:178px;
  height:30px;
  border-radius: 0;
  div{
    width:178px;
    height:30px;
    border-radius: 0;
    input{
      width:178px;
      height:30px;
      border-radius: 0;
      padding-right:15px!important;
    }
  }
  span.el-input__suffix{
    right:-41px;
  }
}
.intMbps{
  width:120px!important;
  height:30px;
  border-radius: 0;
  margin-left:20px;
  border-radius: 0;
  input{
    width:120px;
    height:30px;
    border-radius: 0;
  }
}
</style>