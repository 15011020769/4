<template>
  <div>
    <!-- 策略名称 -->
    <div>
      <span class="fontWeightBold">策略名称</span><el-input class="tacticsName" v-model="tacticsName"></el-input>
    </div>
    <!-- 黑白名单表格 -->
    <div>
      <span class="fontWeightBold">黑白名单</span>
      <div class="tableConOne">
        <div class="tableConOneTop newClear">
          <el-button type="primary">添加</el-button>
          <span class="rightSearch">
            <el-input
              v-model="tableDataName1"
              class="searchs"
              placeholder="请输入要查询的内容"
            ></el-input>
            <el-button class="el-icon-search" @click="doFilter"></el-button>
          </span>
        </div>
        <div>
          <el-table :data="tableDataBegin1.slice((currentPage-1)*pageSize,currentPage*pageSize)">
            <el-table-column prop="strategy" label="策略"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="action" label="操作" width="180">
              <template slot-scope="scope">
                <el-button
                  @click.native.prevent="editRow(scope.$index, scope.row)"
                  type="text"
                  size="small"
                >编辑</el-button>
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
    </div>
    <!-- 高级安全策略 -->
    <div>
      <span class="fontWeightBold">高级安全策略</span>
      <!-- 禁用协议 -->
      <div class="childContTit">
        <h2>禁用协议</h2>
        <el-checkbox-group v-model="DdisableProtocol">
          <el-checkbox label="ICMP" name="type"></el-checkbox>
          <el-checkbox label="TCP" name="type"></el-checkbox>
          <el-checkbox label="UDP" name="type"></el-checkbox>
          <el-checkbox label="其他协议" name="type"></el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- 禁用端口 -->
      <div class="childContTit">
        <h2>禁用端口</h2>
        <table class="table-div">
          <tr class="t-head">
            <td>协议</td>
            <td>端口类型</td>
            <td>开始端口号</td>
            <td>结束端口号</td>
            <td>操作</td>
          </tr>
          <tr class="t-body" v-for="(item, index) in tags" :key="index">
            <td>
              <el-select class="selectChange" v-model="item.protocol">
                <el-option label="TCP" value="TCP"></el-option>
                <el-option label="UDP" value="UDP"></el-option>
              </el-select>
            </td>
            <td>
              <el-select class="selectChange" v-model="item.tortType">
                <el-option label="目的端口" value="destPort"></el-option>
                <el-option label="源端口" value="sourcePort"></el-option>
                <el-option label="目的端口和源端口" value="allPost"></el-option>
              </el-select>
            </td>
            <td>
              <!-- <input type="text" /> -->
              <el-input class="inputChange" v-model="item.beginPort" autocomplete="off"></el-input>
            </td>
            <td>
              <el-input class="inputChange" v-model="item.endPort" autocomplete="off"></el-input>
            </td>
            <td>
              <a v-on:click="removeRow(index,1)" v-show="index >= 0">删除</a>
            </td>
          </tr>
        </table>
        <a v-on:click="addRow(1)" class="addNewRow">添加</a>
      </div>
      <!-- 报文过滤特征 -->
      <div class="childContTit">
        <h2>报文过滤特征</h2>
        <table class="table-div">
          <tr class="t-head">
            <td>协议</td>
            <td>开始源端口</td>
            <td>结束源端口</td>
            <td>开始目的的端口</td>
            <td>结束目的的端口</td>
            <td>最小包长</td>
            <td>最大包长</td>
            <td>监测载荷</td>
            <td>正则表达式</td>
            <td>偏移量</td>
            <td>检查深度</td>
            <td>是否包括</td>
            <td>字符串</td>
            <td>策略</td>
            <td>操作</td>
          </tr>
          <tr class="t-body" v-for="(item, index) in tags1" :key="index">
            <td>
              <el-select class="selectChange1" v-model="item.protocol">
                <el-option label="TCP" value="TCP"></el-option>
                <el-option label="UDP" value="UDP"></el-option>
              </el-select>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.beginProtYarm" autocomplete="off"></el-input>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.endProtYarm" autocomplete="off"></el-input>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.beginMudi" autocomplete="off"></el-input>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.endMudi" autocomplete="off"></el-input>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.minBag" autocomplete="off"></el-input>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.maxBag" autocomplete="off"></el-input>
            </td>
            <td>
              <el-select class="selectChange1" v-model="item.detectionLoad">
                <el-option label="不检测" value="destPort"></el-option>
                <el-option label="IP头开始检查" value="sourcePort"></el-option>
                <el-option label="TCP/UDP头开始检查" value="allPost"></el-option>
                <el-option label="载荷开始检查" value="allPost"></el-option>
              </el-select>
            </td>
            <td>
              <el-select class="selectChange1" v-model="item.regText">
                <el-option label="关键字" value="destPort"></el-option>
                <el-option label="正则表达式" value="sourcePort"></el-option>
              </el-select>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.floatOffset" autocomplete="off"></el-input>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.checkingDeep" autocomplete="off"></el-input>
            </td>
            <td>
              <el-select class="selectChange1" v-model="item.isInclude">
                <el-option label="包含" value="destPort"></el-option>
                <el-option label="不包含" value="sourcePort"></el-option>
              </el-select>
            </td>
            <td>
              <el-input class="inputChange1" v-model="item.string" autocomplete="off"></el-input>
            </td>
            <td>
              <el-select class="selectChange1" v-model="item.strategy">
                <el-option label="丢弃报文" value="destPort"></el-option>
                <el-option label="丢弃且拉黑源IP" value="sourcePort"></el-option>
                <el-option label="丢弃且断开连接" value="sourcePort"></el-option>
                <el-option label="丢弃, 断开连接且拉黑" value="sourcePort"></el-option>
                <el-option label="直接转发" value="sourcePort"></el-option>
              </el-select>
            </td>
            <td>
              <a v-on:click="removeRow(index,2)" v-show="index >= 0">删除</a>
            </td>
          </tr>
        </table>
        <a v-on:click="addRow(2)" class="addNewRow">添加</a>
      </div>
      <!-- 限速 -->
      <div class="childContTit">
        <h2>限速</h2>
        <table class="table-div">
          <tr class="t-head">
            <td>协议</td>
            <td>限速阈值</td>
            <td>操作</td>
          </tr>
          <tr class="t-body" v-for="(item, index) in tags3" :key="index">
            <td>
              <el-select class="selectChange" v-model="item.protocol">
                <el-option label="ICMP" value="ICPM"></el-option>
                <el-option label="OTHER" value="OTHER"></el-option>
                <el-option label="TCP" value="TCP"></el-option>
                <el-option label="UDP" value="UDP"></el-option>
              </el-select>
            </td>
            <td>
              <el-input class="inputChange" v-model="item.speedLimit" autocomplete="off"></el-input>Mbps
            </td>
            <td>
              <a v-on:click="removeRow(index,3)" v-show="index >= 0">删除</a>
            </td>
          </tr>
        </table>
        <a v-on:click="addRow(3)" class="addNewRow">添加</a>
      </div>
      <!-- 拒绝海外流量 -->
      <div class="childContTit">
        <h2>拒绝海外流量</h2>
        <span class="spanStyleLabel">特殊资源</span>
        <el-radio-group v-model="radios1">
          <el-radio label="关闭" name="radio1"></el-radio>
          <el-radio label="开启" name="radio1"></el-radio>
        </el-radio-group>
      </div>
      <!-- 连接耗尽防护 -->
      <div class="childContTit">
        <h2>连接耗尽防护</h2>
        <span class="spanStyleLabel">空连接防护<i class="el-icon-info"></i></span>
        <el-radio-group v-model="radios2">
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">源新建连接限速</span>
        <el-radio-group v-model="radios3">
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group>
        <el-input class="inputChange1"></el-input>个/秒<br/>
        <span class="spanStyleLabel">源并发连接限制</span>
        <el-radio-group v-model="radios4">
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">目的新建连接限速</span>
        <el-radio-group v-model="radios5">
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">目的并发连接数限制</span>
        <el-radio-group v-model="radios6">
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group>
      </div>
      <!-- 异常连接检测 -->
      <div class="childContTit">
        <h2>异常连接检测<i class="el-icon-info"></i></h2>
        <span class="spanStyleLabel">源IP最大异常连接数</span>
        <el-radio-group v-model="radios7">
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">Syn报文占比检测</span>
        <el-radio-group v-model="radios8">
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">Syn报文数检测</span>
        <el-radio-group v-model="radios9">
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">连接超时检测</span>
        <el-radio-group v-model="radios10">
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group><br/>
        <span class="spanStyleLabel">异常空连接防护</span>
        <el-radio-group v-model="radios11">
          <el-radio label="关闭"></el-radio>
          <el-radio label="开启"></el-radio>
        </el-radio-group>
      </div>
      <!-- 水印防护 -->
      <div class="childContTit">
        <h2>水印防护</h2>
        <el-table :data="tableDataBegin2" class="tableBorderTop">
          <el-table-column label="TCP防护端口"></el-table-column>
          <el-table-column label="UDP防护端口"></el-table-column>
          <el-table-column label="UDP水印剥离"></el-table-column>
          <el-table-column label="策略开关"></el-table-column>
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
        <a href="#" class="addNewRow" @click="dialogVisible = true">点击开启</a>
        <el-dialog
          title="水印创建"
          :visible.sync="dialogVisible"
          width="50%"
          :before-close="handleClose">
          <div class="childContTit childContTitModel">
            <h2>TCP协议防护端口</h2>
            <table class="table-div">
              <tr class="t-head">
                <td>开始端口号</td>
                <td>结束端口号</td>
                <td>操作</td>
              </tr>
              <tr class="t-body" v-for="(item, index) in tags4" :key="index">
                <td>
                  <el-input class="inputChange" v-model="item.beginPort" autocomplete="off"></el-input>
                </td>
                <td>
                  <el-input class="inputChange" v-model="item.endPort" autocomplete="off"></el-input>
                </td>
                <td>
                  <a v-on:click="removeRow(index,4)" v-show="index >= 0">删除</a>
                </td>
              </tr>
            </table>
            <a v-on:click="addRow(4)" class="addNewRow">添加</a>
            <p>TCP防护端口最多可以配置5个端口段；不同端口段不可以互相重合；起止端口号相同则认为是一个端口；TCP或UDP协议端口段需要至少配置一条。</p>
          </div>
          <div class="childContTit childContTitModel">
            <h2>UDP协议防护端口</h2>
            <table class="table-div">
              <tr class="t-head">
                <td>开始端口号</td>
                <td>结束端口号</td>
                <td>操作</td>
              </tr>
              <tr class="t-body" v-for="(item, index) in tags5" :key="index">
                <td>
                  <el-input class="inputChange" v-model="item.beginPort" autocomplete="off"></el-input>
                </td>
                <td>
                  <el-input class="inputChange" v-model="item.endPort" autocomplete="off"></el-input>
                </td>
                <td>
                  <a v-on:click="removeRow(index,5)" v-show="index >= 0">删除</a>
                </td>
              </tr>
            </table>
            <a v-on:click="addRow(5)" class="addNewRow">添加</a>
            <p>UDP防护端口最多可以配置5个端口段；不同端口段不可以互相重合；起止端口号相同则认为是一个端口；TCP或UDP协议端口段需要至少配置一条。</p>
          </div>
          <div class="childContTit childContTitModel">
            <h2>
              <span class="hSpanTit">自动剥离UDP报文水印</span>
              <el-radio-group v-model="radios12">
                <el-radio label="关闭"></el-radio>
                <el-radio label="开启"></el-radio>
              </el-radio-group>

            </h2>
            <p>数据报文经过安全防护系统后，自动剥离UDP报文中的水印，再传到源站。海外地区不支持。</p>
          </div>
          <div class="childContTit childContTitNoBorder">
            <h2>
              <span class="hSpanTit">偏移量</span>
              <el-input class="OffsetNum"></el-input>
            </h2>
            <p>指定水印标签在UDP报文中的偏移量，可填范围 0-99</p>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="bottomBtn">
        <el-button type="primary">确定</el-button>
        <el-button @click="closeAddPage">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['isShow'],
  data(){
    return{
      tags:[
        {
          protocol:"111",
          tortType:"111",
          beginPort:"111",
          endPort:"111"
        }
      ],
      tags1:[
        {
          protocol:"111",
          beginProtYarm:"111",
          endProtYarm:"111",
          beginMudi:"111",
          endMudi:"111",
          minBag:"111",
          maxBag:"111",
          detectionLoad:"111",
          regText:"111",
          floatOffset:"111",
          checkingDeep:"111",
          isInclude:"111",
          string:"111",
          strategy:"111"
        }
      ],
      tags3:[
        {
          protocol:"111",
          speedLimit:"111"
        }
      ],
      tags4:[
        {
          beginPort:"111",
          endPort:"111"
        }
      ],
      tags5:[
        {
          beginPort:"111",
          endPort:"111"
        }
      ],
      tacticsName:"",
      tableDataName1:"",
      tableDataBegin1: [],
      tableDataBegin2:[],
      tableDataEnd: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      filterTableDataEnd: [],
      flag: false,
      multipleSelection: [],
      dialogVisible: false,
      filterConrent:"",
      DdisableProtocol:[],
      allData1:[
        {
          strategy:"白名单",
          address:"10.1.1.212"
        }
      ],
      radios1:"关闭",
      radios2:"关闭",
      radios3:"关闭",
      radios4:"关闭",
      radios5:"关闭",
      radios6:"关闭",
      radios7:"关闭",
      radios8:"关闭",
      radios9:"关闭",
      radios10:"关闭",
      radios11:"关闭",
      radios12:"关闭",
    }
  },
  mounted() {
    this.getData1();
    console.log(this.radios12)
  },
  methods:{
    handleClose(done) {
      this.dialogVisible=false;
    },
    getData1() {
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
        this.tableDataBegin1 = this.allData1;
        // 将数据的长度赋值给totalItems
        this.totalItems = this.tableDataBegin1.length;
        if (this.totalItems > this.pageSize) {
          for (let index = 0; index < this.pageSize; index++) {
            this.tableDataEnd.push(this.tableDataBegin[index]);
          }
        } else {
          this.tableDataEnd = this.tableDataBegin1;
        }
      //});
    },
    // 搜索
    doFilter() {
      console.log(this.filterConrent);
      this.tableDataBegin1 = this.allData1;
      this.tableDataEnd = [];
      //每次手动将数据置空,因为会出现多次点击搜索情况
      this.filterTableDataEnd = [];
      this.tableDataBegin1.forEach((val, index) => {
        if (val.address==this.tableDataName1) {
          this.filterTableDataEnd.push(val);
          this.tableDataBegin1 = this.filterTableDataEnd;
        } else {
          this.filterTableDataEnd.push();
          this.tableDataBegin1 = this.filterTableDataEnd;
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
      this.pageSize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val) {
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
    //关闭新增页面
    closeAddPage(){
      this.tableShow=true;
      this.$emit('closePage',{message:this.tableShow})
    },
    copyObj: function () {
      var des = {
        protocol:"",
        tortType:"",
        beginPort:"",
        endPort:""
      }
      return des
    },
    //新增一行
    addRow: function (type) {
      var des = this.copyObj()
      if(type==1){
        this.tags.push(des)
      }else if(type==2){
        this.tags1.push(des)
      }else if(type==3){
        this.tags3.push(des)
      }else if(type==4){
        this.tags4.push(des)
      }else if(type==5){
        this.tags5.push(des)
      }
      
    },
    // 删除一行
    removeRow: function (idx,typeNode) {
      if(typeNode==1){
        this.tags.splice(idx, 1)
      }else if(typeNode==2){
        this.tags1.splice(idx, 1)
      }else if(typeNode==3){
        this.tags3.splice(idx, 1)
      }else if(typeNode==4){
        this.tags4.splice(idx, 1)
      }else if(typeNode==5){
        this.tags5.splice(idx, 1)
      }
    },
  }
}
</script>
<style lang="scss">
.newClear:after{
  display: block;
  clear:both;
  content:"";
}
.fontWeightBold{
  font-size:14px;
  font-weight: 600;
  color:#000;
  margin-right:10px;
  margin-top:12px;
  display: inline-block;
}
.tacticsName{
  width:120px!important;
  input{
    width:120px;
  }
}
.tableConOne{
  margin-top:20px;
  .rightSearch{
    float:right;
  }
}
.childContTit{
  margin-top:25px;
  margin-bottom:6px;
  h2{
    font-size:12px;
    font-weight: 600;
    color:#000;
    margin-bottom:15px;
  }
}
.tableBorderTop{
  border-top:1px solid #eaeaea;
  border-left:1px solid #eaeaea;
  border-right:1px solid #eaeaea!important;
}
.addNewRow{
  display: inline-block;
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border: 1px solid #eaeaea;
  border-top: 0;
  border-bottom: 3px solid #eaeaea;
}
.spanStyleLabel{
  font-size:12px;
  color:#888;
  margin-right:50px;
  margin-bottom:25px;
  line-height:30px;
}
.el-icon-info{
  color:#888;
}
.bottomBtn{
  width:100%;
  border-top:1px solid #eaeaea;
  padding:20px 0;
  margin-top:20px;
}
.childContTitModel{
  padding-bottom:20px;
  border-bottom:1px solid #ddd;
  p{
    color:#888;
    font-size:12px;
    margin-top:12px;
  }
}
.childContTitNoBorder{
  padding-bottom:20px;
  p{
    color:#888;
    font-size:12px;
    margin-top:12px;
  }
  .OffsetNum{
    width:120px;
    input{
      width:120px;
    }
  }
}
.hSpanTit{
  margin-right:22px;
}
.table-div {
  width: 100%;
  border: 1px solid #ddd;
  tr {
    width: 30%;
  }
  .t-head {
    height: 45px;
    padding: 0 5px;
    td{
      border-bottom:1px solid #eaeaea;
    }
  }
  .t-body {
    height: 45px;
    min-height: 200px;
    td{
      border-bottom:1px solid #eaeaea;
      .selectChange{
        height:35px;
        div{
          height:35px;
          input{
            height:35px;
          }
        }
      }
      .selectChange1{
        width:70px;
        height:35px;
        div{
          width:70px;
          height:35px;
          input{
            width:70px;
            height:35px;
          }
        }
      }
      .inputChange{
        height:35px;
        width:150px;
        input{
          height:35px;
          width:150px;
        }
      }
      .inputChange1{
        height:35px;
        width:70px;
        input{
          height:35px;
          width:70px;
        }
      }
    }
  }
}
.inputChange1{
  height:35px;
  width:70px!important;
  input{
    height:35px;
    width:70px;
  }
}
</style>