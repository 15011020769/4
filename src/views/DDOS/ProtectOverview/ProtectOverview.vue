<template>
  <div>
    <div class="overviewTit">防护概览</div>
    <div class="allConMain">
      <div class="allConMainOne">
        <div class="allConMainOneTit">概览</div>
        <div class="allConMainOneCon">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="allConMainOneLeft">
                <h3>安全统计（本月）</h3>
                <el-row class="allConMainOneRow">
                  <el-col :span="8" class="LeftConOne LeftConRow" >
                    <p>攻击次数</p>
                    <p>{{attackData[1].Value}}</p>
                  </el-col>
                  <el-col :span="8" class="LeftConTwo LeftConRow">
                    <p>封堵次数</p>
                    <p>{{attackData[2].Value}}</p>
                  </el-col>
                  <el-col :span="8" class="LeftConThree LeftConRow">
                    <p>攻击峰值</p>
                    <p>{{attackData[3].Value}}<span>Mbps</span></p>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="allConMainOneLeft">
                <h3>当前安全状态</h3>
                <el-row class="allConMainOneRow">
                  <el-col :span="12" class="LeftConOne LeftConRow">
                    <p>清洗中</p>
                    <p>{{(+packDataIP[1].Value) + (+packDataBgp[1].Value)}}</p>
                  </el-col>
                  <el-col :span="12" class="LeftConOne LeftConRow">
                    <p>封堵中</p>
                    <p>{{(+packDataIP[2].Value) + (+packDataBgp[2].Value)}}</p>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="allConMainTwo allConMainOne">
        <div class="allConMainTwoTit allConMainOneTit">我的产品</div>
        <div class="allConMainOneCon allConMainTwoCon">
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="allConMainOneLeft allConMainTwoLeft">
                <el-row class="productRow">
                  <el-col :span="12" class="productRow1"> 
                    独享包 <span>{{packDataBgp[0].Value}}</span>
                  </el-col>
                  <el-col :span="12" class="productRow2"> 
                    <p><span></span><span>清洗中</span><span>{{packDataBgp[1].Value}}</span></p>
                    <p><span></span><span>封堵中</span><span>{{packDataBgp[2].Value}}</span></p>
                    <p><span></span><span>即将到期</span><span>{{packDataBgp[4].Value}}</span></p>
                    <p><span></span><span>已到期</span><span>{{packDataBgp[3].Value}}</span></p>
                  </el-col>
                </el-row>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="allConMainOneRight allConMainTwoRight allConMainTwoLeft">
                <el-row class="productRow">
                  <el-col :span="12" class="productRow1"> 
                    高防IP专业版 <span>{{packDataIP[0].Value}}</span>
                  </el-col>
                  <el-col :span="12" class="productRow2"> 
                    <p><span></span><span>清洗中</span><span>{{packDataIP[1].Value}}</span></p>
                    <p><span></span><span>封堵中</span><span>{{packDataIP[2].Value}}</span></p>
                    <p><span></span><span>即将到期</span><span>{{packDataIP[4].Value}}</span></p>
                    <p><span></span><span>已到期</span><span>{{packDataIP[3].Value}}</span></p>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="allConMainThree">
        <div class="allConMainThreeTit">
          <div>攻击日志（30天内）</div>
          <div class="rightCon">
            <a href="#" class="downloadTable" @click="exportExcel">下载表格</a>
            <el-input class="rightIptSearch" v-model="searchInputID" placeholder="请输入要查询的资产ID"/><el-button @click="doFilter" class="searcHBthn el-icon-search"></el-button>
          </div>
        </div>
        <div class="allConMainThreeCon">
          <div class="chartShowTit">
            <el-button-group>
              <el-button @click="btnClick('bgp')" :class="{'addColor':type=='bgp'}">独享包</el-button>
              <el-button @click="btnClick('bgp-multip')" :class="{'addColor':type=='bgp-multip'}">共享包</el-button>
              <el-button @click="btnClick('net')" :class="{'addColor':type=='net'}">高防IP专业版</el-button>
            </el-button-group>
          </div>
          <div class="tableOverView">
            <el-table id="exportTable" :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
              <el-table-column prop="StartTime" label="攻击时间">
                <template slot-scope="scope">
                  {{scope.row.StartTime}}
                  <!-- <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.funName}}</a> -->
                </template>
              </el-table-column>
              <el-table-column prop="durationTime" label="持续时间">
                <template slot-scope="scope">{{scope.row.EndTime - scope.row.StartTime}}</template>
              </el-table-column>
              <el-table-column prop="" label="产品">
                <template slot-scope="scope">-</template>
              </el-table-column>
              <el-table-column prop="ResourceName" label="资产名称">
                <template slot-scope="scope">{{scope.row.ResourceName}}</template>
              </el-table-column>
              <el-table-column prop="" label="资产类型" v-if="type=='net'?false:true">
                <template slot-scope="scope">-</template>
              </el-table-column>
              <el-table-column prop="Vip" label="IP">
                <template slot-scope="scope">{{scope.row.Vip}}</template>
              </el-table-column>
              <el-table-column prop="AttackType" label="攻击类型" width="70px">
                <template slot-scope="scope">{{scope.row.AttackType}}</template>
              </el-table-column>
              <el-table-column prop="Mbps" label="攻击最大宽带">
                <template slot-scope="scope">{{scope.row.Mbps}}</template>
              </el-table-column>
              <el-table-column prop="Pps" label="攻击最大包速率">
                <template slot-scope="scope">{{scope.row.Pps}}</template>
              </el-table-column>
              <el-table-column prop="" label="触发封禁" width="180">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                  >触发封禁</el-button>
                  <!-- <el-dialog
                    :title="'您确定要删除'+scope.row.funName+'吗？'"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="handleClose"
                  >
                    <span>删除函数将永久删除函数代码及已绑定的触发器。是否确定删除此函数？</span>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible = false">取 消</el-button>
                      <el-button type="primary" @click="sureDelete()">确 定</el-button>
                    </span>
                  </el-dialog> -->
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
              >
              </el-pagination>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { DDOS_SECINDEX, DDOS_PACKINDEX, DDOS_EV_LIST } from "@/constants"
export default {
  data() {
		return {
      // 安全统计-本月
      attackData: [
        {Key: 'AttackIpCount', Value:0, desc: '受攻击的IP数'},
        {Key: 'AttackCount', Value:0, desc: '攻击次数'},
        {Key: 'BlockCount', Value:0, desc: '封堵次数'},
        {Key: 'MaxMbps', Value:0, desc: '攻击峰值Mbps'},
        {Key: 'IpNum', Value:0, desc: '统计的IP数据'}
      ],
      // 获取产品总览
      packParams: ['bgp', 'net'],
      business: 'net',// 产品代号: bgpip表示高防IP；bgp表示独享包；bgp-multip表示共享包；net表示高防IP专业版
      packDataIP: [ // 高防IP专业版 net
        {Key: 'TotalPackCount',Value: 0},
        {Key: 'AttackPackCount',Value: 0},
        {Key: 'BlockPackCount',Value: 0},
        {Key: 'ExpiredPackCount',Value: 0},
        {Key: 'ExpireingPackCount',Value: 0},
        {Key: 'IsolatePackCount',Value: 0}
      ],
      packDataBgp: [ // bgp
        {Key: 'TotalPackCount',Value: 0},
        {Key: 'AttackPackCount',Value: 0},
        {Key: 'BlockPackCount',Value: 0},
        {Key: 'ExpiredPackCount',Value: 0},
        {Key: 'ExpireingPackCount',Value: 0},
        {Key: 'IsolatePackCount',Value: 0}
      ],
      // 日期区间：30天
      endTime: this.getDateString(new Date()),
      startTime: this.getDateString(new Date(new Date().getTime() - 24*60*60*1000*30)),
      // 攻击事件列表
      tableDataBegin: [],

      // 分页相关
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      // 攻击事件列表：bgp表示独享包；bgp-multip表示共享包；net表示高防IP专业版
      type:'bgp',
      // 下载名称
      downloadName: '独享包攻击记录',
      // 查询输入字段（资源实例id）
      searchInputID: '',

      tableDataEnd: [],
      filterTableDataEnd: [],
      flag: false,
      dialogVisible:false,
    }
  },
  created() {
    this.getData();
  },
  methods:{
    getData() {
      this.describeSecIndex()
      for(let i in this.packParams) {
        this.business = this.packParams[i]
        switch (this.packParams[i]) {//[bgpip表示高防IP；bgp表示独享包；bgp-multip表示共享包；net表示高防IP专业版]
          case 'net':
            this.describePackIndex(this.packDataIP)
            break;
          case 'bgp':
            this.describePackIndex(this.packDataBgp)
            break;
        }
      }
      // this.describeInsurePacks()
      this.describeDDoSEvList()
    },
    // 1.1.获取安全统计-本月
    describeSecIndex() {
      let params = {
        Version: '2018-07-09',
      }
      this.axios.post(DDOS_SECINDEX, params).then(res => {
        for(let i in this.attackData) {
          for(let j in res.Response.Data) {
            if (this.attackData[i].Key == res.Response.Data[j].Key) {
              this.attackData[i].Value = res.Response.Data[j].Value
              break
            }
          }
        }
      })
    },
    // 1.2.获取产品总览
    describePackIndex(packData) {
      let params = {
        Version: '2018-07-09',
        Business: this.business,
      }
      this.axios.post(DDOS_PACKINDEX, params).then(res => {
        for(let i in packData) {
          for(let j in res.Response.Data) {
            if (packData[i].Key == res.Response.Data[j].Key) {
              packData[i].Value = res.Response.Data[j].Value
              break
            }
          }
        }
      })
    },
    // 1.3.获取DDoS攻击事件列表
    describeDDoSEvList() {
      let params = {
        Version: '2018-07-09',
        Business: this.type,//[bgp表示独享包；bgp-multip表示共享包；net表示高防IP专业版]
        StartTime: this.startTime,
        EndTime: this.endTime,
        Id: this.searchInputID
      }
      this.axios.post(DDOS_EV_LIST, params).then(res => {
        if(!('Error' in res.Response)) {
          this.tableDataBegin = res.Response.Data
          this.totalItems = this.tableDataBegin.length
        } else {
          console.log(res.Response.Error)
        }
      })
    },
    // 时间格式化'yyyy-MM-dd hh:mm:ss'
    getDateString(date) {
      return date.toLocaleString('zh',{hour12:false, year: 'numeric',  month: '2-digit',  day: '2-digit',  hour: '2-digit',  minute: '2-digit',  second: '2-digit'}).replace(/\//g,'-');
    },
    //下面tab切换表格
    btnClick(param){
      this.type=param;
      if(param=="bgp"){
        this.downloadName="独享包攻击记录"
      }else if(param=="bgp-multip"){
        this.downloadName="共享包攻击记录"
      }else if(param=="net"){
        this.downloadName="高防IP专业版攻击记录"
      }
      this.describeDDoSEvList()
    },
    // 搜索
    doFilter() {
      this.describeDDoSEvList()
      // 重新定义当前页
      this.currentPage = 1;
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
    exportExcel () {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector('#exportTable'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.downloadName+'.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
  }
}

</script>
<style lang="scss" scoped>
.newClear:after {
  display: block;
  clear: both;
  content: "";
}
.overviewTit {
  height: 50px;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  font-weight: 600;
  padding: 0 20px;
  line-height: 50px;
}
.allConMain {
  width: 100%;
  padding: 20px;
  .allConMainOne {
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
    width: 100%;
    .allConMainOneTit {
      width: 100%;
      height: 40px;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
      line-height: 40px;
      padding: 0 12px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom:12px;
      margin-top:20px;
    }
    .allConMainOneLeft,
    .allConMainOneRight {
      height: 146px;
      background-color: #fff;
      box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    }
    .allConMainOneLeft{
      h3{
        font-size:14px;
        font-weight:600;
        color:#999;
        text-align:center;
        line-height:56px;
      }
      .allConMainOneRow{
        .LeftConRow{
          border-right:1px solid #ddd;
          text-align:center;
          p:nth-child(1){
            font-size:12px;
            margin-bottom:20px;
          }
          p:nth-child(2){
            font-size:16px;
          }
        }
        .LeftConOne{
          p:nth-child(2){
            color:#006eff
          }
        }
        .LeftConTwo{
          p:nth-child(2){
            color:#0abf5b 
          }
        }
        .LeftConThree{
          border-right:0;
          p:nth-child(2){
            color:#e54545;
            span{
              color:#999;
              font-size:12px;
            } 
          }
        }
      }
    }
  }
  .allConMainTwoLeft{
    padding:20px 0;
    .productRow1{
      border-right:1px solid #ddd;
      text-align:center;
      font-size:12px;
      line-height: 106px;
      span{
        color:#006eff;
        font-size:18px;
      }
    }
    .productRow2{
      padding-left:96px;
      font-size:12px;
      p{
        margin-bottom:12px;
        span{
          display:inline-block;
          margin-right:10px;
        }
        span:nth-child(1){
          width:10px;
          height:10px;
          border-radius: 100%;
        }
      }
      p:nth-child(1){
        span:nth-child(1){
          background-color:#0abf5b;
        }
        span:nth-child(3){
          color:#0abf5b;
        }
      }
      p:nth-child(2){
        span:nth-child(1){
          background-color:#888;
        }
        span:nth-child(3){
          color:#888;
        }
      }
      p:nth-child(3){
        span:nth-child(1){
          background-color:#e54545;
        }
        span:nth-child(3){
          color:#e54545;
        }
      }
      p:nth-child(4){
        span:nth-child(1){
          background-color:#e54545;
        }
        span:nth-child(3){
          color:#e54545;
        }
      }
    }
  }
}
.allConMainThreeTit{
  width:100%;
  height:60px;
  line-height:60px;
  padding:0 20px;
  background-color: #fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  border:1px solid #ddd;
  margin-top:20px;
  margin-bottom:12px;
  div:nth-child(1){
    font-size:14px;
    font-weight:600;
    float:left;
  }
  div:nth-child(2).rightCon{
    float:right;
    .downloadTable{
      float:left;
    }
    .rightIptSearch{
      float:left;
      width:300px;
      height:30px;
      margin-left:10px;
      ::v-deep input{
        width:100%;
        height:30px;
        border-radius: 0;
        line-height: 30px;
      }
    }
    .searcHBthn{
      float:left;
      margin-top:14px;
      padding:0 16px;
      height:30px;
      line-height:30px;
      border-radius: 0;
    }
  }
}
.allConMainThreeCon{
  width:100%;
  min-height:300px;
  background-color:#fff;
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
  border:1px solid #ddd;
  .chartShowTit{
    width:100%;
    border-bottom:1px solid #eaeaea;
    height:35px;
    line-height:38px;
    margin-top:20px;
    button{
      padding:5px 10px;
      border-bottom:2px solid transparent;
      margin-right:20px!important;
      border:none;
      border-radius: 0;
      font-weight:600;
      font-size:14px;
      color:#000;
      span{
        font-size:12px;
        color:#888;
      }
    }
    .addColor{
      border-bottom:2px solid #006eff;
      background-color:transparent;
      font-weight:600;
      font-size:14px;
      color:#000;
      span{
        font-weight: 600;
        font-size:14px;
        color:#000;
      }
    }
  }
}
.tableOverView{
  min-height:450px;
}
.tabListPage{
  height:50px;
  text-align:right;
  padding-top:8px;
  border-top:1px solid #ddd;
}
</style>