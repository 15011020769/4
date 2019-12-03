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
                    <p>0</p>
                  </el-col>
                  <el-col :span="12" class="LeftConOne LeftConRow">
                    <p>封堵中</p>
                    <p>0</p>
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
                    独享包 <span>0</span>
                  </el-col>
                  <el-col :span="12" class="productRow2"> 
                    <p><span></span><span>清洗中</span><span>0</span></p>
                    <p><span></span><span>封堵中</span><span>0</span></p>
                    <p><span></span><span>即将到期</span><span>0</span></p>
                    <p><span></span><span>已到期</span><span>0</span></p>
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
            <el-input class="rightIptSearch" v-model="tableDataName" placeholder="请输入要查询的资产ID"/><el-button @click="doFilter" class="searcHBthn el-icon-search"></el-button>
          </div>
        </div>
        <div class="allConMainThreeCon">
          <div class="chartShowTit">
            <el-button-group>
              <el-button @click="btnClick(1)" :class="{'addColor':type=='1'}">独享包</el-button>
              <el-button @click="btnClick(2)" :class="{'addColor':type=='2'}">共享包</el-button>
              <el-button @click="btnClick(3)" :class="{'addColor':type=='3'}">高防IP专业版</el-button>
            </el-button-group>
          </div>
          <div>
            <el-table id="exportTable" :data="tableDataBegin.slice((currentPage-1)*pageSize,currentPage*pageSize)">
              <el-table-column prop="attackTime" label="攻击时间">
                <!-- <template slot-scope="scope">
                  <a href="#" @click="toDoDetail(scope.$index, scope.row)">{{scope.row.funName}}</a>
                </template> -->
              </el-table-column>
              <el-table-column prop="durationTime" label="持续时间"></el-table-column>
              <el-table-column prop="products" label="产品"></el-table-column>
              <el-table-column prop="assetName" label="资产名称"></el-table-column>
              <el-table-column prop="assetType" label="资产类型"></el-table-column>
              <el-table-column prop="attackIp" label="IP"></el-table-column>
              <el-table-column prop="attackType" label="攻击类型" width="70px"></el-table-column>
              <el-table-column prop="attackMax" label="攻击最大宽带"></el-table-column>
              <el-table-column prop="attackRate" label="攻击最大包速率"></el-table-column>
              <el-table-column prop="stopStart" label="触发封禁" width="180">
                <template slot-scope="">
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
export default {
  data() {
		return {
      // 安全统计-本月
      attackData: [
        {Key: 'AttackIpCount', Value:'0', desc: '受攻击的IP数'},
        {Key: 'AttackCount', Value:'0', desc: '攻击次数'},
        {Key: 'BlockCount', Value:'0', desc: '封堵次数'},
        {Key: 'MaxMbps', Value:'0', desc: '攻击峰值Mbps'},
        {Key: 'IpNum', Value:'0', desc: '统计的IP数据'}
      ],
      // 获取产品总览
      packParams: ['bgpip', 'bgp', 'net', 'shield'],
      business: 'net',// 产品代号
      packDataIP: [ // 高防IP专业版 net
        {Key: 'TotalPackCount',Value: '0'},
        {Key: 'AttackPackCount',Value: '0'},
        {Key: 'BlockPackCount',Value: '0'},
        {Key: 'ExpiredPackCount',Value: '0'},
        {Key: 'ExpireingPackCount',Value: '0'},
        {Key: 'IsolatePackCount',Value: '0'}
      ],
      packDataBgpip: [ // bgpip
        {Key: 'TotalPackCount',Value: '0'},
        {Key: 'AttackPackCount',Value: '0'},
        {Key: 'BlockPackCount',Value: '0'},
        {Key: 'ExpiredPackCount',Value: '0'},
        {Key: 'ExpireingPackCount',Value: '0'},
        {Key: 'IsolatePackCount',Value: '0'}
      ],
      packDataBgp: [ // bgp
        {Key: 'TotalPackCount',Value: '0'},
        {Key: 'AttackPackCount',Value: '0'},
        {Key: 'BlockPackCount',Value: '0'},
        {Key: 'ExpiredPackCount',Value: '0'},
        {Key: 'ExpireingPackCount',Value: '0'},
        {Key: 'IsolatePackCount',Value: '0'}
      ],
      packDataShield: [ // shield
        {Key: 'TotalPackCount',Value: '0'},
        {Key: 'AttackPackCount',Value: '0'},
        {Key: 'BlockPackCount',Value: '0'},
        {Key: 'ExpiredPackCount',Value: '0'},
        {Key: 'ExpireingPackCount',Value: '0'},
        {Key: 'IsolatePackCount',Value: '0'}
      ],
      // 日期区间：默认获取当前时间和前一天时间
      endTime: this.getDateString(new Date()),
      startTime: this.getDateString(new Date(new Date().getTime() - 24*60*60*1000)),

      type:1,
      tableDataBegin: [],
      tableDataName: "",
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,
      filterConrent:"",
      allData:[{
        attackTime:"1",
        durationTime:"2",
        products:"3",
        assetName:"4",
        assetType:"9",
        attackIp:"5",
        attackType:"6",
        attackMax:"7",
        attackRate:"8",

      }],
      dialogVisible:false,
      newData:"调用次数"
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
        switch (this.packParams[i]) {//['bgpip', 'bgp', 'net', 'shield']
          case 'net':
            this.describePackIndex(this.packDataIP)
            break;
          case 'bgpip':
            this.describePackIndex(this.packDataBgpip)
            break;
          case 'bgp':
            this.describePackIndex(this.packDataBgp)
            break;
          case 'shield':
            this.describePackIndex(this.packDataShield)
            break;
        }
      }
      this.describeInsurePacks()
      this.describeDDoSEvList()
    },
    // 1.1.获取安全统计-本月
    describeSecIndex() {
      let params = {
        Version: '2018-07-09',
      }
      this.$axios.post('dayu2/DescribeSecIndex', params).then(res => {
        console.log(res)
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
      this.$axios.post('dayu2/DescribePackIndex', params).then(res => {
        console.log(res)
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
    // 1.3.获取保险包套餐列表
    describeInsurePacks() {
      let params = {
        Version: '2018-07-09',
      }
      this.$axios.post('dayu2/DescribeInsurePacks', params).then(res => {
        console.log(res)
      })
    },
    // 1.4.获取DDoS攻击事件列表
    describeDDoSEvList() {
      let params = {
        Version: '2018-07-09',
        Business: 'bgp',//腾讯云用的bgp
        StartTime: this.startTime,
        EndTime: this.endTime,
      }
      this.$axios.post('dayu2/DescribeDDoSEvList', params).then(res => {
        console.log(res)
      })
    },
    // 时间格式化'yyyy-MM-dd hh:mm:ss'
    getDateString(date) {
      return date.toLocaleString('zh',{hour12:false, year: 'numeric',  month: '2-digit',  day: '2-digit',  hour: '2-digit',  minute: '2-digit',  second: '2-digit'}).replace(/\//g,'-');
    },
    //下面tab切换表格
    btnClick(clickNode){
      this.type=clickNode;
      if(clickNode=="1"){
        this.newData="独享包"
      }else if(clickNode=="2"){
        this.newData="共享包"
      }else if(clickNode=="3"){
        this.newData="高防IP专业版"
      }
      // else if(clickNode=="4"){
      //   this.newData="并发执行个数"
      // }else if(clickNode=="5"){
      //   this.newData="受限次数"
      // }
    },
    getDataOld() {//前端页面人员写的，不懂
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
    // 搜索
    doFilter() {
      console.log(this.filterConrent);
      this.tableDataBegin = this.allData;
      this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.tableDataBegin.forEach((val, index) => {
        if (val.assetName) {
          if (val.assetName.indexOf(this.tableDataName) == 0) {
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
    exportExcel () {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector('#exportTable'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), this.newData+'.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
  }
}

</script>
<style lang="scss">
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
    }
    .searcHBthn{
      float:left;
      margin-top:10px;
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
.tabListPage{
  text-align:right;
}
</style>